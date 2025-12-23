import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/ideas/empty-state";
import { ReportCard } from "@/components/ideas/report-card";
import { Button } from "@/components/ui/button";
import { useValidationsApi } from "@/hooks/use-validations-api";

function IdeasListComponent() {
	const { validations, loading } = useValidationsApi();

	if (loading) {
		return (
			<div className="container mx-auto max-w-6xl px-4 py-8">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Validated Ideas</h1>
					<p className="mt-1 text-muted-foreground">
						Browse all your validated ideas
					</p>
				</div>
				<Link to="/ideas/new">
					<Button>
						<Plus className="mr-2 size-4" />
						New Validation
					</Button>
				</Link>
			</div>

			{validations.length === 0 ? (
				<EmptyState
					title="No ideas validated yet"
					description="Start validating your ideas to see detailed analysis and recommendations"
					actionLabel="Validate Your First Idea"
					actionHref="/ideas/new"
				/>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{validations.map((validation) => (
						<ReportCard key={validation.id} validation={validation} />
					))}
				</div>
			)}
		</div>
	);
}

export const Route = createFileRoute("/ideas/")({
	component: IdeasListComponent,
});
