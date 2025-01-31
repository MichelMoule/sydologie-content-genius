import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AZURE_ENDPOINT = "https://sydo-chatgpt.openai.azure.com/openai/deployments/gpt-4o-mini-2/chat/completions?api-version=2024-08-01-preview";
const AZURE_API_KEY = Deno.env.get('AZURE_OPENAI_API_KEY');

serve(async (req) => {
  console.log('Function called - Starting execution');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2));
    
    const { feedbackText, questionText } = requestBody;
    console.log('Extracted fields:', { 
      feedbackText: feedbackText?.substring(0, 100) + '...', // Log first 100 chars for privacy
      questionText,
      feedbackLength: feedbackText?.length,
    });

    if (!feedbackText || !questionText) {
      console.error('Missing required fields:', { 
        hasFeedbackText: !!feedbackText, 
        hasQuestionText: !!questionText 
      });
      throw new Error('Feedback text and question text are required');
    }

    console.log('API Key present:', !!AZURE_API_KEY);
    console.log('API Key length:', AZURE_API_KEY?.length);
    console.log('Using Azure endpoint:', AZURE_ENDPOINT);

    const systemPrompt = "Vous êtes un expert en analyse de retours de formation. Analysez le retour ci-dessous et fournissez une analyse constructive et détaillée.";
    const userPrompt = `Question posée : ${questionText}\n\nRetour de l'apprenant : ${feedbackText}\n\nVeuillez analyser ce retour et fournir des insights pertinents.`;

    console.log('Preparing request to Azure OpenAI');
    const requestBodyForAzure = {
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
    };
    console.log('Request body for Azure:', JSON.stringify(requestBodyForAzure, null, 2));

    console.log('Making request to Azure...');
    const response = await fetch(AZURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY!,
      },
      body: JSON.stringify(requestBodyForAzure),
    });

    console.log('Azure API Response status:', response.status);
    console.log('Azure API Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Azure OpenAI API error details:', error);
      throw new Error('Failed to analyze feedback');
    }

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed Azure API Response data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      console.error('Invalid JSON response:', responseText);
      throw new Error('Invalid response from Azure API');
    }

    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected response structure:', data);
      throw new Error('Unexpected response structure from Azure API');
    }

    const analysis = data.choices[0].message.content;
    console.log('Final analysis:', analysis);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Detailed error in analyze-feedback function:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});