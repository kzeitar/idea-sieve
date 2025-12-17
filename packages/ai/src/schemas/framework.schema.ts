/**
 * Framework Type Definitions and Validation Schemas
 *
 * This file defines the structure and validation for all validation frameworks.
 * It ensures type safety and runtime validation of framework data.
 */

import { z } from "zod";

// ============================================================================
// SCORING GUIDELINES SCHEMA
// ============================================================================

export const scoringGuidelinesSchema = z.object({
	"9-10": z.string().min(10, "Scoring guideline must be descriptive"),
	"7-8": z.string().min(10, "Scoring guideline must be descriptive"),
	"5-6": z.string().min(10, "Scoring guideline must be descriptive"),
	"3-4": z.string().min(10, "Scoring guideline must be descriptive"),
	"1-2": z.string().min(10, "Scoring guideline must be descriptive"),
});

// ============================================================================
// EVALUATION CRITERION SCHEMA
// ============================================================================

export const evaluationCriterionSchema = z.object({
	weight: z
		.number()
		.min(0, "Weight must be non-negative")
		.max(1, "Weight cannot exceed 1.0"),
	description: z.string().min(10, "Description must be meaningful"),
	keyQuestions: z
		.array(z.string().min(10))
		.min(3, "Must have at least 3 key questions")
		.max(10, "Too many key questions, keep focused"),
	scoringGuidelines: scoringGuidelinesSchema,
});

// ============================================================================
// EVALUATION CRITERIA SCHEMA
// ============================================================================

export const evaluationCriteriaSchema = z
	.record(z.string(), evaluationCriterionSchema)
	.refine(
		(criteria) => {
			// Validate that weights sum to 1.0 (with small tolerance for floating point)
			const totalWeight = Object.values(criteria).reduce(
				(sum, criterion) => sum + criterion.weight,
				0,
			);
			return Math.abs(totalWeight - 1.0) < 0.001;
		},
		{
			message: "Evaluation criteria weights must sum to 1.0",
		},
	)
	.refine(
		(criteria) => {
			// Ensure there are at least 3 criteria
			return Object.keys(criteria).length >= 3;
		},
		{
			message: "Must have at least 3 evaluation criteria",
		},
	);

// ============================================================================
// TARGET METRICS SCHEMA
// ============================================================================

export const targetMetricsSchema = z.record(z.string(), z.string());

// ============================================================================
// SPECIFIC REQUIREMENTS SCHEMA
// ============================================================================

export const specificRequirementsSchema = z.object({
	minimumMarketSize: z.string().optional(),
	idealMarketSize: z.string().optional(),
	targetMetrics: targetMetricsSchema,
	criticalFactors: z
		.array(z.string().min(10))
		.min(3, "Must have at least 3 critical factors"),
	additionalRequirements: z.record(z.string(), z.unknown()).optional(),
});

// ============================================================================
// MONETIZATION MODEL SCHEMA
// ============================================================================

export const monetizationModelSchema = z.object({
	type: z.string(),
	description: z.string().min(20),
	pros: z.array(z.string()).min(1),
	cons: z.array(z.string()).min(1),
	idealFor: z.string().optional(),
});

// ============================================================================
// ACQUISITION CHANNEL SCHEMA
// ============================================================================

export const acquisitionChannelSchema = z.object({
	channel: z.string(),
	description: z.string().min(20),
	effectiveness: z.enum(["low", "moderate", "high"]),
	cost: z.enum(["low", "moderate", "high"]),
	timeToResults: z.string(),
	idealFor: z.string().optional(),
});

// ============================================================================
// VALIDATION STEP SCHEMA
// ============================================================================

export const validationStepSchema = z.object({
	phase: z.string(),
	title: z.string(),
	description: z.string().min(20),
	actions: z.array(z.string()).min(1),
	successCriteria: z.string(),
	estimatedTime: z.string().optional(),
});

// ============================================================================
// FRAMEWORK SCHEMA
// ============================================================================

export const frameworkSchema = z.object({
	// Core metadata
	name: z.string().min(5),
	version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be semver format"),
	ideaType: z.string(),
	description: z.string().min(50, "Description must be comprehensive"),

	// Evaluation structure
	evaluationCriteria: evaluationCriteriaSchema,

	// Requirements and guidance
	specificRequirements: specificRequirementsSchema,
	commonPitfalls: z
		.array(z.string().min(15))
		.min(5, "Must have at least 5 common pitfalls"),
	successIndicators: z
		.array(z.string().min(15))
		.min(5, "Must have at least 5 success indicators"),
	dealBreakers: z
		.array(z.string().min(15))
		.min(5, "Must have at least 5 deal breakers"),

	// Optional framework-specific sections
	monetizationModels: z.array(monetizationModelSchema).optional(),
	acquisitionChannels: z.array(acquisitionChannelSchema).optional(),
	acquisitionStrategies: z.array(z.string()).optional(),
	validationSteps: z.array(validationStepSchema).optional(),
	idealCharacteristics: z.array(z.string()).optional(),
	technicalConsiderations: z.record(z.string(), z.unknown()).optional(),
	platformSpecificGuidance: z.record(z.string(), z.unknown()).optional(),

	// Allow for framework-specific extensions
	extensions: z.record(z.string(), z.unknown()).optional(),
});

export type Framework = z.infer<typeof frameworkSchema>;
