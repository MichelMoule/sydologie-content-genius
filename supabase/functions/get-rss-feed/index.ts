import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { XMLParser } from 'npm:fast-xml-parser';

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
    console.log('Fetching RSS feed from politepol...');
    const response = await fetch('https://politepol.com/fd/vqTGYzibhecy.xml');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }
    
    console.log('Successfully fetched RSS feed, parsing XML...');
    const xmlText = await response.text();
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    
    const result = parser.parse(xmlText);
    
    if (!result?.rss?.channel?.item) {
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

    const items = Array.isArray(result.rss.channel.item) 
      ? result.rss.channel.item 
      : [result.rss.channel.item];

    console.log(`Found ${items.length} articles in the feed`);

    const articles = items.map((item) => {
      // Extract the first image from the content if available
      const content = item['content:encoded'] || '';
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/) || null;
      const imageUrl = imgMatch ? imgMatch[1] : null;

      return {
        title: item.title || '',
        link: item.link || '',
        description: item.description || '',
        pubDate: item.pubDate || '',
        imageUrl,
      }
    });

    console.log(`Successfully processed ${articles.length} articles`);

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