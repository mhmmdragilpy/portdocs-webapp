import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const origin = new URL(request.url).origin

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  })

  if (error) {
    console.error('Google Auth Error:', error)
    return NextResponse.redirect(`${origin}?error=auth_failed`, 303)
  }

  // Use 303 See Other to force the browser to change the HTTP method to GET
  return NextResponse.redirect(data.url, 303)
}
