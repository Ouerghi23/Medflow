import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { invoiceSchema } from '@/lib/validations'
import { generateInvoiceNumber } from '@/lib/utils'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')
    const status = searchParams.get('status')

    const where: any = {
      tenantId: session.user.tenantId,
    }

    if (patientId) where.patientId = patientId
    if (status) where.status = status

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: invoices })
  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role === 'DOCTOR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = invoiceSchema.parse(body)

    // Calculate totals
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    )
    const discount = validatedData.discount || 0
    const tax = validatedData.tax || 0
    const totalAmount = subtotal - discount + tax

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        patientId: validatedData.patientId,
        amount: subtotal,
        discount,
        tax,
        totalAmount,
        dueDate: validatedData.dueDate,
        notes: validatedData.notes,
        tenantId: session.user.tenantId,
      },
      include: {
        patient: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: invoice,
    })
  } catch (error: any) {
    console.error('Create invoice error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la facture' },
      { status: 500 }
    )
  }
}
