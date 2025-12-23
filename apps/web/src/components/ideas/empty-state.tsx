import { Link } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	title: string;
	description: string;
	actionLabel?: string;
	actionHref?: string;
}

export function EmptyState({
	title,
	description,
	actionLabel,
	actionHref,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="mb-4 rounded-full bg-muted p-3">
				<Lightbulb className="size-8 text-muted-foreground" />
			</div>
			<h3 className="mb-2 font-semibold text-lg">{title}</h3>
			<p className="mb-6 max-w-md text-muted-foreground text-sm">
				{description}
			</p>
			{actionLabel && actionHref && (
				<Link to={actionHref}>
					<Button>{actionLabel}</Button>
				</Link>
			)}
		</div>
	);
}
