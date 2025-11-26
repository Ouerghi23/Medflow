import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    try {
      const invoiceId = session.metadata?.invoiceId

      if (!invoiceId) {
        throw new Error('Missing invoice ID in session metadata')
      }

      // Create payment record
      await prisma.payment.create({
        data: {
          invoiceId,
          amount: session.amount_total! / 100, // Convert from cents
          method: 'STRIPE',
          transactionId: session.payment_intent as string,
          stripeSessionId: session.id,
          status: 'completed',
        },
      })

      // Update invoice status
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'PAID' },
      })

      console.log(`Payment completed for invoice ${invoiceId}`)
    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json(
        { error: 'Error processing payment' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
