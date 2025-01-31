import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DIGIFORMA_API_URL = 'https://app.digiforma.com/api/v1/graphql'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('DIGIFORMA_API_KEY')
    if (!apiKey) {
      throw new Error('API key not configured')
    }

    const query = `
      query Programs {
        programs(filters: { soldOnCatalog: true }) {
          id
          name
          description
          duration
          durationInHours
          trainingModality
          publicRegistrationUrl
          costs {
            cost
            costMode
            type
          }
        }
      }
    `

    console.log('Fetching formations from Digiforma...')
    
    const response = await fetch(DIGIFORMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query }),
    })

    const data = await response.json()
    
    console.log('Formations fetched successfully')

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching formations:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})