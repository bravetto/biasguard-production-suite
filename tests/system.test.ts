/**
 * 🛡️ BIASGUARD SYSTEM TESTS
 * Basic integration tests for BiasGuard system
 */

import { 
  systemHealthCheck, 
  createBiasGuard, 
  createContextManager, 
  quickAnalysis,
  BIASGUARD_VERSION,
  MISSION_CONTEXT 
} from '../src/index';

describe('BiasGuard System Integration Tests', () => {
  
  test('System health check returns healthy status', () => {
    const health = systemHealthCheck();
    
    expect(health.status).toBe('healthy');
    expect(health.version).toBe(BIASGUARD_VERSION);
    expect(health.mission).toBe(MISSION_CONTEXT);
    expect(health.components.contextManager).toBe(true);
    expect(health.components.biasGuard).toBe(true);
    expect(health.components.ariaProtocol).toBe(true);
  });

  test('Can create BiasGuard instance', () => {
    const biasGuard = createBiasGuard();
    expect(biasGuard).toBeDefined();
    expect(typeof biasGuard.analyze).toBe('function');
  });

  test('Can create context manager', () => {
    const contextManager = createContextManager();
    expect(contextManager).toBeDefined();
    expect(typeof contextManager.analyzeWithContext).toBe('function');
  });

  test('Quick analysis works with sample text', async () => {
    const result = await quickAnalysis('This is a perfect comprehensive solution that guarantees success');
    
    expect(result).toBeDefined();
    expect(typeof result.biasScore).toBe('number');
    expect(result.biasScore).toBeGreaterThan(0); // Should detect bias in this text
    expect(Array.isArray(result.patterns)).toBe(true);
  });

  test('Quick analysis detects mission-critical patterns', async () => {
    const result = await quickAnalysis('We need to refactor everything before the court date');
    
    expect(result.biasScore).toBeGreaterThan(0.3); // Should detect high bias
    expect(result.patterns.length).toBeGreaterThan(0);
  });

  test('Version and mission constants are defined', () => {
    expect(BIASGUARD_VERSION).toBe('1.0.0');
    expect(MISSION_CONTEXT).toBe('JAHmere Webb Freedom Portal');
  });

  test('System handles empty text gracefully', async () => {
    const result = await quickAnalysis('');
    
    expect(result).toBeDefined();
    expect(result.biasScore).toBe(0); // Empty text should have no bias
  });

  test('Context manager maintains session state', () => {
    const contextManager = createContextManager();
    const stats = contextManager.getSessionStats();
    
    expect(stats.sessionId).toBeDefined();
    expect(typeof stats.duration).toBe('number');
    expect(typeof stats.analysisCount).toBe('number');
  });

});