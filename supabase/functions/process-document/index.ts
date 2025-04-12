
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
      
      // Count words for analytics
      const wordCount = countWords(textContent);
      
      // Generate summary first - IMPORTANT: Generate summary before knowledge graph
      let summary = null;
      if (document.summarization_enabled) {
        summary = generateSummary(textContent);
        console.log("Generated summary:", summary.substring(0, 100) + "...");
      }
      
      // Update document with extracted content and summary
      const { error: updateError } = await supabase
        .from("documents")
        .update({ 
          content: textContent,
          description: summary,
          status: "processing", 
          word_count: wordCount,
          updated_at: new Date().toISOString() 
        })
        .eq("id", documentId);
        
      if (updateError) {
        console.error("Error updating document content:", updateError);
        await updateDocumentStatus(supabase, documentId, "failed");
        return new Response(
          JSON.stringify({ error: `Error updating document: ${updateError.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Start generating knowledge graph nodes and relationships after summary is created
      await generateKnowledgeGraph(supabase, documentId, textContent, document, summary);
      
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
  const { error } = await supabase
    .from("documents")
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", documentId);
    
  if (error) {
    console.error(`Error updating document status to ${status}:`, error);
  }
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
async function generateKnowledgeGraph(supabase, documentId, textContent, document, summary) {
  console.log(`Generating knowledge graph for document: ${documentId}`);
  
  // Extract entities and concepts from text AND summary (if available)
  const contentToAnalyze = summary ? textContent + " " + summary : textContent;
  const entities = extractEntities(contentToAnalyze);
  
  console.log(`Extracted ${entities.length} entities`);
  
  // First, add the document itself as a node
  const { data: documentNode, error: documentNodeError } = await supabase
    .from("knowledge_nodes")
    .insert({
      name: document.title,
      type: "document",
      user_id: document.user_id,
      count: 1,
      metadata: {
        document_id: documentId,
        document_type: document.document_type,
        summary: summary?.substring(0, 150)
      }
    })
    .select("id")
    .single();
    
  if (documentNodeError) {
    console.error("Error creating document node:", documentNodeError);
    return;
  }
  
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
    
    // Create entity-document relationship
    await supabase
      .from("knowledge_relationships")
      .insert({
        source_id: nodeId,
        target_id: documentNode.id,
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
            .or(`source_id.eq.${nodeId}.and.target_id.eq.${otherNodeData.id},source_id.eq.${otherNodeData.id}.and.target_id.eq.${nodeId}`);
            
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
    
  console.log(`Knowledge graph generation completed for document: ${documentId}`);
}

// Extract entities from text - improved version
function extractEntities(text) {
  // This is a simplified entity extraction - in production, you'd use NLP models
  const entities = [];
  
  // Extract potential entities based on capitalization patterns
  const words = text.split(/\s+/);
  const sentenceEnds = new Set(['.', '!', '?']);
  let inSentence = false;
  let sentenceStart = true;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].trim();
    
    // Skip empty words
    if (word.length === 0) continue;
    
    // Check if word ends a sentence
    const endsWithPunctuation = word.length > 0 && sentenceEnds.has(word[word.length - 1]);
    
    // Check for capitalized words that aren't at sentence start
    if (word.length > 0 && /^[A-Z][a-z]{2,}/.test(word) && !sentenceStart) {
      // Get some context around the entity
      const start = Math.max(0, i - 3);
      const end = Math.min(words.length, i + 4);
      const context = words.slice(start, end).join(' ');
      
      // Clean the name
      const cleanName = word.replace(/[^\w\s]/g, '');
      
      // Check if entity already exists to avoid duplicates
      if (!entities.some(e => e.name === cleanName)) {
        entities.push({
          name: cleanName,
          type: guessEntityType(word, context),
          confidence: 0.7, // Mock confidence score
          context
        });
      }
    }
    
    // Look for technical terms
    if (/^[a-z]+\.[A-Za-z]+/.test(word) || /^[a-z]+-[a-z]+/.test(word)) {
      const context = words.slice(Math.max(0, i - 2), Math.min(words.length, i + 3)).join(' ');
      
      // Clean the name
      const cleanName = word.replace(/[^\w\s\.-]/g, '');
      
      // Check if entity already exists
      if (!entities.some(e => e.name === cleanName)) {
        entities.push({
          name: cleanName,
          type: 'technical_term',
          confidence: 0.6,
          context
        });
      }
    }
    
    // Update sentence tracking
    if (endsWithPunctuation) {
      sentenceStart = true;
      inSentence = false;
    } else if (sentenceStart) {
      sentenceStart = false;
      inSentence = true;
    }
  }
  
  return entities;
}

// Guess entity type based on patterns - improved
function guessEntityType(word, context) {
  // Check for person names
  if (/^(Mr|Mrs|Ms|Dr|Prof)\.\s[A-Z][a-z]+/.test(word) || 
      context.includes("said") || 
      context.includes("wrote") || 
      context.includes("authored")) {
    return 'person';
  }
  
  // Check for organization names
  if (/^[A-Z][a-z]+ (Inc|Corp|LLC|Ltd|Company|Group|Association)\.?$/.test(word) ||
      context.includes("company") || 
      context.includes("organization") || 
      context.includes("founded")) {
    return 'organization';
  }
  
  // Check for dates
  if (/^\d{4}-\d{2}-\d{2}$/.test(word) || 
      /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(word) ||
      context.includes("date") ||
      context.includes("year") ||
      context.includes("month")) {
    return 'date';
  }
  
  // Check for technical terms
  if (context.includes("technology") || 
      context.includes("method") || 
      context.includes("function") ||
      context.includes("code")) {
    return 'technical_term';
  }
  
  // Default to concept
  return 'concept';
}

// Calculate relationship strength between entities - improved
function calculateRelationshipStrength(entity1, entity2) {
  // In a real implementation, this would consider:
  // - proximity in text
  // - frequency of co-occurrence
  // - semantic similarity
  
  // Check if entities appear in each other's context
  const inEachOthersContext = entity1.context.includes(entity2.name) && entity2.context.includes(entity1.name);
  const inOneContext = entity1.context.includes(entity2.name) || entity2.context.includes(entity1.name);
  
  // If they are of the same type, they're more likely to be related
  const sameType = entity1.type === entity2.type;
  
  if (inEachOthersContext) {
    return sameType ? 0.9 : 0.8; // Very strong relationship
  } else if (inOneContext) {
    return sameType ? 0.7 : 0.6; // Strong relationship
  } else {
    return sameType ? 0.5 : 0.4; // Medium relationship
  }
}
