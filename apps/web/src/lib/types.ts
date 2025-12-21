import type {
	TodoItem,
	ValidationInput,
	ValidationReport,
} from "@idea-sieve/ai";

/**
 * Validation status during lifecycle
 */
export type ValidationStatus = "in_progress" | "completed" | "error";

/**
 * Storage wrapper type for validated ideas
 */
export interface StoredValidation {
	id: string;
	status: ValidationStatus;
	input: ValidationInput;
	report?: ValidationReport; // Optional during in_progress
	tasks?: TodoItem[]; // Live task list from AI agent
	error?: string; // Error message if status is "error"
	validationJobId?: string; // ID of the validation job if one exists
	createdAt: string; // ISO timestamp
	completedAt?: string; // ISO timestamp when validation completed
}
