import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";

import { corsHeaders } from '../_shared/cors.ts'


interface ReplyStats {
  ip_address: string
  username: string
  to_user: string,
  prompt: string, 
  gpt_model: string,
  tweet_content: string,
  reply_generated: string,
}

async function insertStats(supabaseClient: SupabaseClient, stats: ReplyStats) {
  const { error } = await supabaseClient.from('analytics_reply_generation').insert(stats)
  console.log(error)
  if (error) throw error

  return new Response(JSON.stringify({ "status": "created" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

serve(async (req) => {

  const { url, method } = req
  if (method != 'POST') {
    return new Response(
      JSON.stringify("Only POST method is allowed"),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  let body = null
  if (method === 'POST' || method === 'PUT') {
    body = await req.json()
  }

  // Create a Supabase client with the Auth context of the logged in user.
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  await insertStats(supabaseClient, {
    username: body.user,
    to_user: body.to_user,
    prompt: body.prompt,
    gpt_model: body.gpt_model,
    tweet_content: body.tweet_content,
    reply_generated: body.reply_generated
  }) 

  return new Response(
    JSON.stringify('Ok'),
     {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
     }
  )
})
