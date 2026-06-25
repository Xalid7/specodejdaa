import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalContacts,
    newContactsThisMonth,
    totalDeals,
    dealsWon,
    dealsLost,
    totalInvoices,
    paidInvoices,
    totalTasks,
    doneTasks,
    overdueTasks,
    recentActivities,
    dealsByStage,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.crmContact.count(),
    prisma.crmContact.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.crmDeal.count(),
    prisma.crmDeal.count({ where: { stage: { type: 'won' } } }),
    prisma.crmDeal.count({ where: { stage: { type: 'lost' } } }),
    prisma.crmInvoice.count(),
    prisma.crmInvoice.count({ where: { status: 'paid' } }),
    prisma.crmTask.count(),
    prisma.crmTask.count({ where: { status: 'done' } }),
    prisma.crmTask.count({ where: { status: { not: 'done' }, dueDate: { lt: now } } }),
    prisma.crmActivity.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { contact: { select: { name: true } } } }),
    prisma.crmDeal.groupBy({ by: ['stageId'], _count: true, _sum: { amount: true } }),
    prisma.crmPayment.aggregate({
      where: { date: { gte: startOfMonth } },
      _sum: { amount: true }
    }),
  ])

  // Total revenue (all time)
  const totalRevenue = await prisma.crmPayment.aggregate({ _sum: { amount: true } })
  // Pending amount
  const pendingInvoices = await prisma.crmInvoice.aggregate({
    where: { status: { in: ['sent', 'overdue', 'draft'] } },
    _sum: { total: true }
  })

  return NextResponse.json({
    contacts: { total: totalContacts, newThisMonth: newContactsThisMonth },
    deals: { total: totalDeals, won: dealsWon, lost: dealsLost, active: totalDeals - dealsWon - dealsLost },
    invoices: { total: totalInvoices, paid: paidInvoices, pending: totalInvoices - paidInvoices },
    tasks: { total: totalTasks, done: doneTasks, overdue: overdueTasks, active: totalTasks - doneTasks },
    revenue: {
      total: totalRevenue._sum.amount || 0,
      thisMonth: monthlyRevenue._sum.amount || 0,
      pending: pendingInvoices._sum.total || 0,
    },
    recentActivities,
    dealsByStage,
  })
}
