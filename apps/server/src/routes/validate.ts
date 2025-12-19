import type { ValidationInput } from "@idea-sieve/ai";
import { db } from "@idea-sieve/db";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { type JobUpdateEvent, jobEvents } from "@/services/job-events";
import { validationService } from "@/services/validation-service";

const app = new Hono();

// ============================================================================
// POST /validate - Start a new validation job
// ============================================================================

/**
 * POST /validate
 *
 * Starts a new validation job for an idea.
 *
 * Request body:
 * {
 *   ideaId: string,
 *   input: ValidationInput
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     jobId: string,
 *     report: ValidationReport
 *   }
 * }
 */
app.post("/", async (c) => {
	try {
		const { ideaId, input } = await c.req.json<{
			ideaId: string;
			input: ValidationInput;
		}>();

		const idea = await db.idea.findUnique({
			where: { id: ideaId },
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

		const existingValidation = await db.ideaValidation.findUnique({
			where: { ideaId },
		});

		if (existingValidation) {
			return c.json(
				{
					success: false,
					error:
						"Idea already validated. Delete the existing validation first.",
					validationId: existingValidation.id,
				},
				409,
			);
		}

		const jobsInProgress = await db.validationJob.findFirst({
			where: {
				ideaId,
				status: { in: ["queued", "processing"] },
			},
		});

		if (jobsInProgress) {
			return c.json(
				{
					success: false,
					error: "Validation already in progress",
					jobId: jobsInProgress.id,
				},
				409,
			);
		}

		const jobId = await validationService.createJob(ideaId);

		validationService
			.runValidationInBackground(jobId, ideaId, input)
			.catch((error) => {
				console.error(`Background validation failed for job ${jobId}:`, error);
			});

		return c.json({
			success: true,
			data: {
				jobId,
				status: "queued",
			},
		});
	} catch (error) {
		console.error("Validation endpoint error:", error);
		return c.json(
			{
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to start validation",
			},
			500,
		);
	}
});

// ============================================================================
// GET /jobs/:jobId - Get validation job status
// ============================================================================

/**
 * GET /jobs/:jobId
 *
 * Get the status and details of a validation job.
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     id: string,
 *     ideaId: string,
 *     status: "queued" | "processing" | "completed" | "failed",
 *     currentTaskIndex: number,
 *     totalTasks: number,
 *     validationId: string | null,
 *     error: string | null,
 *     createdAt: Date,
 *     updatedAt: Date,
 *     startedAt: Date | null,
 *     completedAt: Date | null
 *   }
 * }
 */
app.get("/jobs/:jobId", async (c) => {
	try {
		const { jobId } = c.req.param();

		const job = await validationService.getJobStatus(jobId);

		return c.json({
			success: true,
			data: job,
		});
	} catch (error) {
		console.error("Error fetching job status:", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return c.json(
				{
					success: false,
					error: "Validation job not found",
				},
				404,
			);
		}

		return c.json(
			{
				success: false,
				error: "Failed to fetch job status",
			},
			500,
		);
	}
});

// ============================================================================
// GET /jobs/:jobId/stream - SSE endpoint for real-time job updates
// ============================================================================

/**
 * GET /jobs/:jobId/stream
 *
 * Server-Sent Events (SSE) endpoint for real-time job updates.
 * Sends initial job state immediately, then pushes updates as they occur.
 *
 * Response: text/event-stream with JSON data:
 * {
 *   job: ValidationJobDetails,
 *   tasks: TaskResult[],
 *   progress: { progress: number, isComplete: boolean }
 * }
 */
app.get("/jobs/:jobId/stream", async (c) => {
	const { jobId } = c.req.param();

	return streamSSE(c, async (stream) => {
		let aborted = false;
		let pollInterval: Timer | null = null;

		// Clean up function
		const cleanup = () => {
			aborted = true;
			if (pollInterval) {
				clearInterval(pollInterval);
				pollInterval = null;
			}
			jobEvents.offJobUpdate(jobId, handleJobUpdate);
		};

		// Handle client disconnect
		c.req.raw.signal.addEventListener("abort", cleanup);

		// Handler for job update events
		const handleJobUpdate = async (event: JobUpdateEvent) => {
			if (aborted) return;

			try {
				await stream.writeSSE({
					data: JSON.stringify({
						job: event.job,
						tasks: event.tasks,
						progress: event.progress,
					}),
				});
			} catch (error) {
				console.error("Error sending SSE update:", error);
				cleanup();
			}
		};

		// Subscribe to job update events
		jobEvents.onJobUpdate(jobId, handleJobUpdate);

		// Send initial state immediately
		try {
			const [job, tasks, progress, isComplete] = await Promise.all([
				validationService.getJobStatus(jobId),
				validationService.getTaskResults(jobId),
				validationService.getJobProgress(jobId),
				validationService.isJobComplete(jobId),
			]);

			await stream.writeSSE({
				data: JSON.stringify({
					job,
					tasks,
					progress: {
						progress,
						isComplete,
					},
				}),
			});

			// If job is already complete/failed, close the stream
			if (job.status === "completed" || job.status === "failed") {
				cleanup();
				return;
			}
		} catch (error) {
			console.error("Error fetching initial job state:", error);
			await stream.writeSSE({
				event: "error",
				data: JSON.stringify({
					error: "Failed to fetch job status",
				}),
			});
			cleanup();
			return;
		}

		// Fallback polling mechanism (in case events are missed)
		// Poll every 5 seconds while job is in progress
		pollInterval = setInterval(async () => {
			if (aborted) return;

			try {
				const [job, tasks, progress, isComplete] = await Promise.all([
					validationService.getJobStatus(jobId),
					validationService.getTaskResults(jobId),
					validationService.getJobProgress(jobId),
					validationService.isJobComplete(jobId),
				]);

				await stream.writeSSE({
					data: JSON.stringify({
						job,
						tasks,
						progress: {
							progress,
							isComplete,
						},
					}),
				});

				// If job is complete/failed, stop polling and close stream
				if (job.status === "completed" || job.status === "failed") {
					cleanup();
				}
			} catch (error) {
				console.error("Error in SSE poll:", error);
			}
		}, 5000);

		// Keep connection alive by sending periodic keep-alive messages
		// Wait indefinitely using a promise that never resolves
		await new Promise(() => {
			// This promise never resolves, keeping the stream open
			// The stream will close when cleanup() is called or client disconnects
		});
	});
});

// ============================================================================
// GET /jobs/:jobId/progress - Get job progress percentage
// ============================================================================

/**
 * GET /jobs/:jobId/progress
 *
 * Get the current progress of a validation job as a percentage.
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     progress: number,  // 0-100
 *     isComplete: boolean
 *   }
 * }
 */
app.get("/jobs/:jobId/progress", async (c) => {
	try {
		const { jobId } = c.req.param();

		const [progress, isComplete] = await Promise.all([
			validationService.getJobProgress(jobId),
			validationService.isJobComplete(jobId),
		]);

		return c.json({
			success: true,
			data: {
				progress,
				isComplete,
			},
		});
	} catch (error) {
		console.error("Error fetching job progress:", error);
		return c.json(
			{
				success: false,
				error: "Failed to fetch job progress",
			},
			500,
		);
	}
});

// ============================================================================
// GET /jobs/:jobId/tasks - Get task results for a job
// ============================================================================

/**
 * GET /jobs/:jobId/tasks
 *
 * Get all task results for a validation job.
 *
 * Response:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: string,
 *       jobId: string,
 *       taskId: string,
 *       title: string,
 *       description: string,
 *       status: "pending" | "in_progress" | "completed" | "failed",
 *       result: string | null,
 *       error: string | null,
 *       createdAt: Date,
 *       updatedAt: Date,
 *       startedAt: Date | null,
 *       completedAt: Date | null
 *     }
 *   ]
 * }
 */
app.get("/jobs/:jobId/tasks", async (c) => {
	try {
		const { jobId } = c.req.param();

		const tasks = await validationService.getTaskResults(jobId);

		return c.json({
			success: true,
			data: tasks,
		});
	} catch (error) {
		console.error("Error fetching task results:", error);
		return c.json(
			{
				success: false,
				error: "Failed to fetch task results",
			},
			500,
		);
	}
});

// ============================================================================
// GET /ideas/:ideaId/jobs - Get all jobs for an idea
// ============================================================================

/**
 * GET /ideas/:ideaId/jobs
 *
 * Get all validation jobs for a specific idea.
 *
 * Response:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id: string,
 *       ideaId: string,
 *       status: string,
 *       ...
 *     }
 *   ]
 * }
 */
app.get("/ideas/:ideaId/jobs", async (c) => {
	try {
		const { ideaId } = c.req.param();

		const jobs = await validationService.getJobsByIdeaId(ideaId);

		return c.json({
			success: true,
			data: jobs,
		});
	} catch (error) {
		console.error("Error fetching jobs for idea:", error);
		return c.json(
			{
				success: false,
				error: "Failed to fetch jobs",
			},
			500,
		);
	}
});

// ============================================================================
// GET /ideas/:ideaId/validation - Get validation report for an idea
// ============================================================================

/**
 * GET /ideas/:ideaId/validation
 *
 * Get the validation report for an idea (if it exists).
 *
 * Response:
 * {
 *   success: true,
 *   data: ValidationReport | null
 * }
 */
app.get("/ideas/:ideaId/validation", async (c) => {
	try {
		const { ideaId } = c.req.param();

		const report = await validationService.getValidationReport(ideaId);

		if (!report) {
			return c.json({
				success: true,
				data: null,
			});
		}

		return c.json({
			success: true,
			data: report,
		});
	} catch (error) {
		console.error("Error fetching validation report:", error);
		return c.json(
			{
				success: false,
				error: "Failed to fetch validation report",
			},
			500,
		);
	}
});

export default app;
