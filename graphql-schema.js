/**
 * BiasGuard Unified GraphQL Schema
 * Consolidates 17+ REST endpoints into a single, flexible GraphQL API
 * Version 2.0.0 - Following GraphQL over HTTP 2025 spec
 */

const typeDefs = `
  # Scalar types for enhanced type safety
  scalar DateTime
  scalar JSON
  scalar Upload

  # Core domain types
  type BiasAnalysis {
    id: ID!
    text: String!
    overallScore: Float!
    confidence: Float!
    patterns: [BiasPattern!]!
    statisticalSignificance: StatisticalMetrics
    intersectionalAnalysis: IntersectionalAnalysis
    geopoliticalAnalysis: GeopoliticalAnalysis
    timestamp: DateTime!
    metadata: AnalysisMetadata!
  }

  type BiasPattern {
    type: BiasType!
    severity: SeverityLevel!
    confidence: Float!
    description: String!
    examples: [String!]!
    recommendations: [String!]!
    category: String!
  }

  type StatisticalMetrics {
    pValue: Float
    confidenceInterval: ConfidenceInterval
    effectSize: Float
    sampleSize: Int!
    significance: SignificanceLevel!
  }

  type ConfidenceInterval {
    lower: Float!
    upper: Float!
    level: Float! # e.g., 0.95 for 95% CI
  }

  type IntersectionalAnalysis {
    attributes: [String!]!
    intersections: [Intersection!]!
    compoundBiasScore: Float!
    riskAssessment: RiskLevel!
  }

  type Intersection {
    attributes: [String!]!
    strength: Float!
    patterns: [String!]!
    amplificationFactor: Float!
  }

  type GeopoliticalAnalysis {
    regions: [String!]!
    nationalityBias: Float!
    culturalBias: Float!
    geographicBias: Float!
    recommendations: [String!]!
  }

  type AnalysisMetadata {
    version: String!
    processingTime: Float!
    modelVersion: String!
    frameworkCompliance: FrameworkCompliance!
  }

  type FrameworkCompliance {
    beats: ComplianceScore!
    saged: ComplianceScore!
    statistical: ComplianceScore!
    intersectional: ComplianceScore!
  }

  type ComplianceScore {
    score: Float!
    level: ComplianceLevel!
    details: [String!]!
  }

  # Dashboard metrics types
  type DashboardMetrics {
    totalAnalyses: Int!
    biasDetectionRate: Float!
    avgConfidence: Float!
    criticalAlerts: Int!
    frameworkScores: FrameworkScores!
    performanceMetrics: PerformanceMetrics!
    patternDistribution: PatternDistribution!
    systemStatus: SystemStatus!
    lastUpdated: DateTime!
  }

  type FrameworkScores {
    beats: Float!
    saged: Float!
    statistical: Float!
    intersectional: Float!
  }

  type PerformanceMetrics {
    accuracy: Float!
    precision: Float!
    recall: Float!
    f1Score: Float!
    speed: Float!
    coverage: Float!
  }

  type PatternDistribution {
    demographic: Float!
    geopolitical: Float!
    socioeconomic: Float!
    institutional: Float!
    cultural: Float!
    temporal: Float!
  }

  type SystemStatus {
    status: String!
    uptime: Float!
    responseTime: Float!
    errorRate: Float!
    throughput: Float!
  }

  # Real-time metrics
  type RealTimeMetrics {
    totalAnalyses: Int!
    biasDetectionRate: Float!
    avgConfidence: Float!
    criticalAlerts: Int!
    currentLoad: Float!
    responseTime: Float!
    timestamp: DateTime!
  }

  # Alert types
  type Alert {
    id: ID!
    type: AlertType!
    severity: SeverityLevel!
    message: String!
    details: JSON
    timestamp: DateTime!
    resolved: Boolean!
  }

  # Analytics types
  type PatternAnalytics {
    patterns: [PatternTrend!]!
    timeRange: DateRange!
    totalCount: Int!
    trends: [TrendData!]!
  }

  type PatternTrend {
    pattern: String!
    count: Int!
    percentage: Float!
    trend: TrendDirection!
  }

  type TrendData {
    date: DateTime!
    value: Float!
    category: String!
  }

  type IntersectionAnalytics {
    intersections: [IntersectionTrend!]!
    riskMatrix: [[Float!]!]!
    topCombinations: [AttributeCombination!]!
  }

  type IntersectionTrend {
    attributes: [String!]!
    frequency: Int!
    avgSeverity: Float!
    riskLevel: RiskLevel!
  }

  type AttributeCombination {
    attributes: [String!]!
    score: Float!
    frequency: Int!
  }

  type ValidationBenchmark {
    framework: String!
    score: Float!
    metrics: [BenchmarkMetric!]!
    lastUpdated: DateTime!
  }

  type BenchmarkMetric {
    name: String!
    value: Float!
    target: Float!
    status: ComplianceLevel!
  }

  # Input types
  input AnalysisInput {
    text: String!
    options: AnalysisOptions
  }

  input AnalysisOptions {
    includeIntersectional: Boolean = true
    includeGeopolitical: Boolean = true
    includeStatistical: Boolean = true
    confidenceThreshold: Float = 0.5
    detailLevel: DetailLevel = STANDARD
  }

  type DateRange {
    start: DateTime!
    end: DateTime!
  }

  input DateRangeInput {
    start: DateTime!
    end: DateTime!
  }

  input MetricsFilter {
    dateRange: DateRangeInput
    categories: [String!]
    minConfidence: Float
    severityLevels: [SeverityLevel!]
  }

  input ValidationComparisonInput {
    analysisIds: [ID!]!
    frameworks: [String!]!
    includeDetails: Boolean = false
  }

  # Enums
  enum BiasType {
    DEMOGRAPHIC
    GEOPOLITICAL
    SOCIOECONOMIC
    INSTITUTIONAL
    CULTURAL
    TEMPORAL
    INTERSECTIONAL
  }

  enum SeverityLevel {
    CRITICAL
    HIGH
    MEDIUM
    LOW
    NEGLIGIBLE
  }

  enum SignificanceLevel {
    HIGHLY_SIGNIFICANT
    SIGNIFICANT
    MARGINALLY_SIGNIFICANT
    NOT_SIGNIFICANT
  }

  enum ComplianceLevel {
    EXCELLENT
    GOOD
    ACCEPTABLE
    NEEDS_IMPROVEMENT
    CRITICAL
  }

  enum RiskLevel {
    EXTREME
    HIGH
    MODERATE
    LOW
    MINIMAL
  }

  enum AlertType {
    BIAS_DETECTION
    SYSTEM_PERFORMANCE
    COMPLIANCE_VIOLATION
    SECURITY_ALERT
    DATA_QUALITY
  }

  enum TrendDirection {
    INCREASING
    DECREASING
    STABLE
    VOLATILE
  }

  enum DetailLevel {
    MINIMAL
    STANDARD
    DETAILED
    COMPREHENSIVE
  }

  # Root Query type
  type Query {
    # Analysis queries
    analysis(id: ID!): BiasAnalysis
    analyses(
      filter: MetricsFilter
      limit: Int = 10
      offset: Int = 0
      sortBy: String = "timestamp"
      sortOrder: String = "DESC"
    ): [BiasAnalysis!]!

    # Dashboard metrics
    metrics(filter: MetricsFilter): DashboardMetrics!
    realTimeMetrics: RealTimeMetrics!
    
    # Alerts
    alerts(
      severity: [SeverityLevel!]
      resolved: Boolean
      limit: Int = 20
    ): [Alert!]!

    # Framework compliance
    compliance(frameworks: [String!]): [FrameworkCompliance!]!
    beatsCompliance: ComplianceScore!
    sagedCompliance: ComplianceScore!
    statisticalCompliance: ComplianceScore!
    intersectionalCompliance: ComplianceScore!

    # Analytics
    patternAnalytics(
      dateRange: DateRangeInput!
      categories: [String!]
    ): PatternAnalytics!
    
    intersectionAnalytics(
      dateRange: DateRangeInput!
      attributes: [String!]
    ): IntersectionAnalytics!
    
    trendAnalytics(
      dateRange: DateRangeInput!
      metrics: [String!]!
    ): [TrendData!]!
    
    performanceAnalytics(
      dateRange: DateRangeInput!
    ): PerformanceMetrics!

    # Validation
    validationBenchmarks: [ValidationBenchmark!]!
    
    # Health check
    health: SystemStatus!
  }

  # Root Mutation type
  type Mutation {
    # Analysis operations
    submitAnalysis(input: AnalysisInput!): BiasAnalysis!
    
    # Expert validation
    performExpertValidation(
      analysisId: ID!
      framework: String!
    ): ValidationBenchmark!
    
    compareValidationResults(
      input: ValidationComparisonInput!
    ): [ValidationBenchmark!]!
    
    # Alert management
    resolveAlert(id: ID!): Alert!
    createAlert(
      type: AlertType!
      severity: SeverityLevel!
      message: String!
      details: JSON
    ): Alert!
  }

  # Root Subscription type for real-time updates
  type Subscription {
    # Real-time metrics updates
    metricsUpdated: RealTimeMetrics!
    
    # New analysis results
    analysisCompleted: BiasAnalysis!
    
    # Alert notifications
    alertCreated: Alert!
    
    # System status changes
    systemStatusChanged: SystemStatus!
  }
`;

module.exports = typeDefs;