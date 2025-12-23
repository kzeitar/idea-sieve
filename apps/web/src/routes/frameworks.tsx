import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FrameworkDetailsModal } from "@/components/frameworks/framework-details-modal";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { type Framework, frameworksApi } from "@/lib/api-client";

export const Route = createFileRoute("/frameworks")({
	component: FrameworksPage,
});

// Icon mapping for different framework types
const FRAMEWORK_ICONS: Record<string, string> = {
	saas: "🚀",
	"micro-saas": "⚡",
	"mobile-app": "📱",
	"chrome-extension": "🧩",
	"api-tool": "🔌",
	marketplace: "🏪",
	"info-product": "📚",
	generic: "💡",
};

function FrameworksPage() {
	const [selectedFramework, setSelectedFramework] = useState<any>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [frameworks, setFrameworks] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchFrameworks = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await frameworksApi.list();
				// Transform API data to include frameworkData properties
				const transformedFrameworks = data.map((fw) => ({
					...fw,
					...fw.frameworkData,
				}));
				setFrameworks(transformedFrameworks);
			} catch (err) {
				console.error("Error fetching frameworks:", err);
				setError(
					err instanceof Error ? err.message : "Failed to fetch frameworks",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchFrameworks();
	}, []);

	const handleFrameworkClick = (framework: Framework) => {
		setSelectedFramework(framework);
		setIsModalOpen(true);
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="mb-2 font-bold text-4xl">Validation Frameworks</h1>
					<p className="text-lg text-muted-foreground">
						Explore our comprehensive validation frameworks for different idea
						types
					</p>
				</div>
				<p className="text-muted-foreground">Loading frameworks...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="mb-2 font-bold text-4xl">Validation Frameworks</h1>
					<p className="text-lg text-muted-foreground">
						Explore our comprehensive validation frameworks for different idea
						types
					</p>
				</div>
				<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
					<p className="text-destructive">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold text-4xl">Validation Frameworks</h1>
				<p className="text-lg text-muted-foreground">
					Explore our comprehensive validation frameworks for different idea
					types
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{frameworks.map((framework) => {
					const icon = FRAMEWORK_ICONS[framework.ideaType] || "💡";
					const criteriaCount = Object.keys(
						framework.evaluationCriteria,
					).length;

					return (
						<Card
							key={framework.ideaType}
							className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg"
							onClick={() => handleFrameworkClick(framework)}
						>
							<CardHeader>
								<div className="mb-2 flex items-start justify-between gap-2">
									<div className="flex items-center gap-2">
										<span className="text-3xl" role="img" aria-label="icon">
											{icon}
										</span>
										<CardTitle className="text-xl">{framework.name}</CardTitle>
									</div>
								</div>
								<CardDescription className="line-clamp-3">
									{framework.description.trim()}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary" className="text-xs">
										{criteriaCount} Criteria
									</Badge>
									<Badge variant="outline" className="text-xs">
										v{framework.version}
									</Badge>
									{framework.monetizationModels &&
										framework.monetizationModels.length > 0 && (
											<Badge variant="outline" className="text-xs">
												{framework.monetizationModels.length} Monetization
												Models
											</Badge>
										)}
									{framework.acquisitionChannels &&
										framework.acquisitionChannels.length > 0 && (
											<Badge variant="outline" className="text-xs">
												{framework.acquisitionChannels.length} Acquisition
												Channels
											</Badge>
										)}
								</div>

								{/* Quick stats */}
								<div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center text-xs">
									<div>
										<div className="font-semibold text-green-600 dark:text-green-400">
											{framework.successIndicators?.length || 0}
										</div>
										<div className="text-muted-foreground">Success Signs</div>
									</div>
									<div>
										<div className="font-semibold text-yellow-600 dark:text-yellow-400">
											{framework.commonPitfalls?.length || 0}
										</div>
										<div className="text-muted-foreground">Pitfalls</div>
									</div>
									<div>
										<div className="font-semibold text-red-600 dark:text-red-400">
											{framework.dealBreakers?.length || 0}
										</div>
										<div className="text-muted-foreground">Deal Breakers</div>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Framework Details Modal */}
			<FrameworkDetailsModal
				framework={selectedFramework}
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				showViewAllButton={false}
			/>
		</div>
	);
}
