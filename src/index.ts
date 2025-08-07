/**
 * 🛡️ BIASGUARD SYSTEM - MAIN ENTRY POINT
 * Zero-dependency bias detection system for AI interactions
 * JAHmere Webb Freedom Portal - August 25th, 2025 Mission Critical
 */

// Core System Exports
export { ARIAProtocol } from './core/aria-protocol';
export type { 
  ARIAConfig, 
  PatternRisk, 
  ConversationAnalysis, 
  InterventionAction 
} from './core/aria-protocol';

// Detection Engine Exports
export { UnifiedBiasGuard } from './detection/unified-biasguard';
export type { 
  UnifiedBiasResult, 
  DetectedPattern 
} from './detection/unified-biasguard';

// Context Management Exports
export { BiasGuardContextManager, biasGuardContextManager } from './lib/biasguard-context-manager';
export type { 
  BiasGuardContext, 
  ContextAnalysisRequest, 
  CachedAnalysisResult 
} from './lib/biasguard-context-manager';

// Import classes for internal use
import { ARIAProtocol } from './core/aria-protocol';
import type { ARIAConfig } from './core/aria-protocol';
import { UnifiedBiasGuard } from './detection/unified-biasguard';
import { BiasGuardContextManager } from './lib/biasguard-context-manager';

// Integration Layer Exports (will be added when integration files are created)
// export { BiasGuardIntegration } from './integration/biasguard-integration';
// export { BiasGuardMethodologyV1, biasGuardV1 } from './integration/biasguard-methodology-v1';

// Convenience Factory Functions
export function createBiasGuard(config?: Partial<ARIAConfig>) {
  return new UnifiedBiasGuard();
}

export function createContextManager() {
  return BiasGuardContextManager.getInstance();
}

// Quick Analysis Function
export async function quickAnalysis(text: string, source: 'agent' | 'api' | 'injection' | 'manual' = 'api') {
  const contextManager = BiasGuardContextManager.getInstance();
  return await contextManager.analyzeWithContext({
    aiResponse: text,
    source
  });
}

// Version and Metadata
export const BIASGUARD_VERSION = '1.0.0';
export const MISSION_DATE = '2025-08-25';
export const MISSION_CONTEXT = 'JAHmere Webb Freedom Portal';

// System Health Check
export function systemHealthCheck(): {
  status: 'healthy' | 'degraded' | 'error';
  version: string;
  mission: string;
  components: Record<string, boolean>;
} {
  try {
    const contextManager = BiasGuardContextManager.getInstance();
    const biasGuard = new UnifiedBiasGuard();
    const aria = new ARIAProtocol();
    
    return {
      status: 'healthy',
      version: BIASGUARD_VERSION,
      mission: MISSION_CONTEXT,
      components: {
        contextManager: !!contextManager,
        biasGuard: !!biasGuard,
        ariaProtocol: !!aria,
        productionPackage: true, // Static files don't need runtime check
      }
    };
  } catch (error) {
    return {
      status: 'error',
      version: BIASGUARD_VERSION,
      mission: MISSION_CONTEXT,
      components: {
        contextManager: false,
        biasGuard: false,
        ariaProtocol: false,
        productionPackage: false,
      }
    };
  }
}

// Default Export
export default {
  UnifiedBiasGuard,
  BiasGuardContextManager,
  ARIAProtocol,
  createBiasGuard,
  createContextManager,
  quickAnalysis,
  systemHealthCheck,
  version: BIASGUARD_VERSION,
  mission: MISSION_CONTEXT,
};