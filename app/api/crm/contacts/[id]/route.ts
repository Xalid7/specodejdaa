import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const contact = await prisma.crmContact.findUnique({
    where: { id },
    include: {
      deals: { include: { stage: true } },
      tasks: true,
      invoices: true,
      activities: { orderBy: { createdAt: 'desc' } },
    }
  })
  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(contact)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const data = await req.json()
  const contact = await prisma.crmContact.update({ where: { id }, data })
  return NextResponse.json(contact)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  await prisma.crmContact.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
