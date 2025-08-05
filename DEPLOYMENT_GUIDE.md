# BiasGuard Deployment Guide

## Quick Deploy

### Git Setup
```bash
git init
git add .
git commit -m "Initial BiasGuard landing page"
```

### Vercel Deploy
```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

### Domain Setup (Optional)
```bash
vercel domains add biasguards.ai
vercel alias set [deployment-url] biasguards.ai
```

### Analytics (Optional)
```bash
vercel env add GA_MEASUREMENT_ID
# Enter your GA4 ID when prompted
vercel --prod
```

### Test
```bash
curl -I [your-deployment-url]
```

## Troubleshooting
- DNS propagation may take 24-48 hours
- Check Vercel dashboard for deployment logs
- Use `vercel --debug` for detailed output 