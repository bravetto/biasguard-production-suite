/**
 * BiasGuards.ai Stripe Checkout Session API
 * Creates secure server-side checkout sessions for subscription payments
 * Supports all three tiers: Starter ($19.99), Professional ($99), Enterprise ($299)
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
    
    // Return user-friendly error messages
    if (error.type === 'StripeCardError') {
      res.status(400).json({ error: 'Your card was declined.' });
    } else if (error.type === 'StripeRateLimitError') {
      res.status(429).json({ error: 'Too many requests made to the API too quickly.' });
    } else if (error.type === 'StripeInvalidRequestError') {
      res.status(400).json({ error: 'Invalid parameters were supplied to Stripe.' });
    } else if (error.type === 'StripeAPIError') {
      res.status(500).json({ error: 'An error occurred with Stripe API.' });
    } else if (error.type === 'StripeConnectionError') {
      res.status(500).json({ error: 'A network error occurred.' });
    } else if (error.type === 'StripeAuthenticationError') {
      res.status(401).json({ error: 'Authentication with Stripe failed.' });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
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