import {
	AlertTriangle,
	BarChart3,
	CheckCircle2,
	Lightbulb,
	RefreshCcw,
	TrendingUp,
	XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStatsApi } from "@/hooks/use-stats-api";

export function StatsOverview() {
	const { data: stats, isLoading } = useStatsApi();

	if (isLoading || !stats) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_) => (
					<Card key={_}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-sm">Loading...</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="font-bold text-2xl">—</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{/* Total Ideas */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Total Ideas</CardTitle>
					<Lightbulb className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{stats.total}</div>
					<p className="mt-1 text-muted-foreground text-xs">
						{stats.total === 0 ? "Validate your first idea" : "ideas validated"}
					</p>
				</CardContent>
			</Card>

			{/* Average Score */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Average Score</CardTitle>
					<TrendingUp className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">
						{stats.total === 0 ? "—" : `${stats.averageScore}/10`}
					</div>
					<p className="mt-1 text-muted-foreground text-xs">
						{stats.total === 0 ? "No data yet" : "across all validations"}
					</p>
				</CardContent>
			</Card>

			{/* Build Now Count */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Build Now</CardTitle>
					<CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl text-green-600 dark:text-green-400">
						{stats.recommendationCounts.BUILD_NOW}
					</div>
					<p className="mt-1 text-muted-foreground text-xs">
						Strong opportunities
					</p>
				</CardContent>
			</Card>

			{/* Recommendations Breakdown */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Other Status</CardTitle>
					<BarChart3 className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="space-y-1 text-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<AlertTriangle className="size-3 text-yellow-600 dark:text-yellow-400" />
								<span className="text-muted-foreground">Caution</span>
							</div>
							<span className="font-medium">
								{stats.recommendationCounts.BUILD_WITH_CAUTION}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<RefreshCcw className="size-3 text-orange-600 dark:text-orange-400" />
								<span className="text-muted-foreground">Pivot</span>
							</div>
							<span className="font-medium">
								{stats.recommendationCounts.PIVOT_REQUIRED}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<XCircle className="size-3 text-red-600 dark:text-red-400" />
								<span className="text-muted-foreground">Don't Build</span>
							</div>
							<span className="font-medium">
								{stats.recommendationCounts.DO_NOT_BUILD}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
