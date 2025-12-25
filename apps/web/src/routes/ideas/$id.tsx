import type { ValidationInput } from "@idea-sieve/ai";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle2,
	ChevronDownIcon,
	Clock,
	FileText,
	ListChecks,
	Plus,
	Sparkles,
	XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { Loader } from "@/components/ai-elements/loader";
import {
	Task,
	TaskContent,
	TaskItem,
	TaskTrigger,
} from "@/components/ai-elements/task";
import { InputDetails } from "@/components/ideas/input-details";
import { ReportDetail } from "@/components/ideas/report-detail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useValidation } from "@/hooks/use-validation";
import type { StoredValidation } from "@/lib/types";

function ReportViewComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const { idea, validation, job, tasks, loading, error } = useValidation(id);

	// Convert the data into the format expected by components
	const validationInput = useMemo<ValidationInput | null>(() => {
		if (!idea) return null;

		return {
			ideaName: idea.ideaName,
			ideaDescription: idea.ideaDescription,
			ideaType: idea.ideaType as ValidationInput["ideaType"],
			targetAudience: idea.targetAudience || undefined,
			proposedFeatures: idea.proposedFeatures || [],
			customization: idea.customization || {},
		};
	}, [idea]);

	const storedValidation = useMemo<StoredValidation | null>(() => {
		if (!idea || !validation) return null;

		return {
			id: idea.id,
			status: "completed",
			input: {
				ideaName: idea.ideaName,
				ideaDescription: idea.ideaDescription,
				ideaType: idea.ideaType as ValidationInput["ideaType"],
				targetAudience: idea.targetAudience || undefined,
				proposedFeatures: idea.proposedFeatures || [],
				customization: idea.customization || {},
			},
			report: validation,
			createdAt: idea.validation?.createdAt || idea.createdAt,
			completedAt: job?.completedAt || idea.validation?.createdAt || undefined,
		};
	}, [idea, validation, job]);

	// Loading state
	if (loading && !idea) {
		return (
			<div className="container mx-auto max-w-5xl px-4 py-8">
				<div className="flex items-center justify-center py-12">
					<div className="flex flex-col items-center gap-4">
						<Loader size={40} className="text-primary" />
						<p className="text-muted-foreground">Loading idea...</p>
					</div>
				</div>
			</div>
		);
	}

	// Idea not found
	if (!loading && !idea) {
		return (
			<div className="container mx-auto max-w-5xl px-4 py-8">
				<div className="py-12 text-center">
					<AlertCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
					<h2 className="mb-2 font-bold text-2xl">Idea Not Found</h2>
					<p className="mb-6 text-muted-foreground">
						The idea you're looking for doesn't exist.
					</p>
					<Link to="/ideas">
						<Button>
							<ArrowLeft className="mr-2 size-4" />
							Back to Ideas
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	// Error state (job failed)
	if (error || job?.status === "failed") {
		return (
			<div className="container mx-auto max-w-5xl px-4 py-8">
				<div className="mb-8">
					<Button variant="ghost" onClick={() => navigate({ to: "/ideas" })}>
						<ArrowLeft className="mr-2 size-4" />
						Back to Ideas
					</Button>
				</div>
				<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
					<AlertCircle className="mx-auto mb-4 size-12 text-destructive" />
					<h2 className="mb-2 font-bold text-2xl text-destructive">
						Validation Failed
					</h2>
					<p className="mb-6 text-muted-foreground">
						{error || job?.error || "An error occurred during validation."}
					</p>
					<Button onClick={() => navigate({ to: "/ideas" })}>
						<ArrowLeft className="mr-2 size-4" />
						Back to Ideas
					</Button>
				</div>
			</div>
		);
	}

	// In-progress state (validation running)
	if (job && (job.status === "queued" || job.status === "processing")) {
		// Determine the current phase based on job status and tasks state
		const isQueued = job.status === "queued";
		const isPlanningPhase = job.status === "processing" && tasks.length === 0;
		const allTasksCompleted =
			tasks.length > 0 && tasks.every((task) => task.status === "completed");
		const isReportGenerationPhase =
			job.status === "processing" && allTasksCompleted;
		const isExecutionPhase =
			job.status === "processing" && tasks.length > 0 && !allTasksCompleted;

		// Calculate task statistics
		const completedTasksCount = tasks.filter(
			(t) => t.status === "completed",
		).length;
		const totalTasksCount = tasks.length;

		const sortedTasks = [...tasks].sort((a, b) => {
			if (a.status === "in_progress" && b.status !== "in_progress") return -1;
			if (a.status !== "in_progress" && b.status === "in_progress") return 1;
			return 0;
		});

		return (
			<div className="container mx-auto max-w-5xl px-4 py-8">
				<div className="mb-8">
					<Button variant="ghost" onClick={() => navigate({ to: "/ideas" })}>
						<ArrowLeft className="mr-2 size-4" />
						Back to Ideas
					</Button>
				</div>

				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-4 font-bold text-3xl">{idea?.ideaName}</h1>

					{/* Progress Stepper */}
					<div className="flex items-center gap-4">
						{/* Step 1: Planning */}
						<div className="flex items-center gap-2">
							<div
								className={`flex size-8 items-center justify-center rounded-full border-2 ${
									isPlanningPhase || isQueued
										? "border-primary bg-primary text-primary-foreground"
										: "border-green-600 bg-green-600 text-white"
								}`}
							>
								{isPlanningPhase || isQueued ? (
									<Loader size={16} />
								) : (
									<CheckCircle2 className="size-4" />
								)}
							</div>
							<span
								className={`text-sm ${isPlanningPhase || isQueued ? "font-medium" : "text-muted-foreground"}`}
							>
								Planning
							</span>
						</div>

						{/* Connector */}
						<div
							className={`h-0.5 w-12 ${isExecutionPhase || isReportGenerationPhase ? "bg-green-600" : "bg-muted"}`}
						/>

						{/* Step 2: Executing */}
						<div className="flex items-center gap-2">
							<div
								className={`flex size-8 items-center justify-center rounded-full border-2 ${
									isExecutionPhase
										? "border-primary bg-primary text-primary-foreground"
										: isReportGenerationPhase
											? "border-green-600 bg-green-600 text-white"
											: "border-muted bg-background"
								}`}
							>
								{isExecutionPhase ? (
									<Loader size={16} />
								) : isReportGenerationPhase ? (
									<CheckCircle2 className="size-4" />
								) : (
									<ListChecks className="size-4 text-muted-foreground" />
								)}
							</div>
							<span
								className={`text-sm ${isExecutionPhase ? "font-medium" : "text-muted-foreground"}`}
							>
								Executing
								{isExecutionPhase &&
									` (${completedTasksCount}/${totalTasksCount})`}
							</span>
						</div>

						{/* Connector */}
						<div
							className={`h-0.5 w-12 ${isReportGenerationPhase ? "bg-green-600" : "bg-muted"}`}
						/>

						{/* Step 3: Report */}
						<div className="flex items-center gap-2">
							<div
								className={`flex size-8 items-center justify-center rounded-full border-2 ${
									isReportGenerationPhase
										? "border-primary bg-primary text-primary-foreground"
										: "border-muted bg-background"
								}`}
							>
								{isReportGenerationPhase ? (
									<Loader size={16} />
								) : (
									<FileText className="size-4 text-muted-foreground" />
								)}
							</div>
							<span
								className={`text-sm ${isReportGenerationPhase ? "font-medium" : "text-muted-foreground"}`}
							>
								Report
							</span>
						</div>
					</div>
				</div>

				{/* Current Phase Content */}
				<div className="space-y-6">
					{/* Queued/Planning Phase */}
					{(isQueued || isPlanningPhase) && (
						<div className="rounded-lg border border-primary/50 bg-primary/5 p-8 text-center">
							<Sparkles className="mx-auto mb-4 size-12 animate-pulse text-primary" />
							<h2 className="mb-2 font-semibold text-xl">
								{isQueued ? "Starting Validation" : "Planning Validation"}
							</h2>
							<p className="text-muted-foreground">
								{isQueued
									? "Your validation request is being processed..."
									: "AI is analyzing your idea and creating a comprehensive validation plan..."}
							</p>
						</div>
					)}

					{/* Execution Phase */}
					{isExecutionPhase && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="font-semibold text-xl">Validation Tasks</h2>
								<span className="text-muted-foreground text-sm">
									{completedTasksCount} of {totalTasksCount} completed
								</span>
							</div>

							<div className="space-y-3">
								{sortedTasks.map((task) => {
									const taskIcon =
										task.status === "completed" ? (
											<CheckCircle2 className="size-5 text-green-600" />
										) : task.status === "in_progress" ? (
											<Loader size={20} className="text-primary" />
										) : task.status === "failed" ? (
											<XCircle className="size-5 text-destructive" />
										) : (
											<Clock className="size-5 text-muted-foreground" />
										);

									return (
										<Task key={task.id} defaultOpen={task.status !== "pending"}>
											<div className="rounded-lg border p-4">
												<TaskTrigger title="">
													<div className="flex w-full cursor-pointer items-center gap-3 text-sm transition-colors hover:text-foreground">
														{taskIcon}
														<div className="flex-1 text-left">
															<p className="font-medium">{task.title}</p>
															<p className="text-muted-foreground text-xs">
																{task.description}
															</p>
														</div>
														<ChevronDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
													</div>
												</TaskTrigger>

												<TaskContent>
													{task.result && task.status === "completed" && (
														<TaskItem>
															<p className="text-sm">{task.result}</p>
														</TaskItem>
													)}
													{task.error && (
														<TaskItem>
															<p className="text-destructive text-sm">
																{task.error}
															</p>
														</TaskItem>
													)}
													{task.status === "in_progress" && (
														<TaskItem>
															<div className="flex items-center gap-2">
																<Loader size={16} />
																<p className="text-muted-foreground text-sm">
																	Research in progress...
																</p>
															</div>
														</TaskItem>
													)}
												</TaskContent>
											</div>
										</Task>
									);
								})}
							</div>
						</div>
					)}

					{/* Report Generation Phase */}
					{isReportGenerationPhase && (
						<>
							{/* Report Generation Banner */}
							<div className="rounded-lg border-2 border-primary bg-primary/5 p-8 text-center">
								<Sparkles className="mx-auto mb-4 size-12 animate-pulse text-primary" />
								<h2 className="mb-2 font-semibold text-xl">
									Generating Your Report
								</h2>
								<p className="text-muted-foreground">
									AI is synthesizing all research findings into a comprehensive
									validation report...
								</p>
							</div>

							{/* Completed Tasks Summary */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h2 className="font-semibold text-xl">
										Validation Tasks Complete
									</h2>
									<span className="flex items-center gap-2 text-green-600 text-sm">
										<CheckCircle2 className="size-4" />
										{totalTasksCount} tasks completed
									</span>
								</div>

								<div className="space-y-2">
									{tasks.map((task) => (
										<Task key={task.id} defaultOpen={false}>
											<div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
												<TaskTrigger title="">
													<div className="flex w-full cursor-pointer items-center gap-3 text-sm transition-colors">
														<CheckCircle2 className="size-4 shrink-0 text-green-600" />
														<div className="flex-1 text-left">
															<p className="font-medium text-sm">
																{task.title}
															</p>
														</div>
														<ChevronDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
													</div>
												</TaskTrigger>

												<TaskContent>
													{task.result && (
														<TaskItem>
															<p className="text-sm">{task.result}</p>
														</TaskItem>
													)}
												</TaskContent>
											</div>
										</Task>
									))}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		);
	}

	// No validation exists yet
	if (!validation) {
		return (
			<div className="container mx-auto max-w-5xl px-4 py-8">
				<div className="mb-8">
					<Button variant="ghost" onClick={() => navigate({ to: "/ideas" })}>
						<ArrowLeft className="mr-2 size-4" />
						Back to Ideas
					</Button>
				</div>
				<div className="rounded-lg border bg-muted/50 p-12 text-center">
					<FileText className="mx-auto mb-4 size-16 text-muted-foreground" />
					<h2 className="mb-2 font-bold text-2xl">No Validation Yet</h2>
					<p className="mb-6 text-muted-foreground">
						This idea hasn't been validated yet. Start a validation to get
						insights about market viability, competition, and recommendations.
					</p>
					<Link to="/ideas">
						<Button>
							<ArrowLeft className="mr-2 size-4" />
							Back to Ideas
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	// Completed validation report
	if (!storedValidation) {
		return null;
	}

	return (
		<div className="container mx-auto max-w-5xl px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<Button variant="ghost" onClick={() => navigate({ to: "/ideas" })}>
					<ArrowLeft className="mr-2 size-4" />
					Back to Ideas
				</Button>
				<Link to="/ideas/new">
					<Button>
						<Plus className="mr-2 size-4" />
						Validate Another
					</Button>
				</Link>
			</div>

			<Tabs defaultValue="report" className="space-y-6">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="report">Validation Report</TabsTrigger>
					<TabsTrigger value="input">Input Details</TabsTrigger>
				</TabsList>

				<TabsContent value="report">
					<ReportDetail validation={storedValidation} />
				</TabsContent>

				<TabsContent value="input">
					{validationInput && <InputDetails input={validationInput} />}
				</TabsContent>
			</Tabs>
		</div>
	);
}

export const Route = createFileRoute("/ideas/$id")({
	component: ReportViewComponent,
});
