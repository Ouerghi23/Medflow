import { createCheckoutSession } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { invoiceId } = body

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        tenantId: session.user.tenantId,
      },
      include: {
        patient: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 })
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'Facture déjà payée' }, { status: 400 })
    }

    const checkoutSession = await createCheckoutSession(
      Number(invoice.totalAmount),
      invoice.id,
      {
        patientId: invoice.patientId,
        tenantId: invoice.tenantId,
        invoiceNumber: invoice.invoiceNumber,
      }
    )

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error: any) {
    console.error('Create checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du paiement' },
      { status: 500 }
    )
  }
}
