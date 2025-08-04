# BiasGuard Code - Complete Deployment Guide

> Step-by-step deployment commands for BiasGuards.ai production launch

## 🚀 Pre-Deployment Checklist

- [ ] All files created and tested locally
- [ ] Google Analytics Measurement ID ready
- [ ] Stripe payment link verified
- [ ] Domain `biasguards.ai` purchased and accessible
- [ ] Terminal/Command Prompt open in project directory

---

## 1️⃣ Initialize Git Repository

```bash
# Initialize git repository
git init

# Check git status
git status

# Add all files to staging
git add .

# Verify staged files
git status

# Create initial commit
git commit -m "🚀 Initial commit: BiasGuard Code landing page

- Complete HTML landing page with justice mission
- Tailwind CSS styling and responsive design
- 7 bias patterns detection showcase
- Three pricing tiers (Individual/Professional/Enterprise)
- F12 demo section and social proof
- Performance optimizations and analytics ready
- Mobile-first responsive design
- SEO optimizations and structured data
- Development server with live reload
- Cross-platform testing setup"

# Verify commit
git log --oneline -1
```

**Expected Output:**
```
Initialized empty Git repository in /path/to/BiasGuards.Ai/.git/
On branch main
nothing to commit, working tree clean
[main (root-commit) abc1234] 🚀 Initial commit: BiasGuard Code landing page
```

---

## 2️⃣ Install Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Verify installation
vercel --version

# Login to Vercel (opens browser for authentication)
vercel login

# Verify login status
vercel whoami
```

**Expected Output:**
```
Vercel CLI 32.5.0
> Success! Email authentication complete for your-email@domain.com
your-email@domain.com
```

**Troubleshooting:**
```bash
# If npm install fails (permission issues)
sudo npm install -g vercel

# Alternative: Use npx (no global install)
npx vercel --version

# Clear npm cache if installation fails
npm cache clean --force
npm install -g vercel
```

---

## 3️⃣ Deploy to Vercel

```bash
# Initial deployment (interactive setup)
vercel

# Follow the prompts:
# ? Set up and deploy "~/path/to/BiasGuards.Ai"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? biasguards-ai
# ? In which directory is your code located? ./
# ? Want to modify these settings? [y/N] n

# Wait for deployment to complete...
```

**Expected Output:**
```
🔗  Linked to your-account/biasguards-ai (created .vercel and added it to .gitignore)
🔍  Inspect: https://vercel.com/your-account/biasguards-ai/abc123
✅  Preview: https://biasguards-ai-abc123.vercel.app
📝  Deployed to production. Run `vercel --prod` to overwrite later (https://vercel.com/your-account/biasguards-ai)
```

```bash
# Deploy to production
vercel --prod

# Get deployment info
vercel ls

# Check deployment status
vercel inspect
```

---

## 4️⃣ Configure Custom Domain

```bash
# Add custom domain
vercel domains add biasguards.ai

# Add www subdomain
vercel domains add www.biasguards.ai

# Link domains to project
vercel alias set https://biasguards-ai-abc123.vercel.app biasguards.ai
vercel alias set https://biasguards-ai-abc123.vercel.app www.biasguards.ai

# Verify domain configuration
vercel domains ls

# Check DNS configuration
nslookup biasguards.ai
nslookup www.biasguards.ai
```

**DNS Configuration Commands:**
```bash
# Check current DNS records
dig biasguards.ai
dig www.biasguards.ai

# Verify CNAME records point to Vercel
dig CNAME biasguards.ai
dig CNAME www.biasguards.ai
```

**Expected DNS Records:**
```
biasguards.ai.     300    IN    A       76.76.19.61
www.biasguards.ai. 300    IN    CNAME   cname.vercel-dns.com.
```

---

## 5️⃣ Set Up Environment Variables

```bash
# Set Google Analytics Measurement ID
vercel env add GA_MEASUREMENT_ID

# When prompted, enter your GA4 Measurement ID (e.g., G-XXXXXXXXXX)
# Select: Production, Preview, Development (all environments)

# Verify environment variables
vercel env ls

# Pull environment variables to local .env file
vercel env pull .env.local

# Check local environment file
cat .env.local
```

**Manual Environment Setup:**
```bash
# Alternative: Set via Vercel dashboard
echo "Visit: https://vercel.com/your-account/biasguards-ai/settings/environment-variables"
echo "Add: GA_MEASUREMENT_ID = G-XXXXXXXXXX"

# Redeploy with new environment variables
vercel --prod
```

---

## 6️⃣ Test the Deployment

```bash
# Test main domain
curl -I https://biasguards.ai

# Test www redirect
curl -I https://www.biasguards.ai

# Test specific endpoints
curl -I https://biasguards.ai/index.html
curl -I https://biasguards.ai/vercel.json

# Check response headers
curl -H "Accept: text/html" https://biasguards.ai | head -20

# Test mobile user agent
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" https://biasguards.ai | head -10
```

**Performance Testing:**
```bash
# Install testing tools
npm install -g lighthouse pagespeed-insights-cli

# Run Lighthouse audit on production
lighthouse https://biasguards.ai --output=json --output-path=./production-audit.json

# Run mobile performance test
lighthouse https://biasguards.ai --preset=perf --form-factor=mobile --output=json --output-path=./mobile-audit.json

# Check PageSpeed Insights
psi https://biasguards.ai --strategy=mobile
psi https://biasguards.ai --strategy=desktop
```

---

## 7️⃣ Verify SSL Certificate

```bash
# Check SSL certificate details
openssl s_client -connect biasguards.ai:443 -servername biasguards.ai < /dev/null 2>/dev/null | openssl x509 -text -noout

# Simplified SSL check
curl -I https://biasguards.ai 2>&1 | grep -i "ssl\|tls\|certificate"

# Test SSL Labs rating (manual check)
echo "Visit: https://www.ssllabs.com/ssltest/analyze.html?d=biasguards.ai"

# Check certificate expiration
echo | openssl s_client -servername biasguards.ai -connect biasguards.ai:443 2>/dev/null | openssl x509 -noout -dates
```

**Expected SSL Output:**
```
Not Before: [Date]
Not After : [Date] (should be ~3 months in future)
```

---

## 8️⃣ Test Payment Flow End-to-End

```bash
# Test Stripe checkout URL accessibility
curl -I https://buy.stripe.com/5kQeVeeX7AzbXm1GdI1A00

# Verify all CTA buttons link correctly
curl -s https://biasguards.ai | grep -o 'https://buy.stripe.com/[^"]*' | sort | uniq

# Test from different locations (using curl with different IPs)
curl --resolve biasguards.ai:443:76.76.19.61 -I https://biasguards.ai
```

**Manual Payment Testing Checklist:**
```bash
echo "🧪 Manual Testing Checklist:"
echo "1. Visit: https://biasguards.ai"
echo "2. Click hero CTA button"
echo "3. Verify Stripe checkout loads"
echo "4. Test with different pricing tiers"
echo "5. Verify mobile payment flow"
echo "6. Test payment completion (use Stripe test cards)"
echo ""
echo "Stripe Test Cards:"
echo "Success: 4242 4242 4242 4242"
echo "Decline: 4000 0000 0000 0002"
```

---

## 9️⃣ Analytics Verification

```bash
# Test Google Analytics implementation
curl -s https://biasguards.ai | grep -i "gtag\|analytics\|GA_MEASUREMENT_ID"

# Verify GA4 events (check browser console)
echo "Open browser console at https://biasguards.ai and look for:"
echo "- gtag events firing"
echo "- 'Live reload connected' (if using dev server)"
echo "- No JavaScript errors"

# Test analytics in browser (manual)
echo "Manual Analytics Test:"
echo "1. Open: https://biasguards.ai"
echo "2. Open Developer Tools (F12)"
echo "3. Go to Console tab"
echo "4. Look for gtag events"
echo "5. Click CTA buttons and verify events fire"
```

---

## 🔧 Troubleshooting Commands

### **Deployment Issues**

```bash
# Clear Vercel cache
vercel --debug

# Force redeploy
vercel --prod --force

# Check deployment logs
vercel logs https://biasguards.ai

# Remove and re-add project
vercel remove biasguards-ai
vercel

# Check Vercel status
curl -I https://vercel.com/api/status
```

### **Domain Issues**

```bash
# Flush DNS cache (macOS)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Flush DNS cache (Windows)
ipconfig /flushdns

# Flush DNS cache (Linux)
sudo systemctl restart systemd-resolved

# Check domain propagation
dig @8.8.8.8 biasguards.ai
dig @1.1.1.1 biasguards.ai

# Test from different DNS servers
nslookup biasguards.ai 8.8.8.8
nslookup biasguards.ai 1.1.1.1
```

### **SSL Issues**

```bash
# Force SSL renewal
vercel certs renew biasguards.ai

# Check SSL configuration
curl -vI https://biasguards.ai 2>&1 | grep -i ssl

# Test SSL from different locations
curl --resolve biasguards.ai:443:76.76.19.61 -vI https://biasguards.ai
```

### **Performance Issues**

```bash
# Check Core Web Vitals
lighthouse https://biasguards.ai --only-categories=performance --output=table

# Test from different locations
curl -w "@curl-format.txt" -o /dev/null -s https://biasguards.ai

# Create curl timing format file
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

### **Analytics Issues**

```bash
# Verify environment variables are set
vercel env ls | grep GA_MEASUREMENT_ID

# Check if GA script loads
curl -s https://biasguards.ai | grep -o "gtag.*GA_MEASUREMENT_ID"

# Test GA endpoint accessibility
curl -I https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID
```

---

## 📊 Post-Deployment Verification

### **Complete System Test**

```bash
#!/bin/bash
echo "🧪 Running Complete System Test for BiasGuards.ai"
echo "================================================="

# Test main domain
echo "1. Testing main domain..."
curl -I https://biasguards.ai | head -1

# Test www redirect
echo "2. Testing www redirect..."
curl -I https://www.biasguards.ai | head -1

# Test SSL
echo "3. Testing SSL certificate..."
echo | openssl s_client -servername biasguards.ai -connect biasguards.ai:443 2>/dev/null | openssl x509 -noout -subject

# Test performance
echo "4. Testing performance..."
curl -w "Total time: %{time_total}s\n" -o /dev/null -s https://biasguards.ai

# Test Stripe link
echo "5. Testing Stripe checkout..."
curl -I https://buy.stripe.com/5kQeVeeX7AzbXm1GdI1A00 | head -1

# Test analytics
echo "6. Testing analytics implementation..."
curl -s https://biasguards.ai | grep -c "gtag" && echo "✅ Google Analytics detected" || echo "❌ Google Analytics not found"

echo "✅ System test complete!"
```

### **Monitoring Setup**

```bash
# Set up monitoring (optional)
echo "📊 Monitoring Setup:"
echo "1. Google Analytics: https://analytics.google.com"
echo "2. Vercel Analytics: https://vercel.com/your-account/biasguards-ai/analytics"
echo "3. Uptime monitoring: Consider services like Pingdom or UptimeRobot"
echo "4. Error tracking: Consider Sentry for JavaScript errors"
```

---

## 🎯 Final Verification Checklist

Before going live, verify:

- [ ] `https://biasguards.ai` loads correctly
- [ ] `https://www.biasguards.ai` redirects to non-www
- [ ] SSL certificate is valid (A+ rating)
- [ ] All CTA buttons link to Stripe checkout
- [ ] Google Analytics is tracking pageviews
- [ ] Mobile responsiveness works perfectly
- [ ] Page loads in <3 seconds
- [ ] Core Web Vitals scores >90
- [ ] Payment flow completes successfully
- [ ] No JavaScript errors in console

**Success! 🚀 BiasGuard Code is now live at https://biasguards.ai**

---

## 📞 Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Domain Issues**: Check your domain registrar's DNS settings
- **SSL Issues**: Vercel handles SSL automatically, wait 24-48 hours for propagation
- **Analytics Issues**: Verify GA_MEASUREMENT_ID in Vercel dashboard
- **Payment Issues**: Contact Stripe support for checkout link problems 