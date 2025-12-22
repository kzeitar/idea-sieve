import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Sparkles } from "lucide-react";
import { RecentValidations } from "@/components/ideas/recent-validations";
import { StatsOverview } from "@/components/ideas/stats-overview";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="flex items-center gap-2 font-bold text-3xl">
							<Sparkles className="size-8" />
							AI Idea Validator
						</h1>
						<p className="mt-1 text-muted-foreground">
							Get AI-powered analysis and recommendations for your business
							ideas
						</p>
					</div>
					<Link to="/ideas/new">
						<Button size="lg">
							<Plus className="mr-2 size-5" />
							Validate New Idea
						</Button>
					</Link>
				</div>
			</div>

			<div className="space-y-8">
				<StatsOverview />
				<RecentValidations />
			</div>
		</div>
	);
}
