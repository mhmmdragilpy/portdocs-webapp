import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  // 1. Update Supabase Session
  const response = await updateSession(request)

  // 2. Admin Route Protection
  const path = request.nextUrl.pathname
  
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const adminSession = request.cookies.get('admin_session')?.value
    
    // Check if hardcoded session is valid
    if (adminSession !== 'authenticated_admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 3. Prevent logged-in admins from seeing login page
  if (path === '/admin/login') {
    const adminSession = request.cookies.get('admin_session')?.value
    if (adminSession === 'authenticated_admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
