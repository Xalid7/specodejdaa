import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const data = await req.json()
  const task = await prisma.crmTask.update({ where: { id }, data })
  return NextResponse.json(task)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  await prisma.crmTask.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
