import { db } from "@idea-sieve/db";
import type { ValidationReport } from "../types";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Task status enum matching the database schema
 */
export type TaskStatus = "pending" | "in_progress" | "completed" | "failed";

/**
 * Validation job status enum
 */
export type JobStatus = "queued" | "processing" | "completed" | "failed";

/**
 * Task definition for creating tasks
 */
export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
}

/**
 * Task result with execution details
 */
export interface TaskResult {
	id: string;
	jobId: string;
	taskId: string;
	title: string;
	description: string;
	status: TaskStatus;
	result: string | null;
	error: string | null;
	createdAt: Date;
	updatedAt: Date;
	startedAt: Date | null;
	completedAt: Date | null;
}

/**
 * Validation job with full details
 */
export interface ValidationJobDetails {
	id: string;
	ideaId: string;
	status: JobStatus;
	currentTaskIndex: number;
	totalTasks: number;
	validationId: string | null;
	error: string | null;
	createdAt: Date;
	updatedAt: Date;
	startedAt: Date | null;
	completedAt: Date | null;
}

// ============================================================================
// VALIDATION PERSISTENCE SERVICE
// ============================================================================

export class ValidationPersistence {
	// ==========================================================================
	// JOB MANAGEMENT
	// ==========================================================================

	async createJob(ideaId: string): Promise<string> {
		try {
			const job = await db.validationJob.create({
				data: {
					ideaId,
					status: "queued",
					currentTaskIndex: 0,
					totalTasks: 0,
				},
			});

			return job.id;
		} catch (error) {
			console.error("[ValidationPersistence] Failed to create job:", error);
			throw new Error(
				`Failed to create validation job: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async updateJobStatus(jobId: string, status: JobStatus): Promise<void> {
		try {
			const updateData: {
				status: JobStatus;
				startedAt?: Date;
				completedAt?: Date;
			} = { status };

			if (status === "processing") {
				updateData.startedAt = new Date();
			} else if (status === "completed" || status === "failed") {
				updateData.completedAt = new Date();
			}

			await db.validationJob.update({
				where: { id: jobId },
				data: updateData,
			});
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to update job status:",
				error,
			);
			throw new Error(
				`Failed to update job status: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async updateJobProgress(
		jobId: string,
		currentTaskIndex: number,
	): Promise<void> {
		try {
			await db.validationJob.update({
				where: { id: jobId },
				data: { currentTaskIndex },
			});
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to update job progress:",
				error,
			);
			throw new Error(
				`Failed to update job progress: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async updateJobError(jobId: string, error: string): Promise<void> {
		try {
			await db.validationJob.update({
				where: { id: jobId },
				data: { error, status: "failed", completedAt: new Date() },
			});
		} catch (err) {
			console.error("[ValidationPersistence] Failed to update job error:", err);
			throw new Error(
				`Failed to update job error: ${err instanceof Error ? err.message : "Unknown error"}`,
			);
		}
	}

	async getJob(jobId: string): Promise<ValidationJobDetails> {
		try {
			const job = await db.validationJob.findUnique({
				where: { id: jobId },
			});

			if (!job) {
				throw new Error(`Validation job not found: ${jobId}`);
			}

			return job as ValidationJobDetails;
		} catch (error) {
			console.error("[ValidationPersistence] Failed to get job:", error);
			throw new Error(
				`Failed to get job: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async getJobsByIdeaId(ideaId: string): Promise<ValidationJobDetails[]> {
		try {
			const jobs = await db.validationJob.findMany({
				where: { ideaId },
				orderBy: { createdAt: "desc" },
			});

			return jobs as ValidationJobDetails[];
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to get jobs by idea ID:",
				error,
			);
			throw new Error(
				`Failed to get jobs by idea ID: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	// ==========================================================================
	// TASK MANAGEMENT
	// ==========================================================================

	async saveTaskList(jobId: string, tasks: Task[]): Promise<void> {
		try {
			await db.$transaction(async (tx) => {
				await tx.validationTaskResult.createMany({
					data: tasks.map((task) => ({
						jobId,
						taskId: task.id,
						title: task.title,
						description: task.description,
						status: task.status,
					})),
				});

				await tx.validationJob.update({
					where: { id: jobId },
					data: { totalTasks: tasks.length },
				});
			});
		} catch (error) {
			console.error("[ValidationPersistence] Failed to save task list:", error);
			throw new Error(
				`Failed to save task list: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async updateTaskStatus(
		jobId: string,
		taskId: string,
		status: TaskStatus,
	): Promise<void> {
		try {
			const updateData: {
				status: TaskStatus;
				startedAt?: Date;
				completedAt?: Date;
			} = { status };

			if (status === "in_progress") {
				updateData.startedAt = new Date();
			} else if (status === "completed" || status === "failed") {
				updateData.completedAt = new Date();
			}

			await db.validationTaskResult.update({
				where: {
					jobId_taskId: { jobId, taskId },
				},
				data: updateData,
			});
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to update task status:",
				error,
			);
			throw new Error(
				`Failed to update task status: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async saveTaskResult(
		jobId: string,
		taskId: string,
		result: string,
		isError = false,
	): Promise<void> {
		try {
			await db.validationTaskResult.update({
				where: {
					jobId_taskId: { jobId, taskId },
				},
				data: isError ? { error: result } : { result },
			});
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to save task result:",
				error,
			);
			throw new Error(
				`Failed to save task result: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async getTaskResults(jobId: string): Promise<TaskResult[]> {
		try {
			const results = await db.validationTaskResult.findMany({
				where: { jobId },
				orderBy: { createdAt: "asc" },
			});

			return results as TaskResult[];
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to get task results:",
				error,
			);
			throw new Error(
				`Failed to get task results: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async getTaskResult(jobId: string, taskId: string): Promise<TaskResult> {
		try {
			const result = await db.validationTaskResult.findUnique({
				where: {
					jobId_taskId: { jobId, taskId },
				},
			});

			if (!result) {
				throw new Error(`Task result not found: ${jobId}/${taskId}`);
			}

			return result as TaskResult;
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to get task result:",
				error,
			);
			throw new Error(
				`Failed to get task result: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	// ==========================================================================
	// REPORT MANAGEMENT
	// ==========================================================================

	async saveValidationReport(
		jobId: string,
		ideaId: string,
		report: ValidationReport,
	): Promise<string> {
		try {
			return await db.$transaction(async (tx) => {
				const validation = await tx.ideaValidation.upsert({
					where: { ideaId },
					create: {
						ideaId,
						overallScore: report.overallScore,
						recommendation: report.recommendation,
						validatedAt: new Date(report.validatedAt),
						validationReport: JSON.parse(JSON.stringify(report)),
					},
					update: {
						overallScore: report.overallScore,
						recommendation: report.recommendation,
						validatedAt: new Date(report.validatedAt),
						validationReport: JSON.parse(JSON.stringify(report)),
					},
				});

				await tx.validationJob.update({
					where: { id: jobId },
					data: { validationId: validation.id },
				});

				return validation.id;
			});
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to save validation report:",
				error,
			);
			throw new Error(
				`Failed to save validation report: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async getValidationReport(ideaId: string): Promise<ValidationReport | null> {
		try {
			const validation = await db.ideaValidation.findUnique({
				where: { ideaId },
			});

			if (!validation) {
				return null;
			}

			return validation.validationReport as unknown as ValidationReport;
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to get validation report:",
				error,
			);
			throw new Error(
				`Failed to get validation report: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	// ==========================================================================
	// UTILITY METHODS
	// ==========================================================================

	async getJobProgress(jobId: string): Promise<number> {
		try {
			const job = await this.getJob(jobId);

			if (job.totalTasks === 0) {
				return 0;
			}

			const completedTasks = await db.validationTaskResult.count({
				where: {
					jobId,
					status: { in: ["completed", "failed"] },
				},
			});

			return Math.round((completedTasks / job.totalTasks) * 100);
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to get job progress:",
				error,
			);
			throw new Error(
				`Failed to get job progress: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async isJobComplete(jobId: string): Promise<boolean> {
		try {
			const job = await this.getJob(jobId);

			const completedTasks = await db.validationTaskResult.count({
				where: {
					jobId,
					status: { in: ["completed", "failed"] },
				},
			});

			return completedTasks === job.totalTasks;
		} catch (error) {
			console.error(
				"[ValidationPersistence] Failed to check job completion:",
				error,
			);
			throw new Error(
				`Failed to check job completion: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async deleteJob(jobId: string): Promise<void> {
		try {
			await db.validationJob.delete({
				where: { id: jobId },
			});
		} catch (error) {
			console.error("[ValidationPersistence] Failed to delete job:", error);
			throw new Error(
				`Failed to delete job: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
}

// ============================================================================
// EXPORTS
// ============================================================================

export const validationPersistence = new ValidationPersistence();
