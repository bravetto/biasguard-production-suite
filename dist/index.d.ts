/**
 * 🛡️ BIASGUARD SYSTEM - MAIN ENTRY POINT
 * Zero-dependency bias detection system for AI interactions
 * JAHmere Webb Freedom Portal - August 25th, 2025 Mission Critical
 */
export { ARIAProtocol } from './core/aria-protocol';
export type { ARIAConfig, PatternRisk, ConversationAnalysis, InterventionAction } from './core/aria-protocol';
export { UnifiedBiasGuard } from './detection/unified-biasguard';
export type { UnifiedBiasResult, DetectedPattern } from './detection/unified-biasguard';
export { BiasGuardContextManager, biasGuardContextManager } from './lib/biasguard-context-manager';
export type { BiasGuardContext, ContextAnalysisRequest, CachedAnalysisResult } from './lib/biasguard-context-manager';
import { ARIAProtocol } from './core/aria-protocol';
import type { ARIAConfig } from './core/aria-protocol';
import { UnifiedBiasGuard } from './detection/unified-biasguard';
import { BiasGuardContextManager } from './lib/biasguard-context-manager';
export declare function createBiasGuard(config?: Partial<ARIAConfig>): UnifiedBiasGuard;
export declare function createContextManager(): BiasGuardContextManager;
export declare function quickAnalysis(text: string, source?: 'agent' | 'api' | 'injection' | 'manual'): Promise<any>;
export declare const BIASGUARD_VERSION = "1.0.0";
export declare const MISSION_DATE = "2025-08-25";
export declare const MISSION_CONTEXT = "JAHmere Webb Freedom Portal";
export declare function systemHealthCheck(): {
    status: 'healthy' | 'degraded' | 'error';
    version: string;
    mission: string;
    components: Record<string, boolean>;
};
declare const _default: {
    UnifiedBiasGuard: typeof UnifiedBiasGuard;
    BiasGuardContextManager: typeof BiasGuardContextManager;
    ARIAProtocol: typeof ARIAProtocol;
    createBiasGuard: typeof createBiasGuard;
    createContextManager: typeof createContextManager;
    quickAnalysis: typeof quickAnalysis;
    systemHealthCheck: typeof systemHealthCheck;
    version: string;
    mission: string;
};
export default _default;
//# sourceMappingURL=index.d.ts.map