
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers
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
    // Get API keys from environment variables
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key");
    }

    // Get request data
    const { query, conversationId } = await req.json();

    if (!query) {
      throw new Error("Query is required");
    }

    console.log(`Processing query: ${query}`);

    // Create a system message that defines the AI assistant's behavior
    const systemMessage = `You are a knowledge assistant for Quest Knowledge Forge. 
    You provide helpful, accurate, and concise responses based on the user's knowledge base.
    If you don't know something, admit it rather than making up information.`;

    // Construct the request to OpenAI
    const openAIRequest = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: query }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    };

    // Send request to OpenAI
    console.log("Sending request to OpenAI");
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(openAIRequest),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }

    // Parse OpenAI response
    const openAIData = await openAIResponse.json();
    const responseContent = openAIData.choices[0]?.message?.content || "I couldn't generate a response.";
    
    console.log("Received response from OpenAI");

    // Return the AI response
    return new Response(
      JSON.stringify({
        answer: responseContent,
        sources: [],
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
