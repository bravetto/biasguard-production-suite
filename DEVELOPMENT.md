# BiasGuard Development

## Quick Start
```bash
npm run dev
# Open: http://localhost:3000
```

## Scripts
- `npm run dev` - Development server
- `npm run validate` - Check HTML
- `npm run lighthouse` - Performance audit

## Mobile Testing
Use the network URL displayed when running `npm run dev` to test on mobile devices.

## Troubleshooting
- Port in use: `lsof -ti:3000 | xargs kill -9`
- WebSocket issues: `npm install ws --save-dev`

 