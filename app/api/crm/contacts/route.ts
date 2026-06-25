import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''

  const contacts = await prisma.crmContact.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
            { email: { contains: search } },
            { company: { contains: search } },
          ]
        } : {},
        status ? { status } : {},
      ]
    },
    include: {
      _count: { select: { deals: true, tasks: true, invoices: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(contacts)
}

export async function POST(req: NextRequest) {

  const data = await req.json()
  const contact = await prisma.crmContact.create({ data })
  return NextResponse.json(contact)
}
