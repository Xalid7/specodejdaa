import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || ''

  const invoices = await prisma.crmInvoice.findMany({
    where: status ? { status } : {},
    include: {
      contact: { select: { id: true, name: true, phone: true } },
      deal: { select: { id: true, title: true } },
      payments: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(invoices)
}

export async function POST(req: NextRequest) {

  const data = await req.json()

  const count = await prisma.crmInvoice.count()
  const number = `INV-${String(count + 1).padStart(4, '0')}`

  const invoice = await prisma.crmInvoice.create({
    data: { ...data, number },
    include: { contact: true, deal: true }
  })
  return NextResponse.json(invoice)
}
