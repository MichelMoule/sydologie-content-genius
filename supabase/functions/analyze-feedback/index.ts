import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const AZURE_ENDPOINT = "https://sydo.openai.azure.com/openai/deployments/sydo/chat/completions?api-version=2023-07-01-preview";
const AZURE_API_KEY = Deno.env.get('AZURE_OPENAI_API_KEY');

console.log("Hello from analyze-feedback Function!");

serve(async (req) => {
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Received request body:', requestBody);
    
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

Format de sortie STRICT en JSON dans le Markdown :

\`\`\`json
{
  "subject": "Le sujet de la formation",
  "question": "La question posée",
  "totalResponses": 42,
  "summary": "Un bref résumé global de l'analyse",
  "themes": [
    {
      "title": "Titre du thème",
      "percentage": 75,
      "description": "Description détaillée du thème",
      "testimonials": [
        "Premier témoignage représentatif",
        "Second témoignage représentatif"
      ],
      "isNegative": true,
      "improvements": [
        "Première suggestion d'amélioration",
        "Seconde suggestion d'amélioration"
      ]
    }
  ]
}
\`\`\`

Assurez-vous que :
1. Le JSON soit valide et parsable
2. Les pourcentages soient des nombres (pas de chaînes de caractères)
3. isNegative soit un booléen
4. improvements soit présent uniquement si isNegative est true
5. Le JSON soit encadré par les triples backticks et le mot 'json'`;

    const userPrompt = `J'ai fait une formation sur "${questionText}".

À l'issue de cela, j'ai proposé un questionnaire afin de récupérer les témoignages de mes participants. Voici les ${numberOfResponses} réponses reçues à la question "${questionText}" :

${feedbackText}

Merci de suivre strictement le format JSON demandé dans le prompt système pour l'analyse.`;

    console.log('Preparing request to Azure OpenAI');
    const requestBodyForAzure = {
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 1500
    };
    console.log('Request body for Azure:', JSON.stringify(requestBodyForAzure, null, 2));

    const response = await fetch(AZURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
      },
      body: JSON.stringify(requestBodyForAzure),
    });

    console.log('Azure API Response status:', response.status);
    const responseText = await response.text();
    console.log('Azure API Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Azure API responded with status ${response.status}: ${responseText}`);
    }

    const responseData = JSON.parse(responseText);
    console.log('Parsed response data:', responseData);

    return new Response(
      JSON.stringify({ analysis: responseData.choices[0].message.content }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});