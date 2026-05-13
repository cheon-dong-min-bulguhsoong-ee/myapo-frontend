import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

const WIREFRAMES_ROOT = path.join(process.cwd(), 'design-system', 'wireframes')

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

interface WireframeRouteContext {
  params: Promise<{ path: string[] }>
}

export async function GET(_request: Request, context: WireframeRouteContext) {
  const { path: requestedPath } = await context.params
  const relativePath = requestedPath.join('/')
  const filePath = path.normalize(path.join(WIREFRAMES_ROOT, relativePath))

  if (!filePath.startsWith(`${WIREFRAMES_ROOT}${path.sep}`)) {
    return new NextResponse('Not found', { status: 404 })
  }

  try {
    const body = await readFile(filePath)
    const extension = path.extname(filePath).toLowerCase()

    return new NextResponse(body, {
      headers: {
        'Content-Type': CONTENT_TYPES[extension] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return new NextResponse('Not found', { status: 404 })
    }

    return new NextResponse('Unable to load wireframe', { status: 500 })
  }
}
