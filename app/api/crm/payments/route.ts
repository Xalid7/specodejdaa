import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {

  const payments = await prisma.crmPayment.findMany({
    include: {
      invoice: {
        include: { contact: { select: { id: true, name: true } } }
      }
    },
    orderBy: { date: 'desc' }
  })

  return NextResponse.json(payments)
}

export async function POST(req: NextRequest) {

  const data = await req.json()
  const payment = await prisma.crmPayment.create({ data })

  // Check if invoice is fully paid
  const invoice = await prisma.crmInvoice.findUnique({
    where: { id: data.invoiceId },
    include: { payments: true }
  })
  if (invoice) {
    const totalPaid = invoice.payments.reduce((s, p) => s + p.amount, 0) + data.amount
    if (totalPaid >= invoice.total) {
      await prisma.crmInvoice.update({ where: { id: data.invoiceId }, data: { status: 'paid' } })
    }
  }

  return NextResponse.json(payment)
}
