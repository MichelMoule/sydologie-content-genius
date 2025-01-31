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
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2));
    
    const { feedbackText, questionText } = requestBody;
    console.log('Extracted fields:', { 
      feedbackText: feedbackText?.substring(0, 100) + '...', 
      questionText,
      feedbackLength: feedbackText?.length,
    });

    if (!feedbackText || !questionText) {
      console.error('Missing required fields');
      throw new Error('Feedback text and question text are required');
    }

    const feedbackLines = feedbackText.split('\n').filter(line => line.trim().length > 0);
    const numberOfResponses = feedbackLines.length;

    const systemPrompt = `Vous êtes un expert en analyse de retours de formation qui excelle dans l'analyse sémantique et le regroupement thématique.

Instructions spécifiques :
1. Analysez les retours et regroupez-les par thèmes principaux
2. Ne conservez que les thèmes qui représentent plus de 10% des retours
3. Triez les thèmes par ordre décroissant de pourcentage d'occurrences
4. Pour chaque thème identifié, fournissez :
   - Une description claire de l'idée générale
   - Le pourcentage précis d'occurrences
   - 2-3 exemples de témoignages représentatifs
   - Des propositions de solutions si les retours sont négatifs

Format de sortie en Markdown :
# Analyse des retours de formation : [Sujet]

Question posée : [Question]
Nombre de réponses analysées : [Nombre]

## Résumé des thèmes principaux

[Liste des thèmes avec leurs pourcentages]

## Analyse détaillée par thème

### [Thème 1]
**Idée générale :** [Description]
**Pourcentage d'occurrences :** [X]%
**Exemples de témoignages :**
- [Exemple 1]
- [Exemple 2]
[Si négatif] **Propositions d'amélioration :**
- [Solution 1]
- [Solution 2]

[Répéter pour chaque thème]`;

    const userPrompt = `J'ai fait une formation sur "${questionText}".

À l'issue de cela, j'ai proposé un questionnaire afin de récupérer les témoignages de mes participants. Voici les ${numberOfResponses} réponses reçues à la question "${questionText}" :

${feedbackText}

Merci de suivre strictement le format demandé dans le prompt système pour l'analyse.`;

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
      max_tokens: 1500
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