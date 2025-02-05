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
    const { content, numberOfCards = 5 } = await req.json();

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
            Create exactly ${numberOfCards} flashcards based on the provided content.
            Each flashcard should have a front (question/concept) and back (answer/explanation).
            Return ONLY a JSON array of objects with 'front' and 'back' properties.
            Keep explanations concise but informative.
            DO NOT include any markdown formatting or backticks in your response.
            Example of expected format:
            [{"front": "Question 1", "back": "Answer 1"}, {"front": "Question 2", "back": "Answer 2"}]`
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

    let generatedText = data.choices[0].message.content;
    
    // Clean up the response by removing any markdown formatting
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Cleaned response:', generatedText);
    
    let flashcards;
    try {
      flashcards = JSON.parse(generatedText);
    } catch (error) {
      console.error('Error parsing flashcards JSON:', error);
      console.error('Raw text that failed to parse:', generatedText);
      throw new Error('Invalid response format from AI');
    }

    // Validate the structure of the flashcards
    if (!Array.isArray(flashcards) || !flashcards.every(card => 
      typeof card === 'object' && 
      card !== null && 
      'front' in card && 
      'back' in card &&
      typeof card.front === 'string' &&
      typeof card.back === 'string'
    )) {
      throw new Error('Invalid flashcards structure received from AI');
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