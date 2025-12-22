import { z } from "zod";

export const validationInputSchema = z.object({
	ideaName: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(100, "Name must be less than 100 characters"),

	ideaDescription: z
		.string()
		.min(20, "Description must be at least 20 characters")
		.max(1000, "Description must be less than 1000 characters"),

	ideaType: z.enum([
		"saas",
		"micro-saas",
		"mobile-app",
		"chrome-extension",
		"api-tool",
		"marketplace",
		"info-product",
		"generic",
	]),

	targetAudience: z.string().optional(),

	proposedFeatures: z.array(z.string()).optional(),

	customization: z
		.object({
			validationTone: z
				.enum(["brutal", "balanced", "encouraging", "optimistic"])
				.optional(),
			focusAreas: z
				.array(
					z.enum([
						"market-size",
						"competition",
						"technical-feasibility",
						"monetization",
						"user-acquisition",
						"scalability",
						"legal-compliance",
						"differentiation",
					]),
				)
				.optional(),
			marketFocus: z.enum(["b2b", "b2c", "both"]).optional(),
			targetBudget: z
				.object({
					min: z.number().min(0).optional(),
					max: z.number().min(0).optional(),
					currency: z.string().default("USD"),
				})
				.optional()
				.refine(
					(data) =>
						!data ||
						(data.min === undefined && data.max === undefined) ||
						(data.min !== undefined && data.max !== undefined),
					{
						message: "Both min and max budget must be provided",
					},
				),
			targetTimeline: z
				.object({
					value: z.number().min(1).optional(),
					unit: z.enum(["days", "weeks", "months"]).optional(),
				})
				.optional()
				.refine(
					(data) =>
						!data ||
						(data.value === undefined && data.unit === undefined) ||
						(data.value !== undefined && data.unit !== undefined),
					{
						message: "Both timeline value and unit must be provided",
					},
				),
			technicalConstraints: z.array(z.string()).optional(),
			competitorAnalysisDepth: z
				.enum(["minimal", "standard", "comprehensive"])
				.optional(),
			includeMonetizationStrategy: z.boolean().optional(),
			includeLegalConsiderations: z.boolean().optional(),
		})
		.optional(),
});

export type ValidationInputForm = z.infer<typeof validationInputSchema>;
