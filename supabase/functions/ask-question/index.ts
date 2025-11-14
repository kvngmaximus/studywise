
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const apiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!apiKey) {
      console.error("API key is not set");
      return new Response(
        JSON.stringify({ error: "API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if it's a DeepSeek API key (they typically start with "sk-")
    const isDeepSeekKey = apiKey.startsWith('sk-');
    const isOpenAIKey = apiKey.startsWith('sk-') || apiKey.startsWith('openai-');
    
    console.log(`Using API: ${isDeepSeekKey ? 'DeepSeek' : 'OpenAI'}`);
    console.log("Sending question:", question);
    
    try {
      let response;
      
      if (isDeepSeekKey) {
        // Call DeepSeek API
        response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful AI tutor. Provide clear, concise answers to student questions.'
              },
              { role: 'user', content: question }
            ],
          }),
        });
      } else {
        // Call OpenAI API
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful AI tutor. Provide clear, concise answers to student questions.'
              },
              { role: 'user', content: question }
            ],
          }),
        });
      }

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`API error:`, JSON.stringify(errorData));
        
        let errorMessage = "Failed to get answer from AI service";
        
        // Handle specific error types
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
      const answer = data.choices[0].message.content;
      console.log("Received answer from AI service");

      return new Response(
        JSON.stringify({ answer }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
  } catch (error) {
    console.error("Error in ask-question function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
