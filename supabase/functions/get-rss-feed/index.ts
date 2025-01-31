import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Fetching RSS feed from sydologie.com...');
    const response = await fetch('https://sydologie.com/feed/');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }
    
    console.log('Successfully fetched RSS feed, parsing XML...');
    const xmlText = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    
    if (!doc) {
      throw new Error('Failed to parse RSS feed XML');
    }

    console.log('Successfully parsed XML, extracting items...');
    const items = doc.getElementsByTagName('item');
    
    if (!items || items.length === 0) {
      console.log('No items found in RSS feed');
      return new Response(
        JSON.stringify([]),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const articles = Array.from(items).map((item) => {
      const title = item.getElementsByTagName('title')[0]?.textContent || '';
      const link = item.getElementsByTagName('link')[0]?.textContent || '';
      const description = item.getElementsByTagName('description')[0]?.textContent || '';
      const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';
      const content = item.getElementsByTagName('content:encoded')[0]?.textContent || '';
      
      // Extract the first image from the content if available
      const imgMatch = content?.match(/<img[^>]+src="([^">]+)"/) || null;
      const imageUrl = imgMatch ? imgMatch[1] : null;

      return {
        title,
        link,
        description,
        pubDate,
        imageUrl,
      }
    });

    console.log(`Successfully extracted ${articles.length} articles`);

    return new Response(
      JSON.stringify(articles),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error in get-rss-feed function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch or parse RSS feed',
        details: error.message 
      }),
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