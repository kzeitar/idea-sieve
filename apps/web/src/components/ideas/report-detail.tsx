import {
	AlertTriangle,
	CheckCircle2,
	Compass,
	Lightbulb,
	RefreshCcw,
	Rocket,
	Target,
	TrendingUp,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/date-utils";
import type { StoredValidation } from "@/lib/types";
import { RecommendationBadge } from "./recommendation-badge";
import { ScoreBadge } from "./score-badge";

interface ReportDetailProps {
	validation: StoredValidation;
}

export function ReportDetail({ validation }: ReportDetailProps) {
	const { report } = validation;

	if (!report) {
		return (
			<div className="rounded-lg border border-orange-200 bg-orange-50 p-12 text-center dark:border-orange-900 dark:bg-orange-950">
				<AlertTriangle className="mx-auto mb-4 size-16 text-orange-500" />
				<h3 className="mb-2 font-bold text-xl">Report Not Available</h3>
				<p className="text-muted-foreground">
					The validation report is not available yet. This might be because the
					validation is still in progress or encountered an issue.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="font-bold text-3xl">{report.ideaName}</h1>
						<p className="mt-1 text-muted-foreground">
							{report.ideaType.replace("-", " ")} •{" "}
							{formatRelativeTime(validation.createdAt)}
						</p>
					</div>
					<ScoreBadge
						score={report.overallScore}
						className="px-3 py-2 text-base"
					/>
				</div>
				<RecommendationBadge recommendation={report.recommendation} />
			</div>

			{/* Executive Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Executive Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">{report.executiveSummary}</p>
				</CardContent>
			</Card>

			{/* Analysis Sections Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Market Analysis */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="size-5" />
							Market Analysis
						</CardTitle>
						<div className="flex items-center gap-2">
							<ScoreBadge score={report.marketAnalysis.score.value} />
							<CardDescription>
								{report.marketAnalysis.score.confidence}% confidence
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="mb-2 font-semibold text-sm">Market Size</h4>
							<p className="text-muted-foreground text-sm">
								{report.marketAnalysis.marketSize.description}
							</p>
							{report.marketAnalysis.marketSize.estimatedValue && (
								<p className="mt-1 font-medium text-sm">
									Est. Value: {report.marketAnalysis.marketSize.estimatedValue}{" "}
									• Growth: {report.marketAnalysis.marketSize.growthRate}
								</p>
							)}
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-sm">Competition</h4>
							<p className="text-muted-foreground text-sm">
								{report.marketAnalysis.competitorCount.direct} direct
								competitors, {report.marketAnalysis.competitorCount.indirect}{" "}
								indirect
							</p>
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-sm">User Demand</h4>
							<p className="text-muted-foreground text-sm capitalize">
								{report.marketAnalysis.userDemand.level} demand
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Differentiation */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="size-5" />
							Differentiation
						</CardTitle>
						<div className="flex items-center gap-2">
							<ScoreBadge score={report.differentiation.score.value} />
							<CardDescription>
								{report.differentiation.score.confidence}% confidence
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="mb-2 font-semibold text-sm">Value Proposition</h4>
							<p className="text-muted-foreground text-sm">
								{report.differentiation.uniqueValueProposition}
							</p>
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-sm">
								Key Differentiators
							</h4>
							<ul className="space-y-1 text-muted-foreground text-sm">
								{report.differentiation.keyDifferentiators
									.slice(0, 3)
									.map((diff) => (
										<li key={diff}>• {diff}</li>
									))}
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Technical Feasibility */}
				<Card>
					<CardHeader>
						<CardTitle>Technical Feasibility</CardTitle>
						<div className="flex items-center gap-2">
							<ScoreBadge score={report.technicalFeasibility.score.value} />
							<CardDescription className="capitalize">
								{report.technicalFeasibility.complexityLevel} complexity
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="mb-2 font-semibold text-sm">Development Time</h4>
							<p className="text-muted-foreground text-sm">
								MVP: {report.technicalFeasibility.estimatedDevTime.mvp} • Full:{" "}
								{report.technicalFeasibility.estimatedDevTime.fullVersion}
							</p>
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-sm">Required Skills</h4>
							<p className="text-muted-foreground text-sm">
								{report.technicalFeasibility.requiredSkills
									.slice(0, 3)
									.join(", ")}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Monetization */}
				<Card>
					<CardHeader>
						<CardTitle>Monetization</CardTitle>
						<div className="flex items-center gap-2">
							<ScoreBadge score={report.monetization.score.value} />
							<CardDescription>
								{report.monetization.score.confidence}% confidence
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="mb-2 font-semibold text-sm">Recommended Model</h4>
							<p className="text-muted-foreground text-sm capitalize">
								{report.monetization.recommendedModels[0].type.replace(
									"-",
									" ",
								)}
							</p>
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-sm">
								Revenue Projection (Realistic)
							</h4>
							<p className="font-medium text-sm">
								{report.monetization.revenueProjection.realistic}
							</p>
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-sm">Pricing Strategy</h4>
							<p className="text-muted-foreground text-sm">
								{report.monetization.pricingStrategy}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Risks & Opportunities */}
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="size-5 text-orange-500" />
							Key Risks
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3">
							{report.risks.slice(0, 3).map((risk) => (
								<li key={risk.category} className="text-sm">
									<span className="font-medium">{risk.category}:</span>{" "}
									<span className="text-muted-foreground">
										{risk.description}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lightbulb className="size-5 text-yellow-500" />
							Opportunities
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{report.opportunities.slice(0, 3).map((opp) => (
								<li key={opp} className="text-muted-foreground text-sm">
									• {opp}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			{/* Next Steps */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CheckCircle2 className="size-5 text-green-500" />
						Recommended Next Steps
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-4">
						{report.nextSteps.slice(0, 5).map((step, i) => (
							<li key={step.action} className="flex gap-3">
								<span
									className={`inline-flex size-6 items-center justify-center rounded-full font-medium text-xs ${
										step.priority === "critical"
											? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
											: step.priority === "high"
												? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
												: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
									}`}
								>
									{i + 1}
								</span>
								<div className="flex-1">
									<p className="font-medium text-sm">{step.action}</p>
									<p className="text-muted-foreground text-sm">
										{step.reasoning}
									</p>
									{step.estimatedEffort && (
										<p className="mt-1 text-muted-foreground text-xs">
											Effort: {step.estimatedEffort}
										</p>
									)}
								</div>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			{/* Pivot Recommendations */}
			{report.pivotRecommendations &&
				report.pivotRecommendations.length > 0 && (
					<Card className="border-purple-200 dark:border-purple-900">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
								<RefreshCcw className="size-5" />
								Pivot Recommendations
							</CardTitle>
							<CardDescription>
								Strategic changes to improve viability
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4">
								{report.pivotRecommendations.map((pivot, i) => (
									<li key={pivot.title} className="flex gap-3">
										<span
											className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full font-medium text-xs ${
												pivot.priority === "critical"
													? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
													: pivot.priority === "high"
														? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
														: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
											}`}
										>
											{i + 1}
										</span>
										<div className="flex-1 space-y-1">
											<p className="font-semibold text-sm">{pivot.title}</p>
											<p className="text-muted-foreground text-sm">
												{pivot.description}
											</p>
											<p className="text-muted-foreground text-xs italic">
												Why: {pivot.reasoning}
											</p>
											<p className="text-muted-foreground text-xs">
												<span className="font-medium">Impact:</span>{" "}
												{pivot.estimatedImpact}
											</p>
										</div>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				)}

			{/* Build Recommendations */}
			{report.buildRecommendations &&
				report.buildRecommendations.length > 0 && (
					<Card className="border-green-200 dark:border-green-900">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
								<Rocket className="size-5" />
								Build Recommendations
							</CardTitle>
							<CardDescription>
								Key areas to focus on when building
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4">
								{report.buildRecommendations.map((build, i) => (
									<li key={build.title} className="flex gap-3">
										<span
											className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full font-medium text-xs ${
												build.priority === "critical"
													? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
													: build.priority === "high"
														? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
														: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
											}`}
										>
											{i + 1}
										</span>
										<div className="flex-1 space-y-1">
											<div className="flex items-center gap-2">
												<p className="font-semibold text-sm">{build.title}</p>
												<span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
													{build.category}
												</span>
											</div>
											<p className="text-muted-foreground text-sm">
												{build.description}
											</p>
										</div>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				)}

			{/* Alternative Directions */}
			{report.alternativeDirections &&
				report.alternativeDirections.length > 0 && (
					<Card className="border-blue-200 dark:border-blue-900">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
								<Compass className="size-5" />
								Alternative Directions
							</CardTitle>
							<CardDescription>
								Related opportunities to explore
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4">
								{report.alternativeDirections.map((alt) => (
									<li
										key={alt.title}
										className="space-y-1 border-b pb-3 last:border-0"
									>
										<div className="flex items-start justify-between gap-2">
											<p className="font-semibold text-sm">{alt.title}</p>
											<ScoreBadge score={alt.viabilityScore} />
										</div>
										<p className="text-muted-foreground text-sm">
											{alt.description}
										</p>
										<p className="text-muted-foreground text-xs italic">
											{alt.reasoning}
										</p>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				)}

			{/* Deal Breakers */}
			{report.dealBreakers.length > 0 && (
				<Card className="border-orange-200 dark:border-orange-900">
					<CardHeader>
						<CardTitle className="text-orange-600 dark:text-orange-400">
							Deal Breakers to Watch
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{report.dealBreakers.map((breaker) => (
								<li key={breaker} className="text-muted-foreground text-sm">
									• {breaker}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
