import type { ValidationReport } from "@idea-sieve/ai";
import { useCallback, useEffect, useState } from "react";
import {
	type Idea,
	ideasApi,
	type TaskResult,
	type ValidationJobDetails,
	validationApi,
} from "@/lib/api-client";

export interface UseValidationReturn {
	idea: Idea | null;
	validation: ValidationReport | null;
	job: ValidationJobDetails | null;
	tasks: TaskResult[];
	progress: { progress: number; isComplete: boolean } | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	startValidation: () => Promise<void>;
}

/**
 * Hook for managing idea validation workflow
 *
 * Handles fetching idea, validation report, job status, and tasks
 */
export function useValidation(ideaId: string): UseValidationReturn {
	const [idea, setIdea] = useState<Idea | null>(null);
	const [validation, setValidation] = useState<ValidationReport | null>(null);
	const [job, setJob] = useState<ValidationJobDetails | null>(null);
	const [tasks, setTasks] = useState<TaskResult[]>([]);
	const [progress, setProgress] = useState<{
		progress: number;
		isComplete: boolean;
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const ideaData = await ideasApi.get(ideaId);
			setIdea(ideaData);

			const validationReport = await validationApi.getValidationReport(ideaId);
			setValidation(validationReport);

			const jobs = await validationApi.getJobsByIdeaId(ideaId);
			const latestJob = jobs.length > 0 ? jobs[0] : null;
			setJob(latestJob);

			if (latestJob) {
				const [jobTasks, jobProgress] = await Promise.all([
					validationApi.getTaskResults(latestJob.id),
					validationApi.getJobProgress(latestJob.id),
				]);
				setTasks(jobTasks);
				setProgress(jobProgress);
			}
		} catch (err) {
			console.error("Error fetching validation data:", err);
			setError(err instanceof Error ? err.message : "Failed to fetch data");
		} finally {
			setLoading(false);
		}
	}, [ideaId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// SSE connection for real-time updates
	useEffect(() => {
		if (!job || (job.status !== "queued" && job.status !== "processing")) {
			return;
		}

		const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
		const eventSource = new EventSource(
			`${apiUrl}/api/validate/jobs/${job.id}/stream`,
		);

		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				// Update all state from SSE message
				setJob(data.job);
				setTasks(data.tasks);
				setProgress(data.progress);

				// If job is complete, fetch the validation report
				if (data.job.status === "completed") {
					validationApi
						.getValidationReport(ideaId)
						.then((validationReport) => {
							setValidation(validationReport);
						})
						.catch((err) => {
							console.error("Error fetching validation report:", err);
						});
					eventSource.close();
				} else if (data.job.status === "failed") {
					setError(data.job.error || "Validation failed");
					eventSource.close();
				}
			} catch (err) {
				console.error("Error parsing SSE message:", err);
			}
		};

		eventSource.onerror = (err) => {
			console.error("SSE connection error:", err);
			// EventSource will automatically try to reconnect
			// The SSE endpoint also has fallback polling, so no need to refetch here
		};

		return () => {
			eventSource.close();
		};
	}, [job?.id, job?.status, ideaId]);

	const startValidation = useCallback(async () => {
		if (!idea) {
			throw new Error("Idea not loaded");
		}

		try {
			setLoading(true);
			setError(null);

			const input = {
				ideaName: idea.ideaName,
				ideaDescription: idea.ideaDescription,
				ideaType: idea.ideaType as any,
				targetAudience: idea.targetAudience || undefined,
				proposedFeatures: idea.proposedFeatures,
				customization: idea.customization,
			};

			const result = await validationApi.startValidation(ideaId, input);
			setJob({
				id: result.jobId,
				status: result.status,
			} as ValidationJobDetails);

			await fetchData();
		} catch (err) {
			console.error("Error starting validation:", err);
			setError(
				err instanceof Error ? err.message : "Failed to start validation",
			);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [idea, ideaId, fetchData]);

	return {
		idea,
		validation,
		job,
		tasks,
		progress,
		loading,
		error,
		refetch: fetchData,
		startValidation,
	};
}
