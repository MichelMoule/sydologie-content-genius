
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, need, answers, prompt } = await req.json();
    
    const apiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'generate_questions':
        systemPrompt = `Tu es un expert en création de prompts pour l'IA. En fonction du besoin de l'utilisateur, 
        tu vas générer 3 à 5 questions pertinentes pour obtenir plus de contexte et mieux comprendre ses attentes.
        
        Format de ta réponse :
        Un tableau de questions avec pour chaque question :
        - Un ID unique
        - Le texte de la question
        - Le type de question (ouvert ou choix)
        - Les choix possibles si c'est une question à choix

        Réponds uniquement au format JSON avec cette structure :
        {
          "questions": [
            {
              "id": "q1",
              "text": "Texte de la question",
              "type": "open"
            },
            {
              "id": "q2",
              "text": "Question à choix",
              "type": "choice",
              "choices": ["Choix 1", "Choix 2", "Choix 3"]
            }
          ]
        }`;

        userPrompt = `Voici le besoin de l'utilisateur : "${need}"
        
        Génère-moi des questions pertinentes pour mieux comprendre son besoin et créer un prompt optimal.`;
        break;

      case 'generate_prompt':
        systemPrompt = `Tu es un expert en création de prompts pour l'IA. Tu vas créer un prompt structuré, détaillé et efficace à partir des informations fournies par l'utilisateur.
      
      Format de ta réponse :
      1. Tu vas structurer le prompt généré avec des sections clairement identifiables
      2. Tu vas utiliser des couleurs HTML pour différencier les sections (bleu pour le contexte, violet pour les instructions, vert pour les contraintes, etc.)
      3. Tu dois ajouter des explications didactiques sur pourquoi chaque section est importante
      4. Le prompt final doit être clair, complet et parfaitement adapté au besoin de l'utilisateur
      
      Réponds uniquement au format JSON en respectant cette structure :
      {
        "prompt": "Le prompt complet avec mise en forme HTML et couleurs",
        "explanation": "Explication générale sur la construction de ce prompt",
        "sections": [
          {
            "title": "Titre de la section",
            "content": "Texte de la section",
            "purpose": "À quoi sert cette section dans le prompt"
          }
        ]
      }`;

      userPrompt = `Je souhaite créer un prompt pour l'IA avec les critères suivants:
      
      Besoin: ${need}
      Réponses aux questions: ${JSON.stringify(answers)}
      
      Crée-moi un prompt optimal qui réponde parfaitement à ce besoin, avec des explications pédagogiques.`;
        break;

      case 'improve_prompt':
        systemPrompt = `Tu es un expert en évaluation et amélioration de prompts pour l'IA. Tu vas analyser le prompt fourni par l'utilisateur et proposer des améliorations.
      
      Format de ta réponse :
      1. Tu vas noter le prompt sur 100 points selon plusieurs critères: clarté, précision, structure, et efficacité.
      2. Tu vas identifier les points forts et les faiblesses du prompt
      3. Tu vas proposer une version améliorée du prompt avec des explications sur les changements
      4. Utilise des couleurs HTML pour mettre en évidence les différences et les améliorations
      
      Réponds uniquement au format JSON en respectant cette structure:
      {
        "score": 85,
        "evaluation": {
          "strengths": ["Point fort 1", "Point fort 2"],
          "weaknesses": ["Faiblesse 1", "Faiblesse 2"]
        },
        "improvedPrompt": "Version améliorée du prompt avec mise en forme HTML et couleurs",
        "improvements": [
          {
            "type": "Ajout/Modification/Suppression",
            "description": "Description de l'amélioration",
            "reason": "Raison de cette amélioration"
          }
        ]
      }`;

      userPrompt = `Voici le prompt que je souhaite améliorer:
      
      "${prompt}"
      
      Mon besoin est: ${need}
      
      Évalue ce prompt et propose-moi une version améliorée avec des explications détaillées.`;
        break;

      default:
        throw new Error('Action non reconnue');
    }

    // Log the request for debugging
    console.log(`Processing ${action} request with need: ${need?.substring(0, 50)}...`);

    // Call Azure OpenAI API
    const response = await fetch('https://sydo-chatgpt.openai.azure.com/openai/deployments/gpt-4o-mini-2/chat/completions?api-version=2024-08-01-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.choices || result.choices.length === 0) {
      console.error("Invalid response structure from OpenAI:", JSON.stringify(result));
      throw new Error('Invalid response from the AI service');
    }

    const aiContent = result.choices[0].message.content;
    console.log("AI response content:", aiContent.substring(0, 200) + "...");
    
    let responseData;
    
    try {
      responseData = JSON.parse(aiContent);
      
      // Validate the response structure based on action type
      if (action === 'generate_questions' && (!responseData.questions || !Array.isArray(responseData.questions))) {
        console.error("Invalid questions structure:", JSON.stringify(responseData));
        throw new Error("Response missing questions array");
      }
      
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.error("Raw AI response:", aiContent);
      throw new Error("Format de réponse invalide de l'IA");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: responseData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-prompt function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
