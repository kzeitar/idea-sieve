import { db } from "@idea-sieve/db";
import { Hono } from "hono";

const app = new Hono();

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

		const completedIdeas = ideas.filter((idea) => idea.validation);

		if (completedIdeas.length === 0) {
			return c.json({
				success: true,
				data: {
					total: 0,
					averageScore: 0,
					recommendationCounts: {
						BUILD_NOW: 0,
						BUILD_WITH_CAUTION: 0,
						PIVOT_REQUIRED: 0,
						DO_NOT_BUILD: 0,
					},
					recentValidations: [],
				},
			});
		}

		const total = completedIdeas.length;
		const totalScore = completedIdeas.reduce(
			(sum, idea) => sum + (idea.validation?.overallScore || 0),
			0,
		);
		const averageScore = totalScore / total;

		const recommendationCounts = completedIdeas.reduce(
			(acc, idea) => {
				const rec = idea.validation?.recommendation;
				if (rec && acc[rec]) {
					acc[rec]++;
				}
				return acc;
			},
			{
				BUILD_NOW: 0,
				BUILD_WITH_CAUTION: 0,
				PIVOT_REQUIRED: 0,
				DO_NOT_BUILD: 0,
			} as Record<string, number>,
		);

		const recentValidations = completedIdeas.slice(0, 3).map((idea) => ({
			id: idea.id,
			status: "completed",
			input: {
				ideaName: idea.ideaName,
				ideaDescription: idea.ideaDescription,
				ideaType: idea.ideaType,
				targetAudience: idea.targetAudience,
				proposedFeatures: idea.proposedFeatures,
				customization: idea.customization,
			},
			report: idea.validation?.validationReport,
			createdAt: idea.createdAt,
			completedAt: idea.validation?.validatedAt,
		}));

		return c.json({
			success: true,
			data: {
				total,
				averageScore: Math.round(averageScore * 10) / 10,
				recommendationCounts,
				recentValidations,
			},
		});
	} catch (error) {
		console.error("Error fetching statistics:", error);
		return c.json(
			{
				success: false,
				error: "Failed to fetch statistics",
			},
			500,
		);
	}
});

export default app;
