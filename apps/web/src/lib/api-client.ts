import type { ValidationInput, ValidationReport } from "@idea-sieve/ai";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// ============================================================================
// IDEAS API
// ============================================================================

export interface Idea {
	id: string;
	ideaName: string;
	ideaDescription: string;
	ideaType: string;
	targetAudience: string | null;
	proposedFeatures: string[];
	customization: any;
	createdAt: string;
	updatedAt: string;
	validation?: IdeaValidation | null;
	validationJob?: ValidationJob | null;
}

export interface IdeaValidation {
	id: string;
	ideaId: string;
	overallScore: number;
	recommendation: string;
	validationReport: ValidationReport;
	validatedAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface ValidationJob {
	id: string;
	ideaId: string;
	status: "queued" | "processing" | "completed" | "failed";
	error?: string | null;
	tasks?: any[];
	startedAt?: string | null;
	completedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export const ideasApi = {
	async list(): Promise<Idea[]> {
		const response = await fetch(`${API_BASE_URL}/api/ideas`);
		const result: ApiResponse<Idea[]> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch ideas");
		}

		return result.data || [];
	},

	async get(id: string): Promise<Idea> {
		const response = await fetch(`${API_BASE_URL}/api/ideas/${id}`);
		const result: ApiResponse<Idea> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch idea");
		}

		if (!result.data) {
			throw new Error("Idea not found");
		}

		return result.data;
	},

	async create(input: ValidationInput): Promise<Idea> {
		const response = await fetch(`${API_BASE_URL}/api/ideas`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ideaName: input.ideaName,
				ideaDescription: input.ideaDescription,
				ideaType: input.ideaType,
				targetAudience: input.targetAudience,
				proposedFeatures: input.proposedFeatures,
				customization: input.customization,
			}),
		});

		const result: ApiResponse<Idea> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to create idea");
		}

		if (!result.data) {
			throw new Error("Failed to create idea");
		}

		return result.data;
	},

	async validate(
		id: string,
		report: ValidationReport,
	): Promise<IdeaValidation> {
		const response = await fetch(`${API_BASE_URL}/api/ideas/${id}/validate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				validationReport: report,
				overallScore: report.overallScore,
				recommendation: report.recommendation,
			}),
		});

		const result: ApiResponse<IdeaValidation> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to validate idea");
		}

		if (!result.data) {
			throw new Error("Failed to validate idea");
		}

		return result.data;
	},

	async delete(id: string): Promise<void> {
		const response = await fetch(`${API_BASE_URL}/api/ideas/${id}`, {
			method: "DELETE",
		});

		const result: ApiResponse<void> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to delete idea");
		}
	},
};

// ============================================================================
// FRAMEWORKS API
// ============================================================================

export interface Framework {
	id: string;
	ideaType: string;
	name: string;
	version: string;
	description: string;
	frameworkData: any;
	createdAt: string;
	updatedAt: string;
}

export const frameworksApi = {
	async list(): Promise<Framework[]> {
		const response = await fetch(`${API_BASE_URL}/api/frameworks`);
		const result: ApiResponse<Framework[]> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch frameworks");
		}

		return result.data || [];
	},

	async get(ideaType: string): Promise<Framework> {
		const response = await fetch(`${API_BASE_URL}/api/frameworks/${ideaType}`);
		const result: ApiResponse<Framework> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch framework");
		}

		if (!result.data) {
			throw new Error("Framework not found");
		}

		return result.data;
	},
};

// ============================================================================
// VALIDATION API
// ============================================================================

export interface ValidationJobDetails {
	id: string;
	ideaId: string;
	status: "queued" | "processing" | "completed" | "failed";
	currentTaskIndex: number;
	totalTasks: number;
	validationId: string | null;
	error: string | null;
	createdAt: string;
	updatedAt: string;
	startedAt: string | null;
	completedAt: string | null;
}

export interface TaskResult {
	id: string;
	jobId: string;
	taskId: string;
	title: string;
	description: string;
	status: "pending" | "in_progress" | "completed" | "failed";
	result: string | null;
	error: string | null;
	createdAt: string;
	updatedAt: string;
	startedAt: string | null;
	completedAt: string | null;
}

export const validationApi = {
	async startValidation(
		ideaId: string,
		input: ValidationInput,
	): Promise<{ jobId: string; status: string }> {
		const response = await fetch(`${API_BASE_URL}/api/validate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ideaId, input }),
		});

		const result: ApiResponse<{ jobId: string; status: string }> =
			await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to start validation");
		}

		if (!result.data) {
			throw new Error("Failed to start validation");
		}

		return result.data;
	},

	async getJobStatus(jobId: string): Promise<ValidationJobDetails> {
		const response = await fetch(`${API_BASE_URL}/api/validate/jobs/${jobId}`);
		const result: ApiResponse<ValidationJobDetails> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch job status");
		}

		if (!result.data) {
			throw new Error("Job not found");
		}

		return result.data;
	},

	async getJobProgress(
		jobId: string,
	): Promise<{ progress: number; isComplete: boolean }> {
		const response = await fetch(
			`${API_BASE_URL}/api/validate/jobs/${jobId}/progress`,
		);
		const result: ApiResponse<{ progress: number; isComplete: boolean }> =
			await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch job progress");
		}

		if (!result.data) {
			throw new Error("Progress not found");
		}

		return result.data;
	},

	async getTaskResults(jobId: string): Promise<TaskResult[]> {
		const response = await fetch(
			`${API_BASE_URL}/api/validate/jobs/${jobId}/tasks`,
		);
		const result: ApiResponse<TaskResult[]> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch task results");
		}

		return result.data || [];
	},

	async getJobsByIdeaId(ideaId: string): Promise<ValidationJobDetails[]> {
		const response = await fetch(
			`${API_BASE_URL}/api/validate/ideas/${ideaId}/jobs`,
		);
		const result: ApiResponse<ValidationJobDetails[]> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch jobs");
		}

		return result.data || [];
	},

	async getValidationReport(ideaId: string): Promise<ValidationReport | null> {
		const response = await fetch(
			`${API_BASE_URL}/api/validate/ideas/${ideaId}/validation`,
		);
		const result: ApiResponse<ValidationReport | null> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch validation report");
		}

		return result.data || null;
	},
};

// ============================================================================
// STATS API
// ============================================================================

export interface ValidationStats {
	total: number;
	averageScore: number;
	recommendationCounts: {
		BUILD_NOW: number;
		BUILD_WITH_CAUTION: number;
		PIVOT_REQUIRED: number;
		DO_NOT_BUILD: number;
	};
	recentValidations: Array<{
		id: string;
		status: string;
		input: ValidationInput;
		report?: ValidationReport;
		createdAt: string;
		completedAt?: string;
	}>;
}

export const statsApi = {
	async get(): Promise<ValidationStats> {
		const response = await fetch(`${API_BASE_URL}/api/stats`);
		const result: ApiResponse<ValidationStats> = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch statistics");
		}

		if (!result.data) {
			throw new Error("Statistics not found");
		}

		return result.data;
	},
};
