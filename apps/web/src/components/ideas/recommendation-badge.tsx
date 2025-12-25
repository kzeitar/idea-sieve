import type { RecommendationType } from "@idea-sieve/ai";
import { AlertTriangle, CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecommendationBadgeProps {
	recommendation: RecommendationType;
	className?: string;
	showIcon?: boolean;
	size?: "sm" | "default" | "lg";
}

const BADGE_CONFIG: Record<
	RecommendationType,
	{ label: string; className: string; icon: typeof CheckCircle2 }
> = {
	BUILD_NOW: {
		label: "Build Now",
		className:
			"bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
		icon: CheckCircle2,
	},
	BUILD_WITH_CAUTION: {
		label: "Build with Caution",
		className:
			"bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
		icon: AlertTriangle,
	},
	PIVOT_REQUIRED: {
		label: "Pivot Required",
		className:
			"bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
		icon: RefreshCcw,
	},
	DO_NOT_BUILD: {
		label: "Do Not Build",
		className:
			"bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
		icon: XCircle,
	},
};

export function RecommendationBadge({
	recommendation,
	className,
	showIcon = false,
	size = "default",
}: RecommendationBadgeProps) {
	const config = BADGE_CONFIG[recommendation];
	const Icon = config.icon;

	const getSizeClass = () => {
		if (size === "sm") return "text-xs px-2 py-0.5";
		if (size === "lg") return "text-base px-3 py-1.5";
		return "text-sm px-2.5 py-1";
	};

	const getIconSize = () => {
		if (size === "sm") return "size-3";
		if (size === "lg") return "size-5";
		return "size-4";
	};

	return (
		<Badge
			className={cn(
				"gap-1.5 font-semibold",
				config.className,
				getSizeClass(),
				className,
			)}
		>
			{showIcon && <Icon className={getIconSize()} />}
			{config.label}
		</Badge>
	);
}
