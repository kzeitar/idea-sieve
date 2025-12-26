import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStatsApi } from "@/hooks/use-stats-api";
import type { StoredValidation } from "@/lib/types";
import { EmptyState } from "./empty-state";
import { ReportCard } from "./report-card";

export function RecentValidations() {
	const { data: stats, isLoading } = useStatsApi();

	if (isLoading) {
		return (
			<div>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-semibold text-xl">Recent Validations</h2>
				</div>
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (!stats || stats.total === 0) {
		return (
			<EmptyState
				title="No ideas validated yet"
				description="Start validating your ideas to get AI-powered analysis and recommendations"
				actionLabel="Validate Your First Idea"
				actionHref="/ideas/new"
			/>
		);
	}

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold text-xl">Recent Validations</h2>
				<Link to="/ideas">
					<Button variant="ghost" size="sm">
						View All
						<ArrowRight className="ml-2 size-4" />
					</Button>
				</Link>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				{stats.recentValidations.map((validation) => (
					<ReportCard
						key={validation.id}
						validation={validation as StoredValidation}
					/>
				))}
			</div>
		</div>
	);
}
