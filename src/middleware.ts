import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server"

const publicRoutes = [
    {path: '/sign-in', whenAuthenticated: 'redirect'},
    {path: '/register', whenAuthenticated: 'redirect'},
    {path: '/pricing', whenAuthenticated: 'next'},
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/sign-in'
const REDIRECT_WHEN_AUTHENTICATED_ROUTE = '/'

export function middleware(request: NextRequest) {
    console.log('worked')
    const path =  request.nextUrl.pathname
    const publicRoute = publicRoutes.find(route => route.path === path)
    const authToken = request.cookies.get('token')

    /* Not authenticated user */
    if (!authToken && publicRoute) {
        return NextResponse.next()
    }

    if (!authToken && !publicRoute) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
        return NextResponse.redirect(redirectUrl)
    }

    /* Authenticated user */
    if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED_ROUTE
        return NextResponse.redirect(redirectUrl)
    }

    if (authToken && !publicRoute) {
        // consider checking jwt/token is expired
        // consider redirect the user login
        // consider to refresh token
        return NextResponse.next()
    }


    return NextResponse.next()
}

export const config: MiddlewareConfig = {
    matcher: [
        /* https://nextjs.org/docs/app/building-your-application/routing/middleware
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      ],
}

