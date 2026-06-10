import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const s = await prisma.settings.findFirst()
  return NextResponse.json(s || {})
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const s = await prisma.settings.upsert({
    where: { id: 'default' },
    update: body,
    create: { id: 'default', ...body },
  })
  return NextResponse.json(s)
}
