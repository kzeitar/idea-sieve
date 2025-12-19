import {
	runIdeaValidationAgent,
	type TaskResult,
	type ValidationInput,
	type ValidationJobDetails,
	type ValidationReport,
	validationPersistence,
} from "@idea-sieve/ai";
import { jobEvents } from "./job-events";

/**
 * Server-side validation service
 *
 * Provides a clean interface for running validations and querying results.
 * Delegates to the AI package's validation agent and persistence layer.
 */
export class ValidationService {
	/**
	 * Create a new validation job (without running validation yet)
	 */
	async createJob(ideaId: string): Promise<string> {
		try {
			return await validationPersistence.createJob(ideaId);
		} catch (error) {
			console.error("[ValidationService] Failed to create job:", error);
			throw error;
		}
	}

	/**
	 * Emit job update event with current job state
	 */
	private async emitJobUpdate(jobId: string): Promise<void> {
		try {
			const [job, tasks, progress, isComplete] = await Promise.all([
				validationPersistence.getJob(jobId),
				validationPersistence.getTaskResults(jobId),
				validationPersistence.getJobProgress(jobId),
				validationPersistence.isJobComplete(jobId),
			]);

			jobEvents.emitJobUpdate({
				jobId,
				job,
				tasks,
				progress: {
					progress,
					isComplete,
				},
			});
		} catch (error) {
			console.error(
				"[ValidationService] Failed to emit job update event:",
				error,
			);
		}
	}

	/**
	 * Run validation in the background (async, non-blocking)
	 */
	async runValidationInBackground(
		jobId: string,
		ideaId: string,
		input: ValidationInput,
	): Promise<void> {
		let pollInterval: Timer | null = null;

		try {
			await validationPersistence.updateJobStatus(jobId, "processing");
			await this.emitJobUpdate(jobId);

			// Start polling for updates every 2 seconds while validation runs
			pollInterval = setInterval(async () => {
				await this.emitJobUpdate(jobId);
			}, 2000);

			await runIdeaValidationAgent(ideaId, input);

			// Emit final update after completion
			await this.emitJobUpdate(jobId);
		} catch (error) {
			console.error(
				`[ValidationService] Background validation failed for job ${jobId}:`,
				error,
			);

			await validationPersistence.updateJobStatus(jobId, "failed");
			await this.emitJobUpdate(jobId);
		} finally {
			// Stop polling when validation completes or fails
			if (pollInterval) {
				clearInterval(pollInterval);
			}
		}
	}

	async getJobStatus(jobId: string): Promise<ValidationJobDetails> {
		try {
			return await validationPersistence.getJob(jobId);
		} catch (error) {
			console.error("[ValidationService] Failed to get job status:", error);
			throw error;
		}
	}

	async getTaskResults(jobId: string): Promise<TaskResult[]> {
		try {
			return await validationPersistence.getTaskResults(jobId);
		} catch (error) {
			console.error("[ValidationService] Failed to get task results:", error);
			throw error;
		}
	}

	async getValidationReport(ideaId: string): Promise<ValidationReport | null> {
		try {
			return await validationPersistence.getValidationReport(ideaId);
		} catch (error) {
			console.error(
				"[ValidationService] Failed to get validation report:",
				error,
			);
			throw error;
		}
	}

	async getJobsByIdeaId(ideaId: string): Promise<ValidationJobDetails[]> {
		try {
			return await validationPersistence.getJobsByIdeaId(ideaId);
		} catch (error) {
			console.error("[ValidationService] Failed to get jobs by idea:", error);
			throw error;
		}
	}

	async getJobProgress(jobId: string): Promise<number> {
		try {
			return await validationPersistence.getJobProgress(jobId);
		} catch (error) {
			console.error("[ValidationService] Failed to get job progress:", error);
			throw error;
		}
	}

	async isJobComplete(jobId: string): Promise<boolean> {
		try {
			return await validationPersistence.isJobComplete(jobId);
		} catch (error) {
			console.error(
				"[ValidationService] Failed to check job completion:",
				error,
			);
			throw error;
		}
	}
}

export const validationService = new ValidationService();
