import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AZURE_ENDPOINT = "https://sydo-chatgpt.openai.azure.com/openai/deployments/gpt-4o-mini-2/chat/completions?api-version=2024-08-01-preview";
const AZURE_API_KEY = Deno.env.get('AZURE_OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedbackText, questionText } = await req.json();

    if (!feedbackText || !questionText) {
      throw new Error('Feedback text and question text are required');
    }

    const systemPrompt = "Vous êtes un expert en analyse de retours de formation. Analysez le retour ci-dessous et fournissez une analyse constructive et détaillée.";
    const userPrompt = `Question posée : ${questionText}\n\nRetour de l'apprenant : ${feedbackText}\n\nVeuillez analyser ce retour et fournir des insights pertinents.`;

    const response = await fetch(AZURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY!,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: [{
              type: "text",
              text: systemPrompt
            }]
          },
          {
            role: "user",
            content: [{
              type: "text",
              text: userPrompt
            }]
          }
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Azure OpenAI API error:', error);
      throw new Error('Failed to analyze feedback');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content[0].text;

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-feedback function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});