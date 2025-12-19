import { zValidator } from "@hono/zod-validator";
import { db } from "@idea-sieve/db";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

const createIdeaSchema = z.object({
	ideaName: z.string().min(1, "Idea name is required"),
	ideaDescription: z.string().min(1, "Description is required"),
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
	proposedFeatures: z.array(z.string()).default([]),
	customization: z.any().optional(),
});

const validateIdeaSchema = z.object({
	validationReport: z.any(),
	overallScore: z.number().min(0).max(10),
	recommendation: z.enum([
		"BUILD_NOW",
		"BUILD_WITH_CAUTION",
		"PIVOT_REQUIRED",
		"DO_NOT_BUILD",
	]),
});

app.get("/", async (c) => {
	try {
		const ideas = await db.idea.findMany({
			include: {
				validation: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return c.json({
			success: true,
			data: ideas,
		});
	} catch (error) {
		console.error("Error fetching ideas:", error);
		return c.json(
			{
				success: false,
				error: "Failed to fetch ideas",
			},
			500,
		);
	}
});

app.get("/:id", async (c) => {
	try {
		const { id } = c.req.param();

		const idea = await db.idea.findUnique({
			where: { id },
			include: {
				validation: true,
			},
		});

		if (!idea) {
			return c.json(
				{
					success: false,
					error: "Idea not found",
				},
				404,
			);
		}

		return c.json({
			success: true,
			data: idea,
		});
	} catch (error) {
		console.error("Error fetching idea:", error);
		return c.json(
			{
				success: false,
				error: "Failed to fetch idea",
			},
			500,
		);
	}
});

app.post("/", zValidator("json", createIdeaSchema), async (c) => {
	try {
		const data = c.req.valid("json");

		const idea = await db.idea.create({
			data: {
				ideaName: data.ideaName,
				ideaDescription: data.ideaDescription,
				ideaType: data.ideaType,
				targetAudience: data.targetAudience,
				proposedFeatures: data.proposedFeatures,
				customization: data.customization,
			},
		});

		return c.json(
			{
				success: true,
				data: idea,
			},
			201,
		);
	} catch (error) {
		console.error("Error creating idea:", error);
		return c.json(
			{
				success: false,
				error: "Failed to create idea",
			},
			500,
		);
	}
});

app.post("/:id/validate", zValidator("json", validateIdeaSchema), async (c) => {
	try {
		const { id } = c.req.param();
		const data = c.req.valid("json");

		const idea = await db.idea.findUnique({
			where: { id },
		});

		if (!idea) {
			return c.json(
				{
					success: false,
					error: "Idea not found",
				},
				404,
			);
		}

		const validation = await db.ideaValidation.upsert({
			where: { ideaId: id },
			create: {
				ideaId: id,
				overallScore: data.overallScore,
				recommendation: data.recommendation,
				validationReport: data.validationReport,
				validatedAt: new Date(),
			},
			update: {
				overallScore: data.overallScore,
				recommendation: data.recommendation,
				validationReport: data.validationReport,
				validatedAt: new Date(),
			},
		});

		return c.json({
			success: true,
			data: validation,
		});
	} catch (error) {
		console.error("Error validating idea:", error);
		return c.json(
			{
				success: false,
				error: "Failed to validate idea",
			},
			500,
		);
	}
});

export default app;
