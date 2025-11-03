import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { email, amount, orderId, reference, metadata } = await request.json()

    // Validate request
    if (!email || !amount || !orderId || !reference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      console.error('Paystack secret key not configured')
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    // Initialize Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amount.toString(), // Amount in kobo
        reference,
        currency: 'NGN',
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          ...metadata,
          cancel_action: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`
        },
        channels: ['card', 'bank', 'ussd', 'mobile_money', 'bank_transfer']
      })
    })

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json()
      console.error('Paystack initialization error:', errorData)
      return NextResponse.json(
        { error: 'Failed to initialize payment', details: errorData.message },
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

    return NextResponse.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment', details: error.message },
      { status: 500 }
    )
  }
}
