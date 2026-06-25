import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url)
  const contactId = searchParams.get('contactId')
  const dealId = searchParams.get('dealId')

  const activities = await prisma.crmActivity.findMany({
    where: {
      AND: [
        contactId ? { contactId } : {},
        dealId ? { dealId } : {},
      ]
    },
    include: {
      contact: { select: { id: true, name: true } },
      deal: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return NextResponse.json(activities)
}

export async function POST(req: NextRequest) {

  const data = await req.json()
  const activity = await prisma.crmActivity.create({ data })
  return NextResponse.json(activity)
}
