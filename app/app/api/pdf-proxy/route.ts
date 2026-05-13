import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOST_SUFFIX = '.r2.dev'

export async function GET(req: NextRequest) {
  const targetParam = req.nextUrl.searchParams.get('url')
  const filenameParam = req.nextUrl.searchParams.get('filename') ?? 'document.pdf'

  if (!targetParam) {
    return NextResponse.json({ error: 'url parameter is required' }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(targetParam)
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  if (target.protocol !== 'https:' || !target.hostname.endsWith(ALLOWED_HOST_SUFFIX)) {
    return NextResponse.json({ error: 'host not allowed' }, { status: 403 })
  }

  const upstream = await fetch(target.toString())
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: `upstream ${upstream.status}` }, { status: 502 })
  }

  const encodedName = encodeURIComponent(filenameParam)

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`,
      'Cache-Control': 'private, no-store',
    },
  })
}
