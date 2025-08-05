/**
 * BiasGuards.ai Stripe Webhook Handler
 * Handles subscription events for automatic fulfillment and access provisioning
 * Processes: checkout.session.completed, customer.subscription.*, invoice.*
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Disable body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;
  let body;

  try {
    // Get raw body for signature verification
    body = await getRawBody(req);
    
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`✅ Webhook signature verified: ${event.type}`);

  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialEnding(event.data.object);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error(`❌ Webhook handler error: ${error.message}`);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutCompleted(session) {
  console.log(`🎉 Checkout completed: ${session.id}`);
  
  const { customer, subscription, metadata } = session;
  const tier = metadata?.tier || 'starter';

  try {
    // If this is a subscription, the subscription object will be present
    if (subscription) {
      const subscriptionObj = await stripe.subscriptions.retrieve(subscription);
      await provisionSubscriptionAccess(customer, subscriptionObj, tier);
    }

    // Send welcome email (placeholder for email service integration)
    await sendWelcomeEmail(session.customer_details?.email, tier);

    console.log(`✅ Access provisioned for customer: ${customer}, tier: ${tier}`);

  } catch (error) {
    console.error(`❌ Error handling checkout completion: ${error.message}`);
    throw error;
  }
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription) {
  console.log(`📝 Subscription created: ${subscription.id}`);
  
  const { customer, metadata } = subscription;
  const tier = metadata?.tier || 'starter';

  await provisionSubscriptionAccess(customer, subscription, tier);
}

/**
 * Handle subscription updates (plan changes, etc.)
 */
async function handleSubscriptionUpdated(subscription) {
  console.log(`🔄 Subscription updated: ${subscription.id}`);
  
  const { customer, metadata, status } = subscription;
  const tier = metadata?.tier || 'starter';

  if (status === 'active') {
    await provisionSubscriptionAccess(customer, subscription, tier);
  } else if (status === 'past_due' || status === 'unpaid') {
    await suspendAccess(customer);
  }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription) {
  console.log(`🗑️ Subscription deleted: ${subscription.id}`);
  
  const { customer } = subscription;
  await revokeAccess(customer);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice) {
  console.log(`💰 Payment succeeded: ${invoice.id}`);
  
  const { customer, subscription } = invoice;
  
  if (subscription) {
    const subscriptionObj = await stripe.subscriptions.retrieve(subscription);
    const tier = subscriptionObj.metadata?.tier || 'starter';
    
    // Restore access if it was suspended
    await provisionSubscriptionAccess(customer, subscriptionObj, tier);
    
    // Reset usage counters for new billing period
    await resetUsageCounters(customer, tier);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
  console.log(`❌ Payment failed: ${invoice.id}`);
  
  const { customer } = invoice;
  
  // Send payment failure notification
  await sendPaymentFailureEmail(customer);
  
  // Optionally suspend access after multiple failures
  if (invoice.attempt_count >= 3) {
    await suspendAccess(customer);
  }
}

/**
 * Handle trial ending notification
 */
async function handleTrialEnding(subscription) {
  console.log(`⏰ Trial ending soon: ${subscription.id}`);
  
  const { customer } = subscription;
  await sendTrialEndingEmail(customer);
}

/**
 * Provision access to BiasGuards features based on subscription tier
 */
async function provisionSubscriptionAccess(customerId, subscription, tier) {
  console.log(`🔑 Provisioning ${tier} access for customer: ${customerId}`);
  
  try {
    const features = getTierFeatures(tier);
    const limits = getTierLimits(tier);
    
    // Update customer metadata in Stripe for persistence
    await stripe.customers.update(customerId, {
      metadata: {
        subscription_tier: tier,
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        features: JSON.stringify(features),
        limits: JSON.stringify(limits),
        current_period_start: subscription.current_period_start.toString(),
        current_period_end: subscription.current_period_end.toString(),
        trial_end: subscription.trial_end?.toString() || '',
        access_provisioned: new Date().toISOString(),
        usage_basic: '0',
        usage_counterfactual: '0',
        usage_neural_howlround: '0'
      }
    });
    
    console.log(`✅ Access provisioned and stored in Stripe metadata for ${tier} tier`);
    
  } catch (error) {
    console.error(`❌ Error provisioning access: ${error.message}`);
    throw error;
  }
}

/**
 * Suspend access for past due or failed payments
 */
async function suspendAccess(customerId) {
  console.log(`⏸️ Suspending access for customer: ${customerId}`);
  
  try {
    // Update customer metadata to suspend access
    await stripe.customers.update(customerId, {
      metadata: {
        subscription_status: 'suspended',
        access_suspended: new Date().toISOString()
      }
    });
    
    console.log(`✅ Access suspended for customer: ${customerId}`);
    
  } catch (error) {
    console.error(`❌ Error suspending access: ${error.message}`);
    throw error;
  }
}

/**
 * Revoke access when subscription is cancelled
 */
async function revokeAccess(customerId) {
  console.log(`🚫 Revoking access for customer: ${customerId}`);
  
  try {
    // Update customer metadata to revoke access
    await stripe.customers.update(customerId, {
      metadata: {
        subscription_status: 'cancelled',
        subscription_tier: 'none',
        access_revoked: new Date().toISOString(),
        features: JSON.stringify([]),
        limits: JSON.stringify({ analyses: 0, api_calls: 0 })
      }
    });
    
    console.log(`✅ Access revoked for customer: ${customerId}`);
    
  } catch (error) {
    console.error(`❌ Error revoking access: ${error.message}`);
    throw error;
  }
}

/**
 * Reset usage counters for new billing period
 */
async function resetUsageCounters(customerId, tier) {
  console.log(`🔄 Resetting usage counters for customer: ${customerId}`);
  
  try {
    // Reset usage counters in customer metadata
    await stripe.customers.update(customerId, {
      metadata: {
        usage_basic: '0',
        usage_counterfactual: '0',
        usage_neural_howlround: '0',
        usage_reset_date: new Date().toISOString(),
        current_billing_period: new Date().toISOString()
      }
    });
    
    console.log(`✅ Usage counters reset for customer: ${customerId} (${tier} tier)`);
    
  } catch (error) {
    console.error(`❌ Error resetting usage counters: ${error.message}`);
    throw error;
  }
}

/**
 * Send welcome email to new subscribers
 */
async function sendWelcomeEmail(email, tier) {
  console.log(`📧 Sending welcome email to: ${email} (${tier} tier)`);
  
  // TODO: Integrate with your email service
  // await emailService.sendWelcome(email, tier);
}

/**
 * Send payment failure notification
 */
async function sendPaymentFailureEmail(customerId) {
  console.log(`📧 Sending payment failure notification to customer: ${customerId}`);
  
  // TODO: Integrate with your email service
  // await emailService.sendPaymentFailure(customerId);
}

/**
 * Send trial ending notification
 */
async function sendTrialEndingEmail(customerId) {
  console.log(`📧 Sending trial ending notification to customer: ${customerId}`);
  
  // TODO: Integrate with your email service
  // await emailService.sendTrialEnding(customerId);
}

/**
 * Get features for each subscription tier
 */
function getTierFeatures(tier) {
  const features = {
    starter: ['basic_analysis'],
    professional: ['basic_analysis', 'counterfactual_analysis'],
    enterprise: ['basic_analysis', 'counterfactual_analysis', 'neural_howlround']
  };
  
  return features[tier] || features.starter;
}

/**
 * Get usage limits for each subscription tier
 */
function getTierLimits(tier) {
  const limits = {
    starter: { analyses: 1000, api_calls: 500 },
    professional: { analyses: 10000, api_calls: 5000 },
    enterprise: { analyses: -1, api_calls: -1 } // -1 = unlimited
  };
  
  return limits[tier] || limits.starter;
}

/**
 * Get raw body from request for webhook signature verification
 */
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
    req.on('error', err => {
      reject(err);
    });
  });
}