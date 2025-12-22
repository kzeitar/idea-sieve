import type { ValidationInput, ValidationReport } from "@idea-sieve/ai";
import { ideasApi } from "./api-client";
import type { StoredValidation } from "./types";

/**
 * Get all validations from the database
 */
export async function getAllValidations(): Promise<StoredValidation[]> {
	try {
		const ideas = await ideasApi.list();

		const validations: StoredValidation[] = ideas.map((idea) => {
			// If validation exists, it's completed
			if (idea.validation) {
				return {
					id: idea.id,
					status: "completed" as const,
					input: {
						ideaName: idea.ideaName,
						ideaDescription: idea.ideaDescription,
						ideaType: idea.ideaType as any,
						targetAudience: idea.targetAudience || undefined,
						proposedFeatures: idea.proposedFeatures,
						customization: idea.customization,
					},
					report: idea.validation.validationReport as ValidationReport,
					createdAt: idea.createdAt,
					completedAt: idea.validation.validatedAt,
				};
			}

			// Check validation job status
			const validationJob = idea.validationJob;
			if (validationJob) {
				// Job failed
				if (validationJob.status === "failed") {
					return {
						id: idea.id,
						status: "error" as const,
						input: {
							ideaName: idea.ideaName,
							ideaDescription: idea.ideaDescription,
							ideaType: idea.ideaType as any,
							targetAudience: idea.targetAudience || undefined,
							proposedFeatures: idea.proposedFeatures,
							customization: idea.customization,
						},
						error: validationJob.error || "Validation failed",
						createdAt: idea.createdAt,
					};
				}

				// Job in progress
				if (
					validationJob.status === "processing" ||
					validationJob.status === "queued"
				) {
					return {
						id: idea.id,
						status: "in_progress" as const,
						input: {
							ideaName: idea.ideaName,
							ideaDescription: idea.ideaDescription,
							ideaType: idea.ideaType as any,
							targetAudience: idea.targetAudience || undefined,
							proposedFeatures: idea.proposedFeatures,
							customization: idea.customization,
						},
						tasks: validationJob.tasks,
						validationJobId: validationJob.id,
						createdAt: idea.createdAt,
					};
				}
			}

			// No validation and no active job - idea is pending validation
			return {
				id: idea.id,
				status: "in_progress" as const,
				input: {
					ideaName: idea.ideaName,
					ideaDescription: idea.ideaDescription,
					ideaType: idea.ideaType as any,
					targetAudience: idea.targetAudience || undefined,
					proposedFeatures: idea.proposedFeatures,
					customization: idea.customization,
				},
				createdAt: idea.createdAt,
			};
		});

		// Sort by creation date (newest first)
		return validations.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
	} catch (error) {
		console.error("Error fetching validations:", error);
		return [];
	}
}

/**
 * Get a single validation by ID from the database
 */
export async function getValidationById(
	id: string,
): Promise<StoredValidation | null> {
	try {
		const idea = await ideasApi.get(id);

		// If validation exists, it's completed
		if (idea.validation) {
			return {
				id: idea.id,
				status: "completed",
				input: {
					ideaName: idea.ideaName,
					ideaDescription: idea.ideaDescription,
					ideaType: idea.ideaType as any,
					targetAudience: idea.targetAudience || undefined,
					proposedFeatures: idea.proposedFeatures,
					customization: idea.customization,
				},
				report: idea.validation.validationReport as ValidationReport,
				createdAt: idea.createdAt,
				completedAt: idea.validation.validatedAt,
			};
		}

		// Check validation job status
		const validationJob = idea.validationJob;
		if (validationJob) {
			// Job failed
			if (validationJob.status === "failed") {
				return {
					id: idea.id,
					status: "error",
					input: {
						ideaName: idea.ideaName,
						ideaDescription: idea.ideaDescription,
						ideaType: idea.ideaType as any,
						targetAudience: idea.targetAudience || undefined,
						proposedFeatures: idea.proposedFeatures,
						customization: idea.customization,
					},
					error: validationJob.error || "Validation failed",
					createdAt: idea.createdAt,
				};
			}

			// Job in progress
			if (
				validationJob.status === "processing" ||
				validationJob.status === "queued"
			) {
				return {
					id: idea.id,
					status: "in_progress",
					input: {
						ideaName: idea.ideaName,
						ideaDescription: idea.ideaDescription,
						ideaType: idea.ideaType as any,
						targetAudience: idea.targetAudience || undefined,
						proposedFeatures: idea.proposedFeatures,
						customization: idea.customization,
					},
					tasks: validationJob.tasks,
					validationJobId: validationJob.id,
					createdAt: idea.createdAt,
				};
			}
		}

		// No validation and no active job - idea is pending validation
		return {
			id: idea.id,
			status: "in_progress",
			input: {
				ideaName: idea.ideaName,
				ideaDescription: idea.ideaDescription,
				ideaType: idea.ideaType as any,
				targetAudience: idea.targetAudience || undefined,
				proposedFeatures: idea.proposedFeatures,
				customization: idea.customization,
			},
			createdAt: idea.createdAt,
		};
	} catch (error) {
		console.error("Error fetching validation:", error);
		return null;
	}
}

/**
 * Create a new idea in the database
 * Returns the database ID
 */
export async function createInProgressValidation(
	input: ValidationInput,
): Promise<string> {
	try {
		// Create idea in database
		const idea = await ideasApi.create(input);
		return idea.id;
	} catch (error) {
		console.error("Error creating idea:", error);
		throw new Error("Failed to create idea. Please check your connection.");
	}
}

/**
 * Update an in-progress validation (no-op now, kept for compatibility)
 * Updates are handled server-side via SSE
 */
export function updateInProgressValidation(
	id: string,
	updates: { tasks?: any[]; error?: string },
): void {
	// No-op: Updates are handled server-side
	// Keeping this function for compatibility with existing code
	console.log(`Validation ${id} update (handled server-side):`, updates);
}

/**
 * Complete a validation - save to database
 */
export async function completeValidation(
	id: string,
	report: ValidationReport,
): Promise<void> {
	try {
		// Save validation to database
		await ideasApi.validate(id, report);
	} catch (error) {
		console.error("Error completing validation:", error);
		throw new Error("Failed to save validation result");
	}
}

/**
 * Delete a validation (deletes the idea)
 */
export async function deleteValidation(id: string): Promise<void> {
	try {
		// Delete from database
		await ideasApi.delete(id);
	} catch (error) {
		console.error("Error deleting validation:", error);
		throw new Error("Failed to delete validation");
	}
}
