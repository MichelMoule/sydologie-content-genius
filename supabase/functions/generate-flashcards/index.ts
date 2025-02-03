import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const AZURE_ENDPOINT = "https://sydo-chatgpt.openai.azure.com/openai/deployments/gpt-4o-mini-2/chat/completions?api-version=2024-08-01-preview";
const AZURE_API_KEY = Deno.env.get('AZURE_OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();

    if (!content) {
      throw new Error('Content is required');
    }

    const response = await fetch(AZURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': AZURE_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are an expert at creating flashcards for learning purposes. 
            Create flashcards based on the provided content.
            Each flashcard should have a front (question/concept) and back (answer/explanation).
            Return the flashcards in a JSON array format.
            Keep explanations concise but informative.
            Generate between 5-10 flashcards depending on the content length.
            Format the response as a JSON array of objects with 'front' and 'back' properties.`
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    console.log('Azure OpenAI Response:', data);

    const generatedText = data.choices[0].message.content;
    let flashcards;
    
    try {
      flashcards = JSON.parse(generatedText);
    } catch (error) {
      console.error('Error parsing flashcards JSON:', error);
      throw new Error('Invalid response format from AI');
    }

    return new Response(JSON.stringify({ flashcards }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-flashcards function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});