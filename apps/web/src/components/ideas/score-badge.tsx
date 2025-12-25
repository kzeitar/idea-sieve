import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
	score: number;
	className?: string;
	size?: "sm" | "default" | "lg";
}

export function ScoreBadge({
	score,
	className,
	size = "default",
}: ScoreBadgeProps) {
	const getColorClass = () => {
		if (score < 4)
			return "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
		if (score < 7)
			return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
		return "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
	};

	const getSizeClass = () => {
		if (size === "sm") return "text-xs px-2 py-0.5";
		if (size === "lg") return "text-base px-3 py-1.5";
		return "text-sm px-2.5 py-1";
	};

	return (
		<Badge
			className={cn(
				"font-semibold tabular-nums",
				getColorClass(),
				getSizeClass(),
				className,
			)}
		>
			{score.toFixed(1)}/10
		</Badge>
	);
}
