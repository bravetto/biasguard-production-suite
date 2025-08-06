/**
 * BiasGuards.ai Stripe Webhook Handler - Enhanced 2024 Version
 * Comprehensive automatic subscription fulfillment and access provisioning
 * Features: Real-time provisioning, usage tracking, email automation, retry logic
 * Processes: checkout.session.completed, customer.subscription.*, invoice.*, payment_intent.*
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Enhanced webhook retry configuration
const WEBHOOK_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 30000, // 30 seconds
  enableEmailNotifications: true,
  enableUsageTracking: true,
  enableAdvancedLogging: true
};

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
    // Enhanced event handling with retry logic and comprehensive coverage
    const result = await processWebhookWithRetry(event);
    
    // Log successful processing
    if (WEBHOOK_CONFIG.enableAdvancedLogging) {
      await logWebhookEvent(event, 'success', result);
    }

    res.status(200).json({ 
      received: true, 
      eventId: event.id,
      eventType: event.type,
      processed: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Webhook handler error: ${error.message}`);
    
    // Log failed processing
    if (WEBHOOK_CONFIG.enableAdvancedLogging) {
      await logWebhookEvent(event, 'error', { error: error.message });
    }
    
    // Send alert for critical failures
    await sendWebhookFailureAlert(event, error);
    
    res.status(500).json({ 
      error: 'Webhook processing failed',
      eventId: event.id,
      eventType: event.type,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Process webhook events with retry logic and comprehensive handling
 */
async function processWebhookWithRetry(event, attempt = 1) {
  try {
    // Handle the event based on type
    switch (event.type) {
      case 'checkout.session.completed':
        return await handleCheckoutCompleted(event.data.object);

      case 'customer.subscription.created':
        return await handleSubscriptionCreated(event.data.object);

      case 'customer.subscription.updated':
        return await handleSubscriptionUpdated(event.data.object);

      case 'customer.subscription.deleted':
        return await handleSubscriptionDeleted(event.data.object);

      case 'invoice.payment_succeeded':
        return await handlePaymentSucceeded(event.data.object);

      case 'invoice.payment_failed':
        return await handlePaymentFailed(event.data.object);

      case 'customer.subscription.trial_will_end':
        return await handleTrialEnding(event.data.object);

      // Enhanced event coverage
      case 'payment_intent.succeeded':
        return await handlePaymentIntentSucceeded(event.data.object);

      case 'payment_intent.payment_failed':
        return await handlePaymentIntentFailed(event.data.object);

      case 'customer.subscription.paused':
        return await handleSubscriptionPaused(event.data.object);

      case 'customer.subscription.resumed':
        return await handleSubscriptionResumed(event.data.object);

      case 'invoice.created':
        return await handleInvoiceCreated(event.data.object);

      case 'customer.created':
        return await handleCustomerCreated(event.data.object);

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        return { handled: false, eventType: event.type };
    }

  } catch (error) {
    console.error(`❌ Webhook processing attempt ${attempt} failed: ${error.message}`);
    
    // Retry logic for transient failures
    if (attempt < WEBHOOK_CONFIG.maxRetries && isRetriableError(error)) {
      console.log(`🔄 Retrying webhook processing (attempt ${attempt + 1}/${WEBHOOK_CONFIG.maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, WEBHOOK_CONFIG.retryDelay * attempt));
      return await processWebhookWithRetry(event, attempt + 1);
    }
    
    throw error;
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

    return { handled: true, action: 'checkout_completed', tier, customer };

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
  
  return { handled: true, action: 'trial_ending_notification_sent' };
}

/**
 * Handle successful payment intent (for one-time payments)
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log(`💳 Payment intent succeeded: ${paymentIntent.id}`);
  
  const { customer, metadata } = paymentIntent;
  const tier = metadata?.tier || 'starter';
  
  try {
    // For one-time payments, provide temporary access
    await provisionTemporaryAccess(customer, tier, 30); // 30 days
    
    // Send confirmation email
    if (WEBHOOK_CONFIG.enableEmailNotifications) {
      await sendPaymentConfirmationEmail(customer, paymentIntent.amount, tier);
    }
    
    return { handled: true, action: 'temporary_access_granted', tier, days: 30 };
    
  } catch (error) {
    console.error(`❌ Error handling payment intent success: ${error.message}`);
    throw error;
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent) {
  console.log(`❌ Payment intent failed: ${paymentIntent.id}`);
  
  const { customer, last_payment_error } = paymentIntent;
  
  try {
    // Send payment failure notification
    if (WEBHOOK_CONFIG.enableEmailNotifications) {
      await sendPaymentFailureEmail(customer, last_payment_error?.message);
    }
    
    return { handled: true, action: 'payment_failure_notification_sent' };
    
  } catch (error) {
    console.error(`❌ Error handling payment intent failure: ${error.message}`);
    throw error;
  }
}

/**
 * Handle subscription paused
 */
async function handleSubscriptionPaused(subscription) {
  console.log(`⏸️ Subscription paused: ${subscription.id}`);
  
  const { customer } = subscription;
  
  try {
    await suspendAccess(customer);
    
    if (WEBHOOK_CONFIG.enableEmailNotifications) {
      await sendSubscriptionPausedEmail(customer);
    }
    
    return { handled: true, action: 'subscription_paused', access: 'suspended' };
    
  } catch (error) {
    console.error(`❌ Error handling subscription pause: ${error.message}`);
    throw error;
  }
}

/**
 * Handle subscription resumed
 */
async function handleSubscriptionResumed(subscription) {
  console.log(`▶️ Subscription resumed: ${subscription.id}`);
  
  const { customer, metadata } = subscription;
  const tier = metadata?.tier || 'starter';
  
  try {
    await provisionSubscriptionAccess(customer, subscription, tier);
    
    if (WEBHOOK_CONFIG.enableEmailNotifications) {
      await sendSubscriptionResumedEmail(customer, tier);
    }
    
    return { handled: true, action: 'subscription_resumed', tier };
    
  } catch (error) {
    console.error(`❌ Error handling subscription resume: ${error.message}`);
    throw error;
  }
}

/**
 * Handle invoice created (for proactive management)
 */
async function handleInvoiceCreated(invoice) {
  console.log(`📄 Invoice created: ${invoice.id}`);
  
  const { customer, subscription } = invoice;
  
  try {
    // Update usage tracking for the new billing period
    if (subscription) {
      const subscriptionObj = await stripe.subscriptions.retrieve(subscription);
      const tier = subscriptionObj.metadata?.tier || 'starter';
      
      await resetUsageCounters(customer, tier);
      
      // Send invoice notification if enabled
      if (WEBHOOK_CONFIG.enableEmailNotifications) {
        await sendInvoiceCreatedEmail(customer, invoice);
      }
    }
    
    return { handled: true, action: 'invoice_processed', usage_reset: true };
    
  } catch (error) {
    console.error(`❌ Error handling invoice creation: ${error.message}`);
    throw error;
  }
}

/**
 * Handle customer created
 */
async function handleCustomerCreated(customer) {
  console.log(`👤 Customer created: ${customer.id}`);
  
  try {
    // Initialize customer with basic metadata
    await stripe.customers.update(customer.id, {
      metadata: {
        account_created: new Date().toISOString(),
        subscription_tier: 'none',
        subscription_status: 'inactive',
        usage_basic: '0',
        usage_counterfactual: '0',
        usage_neural_howlround: '0',
        onboarding_completed: 'false'
      }
    });
    
    // Send welcome email (non-subscriber)
    if (WEBHOOK_CONFIG.enableEmailNotifications && customer.email) {
      await sendCustomerWelcomeEmail(customer.email);
    }
    
    return { handled: true, action: 'customer_initialized' };
    
  } catch (error) {
    console.error(`❌ Error handling customer creation: ${error.message}`);
    throw error;
  }
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

/**
 * Provision temporary access for one-time payments
 */
async function provisionTemporaryAccess(customerId, tier, days) {
  console.log(`⏰ Provisioning ${days}-day temporary ${tier} access for customer: ${customerId}`);
  
  try {
    const features = getTierFeatures(tier);
    const limits = getTierLimits(tier);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    
    await stripe.customers.update(customerId, {
      metadata: {
        subscription_tier: tier,
        subscription_status: 'temporary',
        features: JSON.stringify(features),
        limits: JSON.stringify(limits),
        temporary_access_expires: expirationDate.toISOString(),
        access_provisioned: new Date().toISOString(),
        usage_basic: '0',
        usage_counterfactual: '0',
        usage_neural_howlround: '0'
      }
    });
    
    console.log(`✅ Temporary access provisioned for ${tier} tier (${days} days)`);
    
  } catch (error) {
    console.error(`❌ Error provisioning temporary access: ${error.message}`);
    throw error;
  }
}

/**
 * Enhanced Email Notification System
 */

// Payment confirmation email
async function sendPaymentConfirmationEmail(customerId, amount, tier) {
  console.log(`📧 Sending payment confirmation email for customer: ${customerId} (${tier} tier, $${amount/100})`);
  
  // TODO: Implement with your email service (SendGrid, Mailgun, etc.)
  const emailData = {
    to: await getCustomerEmail(customerId),
    subject: `Payment Confirmed - BiasGuard ${tier.charAt(0).toUpperCase() + tier.slice(1)} Access`,
    template: 'payment_confirmation',
    data: {
      tier: tier.charAt(0).toUpperCase() + tier.slice(1),
      amount: (amount / 100).toFixed(2),
      features: getTierFeatures(tier),
      accessDuration: '30 days'
    }
  };
  
  console.log('📧 Email queued:', emailData.subject);
}

// Subscription paused email
async function sendSubscriptionPausedEmail(customerId) {
  console.log(`📧 Sending subscription paused email for customer: ${customerId}`);
  
  const emailData = {
    to: await getCustomerEmail(customerId),
    subject: 'Your BiasGuard Subscription Has Been Paused',
    template: 'subscription_paused',
    data: {
      resumeUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/customer-portal`,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@biasguards.ai'
    }
  };
  
  console.log('📧 Email queued:', emailData.subject);
}

// Subscription resumed email
async function sendSubscriptionResumedEmail(customerId, tier) {
  console.log(`📧 Sending subscription resumed email for customer: ${customerId} (${tier} tier)`);
  
  const emailData = {
    to: await getCustomerEmail(customerId),
    subject: `Welcome Back! Your BiasGuard ${tier.charAt(0).toUpperCase() + tier.slice(1)} Subscription is Active`,
    template: 'subscription_resumed',
    data: {
      tier: tier.charAt(0).toUpperCase() + tier.slice(1),
      features: getTierFeatures(tier),
      dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    }
  };
  
  console.log('📧 Email queued:', emailData.subject);
}

// Invoice created email
async function sendInvoiceCreatedEmail(customerId, invoice) {
  console.log(`📧 Sending invoice created email for customer: ${customerId}`);
  
  const emailData = {
    to: await getCustomerEmail(customerId),
    subject: `Your BiasGuard Invoice is Ready - $${(invoice.amount_due / 100).toFixed(2)}`,
    template: 'invoice_created',
    data: {
      invoiceNumber: invoice.number,
      amount: (invoice.amount_due / 100).toFixed(2),
      dueDate: new Date(invoice.due_date * 1000).toLocaleDateString(),
      payUrl: invoice.hosted_invoice_url
    }
  };
  
  console.log('📧 Email queued:', emailData.subject);
}

// Customer welcome email (non-subscriber)
async function sendCustomerWelcomeEmail(email) {
  console.log(`📧 Sending customer welcome email to: ${email}`);
  
  const emailData = {
    to: email,
    subject: 'Welcome to BiasGuard - Your AI Bias Detection Journey Begins',
    template: 'customer_welcome',
    data: {
      trialUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/demo`,
      pricingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@biasguards.ai'
    }
  };
  
  console.log('📧 Email queued:', emailData.subject);
}

/**
 * Utility Functions
 */

// Get customer email from Stripe
async function getCustomerEmail(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.email;
  } catch (error) {
    console.error(`❌ Error getting customer email: ${error.message}`);
    return null;
  }
}

// Check if error is retriable
function isRetriableError(error) {
  const retriableErrors = [
    'network',
    'timeout',
    'rate_limit',
    'api_connection_error',
    'api_error'
  ];
  
  return retriableErrors.some(type => 
    error.message.toLowerCase().includes(type) || 
    error.type === type
  );
}

// Log webhook events for monitoring
async function logWebhookEvent(event, status, result = {}) {
  const logEntry = {
    eventId: event.id,
    eventType: event.type,
    status: status,
    timestamp: new Date().toISOString(),
    result: result,
    livemode: event.livemode
  };
  
  console.log(`📊 Webhook Event Log:`, JSON.stringify(logEntry, null, 2));
  
  // TODO: Store in your logging system (database, monitoring service, etc.)
}

// Send webhook failure alerts
async function sendWebhookFailureAlert(event, error) {
  console.log(`🚨 WEBHOOK FAILURE ALERT: ${event.type} - ${error.message}`);
  
  const alertData = {
    eventType: event.type,
    eventId: event.id,
    error: error.message,
    timestamp: new Date().toISOString(),
    severity: 'high'
  };
  
  // TODO: Send to monitoring service (Slack, PagerDuty, email, etc.)
  console.log('🚨 Alert data:', JSON.stringify(alertData, null, 2));
}