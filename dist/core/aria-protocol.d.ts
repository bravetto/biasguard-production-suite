/**
 * 🛡️ ARIA PROTOCOL - AI Regulation Interface
 * Pragmatic pattern blindness prevention for AI systems
 */
export interface ARIAConfig {
    version: string;
    constraints: {
        maxAttemptsSameSolution: number;
        requireAlternativeApproachAfter: number;
        contextWindowResetTrigger: number;
    };
    patternDetection: {
        neuralHowlroundThreshold: number;
        repetitionDetection: boolean;
        anchoringBiasAlerts: boolean;
    };
}
export interface PatternRisk {
    level: 'low' | 'medium' | 'high' | 'critical';
    type: 'neural_howlround' | 'context_amnesia' | 'anchoring_bias' | 'vibe_coding_entropy';
    confidence: number;
    description: string;
    recommendation: string;
}
export interface ConversationAnalysis {
    messageCount: number;
    repetitionScore: number;
    topicDiversity: number;
    solutionVariation: number;
    risks: PatternRisk[];
    interventionRequired: boolean;
}
export interface InterventionAction {
    type: 'pause' | 'challenge_assumptions' | 'require_alternative' | 'reset_context';
    message: string;
    priority: 'low' | 'medium' | 'high';
}
export declare class ARIAProtocol {
    private config;
    constructor(config?: Partial<ARIAConfig>);
    /**
     * Analyze conversation for pattern blindness risks
     */
    analyzeConversation(messages: string[], currentSolution?: string): ConversationAnalysis;
    /**
     * Generate intervention actions based on analysis
     */
    generateInterventions(analysis: ConversationAnalysis): InterventionAction[];
    /**
     * Calculate repetition score (0-1, higher = more repetitive)
     */
    private calculateRepetitionScore;
    /**
     * Calculate topic diversity (0-1, higher = more diverse)
     */
    private calculateTopicDiversity;
    /**
     * Detect anchoring bias patterns
     */
    private detectAnchoringBias;
    /**
     * Calculate solution variation score
     */
    private calculateSolutionVariation;
}
export default ARIAProtocol;
//# sourceMappingURL=aria-protocol.d.ts.map