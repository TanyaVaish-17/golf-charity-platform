import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return Response.json({ error: 'Webhook error' }, { status: 400 })
  }

  const session = event.data.object

  if (event.type === 'checkout.session.completed') {
    const userId = session.metadata.userId
    const subscriptionId = session.subscription

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const plan = subscription.items.data[0].price.recurring.interval === 'month' ? 'monthly' : 'yearly'
    const endDate = new Date(subscription.current_period_end * 1000)

    await supabase.from('profiles').update({
      subscription_status: 'active',
      subscription_plan: plan,
      subscription_end_date: endDate,
      stripe_subscription_id: subscriptionId,
    }).eq('id', userId)

    await supabase.from('subscription_logs').insert({
      user_id: userId,
      plan,
      amount: session.amount_total / 100,
      stripe_payment_id: session.payment_intent,
      status: 'paid',
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_subscription_id', session.id)
      .single()

    if (profile) {
      await supabase.from('profiles').update({
        subscription_status: 'inactive',
        stripe_subscription_id: null,
      }).eq('id', profile.id)
    }
  }

  return Response.json({ received: true })
}