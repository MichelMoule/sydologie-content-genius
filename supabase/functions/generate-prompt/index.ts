
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
    const { mode, need, context, audience, tone, complexity, prompt } = await req.json();
    
    const apiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    let systemPrompt = '';
    let userPrompt = '';

    // Différent prompts selon le mode (génération ou amélioration)
    if (mode === 'generate') {
      systemPrompt = `Tu es un expert en création de prompts pour l'IA. Tu vas créer un prompt structuré, détaillé et efficace à partir des informations fournies par l'utilisateur.
      
      Format de ta réponse :
      1. Tu vas structurer le prompt généré avec des sections clairement identifiables
      2. Tu vas utiliser des couleurs HTML pour différencier les sections (bleu pour le contexte, violet pour les instructions, vert pour les contraintes, etc.)
      3. Tu dois ajouter des explications didactiques sur pourquoi chaque section est importante
      4. Le prompt final doit être clair, complet et parfaitement adapté au besoin de l'utilisateur
      
      Répond uniquement au format JSON en respectant cette structure :
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
      Contexte: ${context || "Non spécifié"}
      Public cible: ${audience || "Non spécifié"}
      Ton souhaité: ${tone || "Non spécifié"}
      Niveau de complexité: ${complexity || "Moyen"}
      
      Crée-moi un prompt optimal qui réponde parfaitement à ce besoin, avec des explications pédagogiques.`;
    } else {
      systemPrompt = `Tu es un expert en évaluation et amélioration de prompts pour l'IA. Tu vas analyser le prompt fourni par l'utilisateur et proposer des améliorations.
      
      Format de ta réponse :
      1. Tu vas noter le prompt sur 100 points selon plusieurs critères: clarté, précision, structure, et efficacité.
      2. Tu vas identifier les points forts et les faiblesses du prompt
      3. Tu vas proposer une version améliorée du prompt avec des explications sur les changements
      4. Utilise des couleurs HTML pour mettre en évidence les différences et les améliorations
      
      Répond uniquement au format JSON en respectant cette structure:
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
    }

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

    const result = await response.json();
    console.log('Received response from Azure OpenAI');

    if (!result.choices || result.choices.length === 0) {
      console.error('Invalid response from Azure OpenAI:', result);
      throw new Error('Invalid response from the AI service');
    }

    const aiContent = result.choices[0].message.content;
    let responseData;

    try {
      // Parse the JSON response from the AI
      responseData = JSON.parse(aiContent);
      console.log('Successfully parsed prompt data');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.log('Raw response:', aiContent);
      throw new Error('Failed to parse data from AI response');
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
