/**
 * BiasGuards.ai Stripe Checkout Session API
 * Creates secure server-side checkout sessions for subscription payments
 * Supports all three tiers: Starter ($19/mo), Professional ($99/mo), Enterprise ($299/mo)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, tier, mode = 'subscription', successPath = '/subscription-success', cancelPath = '/pricing' } = req.body;

    // Validate required parameters
    if (!priceId || !tier) {
      return res.status(400).json({ 
        error: 'Missing required parameters: priceId and tier are required' 
      });
    }

    // Validate tier against known price IDs
    const validPriceIds = {
      'starter': process.env.STRIPE_PRICE_ID_STARTER || 'price_1RsDxiL7UMRowhrwAa7Zimok',
      'professional': process.env.STRIPE_PRICE_ID_PROFESSIONAL || 'price_1RsDyVL7UMRowhrw9XnqUl2W',
      'enterprise': process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_1RsDz8L7UMRowhrwqqKW2tV7'
    };

    console.log('🔍 Debug - Received:', { priceId, tier, mode });
    console.log('🔍 Debug - Valid Price IDs:', validPriceIds);
    console.log('🔍 Debug - Environment Check:', {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_PRICE_ID_STARTER: process.env.STRIPE_PRICE_ID_STARTER,
      STRIPE_PRICE_ID_PROFESSIONAL: process.env.STRIPE_PRICE_ID_PROFESSIONAL,
      STRIPE_PRICE_ID_ENTERPRISE: process.env.STRIPE_PRICE_ID_ENTERPRISE
    });

    if (!validPriceIds[tier] || priceId !== validPriceIds[tier]) {
      return res.status(400).json({ 
        error: `Invalid price ID for tier: ${tier}. Expected: ${validPriceIds[tier]}, Got: ${priceId}` 
      });
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (req.headers.origin || `https://${req.headers.host}`);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${baseUrl}${cancelPath}`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        tier: tier,
        source: 'biasguards_website',
        timestamp: new Date().toISOString()
      },
      subscription_data: mode === 'subscription' ? {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          tier: tier,
          features: JSON.stringify(getTierFeatures(tier))
        }
      } : undefined,
      // Enable customer creation for payment mode only
      ...(mode === 'payment' && {
        customer_creation: 'always'
      })
    });

    // Log successful session creation
    console.log(`✅ Checkout session created: ${session.id} for tier: ${tier}`);

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
      tier: tier,
      mode: mode
    });

  } catch (error) {
    console.error('❌ Stripe checkout session creation failed:', error);
    
    // Enhanced error handling with detailed responses
    const errorId = Date.now().toString(36).toUpperCase();
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred';
    let errorType = 'api_error';
    let userMessage = 'Please try again or contact support if the issue persists.';
    
    if (error.type === 'StripeCardError') {
      statusCode = 400;
      errorMessage = 'Your card was declined';
      errorType = 'card_error';
      userMessage = 'Please try a different payment method or contact your bank.';
    } else if (error.type === 'StripeRateLimitError') {
      statusCode = 429;
      errorMessage = 'Too many requests made to the API too quickly';
      errorType = 'rate_limit';
      userMessage = 'Please wait a moment before trying again.';
    } else if (error.type === 'StripeInvalidRequestError') {
      statusCode = 400;
      errorMessage = 'Invalid payment request';
      errorType = 'invalid_request';
      userMessage = 'Please check your payment details and try again.';
    } else if (error.type === 'StripeAPIError') {
      statusCode = 502;
      errorMessage = 'Payment service temporarily unavailable';
      errorType = 'api_error';
      userMessage = 'Our payment service is temporarily unavailable. Please try again in a few moments.';
    } else if (error.type === 'StripeConnectionError') {
      statusCode = 503;
      errorMessage = 'Unable to connect to payment services';
      errorType = 'network';
      userMessage = 'Unable to connect to payment services. Please check your connection and try again.';
    } else if (error.type === 'StripeAuthenticationError') {
      statusCode = 401;
      errorMessage = 'Payment authentication failed';
      errorType = 'authentication_error';
      userMessage = 'There was an authentication error. Please refresh the page and try again.';
    }
    
    // Log detailed error information for monitoring
    console.error(`[${errorId}] Error Details:`, {
      type: errorType,
      statusCode,
      stripeErrorType: error.type,
      stripeErrorCode: error.code,
      message: error.message,
      requestId: req.headers['x-request-id'],
      tier,
      priceId,
      timestamp: new Date().toISOString()
    });
    
    // Return comprehensive error response
    res.status(statusCode).json({ 
      error: errorMessage,
      type: errorType,
      message: userMessage,
      errorId: errorId,
      timestamp: new Date().toISOString(),
      retryable: ['rate_limit', 'network', 'api_error'].includes(errorType),
      supportContact: errorType === 'authentication_error' ? 'support@biasguards.ai' : null
    });
  }
}

/**
 * Get features for each subscription tier
 */
function getTierFeatures(tier) {
  const features = {
    starter: [
      'Basic bias detection',
      '1,000 analyses per month',
      'Email support',
      'Justice mission support'
    ],
    professional: [
      'Advanced bias detection',
      'Counterfactual analysis',
      '10,000 analyses per month',
      'Priority support',
      'API access',
      'Justice mission support'
    ],
    enterprise: [
      'Full bias detection suite',
      'Neural howlround prevention',
      'Unlimited analyses',
      'Custom integration',
      'Dedicated support',
      'White-label options',
      'Justice mission support'
    ]
  };

  return features[tier] || features.starter;
}