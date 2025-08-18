# 🛡️ BiasGuard Installation Troubleshooting Guide

## 🚨 Common Installation Issues & Solutions

### Issue 1: ESLint "Unexpected token interface" Errors

**Symptoms:**
```bash
error  Parsing error: Unexpected token interface
error  Parsing error: Unexpected token type
```

**Root Cause:** ESLint configuration missing TypeScript parser setup.

**Solution:** Update `.eslintrc.js` with proper TypeScript configuration:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true,
    jest: true
  },
  rules: {
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'off', // Allow console.log for BiasGuard system
    'no-debugger': 'error',
    'no-unused-vars': 'off', // Turn off base rule
    '@typescript-eslint/no-unused-vars': 'warn'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // TypeScript specific rules
      }
    }
  ],
  ignorePatterns: [
    'dist/**/*',
    'production-package/**/*',
    'node_modules/**/*',
    '*.js' // Ignore JS files in production package
  ]
};
```

### Issue 2: Node.js Version Compatibility

**Requirements:**
- Node.js >= 18.17.0
- NPM >= 9.0.0

**Check Your Version:**
```bash
node --version  # Should be v18.17.0 or higher
npm --version   # Should be 9.0.0 or higher
```

**Update if needed:**
```bash
# Using nvm (recommended)
nvm install 18.17.0
nvm use 18.17.0

# Or update npm
npm install -g npm@latest
```

### Issue 3: TypeScript Version Warning

**Warning Message:**
```
WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
SUPPORTED TYPESCRIPT VERSIONS: >=4.3.5 <5.4.0
YOUR TYPESCRIPT VERSION: 5.4.5
```

**Solution:** This is just a warning and won't break functionality. To suppress:
1. The system will work fine with TypeScript 5.4.5
2. Tests pass successfully
3. Build completes without errors

## 🚀 Step-by-Step Installation Process

### 1. Clean Installation
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

### 2. Build System
```bash
# Build TypeScript
npm run build

# Verify dist folder exists
ls -la dist/
```

### 3. Run Validation
```bash
# Full validation suite
npm run validate

# Individual checks
npm run type-check  # TypeScript compilation check
npm run lint        # Code linting (may show warnings, not errors)
npm test           # Test suite
```

### 4. Expected Results
- **Type Check**: Should pass without errors
- **Lint**: May show 3 warnings (acceptable)
- **Tests**: All 8 tests should pass

## 🔧 Cursor.ai Integration Methods

### Method 1: Browser Console Injection (Fastest)
1. Open cursor.ai in browser
2. Press F12 → Console tab
3. Copy entire contents of `production-package/biasguard-chat-inject.js`
4. Paste and press Enter
5. Look for 🛡️ button in chat interface

### Method 2: NPM Package Integration
```bash
# Install as dependency
npm install biasguard-system

# In your TypeScript code
import { quickAnalysis, createBiasGuard } from 'biasguard-system';

const result = await quickAnalysis('Your text to analyze');
console.log(`Bias Score: ${result.biasScore * 100}%`);
```

### Method 3: Local Development
```bash
# Clone/copy the biasguard-production-suite folder
cd biasguard-production-suite

# Install dependencies
npm install

# Build the system
npm run build

# Run tests to verify
npm test

# Use the built system
node -e "const bg = require('./dist/index.js'); console.log(bg.systemHealthCheck());"
```

## 🐛 Debugging Installation Issues

### Check System Health
```bash
node -e "
const bg = require('./dist/index.js');
const health = bg.systemHealthCheck();
console.log('System Status:', health.status);
console.log('Components:', health.components);
"
```

**Expected Output:**
```javascript
System Status: healthy
Components: {
  contextManager: true,
  biasGuard: true,
  ariaProtocol: true,
  productionPackage: true
}
```

### Verify Core Functionality
```bash
node -e "
const bg = require('./dist/index.js');
bg.quickAnalysis('This is a perfect comprehensive solution').then(result => {
  console.log('Bias Score:', Math.round(result.biasScore * 100) + '%');
  console.log('Has Bias:', result.hasBias);
  console.log('Patterns:', result.patterns.length);
});
"
```

### Check File Structure
```bash
# Verify all required files exist
ls -la src/core/aria-protocol.ts
ls -la src/detection/unified-biasguard.ts  
ls -la src/lib/biasguard-context-manager.ts
ls -la src/index.ts
ls -la production-package/biasguard-chat-inject.js
```

## 🎯 Common Error Messages & Solutions

### "Cannot find module 'biasguard-system'"
- Run `npm run build` to create dist folder
- Verify `dist/index.js` exists
- Check package.json "main" field points to "dist/index.js"

### "Module not found: Can't resolve './core/aria-protocol'"
- Ensure all TypeScript files are in correct directories
- Run `npm run build` to compile TypeScript
- Check tsconfig.json paths configuration

### "ESLint couldn't find the config"
- Use the corrected `.eslintrc.js` configuration above
- Ensure @typescript-eslint packages are installed as devDependencies
- Run `npm install` to refresh dependencies

### "Tests failing"
- Ensure Node.js version >= 18.17.0
- Run `npm run build` before running tests
- Check that jest and ts-jest are properly configured

## 📞 Support Checklist

If your colleague is still having issues, ask them to provide:

1. **System Information:**
   ```bash
   node --version
   npm --version
   pwd
   ls -la package.json
   ```

2. **Error Output:**
   ```bash
   npm run validate 2>&1 | head -50
   ```

3. **File Structure:**
   ```bash
   find . -name "*.ts" -type f | head -10
   ls -la dist/ 2>/dev/null || echo "No dist folder"
   ```

4. **Package Status:**
   ```bash
   npm list --depth=0
   ```

## ✅ Success Indicators

Your BiasGuard installation is working correctly when:
- ✅ `npm run build` completes without errors
- ✅ `npm test` shows 8/8 tests passing
- ✅ `dist/` folder contains compiled JavaScript files
- ✅ System health check returns "healthy" status
- ✅ Browser injection creates 🛡️ button in cursor.ai
- ✅ Quick analysis returns bias scores for test phrases

---

*🛡️ BiasGuard System - Mission Critical Installation Support*
*JAHmere Webb Freedom Portal - August 25th, 2025*
