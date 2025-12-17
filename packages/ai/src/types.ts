/**
 * AI Idea Validator - TypeScript Type Definitions
 * These types define the structure of validation inputs and outputs
 */

// ============================================================================
// INPUT TYPES
// ============================================================================

export type IdeaType =
	| "saas"
	| "micro-saas"
	| "mobile-app"
	| "chrome-extension"
	| "api-tool"
	| "marketplace"
	| "info-product"
	| "generic";

export type MarketFocus = "b2b" | "b2c" | "both";

export type ValidationTone =
	| "brutal" // Harsh, critical, will strongly tell you not to build
	| "balanced" // Fair assessment, honest but constructive (DEFAULT)
	| "encouraging" // Supportive while still honest
	| "optimistic"; // Looks for positives, helpful for early-stage exploration

export interface CustomizationOptions {
	validationTone?: ValidationTone;
	focusAreas?: FocusArea[];
	marketFocus?: MarketFocus;
	targetBudget?: {
		min: number;
		max: number;
		currency: string;
	};
	targetTimeline?: {
		value: number;
		unit: "days" | "weeks" | "months";
	};
	technicalConstraints?: string[];
	competitorAnalysisDepth?: "minimal" | "standard" | "comprehensive";
	includeMonetizationStrategy?: boolean;
	includeLegalConsiderations?: boolean;
}

export type FocusArea =
	| "market-size"
	| "competition"
	| "technical-feasibility"
	| "monetization"
	| "user-acquisition"
	| "scalability"
	| "legal-compliance"
	| "differentiation";

export interface ValidationInput {
	ideaName: string;
	ideaDescription: string;
	ideaType: IdeaType;
	targetAudience?: string;
	proposedFeatures?: string[];
	customization?: CustomizationOptions;
}

// ============================================================================
// OUTPUT TYPES
// ============================================================================

export type TodoItem = {
	content: string;
	activeForm: string;
	status: "pending" | "in_progress" | "completed";
};

export type RecommendationType =
	| "BUILD_NOW" // Strong opportunity, clear path forward
	| "BUILD_WITH_CAUTION" // Viable but has significant challenges
	| "PIVOT_REQUIRED" // Core concept needs major changes
	| "DO_NOT_BUILD"; // Not viable, fundamental issues

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Score {
	value: number; // 0-10 scale
	reasoning: string;
	confidence: number; // 0-100, how confident is the assessment
}

export interface Competitor {
	name: string;
	description: string;
	website?: string;
	strengths: string[];
	weaknesses: string[];
	marketShare?: "dominant" | "significant" | "emerging" | "niche";
	pricing?: string;
	lastUpdated?: string;
}

export interface MarketAnalysis {
	score: Score;
	marketSize: {
		description: string;
		estimatedValue?: string;
		growthRate?: string;
		sources?: string[];
	};
	competitors: Competitor[];
	competitorCount: {
		direct: number;
		indirect: number;
	};
	marketTrends: string[];
	userDemand: {
		level: "low" | "moderate" | "high" | "very-high";
		evidence: string[];
	};
	saturation: {
		level: "low" | "moderate" | "high" | "oversaturated";
		analysis: string;
	};
}

export interface DifferentiationAnalysis {
	score: Score;
	uniqueValueProposition: string;
	keyDifferentiators: string[];
	competitiveAdvantages: string[];
	weaknesses: string[];
	moatPotential: {
		rating: "none" | "weak" | "moderate" | "strong";
		explanation: string;
	};
}

export interface TechnicalFeasibility {
	score: Score;
	complexityLevel: "low" | "moderate" | "high" | "very-high";
	requiredSkills: string[];
	estimatedDevTime: {
		mvp: string;
		fullVersion: string;
	};
	technicalChallenges: string[];
	requiredInfrastructure: string[];
	thirdPartyDependencies: string[];
	scalabilityConcerns?: string[];
}

export interface MonetizationAnalysis {
	score: Score;
	recommendedModels: MonetizationModel[];
	revenueProjection: {
		optimistic: string;
		realistic: string;
		pessimistic: string;
		timeframe: string;
	};
	pricingStrategy: string;
	competitorPricing: {
		low: string;
		average: string;
		high: string;
	};
	ltv_cac_ratio?: {
		estimated: number;
		viability: string;
	};
}

export interface MonetizationModel {
	type:
		| "subscription"
		| "one-time"
		| "freemium"
		| "usage-based"
		| "ads"
		| "marketplace"
		| "hybrid";
	description: string;
	pros: string[];
	cons: string[];
	fitScore: number; // 0-10
}

export interface UserAcquisition {
	score: Score;
	difficulty: "easy" | "moderate" | "hard" | "very-hard";
	recommendedChannels: AcquisitionChannel[];
	estimatedCAC: {
		range: string;
		reasoning: string;
	};
	organicPotential: {
		level: "low" | "moderate" | "high";
		explanation: string;
	};
	viralCoefficient?: {
		estimated: number;
		reasoning: string;
	};
}

export interface AcquisitionChannel {
	channel: string;
	effectiveness: "low" | "moderate" | "high";
	cost: "low" | "moderate" | "high";
	timeToResults: string;
	description: string;
}

export interface Risk {
	category: string;
	level: RiskLevel;
	description: string;
	mitigation?: string;
	impact: "low" | "medium" | "high" | "critical";
}

export interface LegalConsiderations {
	compliance: string[];
	regulations: string[];
	privacyRequirements: string[];
	risks: string[];
}

export interface ActionItem {
	priority: "critical" | "high" | "medium" | "low";
	action: string;
	reasoning: string;
	estimatedEffort?: string;
}

export interface PivotRecommendation {
	title: string;
	description: string;
	reasoning: string;
	priority: "critical" | "high" | "medium" | "low";
	estimatedImpact: string; // e.g., "Could improve market score by 2-3 points"
}

export interface BuildRecommendation {
	title: string;
	description: string;
	priority: "critical" | "high" | "medium" | "low";
	category: "product" | "market" | "technical" | "business";
}

export interface AlternativeDirection {
	title: string;
	description: string;
	viabilityScore: number; // 0-10
	reasoning: string;
}

export interface ValidationReport {
	// Meta information
	ideaName: string;
	ideaType: IdeaType;
	validatedAt: string;

	// Overall assessment
	overallScore: number; // 0-10 weighted average
	recommendation: RecommendationType;
	executiveSummary: string;

	// Core analysis sections
	marketAnalysis: MarketAnalysis;
	differentiation: DifferentiationAnalysis;
	technicalFeasibility: TechnicalFeasibility;
	monetization: MonetizationAnalysis;
	userAcquisition: UserAcquisition;

	// Risk and opportunity
	risks: Risk[];
	opportunities: string[];

	// Optional sections (based on customization)
	legalConsiderations?: LegalConsiderations;

	// Actionable guidance
	nextSteps: ActionItem[];
	pivotRecommendations: PivotRecommendation[]; // Specific pivots to consider (especially for PIVOT_REQUIRED)
	buildRecommendations: BuildRecommendation[]; // What to focus on when building (for BUILD_NOW, BUILD_WITH_CAUTION)
	alternativeDirections: AlternativeDirection[]; // Alternative ideas to explore (for PIVOT_REQUIRED, DO_NOT_BUILD)
	dealBreakers: string[];
	criticalSuccessFactors: string[];

	// Additional context
	assumptions: string[];
	dataQuality: {
		score: number; // 0-100
		notes: string;
	};
}
