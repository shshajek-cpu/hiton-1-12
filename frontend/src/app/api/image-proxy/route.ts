import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const rawUrl = request.nextUrl.searchParams.get('url')

    if (!rawUrl) {
        return new NextResponse('Missing URL parameter', { status: 400 })
    }

    // Decode URL just in case, though searchParams usually handles it.
    // Sometimes double encoding happens on client side.
    const url = decodeURIComponent(rawUrl)

    try {
        console.log(`[Proxy] Fetching: ${url}`)
        
        // Fetch the image from the external server
        const response = await fetch(url, {
            headers: {
                // Mimic a generic browser request strictly
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://aion2.plaync.com/' 
            }
        })

        console.log(`[Proxy] Status: ${response.status}`)

        if (!response.ok) {
            console.error(`[Proxy] Failed: ${response.status} ${response.statusText}`)
            return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status })
        }

        // Get the image data
        const buffer = await response.arrayBuffer()
        
        // Check if buffer is empty or too small (e.g. empty pixel or error text)
        if (buffer.byteLength < 100) {
            console.warn(`[Proxy] Image too small (${buffer.byteLength} bytes), possibly blocked or empty.`)
            return new NextResponse('Image too small', { status: 404 })
        }

        const headers = new Headers()

        // Forward content type (image/jpeg, image/png, etc.)
        headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg')
        // Cache control for performance
        headers.set('Cache-Control', 'public, max-age=86400')

        return new NextResponse(buffer, {
            headers
        })

    } catch (error) {
        console.error('Image Proxy Error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
