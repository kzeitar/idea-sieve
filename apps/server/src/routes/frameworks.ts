import { db } from "@idea-sieve/db";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
	try {
		const frameworks = await db.framework.findMany({
			orderBy: {
				ideaType: "asc",
			},
		});

		return c.json({
			success: true,
			data: frameworks,
		});
	} catch (error) {
		console.error("Error fetching frameworks:", error);
		return c.json(
			{
				success: false,
				error: "Failed to fetch frameworks",
			},
			500,
		);
	}
});

app.get("/:ideaType", async (c) => {
	try {
		const { ideaType } = c.req.param();

		const framework = await db.framework.findUnique({
			where: { ideaType },
		});

		if (!framework) {
			return c.json(
				{
					success: false,
					error: "Framework not found",
				},
				404,
			);
		}

		return c.json({
			success: true,
			data: framework,
		});
	} catch (error) {
		console.error("Error fetching framework:", error);
		return c.json(
			{
				success: false,
				error: "Failed to fetch framework",
			},
			500,
		);
	}
});

export default app;
