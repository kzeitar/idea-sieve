import type { ValidationInput } from "@idea-sieve/ai";
import {
	CheckCircle2,
	Clock,
	DollarSign,
	Filter,
	MessageSquare,
	Sparkles,
	Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface InputDetailsProps {
	input: ValidationInput;
}

const IDEA_TYPE_LABELS: Record<string, string> = {
	saas: "SaaS",
	"micro-saas": "Micro-SaaS",
	"mobile-app": "Mobile App",
	"chrome-extension": "Chrome Extension",
	"api-tool": "API Tool",
	marketplace: "Marketplace",
	"info-product": "Info Product",
	generic: "Generic",
};

const FOCUS_AREA_LABELS: Record<string, string> = {
	"market-size": "Market Size",
	competition: "Competition",
	"technical-feasibility": "Technical Feasibility",
	monetization: "Monetization",
	"user-acquisition": "User Acquisition",
	scalability: "Scalability",
	"legal-compliance": "Legal Compliance",
	differentiation: "Differentiation",
};

const TONE_LABELS: Record<string, { label: string; description: string }> = {
	brutal: { label: "Brutal", description: "Harsh, critical feedback" },
	balanced: { label: "Balanced", description: "Fair and constructive" },
	encouraging: {
		label: "Encouraging",
		description: "Supportive while honest",
	},
	optimistic: { label: "Optimistic", description: "Focuses on positives" },
};

const MARKET_FOCUS_LABELS: Record<string, string> = {
	b2b: "Business to Business (B2B)",
	b2c: "Business to Consumer (B2C)",
	both: "Hybrid (B2B & B2C)",
};

export function InputDetails({ input }: InputDetailsProps) {
	const customization = input.customization || {};

	return (
		<div className="space-y-6">
			{/* Basic Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Sparkles className="size-5" />
						Basic Information
					</CardTitle>
					<CardDescription>Core details about your idea</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h4 className="mb-2 font-semibold text-sm">Idea Name</h4>
						<p className="text-foreground">{input.ideaName}</p>
					</div>

					<div>
						<h4 className="mb-2 font-semibold text-sm">Idea Type</h4>
						<Badge variant="secondary" className="font-normal">
							{IDEA_TYPE_LABELS[input.ideaType] || input.ideaType}
						</Badge>
					</div>

					<div>
						<h4 className="mb-2 font-semibold text-sm">Description</h4>
						<p className="text-muted-foreground text-sm">
							{input.ideaDescription}
						</p>
					</div>

					{input.targetAudience && (
						<div>
							<h4 className="mb-2 font-semibold text-sm">Target Audience</h4>
							<p className="text-muted-foreground text-sm">
								{input.targetAudience}
							</p>
						</div>
					)}

					{input.proposedFeatures && input.proposedFeatures.length > 0 && (
						<div>
							<h4 className="mb-2 font-semibold text-sm">Proposed Features</h4>
							<ul className="space-y-1">
								{input.proposedFeatures.map((feature) => (
									<li
										key={feature}
										className="flex items-start gap-2 text-muted-foreground text-sm"
									>
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Validation Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MessageSquare className="size-5" />
						Validation Settings
					</CardTitle>
					<CardDescription>How the validation was customized</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h4 className="mb-2 font-semibold text-sm">Validation Tone</h4>
						<div className="flex flex-col gap-1">
							<Badge variant="outline" className="w-fit font-normal">
								{TONE_LABELS[customization.validationTone || "balanced"].label}
							</Badge>
							<p className="text-muted-foreground text-xs">
								{
									TONE_LABELS[customization.validationTone || "balanced"]
										.description
								}
							</p>
						</div>
					</div>

					{customization.marketFocus && (
						<div>
							<h4 className="mb-2 font-semibold text-sm">Market Focus</h4>
							<Badge variant="secondary" className="font-normal">
								{MARKET_FOCUS_LABELS[customization.marketFocus]}
							</Badge>
						</div>
					)}

					<div>
						<h4 className="mb-2 font-semibold text-sm">
							Competitor Analysis Depth
						</h4>
						<Badge variant="outline" className="font-normal capitalize">
							{customization.competitorAnalysisDepth || "standard"}
						</Badge>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<div className="flex items-center gap-2">
							<div
								className={`size-2 rounded-full ${
									customization.includeMonetizationStrategy !== false
										? "bg-green-500"
										: "bg-gray-300"
								}`}
							/>
							<span className="text-sm">Monetization Strategy</span>
						</div>
						<div className="flex items-center gap-2">
							<div
								className={`size-2 rounded-full ${
									customization.includeLegalConsiderations
										? "bg-green-500"
										: "bg-gray-300"
								}`}
							/>
							<span className="text-sm">Legal Considerations</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Focus Areas */}
			{customization.focusAreas && customization.focusAreas.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Filter className="size-5" />
							Focus Areas
						</CardTitle>
						<CardDescription>Specific areas analyzed in depth</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{customization.focusAreas.map((area) => (
								<Badge key={area} variant="secondary" className="font-normal">
									{FOCUS_AREA_LABELS[area] || area}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Technical Constraints */}
			{customization.technicalConstraints &&
				customization.technicalConstraints.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Wrench className="size-5" />
								Technical Constraints
							</CardTitle>
							<CardDescription>
								Limitations and requirements considered
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								{customization.technicalConstraints.map((constraint) => (
									<li
										key={constraint}
										className="flex items-start gap-2 text-muted-foreground text-sm"
									>
										<span className="mt-1 text-orange-500">•</span>
										<span>{constraint}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				)}

			{/* Budget & Timeline */}
			{(customization.targetBudget || customization.targetTimeline) && (
				<div className="grid gap-6 md:grid-cols-2">
					{customization.targetBudget && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<DollarSign className="size-5" />
									Target Budget
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="font-medium text-lg">
									{customization.targetBudget.currency}{" "}
									{customization.targetBudget.min?.toLocaleString()} -{" "}
									{customization.targetBudget.max?.toLocaleString()}
								</p>
							</CardContent>
						</Card>
					)}

					{customization.targetTimeline && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Clock className="size-5" />
									Target Timeline
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="font-medium text-lg">
									{customization.targetTimeline.value}{" "}
									{customization.targetTimeline.unit}
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);
}
