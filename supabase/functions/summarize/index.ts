
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
        JSON.stringify({ error: "No text provided for summarization" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Sending text for summarization. Length:", text.length);

    // Check if it's a DeepSeek API key (they typically start with "sk-")
    const isDeepSeekKey = openAIApiKey.startsWith('sk-');
    
    let response;
    let summary;
    
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
                content: 'You are a helpful study assistant that creates clear, concise summaries. Format your summaries with bullet points for key concepts and short paragraphs for explanations. Focus on the most important information.',
              },
              {
                role: 'user',
                content: `Please summarize the following text:\n\n${text}`,
              },
            ],
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
                content: 'You are a helpful study assistant that creates clear, concise summaries. Format your summaries with bullet points for key concepts and short paragraphs for explanations. Focus on the most important information.',
              },
              {
                role: 'user',
                content: `Please summarize the following text:\n\n${text}`,
              },
            ],
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", JSON.stringify(errorData));
        
        let errorMessage = "Failed to get summary from AI service";
        
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
      summary = data.choices[0].message.content;
      console.log("Received summary from AI service");
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

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in summarize function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
