# BiasGuard Code - Local Development Guide

> Complete setup guide for developing and testing the BiasGuard Code landing page locally

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for development server)
- Modern web browser
- Mobile device or browser dev tools (for mobile testing)

### Setup & Run
```bash
# Clone or navigate to project directory
cd biasguard-landing

# Install development dependencies
npm run setup

# Start development server with live reload
npm run dev

# Open in browser
# Local: http://localhost:3000
# Network: http://[your-ip]:3000 (for mobile testing)
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with live reload |
| `npm start` | Alias for `npm run dev` |
| `npm run serve` | Static server without live reload |
| `npm run serve:python` | Python-based static server |
| `npm run validate` | Validate HTML markup |
| `npm run lighthouse` | Run Lighthouse performance audit |
| `npm run lighthouse:mobile` | Mobile-specific Lighthouse audit |
| `npm test` | Run validation and performance tests |
| `npm run test:mobile` | Run mobile performance tests |
| `npm run clean` | Clean build artifacts and reports |

## 🔄 Live Reload Features

The development server includes:
- **Automatic Reload** - Page refreshes when files change
- **WebSocket Connection** - Real-time communication
- **File Watching** - Monitors `index.html`, `package.json`, `vercel.json`
- **Reconnection Logic** - Handles network interruptions
- **Console Logging** - Clear feedback on reload status

### Files Watched for Changes:
- `index.html` - Main landing page
- `package.json` - Project configuration
- `vercel.json` - Deployment settings

## 📱 Mobile Device Testing

### Network Access Setup
1. **Find Your IP Address:**
   ```bash
   # The dev server automatically displays your network IP
   npm run dev
   # Look for: 🌐 Network: http://192.168.1.XXX:3000
   ```

2. **Connect Mobile Device:**
   - Ensure mobile device is on same WiFi network
   - Open browser on mobile device
   - Navigate to the network URL shown in terminal
   - Example: `http://192.168.1.100:3000`

3. **Enable Live Reload on Mobile:**
   - Live reload works automatically on mobile
   - Check browser console for connection status
   - Look for: "🔄 Live reload connected"

### Mobile Testing Checklist
- [ ] Touch targets are 44px+ (buttons, links)
- [ ] Text is readable (16px+ font size)
- [ ] Navigation is thumb-friendly
- [ ] CTAs are easily tappable
- [ ] Page loads quickly on 3G simulation
- [ ] Viewport fits properly (no horizontal scroll)
- [ ] Safe area respected on notched devices

## 🌐 Cross-Browser Testing

### Desktop Browsers
| Browser | Version | Priority | Notes |
|---------|---------|----------|-------|
| **Chrome** | Latest | High | Primary development browser |
| **Firefox** | Latest | High | Test Gecko engine compatibility |
| **Safari** | Latest | Medium | WebKit engine, Mac only |
| **Edge** | Latest | Medium | Chromium-based, Windows focus |

### Mobile Browsers
| Browser | Platform | Priority | Notes |
|---------|----------|----------|-------|
| **Chrome Mobile** | Android | High | Most used mobile browser |
| **Safari Mobile** | iOS | High | iOS default browser |
| **Firefox Mobile** | Android | Medium | Alternative Android browser |
| **Samsung Internet** | Android | Low | Samsung device default |

### Browser Testing Commands
```bash
# Open in different browsers (macOS)
open -a "Google Chrome" http://localhost:3000
open -a "Firefox" http://localhost:3000
open -a "Safari" http://localhost:3000

# Open in different browsers (Windows)
start chrome http://localhost:3000
start firefox http://localhost:3000
start msedge http://localhost:3000

# Open in different browsers (Linux)
google-chrome http://localhost:3000
firefox http://localhost:3000
```

## 🔧 Browser DevTools Testing

### Chrome DevTools Mobile Simulation
1. **Open DevTools** - `F12` or `Ctrl+Shift+I`
2. **Toggle Device Toolbar** - `Ctrl+Shift+M`
3. **Select Device Presets:**
   - iPhone 14 Pro (393×852)
   - Samsung Galaxy S21 (360×800)
   - iPad Air (820×1180)
   - Custom responsive sizes

### Performance Testing
```bash
# Desktop performance audit
npm run lighthouse

# Mobile performance audit  
npm run test:mobile

# View reports
open lighthouse-report.json      # Desktop
open lighthouse-mobile.json     # Mobile
```

### Network Throttling
1. **Chrome DevTools** → Network tab
2. **Throttling Options:**
   - Fast 3G (1.6 Mbps down, 750 Kbps up)
   - Slow 3G (500 Kbps down, 500 Kbps up)
   - Offline (test offline behavior)

## 🧪 Testing Scenarios

### Core Functionality Tests
- [ ] **Hero CTA** - Primary button leads to Stripe
- [ ] **Navigation** - Smooth scroll to sections
- [ ] **Demo Section** - F12 demo display works
- [ ] **Pricing Cards** - All CTAs link correctly
- [ ] **Analytics** - Events fire properly (check console)
- [ ] **Mobile Menu** - Responsive navigation works

### Performance Tests
- [ ] **Page Load** - <3 seconds on 3G
- [ ] **First Contentful Paint** - <1.2 seconds
- [ ] **Largest Contentful Paint** - <2.5 seconds
- [ ] **Cumulative Layout Shift** - <0.1
- [ ] **Mobile Performance** - 90+ Lighthouse score

### Accessibility Tests
- [ ] **Keyboard Navigation** - Tab through all elements
- [ ] **Screen Reader** - Proper ARIA labels
- [ ] **Color Contrast** - WCAG AA compliance
- [ ] **Focus Indicators** - Visible focus states
- [ ] **Alt Text** - All images have descriptions

## 🐛 Troubleshooting

### Development Server Issues
```bash
# Port already in use
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000

# Permission denied (macOS/Linux)
sudo npm run dev

# WebSocket connection failed
npm install ws --save-dev  # Reinstall WebSocket dependency
```

### Live Reload Not Working
1. **Check Console** - Look for WebSocket errors
2. **Firewall Settings** - Allow port 3001 (WebSocket port)
3. **Network Issues** - Try `localhost` instead of network IP
4. **Browser Cache** - Hard refresh with `Ctrl+Shift+R`

### Mobile Device Can't Connect
1. **Same Network** - Ensure device on same WiFi
2. **Firewall** - Disable firewall temporarily
3. **IP Address** - Double-check network IP in terminal
4. **Port Forwarding** - Check router settings if needed

## 📊 Performance Monitoring

### Core Web Vitals Targets
| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | ≤2.5s | 2.5s-4.0s | >4.0s |
| **FID** | ≤100ms | 100ms-300ms | >300ms |
| **CLS** | ≤0.1 | 0.1-0.25 | >0.25 |

### Monitoring Commands
```bash
# Continuous performance monitoring
npm run lighthouse && open lighthouse-report.json

# Mobile performance check
npm run lighthouse:mobile && open lighthouse-mobile.json

# HTML validation
npm run validate
```

## 🔍 Debugging Tips

### Console Logging
- **Analytics Events** - Check GA4 events in console
- **Live Reload** - WebSocket connection status
- **Performance** - Core Web Vitals measurements
- **Errors** - JavaScript errors and warnings

### Network Analysis
1. **DevTools Network Tab** - Monitor resource loading
2. **Performance Tab** - Analyze loading timeline
3. **Lighthouse Tab** - Automated performance audits
4. **Coverage Tab** - Identify unused CSS/JS

## 📚 Additional Resources

### Documentation Links
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Chrome DevTools Guide](https://developers.google.com/web/tools/chrome-devtools)
- [Web Vitals](https://web.dev/vitals/)
- [Mobile Web Testing](https://developers.google.com/web/fundamentals/performance)

### Testing Tools
- **BrowserStack** - Cross-browser testing service
- **LambdaTest** - Mobile device testing
- **WebPageTest** - Performance analysis
- **GTmetrix** - Speed optimization insights

---

## 🎯 Quick Testing Checklist

Before deployment, ensure:
- [ ] Development server runs without errors
- [ ] Live reload works on file changes
- [ ] Mobile devices can access via network URL
- [ ] All browsers display correctly
- [ ] Performance scores meet targets (90+)
- [ ] HTML validates without errors
- [ ] Analytics events fire properly
- [ ] All CTAs link to correct Stripe URL

**Happy developing! 🚀** 