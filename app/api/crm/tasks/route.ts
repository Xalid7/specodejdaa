import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || ''
  const priority = searchParams.get('priority') || ''

  const tasks = await prisma.crmTask.findMany({
    where: {
      AND: [
        status ? { status } : {},
        priority ? { priority } : {},
      ]
    },
    include: {
      contact: { select: { id: true, name: true } },
      deal: { select: { id: true, title: true } },
    },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }]
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {

  const data = await req.json()
  const task = await prisma.crmTask.create({
    data,
    include: { contact: true, deal: true }
  })
  return NextResponse.json(task)
}
