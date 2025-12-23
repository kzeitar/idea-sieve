import type { Framework } from "@idea-sieve/ai";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface FrameworkDetailsModalProps {
	framework: Framework | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	showViewAllButton?: boolean;
}

export function FrameworkDetailsModal({
	framework,
	open,
	onOpenChange,
	showViewAllButton = true,
}: FrameworkDetailsModalProps) {
	if (!framework) return null;

	const criteria = Object.entries(framework.evaluationCriteria);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
				<DialogHeader>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<DialogTitle className="mb-2 text-2xl">
								{framework.name}
							</DialogTitle>
							<DialogDescription className="text-base">
								{framework.description.trim()}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="mt-4 space-y-6">
					{/* Evaluation Criteria */}
					<section>
						<h3 className="mb-3 font-semibold text-lg">Evaluation Criteria</h3>
						<div className="grid gap-4">
							{criteria.map(([key, criterion]) => (
								<Card key={key}>
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-2">
											<CardTitle className="text-base capitalize">
												{key.replace(/([A-Z])/g, " $1").trim()}
											</CardTitle>
											<Badge variant="secondary">
												Weight: {(criterion.weight * 100).toFixed(0)}%
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-2">
										<p className="text-muted-foreground text-sm">
											{criterion.description}
										</p>
										<div className="text-muted-foreground text-xs">
											{criterion.keyQuestions.length} key questions
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</section>

					<Separator />

					{/* Target Metrics */}
					{framework.specificRequirements.targetMetrics &&
						Object.keys(framework.specificRequirements.targetMetrics).length >
							0 && (
							<section>
								<h3 className="mb-3 font-semibold text-lg">Target Metrics</h3>
								<div className="grid grid-cols-2 gap-3">
									{Object.entries(
										framework.specificRequirements.targetMetrics,
									).map(([metric, value]) => (
										<div
											key={metric}
											className="rounded-lg border bg-muted/50 p-3"
										>
											<div className="mb-1 text-muted-foreground text-xs capitalize">
												{metric.replace(/([A-Z])/g, " $1").trim()}
											</div>
											<div className="font-medium">{value}</div>
										</div>
									))}
								</div>
							</section>
						)}

					{/* Success Indicators */}
					{framework.successIndicators &&
						framework.successIndicators.length > 0 && (
							<section>
								<h3 className="mb-3 font-semibold text-lg">
									Success Indicators
								</h3>
								<ul className="space-y-2">
									{framework.successIndicators.map((indicator) => (
										<li
											key={indicator}
											className="flex items-start gap-2 text-muted-foreground text-sm"
										>
											<span className="mt-0.5 text-green-500">✓</span>
											<span>{indicator}</span>
										</li>
									))}
								</ul>
							</section>
						)}

					{/* Common Pitfalls */}
					{framework.commonPitfalls && framework.commonPitfalls.length > 0 && (
						<section>
							<h3 className="mb-3 font-semibold text-lg">Common Pitfalls</h3>
							<ul className="space-y-2">
								{framework.commonPitfalls.map((pitfall) => (
									<li
										key={pitfall}
										className="flex items-start gap-2 text-muted-foreground text-sm"
									>
										<span className="mt-0.5 text-yellow-500">⚠</span>
										<span>{pitfall}</span>
									</li>
								))}
							</ul>
						</section>
					)}

					{/* Deal Breakers */}
					{framework.dealBreakers && framework.dealBreakers.length > 0 && (
						<section>
							<h3 className="mb-3 font-semibold text-lg">Deal Breakers</h3>
							<ul className="space-y-2">
								{framework.dealBreakers.map((dealBreaker) => (
									<li
										key={dealBreaker}
										className="flex items-start gap-2 text-muted-foreground text-sm"
									>
										<span className="mt-0.5 text-red-500">✕</span>
										<span>{dealBreaker}</span>
									</li>
								))}
							</ul>
						</section>
					)}

					{/* Monetization Models */}
					{framework.monetizationModels &&
						framework.monetizationModels.length > 0 && (
							<section>
								<h3 className="mb-3 font-semibold text-lg">
									Monetization Models
								</h3>
								<div className="grid gap-3">
									{framework.monetizationModels.map((model) => (
										<Card key={model.type}>
											<CardHeader className="pb-3">
												<CardTitle className="text-base">
													{model.type}
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-3 text-sm">
												<p className="text-muted-foreground">
													{model.description}
												</p>
												{model.idealFor && (
													<div>
														<span className="font-medium">Ideal for: </span>
														<span className="text-muted-foreground">
															{model.idealFor}
														</span>
													</div>
												)}
											</CardContent>
										</Card>
									))}
								</div>
							</section>
						)}

					{/* Acquisition Channels */}
					{framework.acquisitionChannels &&
						framework.acquisitionChannels.length > 0 && (
							<section>
								<h3 className="mb-3 font-semibold text-lg">
									Acquisition Channels
								</h3>
								<div className="grid gap-3">
									{framework.acquisitionChannels.map((channel) => (
										<Card key={channel.channel}>
											<CardHeader className="pb-3">
												<div className="flex items-start justify-between gap-2">
													<CardTitle className="text-base">
														{channel.channel}
													</CardTitle>
													<div className="flex gap-2">
														<Badge variant="outline" className="text-xs">
															{channel.effectiveness}
														</Badge>
														<Badge variant="secondary" className="text-xs">
															{channel.cost} cost
														</Badge>
													</div>
												</div>
											</CardHeader>
											<CardContent className="space-y-2 text-sm">
												<p className="text-muted-foreground">
													{channel.description}
												</p>
												<div className="text-muted-foreground text-xs">
													Time to results: {channel.timeToResults}
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</section>
						)}

					{/* View All Button */}
					{showViewAllButton && (
						<div className="flex justify-center pt-4">
							<Link to="/frameworks" target="_blank">
								<Button variant="outline" className="gap-2">
									<span>View All Frameworks</span>
									<ExternalLink className="h-4 w-4" />
								</Button>
							</Link>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
