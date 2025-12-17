import { createOpenAI } from "@ai-sdk/openai";
import { tavilySearch } from "@tavily/ai-sdk";
import { generateText, Output, stepCountIs } from "ai";
import { createRetryable } from "ai-retry";
import { retryAfterDelay } from "ai-retry/retryables";
import { z } from "zod";
import {
	AI_IDEA_VALIDATOR_SYSTEM_PROMPT,
	buildValidationPrompt,
	type ValidationInput,
} from "../prompts/validator-prompt";
import { validationReportSchema } from "../schemas/validation-report.schema";
import type { ValidationReport } from "../types";
import {
	type Task,
	type TaskStatus,
	ValidationPersistence,
} from "./validation-persistence";

// ============================================================================
// AI CONFIGURATION
// ============================================================================

const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Two-tier model strategy for cost optimization
const cheapModel = createRetryable({
	model: openai("gpt-5-mini"),
	retries: [
		retryAfterDelay({ delay: 1_000, backoffFactor: 2, maxAttempts: 3 }),
	],
}); // Fast, cheap model for research tasks
const expensiveModel = createRetryable({
	model: openai("gpt-5.2"),
	retries: [
		retryAfterDelay({ delay: 1_000, backoffFactor: 2, maxAttempts: 3 }),
	],
}); // High-quality model for final analysis

// ============================================================================
// VALIDATION CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG = {
	maxSearchesPerTask: 3,
	targetTaskCount: { min: 4, max: 6 },
};

// ============================================================================
// AGENT WORKFLOW STEPS
// ============================================================================

/**
 * Step 1: Generate a structured task list for validating the idea
 */
async function planValidationTasks(input: ValidationInput): Promise<Task[]> {
	console.log("[AGENT] Planning validation tasks...");

	const tone = input.customization?.validationTone || "balanced";
	const focusAreas = input.customization?.focusAreas || [];

	const { output: taskPlan } = await generateText({
		model: cheapModel,
		system: AI_IDEA_VALIDATOR_SYSTEM_PROMPT,
		output: Output.object({
			schema: z.object({
				tasks: z.array(
					z.object({
						title: z.string(),
						description: z.string(),
						priority: z.enum(["critical", "high", "medium", "low"]),
					}),
				),
			}),
		}),
		prompt: `You are planning validation tasks for this idea. Create a focused, efficient validation plan.

Idea: ${input.ideaName}
Type: ${input.ideaType}
Description: ${input.ideaDescription}
${input.targetAudience ? `Target Audience: ${input.targetAudience}` : ""}
Validation Tone: ${tone.toUpperCase()}
${focusAreas.length > 0 ? `Focus Areas: ${focusAreas.join(", ")}` : ""}

IMPORTANT: Create ${DEFAULT_CONFIG.targetTaskCount.min}-${DEFAULT_CONFIG.targetTaskCount.max} HIGH-VALUE tasks that:
1. Cover market research, competition, demand validation, and business model
2. Combine multiple objectives in single tasks where possible
3. Prioritize critical assumptions that make or break the idea
4. Focus on validation over exploration
5. Each task gets up to ${DEFAULT_CONFIG.maxSearchesPerTask} web searches

Generate tasks that are specific, measurable, and focused on gathering evidence.
Each task should validate a key assumption or answer a critical question.

Return ONLY the task list, no additional commentary.`,
	});

	const tasks: Task[] = taskPlan.tasks.map((task, index) => ({
		id: `task_${index + 1}`,
		title: task.title,
		description: task.description,
		status: "pending" as TaskStatus,
	}));

	console.log(`[AGENT] Generated ${tasks.length} validation tasks`);

	return tasks;
}

/**
 * Step 2: Execute a single validation task
 */
async function executeValidationTask(
	input: ValidationInput,
	task: Task,
	previousResults: string[],
): Promise<string> {
	console.log(`[AGENT] Executing task: ${task.title}`);

	const contextFromPreviousTasks =
		previousResults.length > 0
			? `\n\nContext from previous tasks:\n${previousResults.join("\n\n")}`
			: "";

	const tone = input.customization?.validationTone || "balanced";

	const { text: result } = await generateText({
		model: cheapModel,
		system: AI_IDEA_VALIDATOR_SYSTEM_PROMPT,
		tools: {
			webSearch: tavilySearch({ apiKey: process.env.TAVILY_API_KEY }),
		},
		stopWhen: stepCountIs(DEFAULT_CONFIG.maxSearchesPerTask + 1), // +1 for final response step
		prompt: `You are conducting startup idea validation research with ${tone.toUpperCase()} tone.

Original Idea: ${input.ideaName} (${input.ideaType})
Description: ${input.ideaDescription}
${input.targetAudience ? `Target Audience: ${input.targetAudience}` : ""}

Current Task: ${task.title}
Description: ${task.description}
${contextFromPreviousTasks}

CRITICAL CONSTRAINTS:
- You have EXACTLY ${DEFAULT_CONFIG.maxSearchesPerTask} web searches for this task
- Use searches strategically and sparingly
- After completing your searches (or if no searches needed), you MUST provide your final findings immediately

Execute this validation task efficiently:
1. Plan before searching - know exactly what you need
2. Use specific, targeted search queries
3. Gather specific, actionable evidence
4. Focus on data that validates or invalidates key assumptions
5. After gathering evidence, IMMEDIATELY provide your final findings and STOP

IMPORTANT: After your final search (or if you don't need to search), you must IMMEDIATELY provide your findings. Do not make additional tool calls.

Provide your findings in 200-300 words. Include:
- Key discoveries and evidence
- Data points or metrics found
- Insights relevant to the idea's viability
- Any critical assumptions tested

Be specific and analytical. Once you provide your findings, your task is complete.`,
	});

	console.log(`[AGENT] Completed task: ${task.title}`);

	return result;
}

/**
 * Step 3: Generate the final validation report
 */
async function generateValidationReport(
	input: ValidationInput,
	tasks: Task[],
	taskResults: Map<string, string>,
): Promise<ValidationReport> {
	console.log("[AGENT] Generating final validation report...");

	const allFindings = Array.from(taskResults.entries())
		.map(([taskId, result]) => {
			const task = tasks.find((t) => t.id === taskId);
			return `**Task: ${task?.title}**\n${result}`;
		})
		.join("\n\n---\n\n");

	const tone = input.customization?.validationTone || "balanced";

	const validationPrompt = buildValidationPrompt(input);

	const { output: report } = await generateText({
		model: expensiveModel,
		system: AI_IDEA_VALIDATOR_SYSTEM_PROMPT,
		output: Output.object({ schema: validationReportSchema }),
		prompt: `${validationPrompt}

VALIDATION RESEARCH FINDINGS:
${allFindings}

Based on all the validation tasks performed above, generate a comprehensive validation report.

CRITICAL INSTRUCTIONS:
1. Use ${tone.toUpperCase()} tone as specified in the system prompt
2. Base your analysis on the research findings above
3. Be specific and data-driven - cite actual findings from the research
4. Provide actionable next steps with success criteria
5. Match your recommendation (BUILD_NOW/BUILD_WITH_CAUTION/PIVOT_REQUIRED/DO_NOT_BUILD) to the evidence
6. Follow the recommendation-specific guidance:
   - BUILD_NOW: Populate buildRecommendations, empty pivotRecommendations and alternativeDirections
   - BUILD_WITH_CAUTION: Populate buildRecommendations and pivotRecommendations, empty alternativeDirections
   - PIVOT_REQUIRED: Empty buildRecommendations, populate pivotRecommendations and alternativeDirections
   - DO_NOT_BUILD: Empty buildRecommendations, populate pivotRecommendations and alternativeDirections

Generate the complete validation report now.`,
	});

	console.log(
		`[AGENT] Report generated with verdict: ${report.recommendation}`,
	);

	return report as ValidationReport;
}

// ============================================================================
// MAIN AGENT WORKFLOW ORCHESTRATOR
// ============================================================================

/**
 * Main workflow: Orchestrates the entire idea validation process
 *
 * Workflow steps:
 * 1. Create validation job in database
 * 2. Plan validation tasks using AI
 * 3. Persist task list
 * 4. Execute tasks sequentially with progress tracking
 * 5. Generate final validation report
 * 6. Persist report and complete job
 *
 * @param ideaId - The ID of the idea to validate
 * @param input - Validation input with idea details and customization
 *
 * @returns Promise resolving to the validation report and job ID
 */
export async function runIdeaValidationAgent(
	ideaId: string,
	input: ValidationInput,
): Promise<{ jobId: string; report: ValidationReport }> {
	const startTime = Date.now();
	console.log(`\n${"=".repeat(80)}`);
	console.log(`[WORKFLOW] Starting validation for idea: ${ideaId}`);
	console.log(`[WORKFLOW] Idea: ${input.ideaName} (${input.ideaType})`);
	console.log(`[WORKFLOW] Start time: ${new Date().toISOString()}`);
	console.log(`${"=".repeat(80)}\n`);

	const persistence = new ValidationPersistence();

	// -------------------------------------------------------------------------
	// PHASE 1: JOB INITIALIZATION
	// -------------------------------------------------------------------------
	console.log("[PHASE 1] JOB INITIALIZATION - Starting...");
	const jobId = await persistence.createJob(ideaId);
	console.log(`[PHASE 1] ✓ Created job: ${jobId}`);

	try {
		await persistence.updateJobStatus(jobId, "processing");
		console.log(`[PHASE 1] ✓ Job status set to 'processing'\n`);

		// -----------------------------------------------------------------------
		// PHASE 2: TASK PLANNING
		// -----------------------------------------------------------------------
		console.log("[PHASE 2] TASK PLANNING - Starting...");
		const planStart = Date.now();
		const tasks = await planValidationTasks(input);
		console.log(
			`[PHASE 2] ✓ Generated ${tasks.length} tasks in ${Date.now() - planStart}ms`,
		);

		const saveStart = Date.now();
		await persistence.saveTaskList(jobId, tasks);
		console.log(
			`[PHASE 2] ✓ Saved ${tasks.length} tasks to database in ${Date.now() - saveStart}ms`,
		);
		console.log(`[PHASE 2] Task IDs: ${tasks.map((t) => t.id).join(", ")}\n`);

		// -----------------------------------------------------------------------
		// PHASE 3: SEQUENTIAL TASK EXECUTION
		// -----------------------------------------------------------------------
		console.log(`[PHASE 3] TASK EXECUTION - Starting ${tasks.length} tasks...`);
		const taskResults = new Map<string, string>();
		const previousResults: string[] = [];

		for (let i = 0; i < tasks.length; i++) {
			const task = tasks[i] as Task;

			const taskStartTime = Date.now();
			console.log(`\n${"─".repeat(80)}`);
			console.log(`[PHASE 3] Task ${i + 1}/${tasks.length}: ${task.id}`);
			console.log(`[PHASE 3] Title: ${task.title}`);
			console.log(`[PHASE 3] Start time: ${new Date().toISOString()}`);

			try {
				await persistence.updateJobProgress(jobId, i);
				console.log(`[PHASE 3] ✓ Updated job progress to ${i}`);

				await persistence.updateTaskStatus(jobId, task.id, "in_progress");
				console.log(`[PHASE 3] ✓ Task status set to 'in_progress'`);

				console.log("[PHASE 3] Executing task...");
				const execStart = Date.now();
				const result = await executeValidationTask(
					input,
					task,
					previousResults,
				);
				console.log(`[PHASE 3] ✓ Task executed in ${Date.now() - execStart}ms`);
				console.log(`[PHASE 3] Result length: ${result.length} chars`);

				taskResults.set(task.id, result);
				previousResults.push(`${task.title}: ${result}`);

				console.log("[PHASE 3] Saving task result...");
				await persistence.saveTaskResult(jobId, task.id, result);
				console.log("[PHASE 3] ✓ Task result saved");

				await persistence.updateTaskStatus(jobId, task.id, "completed");
				console.log(`[PHASE 3] ✓ Task status set to 'completed'`);

				const taskDuration = Date.now() - taskStartTime;
				console.log(
					`[PHASE 3] ✅ Task ${i + 1}/${tasks.length} completed in ${taskDuration}ms`,
				);
			} catch (error) {
				const taskDuration = Date.now() - taskStartTime;
				console.error(
					`[PHASE 3] ❌ Task ${task.id} FAILED after ${taskDuration}ms`,
				);
				console.error(
					`[PHASE 3] Error type: ${error instanceof Error ? error.constructor.name : typeof error}`,
				);
				console.error(
					"[PHASE 3] Error message:",
					error instanceof Error ? error.message : String(error),
				);
				console.error("[PHASE 3] Full error:", error);

				const errorMessage = `Task failed: ${error instanceof Error ? error.message : "Unknown error"}`;
				taskResults.set(task.id, errorMessage);

				try {
					await persistence.saveTaskResult(jobId, task.id, errorMessage, true);
					console.log("[PHASE 3] ✓ Error saved to database");
				} catch (saveError) {
					console.error(
						"[PHASE 3] ❌ CRITICAL: Failed to save error to database:",
						saveError,
					);
				}

				try {
					await persistence.updateTaskStatus(jobId, task.id, "failed");
					console.log(`[PHASE 3] ✓ Task status set to 'failed'`);
				} catch (statusError) {
					console.error(
						"[PHASE 3] ❌ CRITICAL: Failed to update task status:",
						statusError,
					);
				}
			}
		}
		console.log(`\n${"─".repeat(80)}`);
		console.log("[PHASE 3] ✅ All tasks completed\n");

		// -----------------------------------------------------------------------
		// PHASE 4: REPORT GENERATION
		// -----------------------------------------------------------------------
		console.log("[PHASE 4] REPORT GENERATION - Starting...");
		console.log(`[PHASE 4] Task results collected: ${taskResults.size}`);
		const reportStart = Date.now();

		const report = await generateValidationReport(input, tasks, taskResults);

		const reportDuration = Date.now() - reportStart;
		console.log(`[PHASE 4] ✓ Report generated in ${reportDuration}ms`);
		console.log(`[PHASE 4] Recommendation: ${report.recommendation}`);
		console.log(`[PHASE 4] Overall score: ${report.overallScore}/10`);

		console.log("[PHASE 4] Saving report to database...");
		await persistence.saveValidationReport(jobId, ideaId, report);
		console.log("[PHASE 4] ✓ Report saved to database\n");

		// -----------------------------------------------------------------------
		// PHASE 5: JOB COMPLETION
		// -----------------------------------------------------------------------
		console.log("[PHASE 5] JOB COMPLETION - Finalizing...");
		await persistence.updateJobStatus(jobId, "completed");
		console.log(`[PHASE 5] ✓ Job status set to 'completed'`);

		const totalDuration = Date.now() - startTime;
		console.log(`\n${"=".repeat(80)}`);
		console.log("[WORKFLOW] ✅ VALIDATION COMPLETE");
		console.log(`[WORKFLOW] Job ID: ${jobId}`);
		console.log(
			`[WORKFLOW] Total duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(1)}s)`,
		);
		console.log(
			`[WORKFLOW] Final verdict: ${report.recommendation} (${report.overallScore}/10)`,
		);
		console.log(`[WORKFLOW] End time: ${new Date().toISOString()}`);
		console.log(`${"=".repeat(80)}\n`);

		return { jobId, report };
	} catch (error) {
		const totalDuration = Date.now() - startTime;
		console.error(`\n${"=".repeat(80)}`);
		console.error("[WORKFLOW] ❌ FATAL ERROR");
		console.error(`[WORKFLOW] Job ID: ${jobId}`);
		console.error(
			`[WORKFLOW] Failed after: ${totalDuration}ms (${(totalDuration / 1000).toFixed(1)}s)`,
		);
		console.error(
			`[WORKFLOW] Error type: ${error instanceof Error ? error.constructor.name : typeof error}`,
		);
		console.error(
			"[WORKFLOW] Error message:",
			error instanceof Error ? error.message : String(error),
		);
		console.error("[WORKFLOW] Full error:", error);
		console.error(`${"=".repeat(80)}\n`);

		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		try {
			await persistence.updateJobError(jobId, errorMessage);
			console.error("[WORKFLOW] ✓ Error saved to database");
		} catch (dbError) {
			console.error(
				"[WORKFLOW] ❌ CRITICAL: Failed to save error to database:",
				dbError,
			);
		}

		throw error;
	}
}
