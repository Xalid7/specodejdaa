import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url)
  const stageId = searchParams.get('stageId') || ''
  const contactId = searchParams.get('contactId') || ''

  const deals = await prisma.crmDeal.findMany({
    where: {
      AND: [
        stageId ? { stageId } : {},
        contactId ? { contactId } : {},
      ]
    },
    include: {
      stage: true,
      contact: { select: { id: true, name: true, phone: true, company: true } },
      _count: { select: { tasks: true, invoices: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(deals)
}

export async function POST(req: NextRequest) {

  const data = await req.json()
  const deal = await prisma.crmDeal.create({
    data,
    include: { stage: true, contact: true }
  })
  return NextResponse.json(deal)
}
