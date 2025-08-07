"use strict";
/**
 * 🛡️ BIASGUARD SYSTEM - MAIN ENTRY POINT
 * Zero-dependency bias detection system for AI interactions
 * JAHmere Webb Freedom Portal - August 25th, 2025 Mission Critical
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemHealthCheck = exports.MISSION_CONTEXT = exports.MISSION_DATE = exports.BIASGUARD_VERSION = exports.quickAnalysis = exports.createContextManager = exports.createBiasGuard = exports.biasGuardContextManager = exports.BiasGuardContextManager = exports.UnifiedBiasGuard = exports.ARIAProtocol = void 0;
// Core System Exports
var aria_protocol_1 = require("./core/aria-protocol");
Object.defineProperty(exports, "ARIAProtocol", { enumerable: true, get: function () { return aria_protocol_1.ARIAProtocol; } });
// Detection Engine Exports
var unified_biasguard_1 = require("./detection/unified-biasguard");
Object.defineProperty(exports, "UnifiedBiasGuard", { enumerable: true, get: function () { return unified_biasguard_1.UnifiedBiasGuard; } });
// Context Management Exports
var biasguard_context_manager_1 = require("./lib/biasguard-context-manager");
Object.defineProperty(exports, "BiasGuardContextManager", { enumerable: true, get: function () { return biasguard_context_manager_1.BiasGuardContextManager; } });
Object.defineProperty(exports, "biasGuardContextManager", { enumerable: true, get: function () { return biasguard_context_manager_1.biasGuardContextManager; } });
// Import classes for internal use
const aria_protocol_2 = require("./core/aria-protocol");
const unified_biasguard_2 = require("./detection/unified-biasguard");
const biasguard_context_manager_2 = require("./lib/biasguard-context-manager");
// Integration Layer Exports (will be added when integration files are created)
// export { BiasGuardIntegration } from './integration/biasguard-integration';
// export { BiasGuardMethodologyV1, biasGuardV1 } from './integration/biasguard-methodology-v1';
// Convenience Factory Functions
function createBiasGuard(config) {
    return new unified_biasguard_2.UnifiedBiasGuard();
}
exports.createBiasGuard = createBiasGuard;
function createContextManager() {
    return biasguard_context_manager_2.BiasGuardContextManager.getInstance();
}
exports.createContextManager = createContextManager;
// Quick Analysis Function
async function quickAnalysis(text, source = 'api') {
    const contextManager = biasguard_context_manager_2.BiasGuardContextManager.getInstance();
    return await contextManager.analyzeWithContext({
        aiResponse: text,
        source
    });
}
exports.quickAnalysis = quickAnalysis;
// Version and Metadata
exports.BIASGUARD_VERSION = '1.0.0';
exports.MISSION_DATE = '2025-08-25';
exports.MISSION_CONTEXT = 'JAHmere Webb Freedom Portal';
// System Health Check
function systemHealthCheck() {
    try {
        const contextManager = biasguard_context_manager_2.BiasGuardContextManager.getInstance();
        const biasGuard = new unified_biasguard_2.UnifiedBiasGuard();
        const aria = new aria_protocol_2.ARIAProtocol();
        return {
            status: 'healthy',
            version: exports.BIASGUARD_VERSION,
            mission: exports.MISSION_CONTEXT,
            components: {
                contextManager: !!contextManager,
                biasGuard: !!biasGuard,
                ariaProtocol: !!aria,
                productionPackage: true, // Static files don't need runtime check
            }
        };
    }
    catch (error) {
        return {
            status: 'error',
            version: exports.BIASGUARD_VERSION,
            mission: exports.MISSION_CONTEXT,
            components: {
                contextManager: false,
                biasGuard: false,
                ariaProtocol: false,
                productionPackage: false,
            }
        };
    }
}
exports.systemHealthCheck = systemHealthCheck;
// Default Export
exports.default = {
    UnifiedBiasGuard: unified_biasguard_2.UnifiedBiasGuard,
    BiasGuardContextManager: biasguard_context_manager_2.BiasGuardContextManager,
    ARIAProtocol: aria_protocol_2.ARIAProtocol,
    createBiasGuard,
    createContextManager,
    quickAnalysis,
    systemHealthCheck,
    version: exports.BIASGUARD_VERSION,
    mission: exports.MISSION_CONTEXT,
};
//# sourceMappingURL=index.js.map