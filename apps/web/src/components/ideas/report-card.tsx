import { Link } from "@tanstack/react-router";
import { AlertCircle, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/date-utils";
import type { StoredValidation } from "@/lib/types";
import { RecommendationBadge } from "./recommendation-badge";
import { ScoreBadge } from "./score-badge";

interface ReportCardProps {
	validation: StoredValidation;
}

const IDEA_TYPE_LABELS: Record<string, string> = {
	saas: "SaaS",
	"micro-saas": "Micro-SaaS",
	"mobile-app": "Mobile App",
	"chrome-extension": "Chrome Extension",
	"api-tool": "API Tool",
	marketplace: "Marketplace",
	"info-product": "Info Product",
	generic: "Generic",
};

export function ReportCard({ validation }: ReportCardProps) {
	// Handle in-progress state
	if (validation.status === "in_progress") {
		const ideaTypeLabel =
			IDEA_TYPE_LABELS[validation.input.ideaType] || validation.input.ideaType;

		return (
			<Link to="/ideas/$id" params={{ id: validation.id }}>
				<Card className="group h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
					<CardHeader className="space-y-3">
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0 flex-1">
								<CardTitle className="truncate text-lg transition-colors group-hover:text-primary">
									{validation.input.ideaName}
								</CardTitle>
								<div className="mt-1.5 flex items-center gap-2">
									<Badge variant="outline" className="text-xs">
										{ideaTypeLabel}
									</Badge>
									<Badge
										variant="outline"
										className="bg-blue-500/10 text-blue-500 text-xs"
									>
										<Loader2 className="mr-1 size-3 animate-spin" />
										Validating...
									</Badge>
								</div>
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-3">
						<p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
							{validation.input.ideaDescription}
						</p>

						<div className="flex items-center gap-1.5 pt-1 text-muted-foreground text-xs">
							<Clock className="size-3" />
							<span>{formatRelativeTime(validation.createdAt)}</span>
						</div>
					</CardContent>
				</Card>
			</Link>
		);
	}

	// Handle error state
	if (validation.status === "error") {
		const ideaTypeLabel =
			IDEA_TYPE_LABELS[validation.input.ideaType] || validation.input.ideaType;

		return (
			<Link to="/ideas/$id" params={{ id: validation.id }}>
				<Card className="group h-full cursor-pointer transition-all hover:border-destructive/50 hover:shadow-md">
					<CardHeader className="space-y-3">
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0 flex-1">
								<CardTitle className="truncate text-lg transition-colors group-hover:text-destructive">
									{validation.input.ideaName}
								</CardTitle>
								<div className="mt-1.5 flex items-center gap-2">
									<Badge variant="outline" className="text-xs">
										{ideaTypeLabel}
									</Badge>
									<Badge
										variant="destructive"
										className="bg-destructive/10 text-destructive text-xs"
									>
										<AlertCircle className="mr-1 size-3" />
										Error
									</Badge>
								</div>
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-3">
						<p className="line-clamp-2 text-destructive/70 text-sm leading-relaxed">
							{validation.error || "Validation failed"}
						</p>

						<div className="flex items-center gap-1.5 pt-1 text-muted-foreground text-xs">
							<Clock className="size-3" />
							<span>{formatRelativeTime(validation.createdAt)}</span>
						</div>
					</CardContent>
				</Card>
			</Link>
		);
	}

	// Handle completed state
	const { report } = validation;

	// Safety check - if no report exists for completed state, show error
	if (!report) {
		return (
			<Link to="/ideas/$id" params={{ id: validation.id }}>
				<Card className="group h-full cursor-pointer transition-all hover:border-destructive/50 hover:shadow-md">
					<CardHeader className="space-y-3">
						<CardTitle className="text-destructive text-lg">
							Invalid Validation
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">
							This validation is in an invalid state.
						</p>
					</CardContent>
				</Card>
			</Link>
		);
	}

	const ideaTypeLabel = IDEA_TYPE_LABELS[report.ideaType] || report.ideaType;

	return (
		<Link to="/ideas/$id" params={{ id: validation.id }}>
			<Card className="group h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
				<CardHeader className="space-y-3">
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0 flex-1">
							<CardTitle className="truncate text-lg transition-colors group-hover:text-primary">
								{report.ideaName}
							</CardTitle>
							<div className="mt-1.5 flex items-center gap-2">
								<Badge variant="outline" className="text-xs">
									{ideaTypeLabel}
								</Badge>
							</div>
						</div>
						<ScoreBadge score={report.overallScore} size="lg" />
					</div>
				</CardHeader>

				<CardContent className="space-y-3">
					<RecommendationBadge
						recommendation={report.recommendation}
						showIcon
						size="default"
					/>

					<p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
						{report.executiveSummary}
					</p>

					<div className="flex items-center gap-1.5 pt-1 text-muted-foreground text-xs">
						<Clock className="size-3" />
						<span>{formatRelativeTime(validation.createdAt)}</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
