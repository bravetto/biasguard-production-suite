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

export class ARIAProtocol {
  private config: ARIAConfig;

  constructor(config?: Partial<ARIAConfig>) {
    this.config = {
      version: '1.0.0',
      constraints: {
        maxAttemptsSameSolution: 3,
        requireAlternativeApproachAfter: 5,
        contextWindowResetTrigger: 50,
      },
      patternDetection: {
        neuralHowlroundThreshold: 0.7,
        repetitionDetection: true,
        anchoringBiasAlerts: true,
      },
      ...config,
    };
  }

  /**
   * Analyze conversation for pattern blindness risks
   */
  analyzeConversation(messages: string[], currentSolution?: string): ConversationAnalysis {
    const risks: PatternRisk[] = [];
    
    // Neural Howlround Detection
    const repetitionScore = this.calculateRepetitionScore(messages);
    if (repetitionScore > this.config.patternDetection.neuralHowlroundThreshold) {
      risks.push({
        level: repetitionScore > 0.9 ? 'critical' : 'high',
        type: 'neural_howlround',
        confidence: repetitionScore,
        description: 'Detected recursive pattern fixation in conversation',
        recommendation: 'Challenge current approach and explore alternatives'
      });
    }

    // Context Amnesia Detection
    const topicDiversity = this.calculateTopicDiversity(messages);
    if (topicDiversity < 0.3 && messages.length > 10) {
      risks.push({
        level: 'medium',
        type: 'context_amnesia',
        confidence: 1 - topicDiversity,
        description: 'Low topic diversity suggests context narrowing',
        recommendation: 'Broaden context and consider different perspectives'
      });
    }

    // Anchoring Bias Detection
    if (currentSolution && this.detectAnchoringBias(messages, currentSolution)) {
      risks.push({
        level: 'medium',
        type: 'anchoring_bias',
        confidence: 0.8,
        description: 'Strong attachment to initial solution approach',
        recommendation: 'Explicitly consider alternative solutions'
      });
    }

    return {
      messageCount: messages.length,
      repetitionScore,
      topicDiversity,
      solutionVariation: this.calculateSolutionVariation(messages),
      risks,
      interventionRequired: risks.some(r => r.level === 'high' || r.level === 'critical')
    };
  }

  /**
   * Generate intervention actions based on analysis
   */
  generateInterventions(analysis: ConversationAnalysis): InterventionAction[] {
    const interventions: InterventionAction[] = [];

    for (const risk of analysis.risks) {
      switch (risk.type) {
        case 'neural_howlround':
          interventions.push({
            type: 'challenge_assumptions',
            message: 'Pattern detected: Let\'s step back and challenge our current approach. What are 3 completely different ways to solve this?',
            priority: 'high'
          });
          break;
        
        case 'context_amnesia':
          interventions.push({
            type: 'reset_context',
            message: 'Context narrowing detected: Let\'s refresh our perspective. What broader context should we consider?',
            priority: 'medium'
          });
          break;
        
        case 'anchoring_bias':
          interventions.push({
            type: 'require_alternative',
            message: 'Anchoring bias detected: Before proceeding, please propose 2 alternative approaches.',
            priority: 'medium'
          });
          break;
      }
    }

    return interventions;
  }

  /**
   * Calculate repetition score (0-1, higher = more repetitive)
   */
  private calculateRepetitionScore(messages: string[]): number {
    if (messages.length < 3) return 0;

    const recentMessages = messages.slice(-10);
    const uniqueWords = new Set();
    const totalWords: string[] = [];

    recentMessages.forEach(msg => {
      const words = msg.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      words.forEach(word => {
        uniqueWords.add(word);
        totalWords.push(word);
      });
    });

    return totalWords.length > 0 ? 1 - (uniqueWords.size / totalWords.length) : 0;
  }

  /**
   * Calculate topic diversity (0-1, higher = more diverse)
   */
  private calculateTopicDiversity(messages: string[]): number {
    if (messages.length < 2) return 1;

    // Simple heuristic: count unique key terms
    const keyTerms = new Set<string>();
    messages.forEach(msg => {
      const words = msg.toLowerCase().split(/\s+/)
        .filter(w => w.length > 4)
        .slice(0, 5); // Take first 5 significant words per message
      words.forEach(word => keyTerms.add(word));
    });

    return Math.min(1, keyTerms.size / (messages.length * 2));
  }

  /**
   * Detect anchoring bias patterns
   */
  private detectAnchoringBias(messages: string[], currentSolution: string): boolean {
    const solutionWords = currentSolution.toLowerCase().split(/\s+/);
    const recentMessages = messages.slice(-5).join(' ').toLowerCase();
    
    // Check if solution terms appear frequently in recent messages
    const matchCount = solutionWords.filter(word => 
      word.length > 3 && recentMessages.includes(word)
    ).length;
    
    return matchCount > solutionWords.length * 0.6;
  }

  /**
   * Calculate solution variation score
   */
  private calculateSolutionVariation(messages: string[]): number {
    // Simple heuristic for solution diversity
    const solutionKeywords = ['approach', 'solution', 'method', 'way', 'strategy'];
    let variationScore = 0;
    
    messages.forEach(msg => {
      const hasNewSolution = solutionKeywords.some(keyword => 
        msg.toLowerCase().includes(keyword)
      );
      if (hasNewSolution) variationScore += 0.1;
    });

    return Math.min(1, variationScore);
  }
}

export default ARIAProtocol;