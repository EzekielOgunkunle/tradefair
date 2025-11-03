import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing transaction reference' },
        { status: 400 }
      )
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    // Verify transaction with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json()
      console.error('Paystack verification error:', errorData)
      return NextResponse.json(
        { error: 'Failed to verify payment', details: errorData.message },
        { status: 500 }
      )
    }

    const data = await paystackResponse.json()

    if (!data.status || !data.data) {
      return NextResponse.json(
        { error: 'Invalid response from payment provider' },
        { status: 500 }
      )
    }

    const transactionData = data.data

    return NextResponse.json({
      success: true,
      status: transactionData.status,
      reference: transactionData.reference,
      amount: transactionData.amount,
      currency: transactionData.currency,
      paidAt: transactionData.paid_at,
      channel: transactionData.channel,
      metadata: transactionData.metadata
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error.message },
      { status: 500 }
    )
  }
}
