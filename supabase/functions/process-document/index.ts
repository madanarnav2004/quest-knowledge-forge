import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { documentId } = await req.json();
    
    if (!documentId) {
      return new Response(
        JSON.stringify({ error: "Document ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing document with ID: ${documentId}`);

    // Fetch document details
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (fetchError) {
      console.error("Error fetching document:", fetchError);
      return new Response(
        JSON.stringify({ error: `Error fetching document: ${fetchError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from("documents")
      .download(document.file_path);

    if (downloadError) {
      console.error("Error downloading file:", downloadError);
      await updateDocumentStatus(supabase, documentId, "failed");
      return new Response(
        JSON.stringify({ error: `Error downloading file: ${downloadError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract text content based on document type
    let textContent = "";
    try {
      textContent = await extractTextContent(fileData, document.document_type);
      
      // Generate summary if requested
      let summary = null;
      if (document.summarization_enabled) {
        summary = generateSummary(textContent);
      }
      
      // Count words for analytics
      const wordCount = countWords(textContent);
      
      // Update document with extracted content
      await supabase
        .from("documents")
        .update({ 
          content: textContent,
          description: summary,
          status: "processing", 
          word_count: wordCount,
          updated_at: new Date().toISOString() 
        })
        .eq("id", documentId);

      // Start generating knowledge graph nodes and relationships
      await generateKnowledgeGraph(supabase, documentId, textContent, document);
      
      // Mark document as completed
      await updateDocumentStatus(supabase, documentId, "completed");
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Document processed successfully and knowledge graph updated",
          summary: summary
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error processing document:", error);
      await updateDocumentStatus(supabase, documentId, "failed");
      return new Response(
        JSON.stringify({ error: `Error processing document: ${error.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to update document status
async function updateDocumentStatus(supabase, documentId, status) {
  await supabase
    .from("documents")
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", documentId);
}

// Count words in text content
function countWords(text) {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Generate a simple summary of the text content
function generateSummary(text, maxLength = 200) {
  // First, split the text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  // If there are no complete sentences, return a portion of the text
  if (sentences.length === 0) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }
  
  // Take the first few sentences that fit within the maxLength
  let summary = "";
  let i = 0;
  
  while (i < sentences.length && (summary.length + sentences[i].length) <= maxLength) {
    summary += sentences[i];
    i++;
  }
  
  // If the summary is empty, take at least the first sentence
  if (summary === "" && sentences.length > 0) {
    summary = sentences[0].length > maxLength 
      ? sentences[0].substring(0, maxLength) + "..."
      : sentences[0];
  }
  
  return summary;
}

// Mock function to extract text content - in a real environment, you'd use proper libraries
async function extractTextContent(fileData, documentType) {
  // For demonstration - this would use libraries specific to each file type
  // like pdf.js for PDFs, marked for markdown, etc.
  
  // Convert file blob to text
  const text = await fileData.text();
  
  // Basic processing based on document type
  switch (documentType) {
    case 'pdf':
    case 'text':
      return text;
    case 'markdown':
      // Strip markdown syntax (simplistic approach)
      return text.replace(/[#*_`~]/g, '');
    case 'code':
      // Remove code comments (simplistic approach)
      return text.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    default:
      return text;
  }
}

// Generate knowledge graph nodes and relationships
async function generateKnowledgeGraph(supabase, documentId, textContent, document) {
  // Extract entities and concepts from text
  const entities = extractEntities(textContent);
  
  // Create or update knowledge graph nodes
  for (const entity of entities) {
    // Check if entity already exists
    const { data: existingEntities } = await supabase
      .from("knowledge_nodes")
      .select("id, count")
      .eq("name", entity.name)
      .eq("user_id", document.user_id);
      
    let nodeId;
    
    if (existingEntities && existingEntities.length > 0) {
      // If entity exists, use its ID
      nodeId = existingEntities[0].id;
      
      // Update entity metadata
      await supabase
        .from("knowledge_nodes")
        .update({ 
          count: existingEntities[0].count + 1,
          updated_at: new Date().toISOString() 
        })
        .eq("id", nodeId);
    } else {
      // Otherwise, create a new entity
      const { data: newNode, error } = await supabase
        .from("knowledge_nodes")
        .insert({
          name: entity.name,
          type: entity.type,
          user_id: document.user_id,
          count: 1,
          metadata: {
            confidence: entity.confidence,
            context: entity.context.substring(0, 100) // Keep context short
          }
        })
        .select("id")
        .single();
        
      if (error) {
        console.error("Error creating knowledge node:", error);
        continue;
      }
        
      nodeId = newNode.id;
    }
    
    // Create document-entity relationship
    await supabase
      .from("knowledge_relationships")
      .insert({
        source_id: nodeId,
        target_id: documentId,
        relationship_type: "mentioned_in",
        user_id: document.user_id,
        metadata: {
          confidence: entity.confidence,
          strength: 0.8, // High strength for direct mentions
          context: entity.context.substring(0, 100) // Keep context short
        }
      });
      
    // Create entity-entity relationships for co-occurrence
    for (const otherEntity of entities) {
      if (entity.name !== otherEntity.name) {
        const { data: otherNodeData, error } = await supabase
          .from("knowledge_nodes")
          .select("id")
          .eq("name", otherEntity.name)
          .eq("user_id", document.user_id)
          .single();
          
        if (error) {
          continue; // Skip if other node not found
        }
          
        if (otherNodeData) {
          const strength = calculateRelationshipStrength(entity, otherEntity);
          
          // Check if relationship already exists
          const { data: existingRel } = await supabase
            .from("knowledge_relationships")
            .select("id")
            .eq("source_id", nodeId)
            .eq("target_id", otherNodeData.id)
            .eq("user_id", document.user_id);
            
          if (!existingRel || existingRel.length === 0) {
            await supabase
              .from("knowledge_relationships")
              .insert({
                source_id: nodeId,
                target_id: otherNodeData.id,
                relationship_type: "related_to",
                user_id: document.user_id,
                metadata: {
                  strength: strength,
                  document_id: documentId
                }
              });
          }
        }
      }
    }
  }
  
  // Set document as vector embedded
  await supabase
    .from("documents")
    .update({ 
      vector_embedded: true 
    })
    .eq("id", documentId);
}

// Extract entities from text - simplified version
function extractEntities(text) {
  // This is a simplified entity extraction - in production, you'd use NLP models
  const entities = [];
  
  // Extract potential entities based on capitalization patterns
  const words = text.split(/\s+/);
  const sentenceEnds = new Set(['.', '!', '?']);
  let inSentence = false;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].trim();
    
    // Skip empty words
    if (word.length === 0) continue;
    
    // Skip first word of sentence for capitalization check
    if (!inSentence) {
      inSentence = true;
      continue;
    }
    
    // Check if word ends a sentence
    if (word.length > 0 && sentenceEnds.has(word[word.length - 1])) {
      inSentence = false;
    }
    
    // Check for capitalized words that aren't at sentence start
    if (word.length > 0 && /^[A-Z][a-z]{2,}/.test(word)) {
      // Get some context around the entity
      const start = Math.max(0, i - 3);
      const end = Math.min(words.length, i + 4);
      const context = words.slice(start, end).join(' ');
      
      entities.push({
        name: word.replace(/[^\w\s]/g, ''), // Remove punctuation
        type: guessEntityType(word),
        confidence: 0.7, // Mock confidence score
        context
      });
    }
    
    // Look for technical terms
    if (/^[a-z]+\.[A-Za-z]+/.test(word) || /^[a-z]+-[a-z]+/.test(word)) {
      const context = words.slice(Math.max(0, i - 2), Math.min(words.length, i + 3)).join(' ');
      
      entities.push({
        name: word.replace(/[^\w\s\.-]/g, ''),
        type: 'technical_term',
        confidence: 0.6,
        context
      });
    }
  }
  
  return entities;
}

// Guess entity type based on patterns - simplified
function guessEntityType(word) {
  if (/^(Mr|Mrs|Ms|Dr|Prof)\.\s[A-Z][a-z]+/.test(word)) {
    return 'person';
  }
  
  if (/^[A-Z][a-z]+ (Inc|Corp|LLC|Ltd)\.?$/.test(word)) {
    return 'organization';
  }
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(word)) {
    return 'date';
  }
  
  return 'concept';
}

// Calculate relationship strength between entities
function calculateRelationshipStrength(entity1, entity2) {
  // In a real implementation, this would consider:
  // - proximity in text
  // - frequency of co-occurrence
  // - semantic similarity
  
  // Basic implementation: check if entities appear in each other's context
  if (entity1.context.includes(entity2.name) && entity2.context.includes(entity1.name)) {
    return 0.8 + (Math.random() * 0.2); // Strong relationship 0.8-1.0
  } else if (entity1.context.includes(entity2.name) || entity2.context.includes(entity1.name)) {
    return 0.5 + (Math.random() * 0.3); // Medium relationship 0.5-0.8
  } else {
    return 0.3 + (Math.random() * 0.2); // Weaker relationship 0.3-0.5
  }
}
