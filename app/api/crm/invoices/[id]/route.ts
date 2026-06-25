import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const invoice = await prisma.crmInvoice.findUnique({
    where: { id },
    include: { contact: true, deal: true, payments: true }
  })
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(invoice)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const data = await req.json()
  const invoice = await prisma.crmInvoice.update({ where: { id }, data })
  return NextResponse.json(invoice)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  await prisma.crmInvoice.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
