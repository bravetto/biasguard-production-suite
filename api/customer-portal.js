/**
 * BiasGuards.ai Stripe Customer Portal API
 * Creates customer portal sessions for subscription management
 * Allows customers to update billing, cancel subscriptions, view invoices
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, returnUrl } = req.body;

    // Validate required parameters
    if (!customerId) {
      return res.status(400).json({ 
        error: 'Missing required parameter: customerId' 
      });
    }

    // Get the base URL for return path
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (req.headers.origin || `https://${req.headers.host}`);
    
    const finalReturnUrl = returnUrl || `${baseUrl}/account`;

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: finalReturnUrl,
    });

    console.log(`✅ Customer portal session created for: ${customerId}`);

    res.status(200).json({
      url: portalSession.url,
      customerId: customerId
    });

  } catch (error) {
    console.error('❌ Customer portal session creation failed:', error);
    
    // Return user-friendly error messages
    if (error.type === 'StripeInvalidRequestError') {
      res.status(400).json({ error: 'Invalid customer ID or request parameters.' });
    } else if (error.type === 'StripeAuthenticationError') {
      res.status(401).json({ error: 'Authentication with Stripe failed.' });
    } else {
      res.status(500).json({ error: 'Unable to create customer portal session.' });
    }
  }
}