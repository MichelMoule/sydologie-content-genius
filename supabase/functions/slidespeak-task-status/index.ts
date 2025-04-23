
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const API_KEY = Deno.env.get('SLIDESPEAK_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!API_KEY) {
      throw new Error("La clé API SlideSpeak n'est pas configurée");
    }

    const { task_id } = await req.json();
    
    if (!task_id) {
      throw new Error("L'ID de tâche est requis");
    }

    const API_URL = `https://api.slidespeak.co/api/v1/task_status/${task_id}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Erreur API SlideSpeak: ${response.status} ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
