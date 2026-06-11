import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params
  await prisma.serviceProduct.delete({ where: { id: pid } })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params
  const body = await req.json()
  const p = await prisma.serviceProduct.update({ where: { id: pid }, data: body })
  return NextResponse.json(p)
}
