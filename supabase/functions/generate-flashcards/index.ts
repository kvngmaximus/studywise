
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "No text provided for flashcard generation" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      console.error("API key is not set");
      return new Response(
        JSON.stringify({ error: "API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Sending text for flashcard generation. Length:", text.length);

    // Check if it's a DeepSeek API key (they typically start with "sk-")
    const isDeepSeekKey = openAIApiKey.startsWith('sk-');
    
    let response;
    let flashcards;
    
    try {
      if (isDeepSeekKey) {
        // Call DeepSeek API
        response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'Create concise flashcards from the given text. Return an array of question-answer pairs in JSON format like this: {"flashcards": [{"question": "What is photosynthesis?", "answer": "Process by which plants convert sunlight into energy"}]}'
              },
              { role: 'user', content: text }
            ],
            response_format: { type: "json_object" }
          }),
        });
      } else {
        // Call OpenAI API
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Create concise flashcards from the given text. Return an array of question-answer pairs in JSON format like this: {"flashcards": [{"question": "What is photosynthesis?", "answer": "Process by which plants convert sunlight into energy"}]}'
              },
              { role: 'user', content: text }
            ],
            response_format: { type: "json_object" }
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", JSON.stringify(errorData));
        
        let errorMessage = "Failed to generate flashcards from AI service";
        
        if (errorData.error?.code === 'invalid_api_key') {
          errorMessage = `Your API key appears to be invalid. Please update it in the Supabase edge function secrets.`;
        }
        
        return new Response(
          JSON.stringify({ 
            error: errorMessage, 
            details: errorData.error
          }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      console.log("Response data structure:", Object.keys(data));
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        console.log("Raw content:", content);
        
        try {
          const parsedContent = JSON.parse(content);
          
          if (parsedContent.flashcards) {
            flashcards = parsedContent.flashcards;
          } else {
            // Try to find flashcards at the root level
            flashcards = parsedContent;
          }
          
          if (!Array.isArray(flashcards)) {
            throw new Error("Flashcards data is not in expected format");
          }
          
          console.log(`Successfully parsed ${flashcards.length} flashcards`);
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          return new Response(
            JSON.stringify({ 
              error: "Failed to parse AI response", 
              details: content 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        throw new Error("Unexpected response structure from AI service");
      }
    } catch (apiError) {
      console.error("Error calling AI API:", apiError);
      return new Response(
        JSON.stringify({ 
          error: "Error connecting to AI service", 
          details: apiError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(flashcards), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-flashcards function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
