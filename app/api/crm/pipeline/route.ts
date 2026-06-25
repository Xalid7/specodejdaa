import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_STAGES = [
  { name: 'Yangi lid', color: '#6B7280', order: 0, type: 'active' },
  { name: 'Aloqa o\'rnatildi', color: '#3B82F6', order: 1, type: 'active' },
  { name: 'Taklif yuborildi', color: '#8B5CF6', order: 2, type: 'active' },
  { name: 'Muzokara', color: '#F59E0B', order: 3, type: 'active' },
  { name: 'Bitim tuzildi', color: '#10B981', order: 4, type: 'won' },
  { name: 'Rad etildi', color: '#EF4444', order: 5, type: 'lost' },
]

export async function GET() {

  let stages = await prisma.crmPipelineStage.findMany({ orderBy: { order: 'asc' } })

  if (stages.length === 0) {
    stages = await Promise.all(DEFAULT_STAGES.map(s => prisma.crmPipelineStage.create({ data: s })))
  }

  return NextResponse.json(stages)
}

export async function POST(req: NextRequest) {

  const data = await req.json()
  const stage = await prisma.crmPipelineStage.create({ data })
  return NextResponse.json(stage)
}
