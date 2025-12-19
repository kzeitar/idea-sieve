import { env } from "@idea-sieve/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import frameworksRoutes from "./routes/frameworks";
import ideasRoutes from "./routes/ideas";
import statsRoutes from "./routes/stats";
import validateRoutes from "./routes/validate";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	}),
);

app.get("/health", (c) => {
	return c.json({ status: "healthy" });
});

app.get("/", (c) => {
	return c.json({
		name: "idea-sieve-api",
		version: "1.0.0",
		status: "running",
	});
});

// Mount routes
app.route("/api/ideas", ideasRoutes);
app.route("/api/frameworks", frameworksRoutes);
app.route("/api/stats", statsRoutes);
app.route("/api/validate", validateRoutes);

export default app;
