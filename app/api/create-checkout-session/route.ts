import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/create-checkout-session
 *
 * Creates a Stripe Checkout Session for invoice payment.
 * Requires STRIPE_SECRET_KEY in environment.
 * Falls back gracefully in demo mode.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, invoiceNumber, amount, clientEmail, description } = body;

    // ── Validate input ────────────────────────────────────────────────────────
    if (!invoiceId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid invoice data' },
        { status: 400 }
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // ── Demo mode (no Stripe key) ─────────────────────────────────────────────
    if (!stripeKey || stripeKey.includes('your_secret')) {
      return NextResponse.json(
        { error: 'Stripe not configured — running in demo mode' },
        { status: 503 }
      );
    }

    // ── Real Stripe integration ───────────────────────────────────────────────
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' as any });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode:                 'payment',
      customer_email:       clientEmail,
      line_items: [
        {
          price_data: {
            currency:     'usd',
            unit_amount:  amount,  // already in cents
            product_data: {
              name:        `Invoice ${invoiceNumber}`,
              description: description ?? 'Professional Services',
            },
          },
          quantity: 1,
        },
      ],
      metadata: { invoiceId, invoiceNumber },
      success_url: `${appUrl}/payment-success?invoice=${invoiceNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/client/invoices/${invoiceId}?cancelled=true`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    console.error('[create-checkout-session]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
