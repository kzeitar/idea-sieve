import { z } from "zod";

// ============================================================================
// ENUM SCHEMAS
// ============================================================================

export const ideaTypeSchema = z.enum([
	"saas",
	"micro-saas",
	"mobile-app",
	"chrome-extension",
	"api-tool",
	"marketplace",
	"info-product",
	"generic",
]);

export const recommendationTypeSchema = z.enum([
	"BUILD_NOW",
	"BUILD_WITH_CAUTION",
	"PIVOT_REQUIRED",
	"DO_NOT_BUILD",
]);

export const riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);

// ============================================================================
// BASE SCHEMAS
// ============================================================================

export const scoreSchema = z.object({
	value: z.number(), // 0-10 scale (constraints enforced via prompt)
	reasoning: z.string(),
	confidence: z.number(), // 0-100 (constraints enforced via prompt)
});

export const competitorSchema = z.object({
	name: z.string(),
	description: z.string(),
	website: z.string(),
	strengths: z.array(z.string()),
	weaknesses: z.array(z.string()),
	marketShare: z.enum(["dominant", "significant", "emerging", "niche"]),
	pricing: z.string(),
	lastUpdated: z.string(),
});

export const marketAnalysisSchema = z.object({
	score: scoreSchema,
	marketSize: z.object({
		description: z.string(),
		estimatedValue: z.string(),
		growthRate: z.string(),
		sources: z.array(z.string()),
	}),
	competitors: z.array(competitorSchema),
	competitorCount: z.object({
		direct: z.number(),
		indirect: z.number(),
	}),
	marketTrends: z.array(z.string()),
	userDemand: z.object({
		level: z.enum(["low", "moderate", "high", "very-high"]),
		evidence: z.array(z.string()),
	}),
	saturation: z.object({
		level: z.enum(["low", "moderate", "high", "oversaturated"]),
		analysis: z.string(),
	}),
});

export const differentiationAnalysisSchema = z.object({
	score: scoreSchema,
	uniqueValueProposition: z.string(),
	keyDifferentiators: z.array(z.string()),
	competitiveAdvantages: z.array(z.string()),
	weaknesses: z.array(z.string()),
	moatPotential: z.object({
		rating: z.enum(["none", "weak", "moderate", "strong"]),
		explanation: z.string(),
	}),
});

export const technicalFeasibilitySchema = z.object({
	score: scoreSchema,
	complexityLevel: z.enum(["low", "moderate", "high", "very-high"]),
	requiredSkills: z.array(z.string()),
	estimatedDevTime: z.object({
		mvp: z.string(),
		fullVersion: z.string(),
	}),
	technicalChallenges: z.array(z.string()),
	requiredInfrastructure: z.array(z.string()),
	thirdPartyDependencies: z.array(z.string()),
	scalabilityConcerns: z.array(z.string()),
});

export const monetizationModelSchema = z.object({
	type: z.enum([
		"subscription",
		"one-time",
		"freemium",
		"usage-based",
		"ads",
		"marketplace",
		"hybrid",
	]),
	description: z.string(),
	pros: z.array(z.string()),
	cons: z.array(z.string()),
	fitScore: z.number(), // 0-10 scale (constraints enforced via prompt)
});

export const monetizationAnalysisSchema = z.object({
	score: scoreSchema,
	recommendedModels: z.array(monetizationModelSchema),
	revenueProjection: z.object({
		optimistic: z.string(),
		realistic: z.string(),
		pessimistic: z.string(),
		timeframe: z.string(),
	}),
	pricingStrategy: z.string(),
	competitorPricing: z.object({
		low: z.string(),
		average: z.string(),
		high: z.string(),
	}),
	ltv_cac_ratio: z.object({
		estimated: z.number(),
		viability: z.string(),
	}),
});

export const acquisitionChannelSchema = z.object({
	channel: z.string(),
	effectiveness: z.enum(["low", "moderate", "high"]),
	cost: z.enum(["low", "moderate", "high"]),
	timeToResults: z.string(),
	description: z.string(),
});

export const userAcquisitionSchema = z.object({
	score: scoreSchema,
	difficulty: z.enum(["easy", "moderate", "hard", "very-hard"]),
	recommendedChannels: z.array(acquisitionChannelSchema),
	estimatedCAC: z.object({
		range: z.string(),
		reasoning: z.string(),
	}),
	organicPotential: z.object({
		level: z.enum(["low", "moderate", "high"]),
		explanation: z.string(),
	}),
	viralCoefficient: z.object({
		estimated: z.number(),
		reasoning: z.string(),
	}),
});

export const riskSchema = z.object({
	category: z.string(),
	level: riskLevelSchema,
	description: z.string(),
	mitigation: z.string(),
	impact: z.enum(["low", "medium", "high", "critical"]),
});

export const legalConsiderationsSchema = z.object({
	compliance: z.array(z.string()),
	regulations: z.array(z.string()),
	privacyRequirements: z.array(z.string()),
	risks: z.array(z.string()),
});

export const actionItemSchema = z.object({
	priority: z.enum(["critical", "high", "medium", "low"]),
	action: z.string(),
	reasoning: z.string(),
	estimatedEffort: z.string(),
});

export const pivotRecommendationSchema = z.object({
	title: z.string(),
	description: z.string(),
	reasoning: z.string(),
	priority: z.enum(["critical", "high", "medium", "low"]),
	estimatedImpact: z.string(),
});

export const buildRecommendationSchema = z.object({
	title: z.string(),
	description: z.string(),
	priority: z.enum(["critical", "high", "medium", "low"]),
	category: z.enum(["product", "market", "technical", "business"]),
});

export const alternativeDirectionSchema = z.object({
	title: z.string(),
	description: z.string(),
	viabilityScore: z.number(), // 0-10 scale (constraints enforced via prompt)
	reasoning: z.string(),
});

// ============================================================================
// MAIN ValidationReport SCHEMAS
// ============================================================================

export const validationReportSchema = z.object({
	// Meta information
	ideaName: z.string(),
	ideaType: ideaTypeSchema,
	validatedAt: z.string(),

	// Overall assessment
	overallScore: z.number(), // 0-10 weighted average (constraints enforced via prompt)
	recommendation: recommendationTypeSchema,
	executiveSummary: z.string(),

	// Core analysis sections
	marketAnalysis: marketAnalysisSchema,
	differentiation: differentiationAnalysisSchema,
	technicalFeasibility: technicalFeasibilitySchema,
	monetization: monetizationAnalysisSchema,
	userAcquisition: userAcquisitionSchema,

	// Risk and opportunity
	risks: z.array(riskSchema),
	opportunities: z.array(z.string()),

	// Optional sections (based on customization)
	legalConsiderations: legalConsiderationsSchema,

	// Actionable guidance
	nextSteps: z.array(actionItemSchema),
	pivotRecommendations: z.array(pivotRecommendationSchema),
	buildRecommendations: z.array(buildRecommendationSchema),
	alternativeDirections: z.array(alternativeDirectionSchema),
	dealBreakers: z.array(z.string()),
	criticalSuccessFactors: z.array(z.string()),

	// Additional context
	assumptions: z.array(z.string()),
	dataQuality: z.object({
		score: z.number(), // 0-100 (constraints enforced via prompt)
		notes: z.string(),
	}),
});
