import { createFileRoute } from "@tanstack/react-router";
import { ValidationForm } from "@/components/ideas/validation-form";

function NewValidationComponent() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<div className="mb-8">
				<h1 className="font-bold text-3xl">Validate New Idea</h1>
				<p className="mt-1 text-muted-foreground">
					Get AI-powered analysis and recommendations for your idea
				</p>
			</div>

			<ValidationForm />
		</div>
	);
}

export const Route = createFileRoute("/ideas/new")({
	component: NewValidationComponent,
});
