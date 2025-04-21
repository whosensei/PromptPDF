import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    if (request.nextUrl.pathname.startsWith('/sign-in') || request.nextUrl.pathname.startsWith('/sign-up')) {
        if (token) {
            return NextResponse.redirect(new URL('/uploadfile', request.url))
        }
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    try {

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret')
        await jwtVerify(token, secret)
        return NextResponse.next()
    } catch (error) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
}

export const config = {
    matcher: ['/uploadfile', '/chats/:path*']
}