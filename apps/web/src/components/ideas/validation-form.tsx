import type { FocusArea, Framework, IdeaType } from "@idea-sieve/ai";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Info, Loader, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { FrameworkDetailsModal } from "@/components/frameworks/framework-details-modal";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { frameworksApi, ideasApi, validationApi } from "@/lib/api-client";
import { validationInputSchema } from "@/lib/validation-schema";

function createZodFieldValidator<T>(schema: z.ZodType<T>) {
	return ({ value }: { value: T }) => {
		const result = schema.safeParse(value);

		if (result.success) {
			return undefined;
		}

		return result.error.issues[0].message;
	};
}

const IDEA_TYPES: { value: IdeaType; label: string; description: string }[] = [
	{
		value: "saas",
		label: "SaaS",
		description: "Software as a Service product",
	},
	{
		value: "micro-saas",
		label: "Micro-SaaS",
		description: "Small, focused SaaS targeting a niche",
	},
	{
		value: "mobile-app",
		label: "Mobile App",
		description: "iOS or Android application",
	},
	{
		value: "chrome-extension",
		label: "Chrome Extension",
		description: "Browser extension for Chrome",
	},
	{
		value: "api-tool",
		label: "API Tool",
		description: "API or developer tool",
	},
	{
		value: "marketplace",
		label: "Marketplace",
		description: "Platform connecting buyers and sellers",
	},
	{
		value: "info-product",
		label: "Info Product",
		description: "Course, ebook, or educational content",
	},
	{ value: "generic", label: "Generic", description: "Other type of product" },
];

const FOCUS_AREAS: { value: FocusArea; label: string; description: string }[] =
	[
		{
			value: "market-size",
			label: "Market Size",
			description: "Total addressable market analysis",
		},
		{
			value: "competition",
			label: "Competition",
			description: "Competitive landscape assessment",
		},
		{
			value: "technical-feasibility",
			label: "Technical Feasibility",
			description: "Implementation complexity and challenges",
		},
		{
			value: "monetization",
			label: "Monetization",
			description: "Revenue models and pricing strategies",
		},
		{
			value: "user-acquisition",
			label: "User Acquisition",
			description: "Customer acquisition channels and costs",
		},
		{
			value: "scalability",
			label: "Scalability",
			description: "Growth potential and scaling challenges",
		},
		{
			value: "legal-compliance",
			label: "Legal Compliance",
			description: "Regulatory and legal considerations",
		},
		{
			value: "differentiation",
			label: "Differentiation",
			description: "Unique value proposition analysis",
		},
	];

export function ValidationForm() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const submittingRef = useRef(false);
	const [isFrameworkModalOpen, setIsFrameworkModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("basic");
	const [selectedFramework, setSelectedFramework] = useState<Framework | null>(
		null,
	);
	const [selectedIdeaType, setSelectedIdeaType] = useState<IdeaType | null>(
		null,
	);

	const form = useForm({
		defaultValues: {
			ideaName: "",
			ideaDescription: "",
			ideaType: "saas" as IdeaType,
			targetAudience: "",
			proposedFeatures: [] as string[],
			customization: {
				validationTone: "balanced",
				focusAreas: [] as FocusArea[],
				marketFocus: undefined as "b2b" | "b2c" | "both" | undefined,
				targetBudget: undefined as
					| { min: number; max: number; currency: string }
					| undefined,
				targetTimeline: undefined as
					| { value: number; unit: "days" | "weeks" | "months" }
					| undefined,
				technicalConstraints: [] as string[],
				competitorAnalysisDepth: "standard",
				includeMonetizationStrategy: true,
				includeLegalConsiderations: false,
			},
		},
		onSubmit: async ({ value }) => {
			// Prevent double submission
			if (submittingRef.current) {
				return;
			}

			submittingRef.current = true;
			setIsSubmitting(true);
			try {
				// Validate using zod before submitting
				const validatedData = validationInputSchema.parse(value);

				// Step 1: Create idea in database
				const idea = await ideasApi.create(validatedData as any);

				// Step 2: Start validation
				await validationApi.startValidation(idea.id, validatedData as any);

				toast.success("Validation started! Analyzing your idea...");
				navigate({ to: "/ideas/$id", params: { id: idea.id } });

				// Validation will run in background, useValidation hook will poll for updates
			} catch (error) {
				console.error("Failed to start validation:", error);
				if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("Failed to start validation. Please try again.");
				}
				setIsSubmitting(false);
				submittingRef.current = false;
			}
		},
	});

	// Fetch framework when ideaType changes
	useEffect(() => {
		const subscription = form.store.subscribe((state) => {
			if (!state.currentVal.values) return;

			const currentIdeaType = state.currentVal.values.ideaType;
			if (currentIdeaType !== selectedIdeaType) {
				setSelectedIdeaType(currentIdeaType);
				if (currentIdeaType) {
					frameworksApi
						.get(currentIdeaType)
						.then((framework) => {
							setSelectedFramework(framework.frameworkData as Framework);
						})
						.catch((error) => {
							console.error("Failed to fetch framework:", error);
							setSelectedFramework(null);
						});
				}
			}
		});
		return () => subscription();
	}, [form.store, selectedIdeaType]);

	const [newFeature, setNewFeature] = useState("");
	const [newConstraint, setNewConstraint] = useState("");

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="basic">Basic Information</TabsTrigger>
					<TabsTrigger value="customization">
						Customization (Optional)
					</TabsTrigger>
				</TabsList>

				{/* Basic Information Tab */}
				<TabsContent value="basic" className="mt-4 space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Tell us about your idea</CardTitle>
							<CardDescription>
								Provide the essential details about what you want to build
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Idea Name */}
							<form.Field
								name="ideaName"
								validators={{
									onSubmit: createZodFieldValidator(
										validationInputSchema.shape.ideaName,
									),
								}}
							>
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="ideaName">
											Idea Name <span className="text-destructive">*</span>
										</Label>
										<Input
											id="ideaName"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="e.g., TaskFlow - AI-Powered Project Management"
											disabled={isSubmitting}
										/>
										{field.state.meta.errors &&
											field.state.meta.errors.length > 0 && (
												<p className="text-destructive text-sm">
													{String(field.state.meta.errors[0])}
												</p>
											)}
									</div>
								)}
							</form.Field>

							{/* Idea Type */}
							<form.Field name="ideaType">
								{(field) => (
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Label htmlFor="ideaType">
												Idea Type <span className="text-destructive">*</span>
											</Label>
											<button
												type="button"
												onClick={() => setIsFrameworkModalOpen(true)}
												className="text-muted-foreground transition-colors hover:text-foreground"
												aria-label="View framework details"
												disabled={!field.state.value}
											>
												<Info className="h-4 w-4" />
											</button>
										</div>
										<Select
											value={field.state.value}
											onValueChange={(value) =>
												field.handleChange(value as IdeaType)
											}
											disabled={isSubmitting}
										>
											<SelectTrigger id="ideaType">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{IDEA_TYPES.map((type) => (
													<SelectItem key={type.value} value={type.value}>
														<div className="flex flex-col items-start">
															<span className="font-medium">{type.label}</span>
															<span className="text-muted-foreground text-xs">
																{type.description}
															</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>

							{/* Idea Description */}
							<form.Field
								name="ideaDescription"
								validators={{
									onSubmit: createZodFieldValidator(
										validationInputSchema.shape.ideaDescription,
									),
								}}
							>
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="ideaDescription">
											Description <span className="text-destructive">*</span>
										</Label>
										<Textarea
											id="ideaDescription"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Describe your idea in detail. What problem does it solve? Who is it for? What makes it unique?"
											className="min-h-[120px] resize-y"
											disabled={isSubmitting}
										/>
										<p className="text-muted-foreground text-xs">
											{field.state.value.length}/1000 characters (minimum 20)
										</p>
										{field.state.meta.errors &&
											field.state.meta.errors.length > 0 && (
												<p className="text-destructive text-sm">
													{String(field.state.meta.errors[0])}
												</p>
											)}
									</div>
								)}
							</form.Field>

							{/* Target Audience */}
							<form.Field name="targetAudience">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="targetAudience">
											Target Audience{" "}
											<span className="text-muted-foreground">(Optional)</span>
										</Label>
										<Input
											id="targetAudience"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="e.g., Small business owners, Developers, Marketing teams"
											disabled={isSubmitting}
										/>
										<p className="text-muted-foreground text-xs">
											Who will use your product?
										</p>
									</div>
								)}
							</form.Field>

							{/* Proposed Features */}
							<form.Field name="proposedFeatures">
								{(field) => (
									<div className="space-y-2">
										<Label>
											Proposed Features{" "}
											<span className="text-muted-foreground">(Optional)</span>
										</Label>
										<div className="space-y-2">
											{field.state.value.map((feature) => (
												<div key={feature} className="flex gap-2">
													<Input value={feature} disabled className="flex-1" />
													<Button
														type="button"
														variant="outline"
														size="icon"
														onClick={() => {
															const newFeatures = field.state.value.filter(
																(f) => f !== feature,
															);
															field.handleChange(newFeatures);
														}}
														disabled={isSubmitting}
													>
														<X className="size-4" />
													</Button>
												</div>
											))}
											<div className="flex gap-2">
												<Input
													value={newFeature}
													onChange={(e) => setNewFeature(e.target.value)}
													placeholder="e.g., AI-powered task prioritization"
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															if (newFeature.trim()) {
																field.handleChange([
																	...field.state.value,
																	newFeature.trim(),
																]);
																setNewFeature("");
															}
														}
													}}
													disabled={isSubmitting}
												/>
												<Button
													type="button"
													variant="outline"
													size="icon"
													onClick={() => {
														if (newFeature.trim()) {
															field.handleChange([
																...field.state.value,
																newFeature.trim(),
															]);
															setNewFeature("");
														}
													}}
													disabled={isSubmitting}
												>
													<Plus className="size-4" />
												</Button>
											</div>
											<p className="text-muted-foreground text-xs">
												Press Enter or click + to add a feature
											</p>
										</div>
									</div>
								)}
							</form.Field>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Customization Tab */}
				<TabsContent value="customization" className="mt-4 space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Validation Settings</CardTitle>
							<CardDescription>
								Customize how we analyze your idea
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Validation Tone */}
							<form.Field name="customization.validationTone">
								{(field) => (
									<div className="space-y-3">
										<Label>Validation Tone</Label>
										<RadioGroup
											value={field.state.value}
											onValueChange={(value) =>
												field.handleChange(
													value as
														| "brutal"
														| "balanced"
														| "encouraging"
														| "optimistic",
												)
											}
											disabled={isSubmitting}
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="brutal" id="tone-brutal" />
												<Label
													htmlFor="tone-brutal"
													className="cursor-pointer font-normal"
												>
													<span className="font-medium">Brutal</span> - Harsh,
													critical feedback
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="balanced" id="tone-balanced" />
												<Label
													htmlFor="tone-balanced"
													className="cursor-pointer font-normal"
												>
													<span className="font-medium">Balanced</span> - Fair
													and constructive
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="encouraging"
													id="tone-encouraging"
												/>
												<Label
													htmlFor="tone-encouraging"
													className="cursor-pointer font-normal"
												>
													<span className="font-medium">Encouraging</span> -
													Supportive while honest
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="optimistic"
													id="tone-optimistic"
												/>
												<Label
													htmlFor="tone-optimistic"
													className="cursor-pointer font-normal"
												>
													<span className="font-medium">Optimistic</span> -
													Focuses on positives
												</Label>
											</div>
										</RadioGroup>
									</div>
								)}
							</form.Field>

							<Separator />

							{/* Market Focus */}
							<form.Field name="customization.marketFocus">
								{(field) => (
									<div className="space-y-3">
										<Label>Market Focus</Label>
										<RadioGroup
											value={field.state.value || ""}
											onValueChange={(value) =>
												field.handleChange(value as "b2b" | "b2c" | "both")
											}
											disabled={isSubmitting}
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="b2b" id="market-b2b" />
												<Label
													htmlFor="market-b2b"
													className="cursor-pointer font-normal"
												>
													B2B - Business to Business
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="b2c" id="market-b2c" />
												<Label
													htmlFor="market-b2c"
													className="cursor-pointer font-normal"
												>
													B2C - Business to Consumer
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="both" id="market-both" />
												<Label
													htmlFor="market-both"
													className="cursor-pointer font-normal"
												>
													Both - Hybrid model
												</Label>
											</div>
										</RadioGroup>
									</div>
								)}
							</form.Field>

							<Separator />

							{/* Focus Areas */}
							<form.Field name="customization.focusAreas">
								{(field) => (
									<div className="space-y-3">
										<Label>Focus Areas</Label>
										<p className="text-muted-foreground text-sm">
											Select specific areas you want us to analyze in depth
										</p>
										<div className="grid gap-3 sm:grid-cols-2">
											{FOCUS_AREAS.map((area) => (
												<div
													key={area.value}
													className="flex items-start space-x-2"
												>
													<Checkbox
														id={`focus-${area.value}`}
														checked={field.state.value.includes(area.value)}
														onCheckedChange={(checked) => {
															if (checked) {
																field.handleChange([
																	...field.state.value,
																	area.value,
																]);
															} else {
																field.handleChange(
																	field.state.value.filter(
																		(v) => v !== area.value,
																	),
																);
															}
														}}
														disabled={isSubmitting}
													/>
													<div className="grid gap-1">
														<Label
															htmlFor={`focus-${area.value}`}
															className="cursor-pointer font-medium"
														>
															{area.label}
														</Label>
														<p className="text-muted-foreground text-xs">
															{area.description}
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</form.Field>

							<Separator />

							{/* Analysis Options */}
							<div className="space-y-4">
								<Label>Analysis Options</Label>

								<form.Field name="customization.competitorAnalysisDepth">
									{(field) => (
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<Label className="font-medium text-sm">
													Competitor Analysis Depth
												</Label>
												<p className="text-muted-foreground text-xs">
													How detailed should the competitive analysis be?
												</p>
											</div>
											<Select
												value={field.state.value}
												onValueChange={(value) =>
													field.handleChange(
														value as "minimal" | "standard" | "comprehensive",
													)
												}
												disabled={isSubmitting}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="minimal">Minimal</SelectItem>
													<SelectItem value="standard">Standard</SelectItem>
													<SelectItem value="comprehensive">
														Comprehensive
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									)}
								</form.Field>

								<form.Field name="customization.includeMonetizationStrategy">
									{(field) => (
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<Label className="font-medium text-sm">
													Include Monetization Strategy
												</Label>
												<p className="text-muted-foreground text-xs">
													Detailed revenue model analysis
												</p>
											</div>
											<Switch
												checked={field.state.value}
												onCheckedChange={field.handleChange}
												disabled={isSubmitting}
											/>
										</div>
									)}
								</form.Field>

								<form.Field name="customization.includeLegalConsiderations">
									{(field) => (
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<Label className="font-medium text-sm">
													Include Legal Considerations
												</Label>
												<p className="text-muted-foreground text-xs">
													Compliance and regulatory analysis
												</p>
											</div>
											<Switch
												checked={field.state.value}
												onCheckedChange={field.handleChange}
												disabled={isSubmitting}
											/>
										</div>
									)}
								</form.Field>
							</div>

							<Separator />

							{/* Technical Constraints */}
							<form.Field name="customization.technicalConstraints">
								{(field) => (
									<div className="space-y-2">
										<Label>Technical Constraints</Label>
										<p className="text-muted-foreground text-sm">
											Any limitations or requirements we should consider?
										</p>
										<div className="space-y-2">
											{field.state.value.map((constraint) => (
												<div key={constraint} className="flex gap-2">
													<Input
														value={constraint}
														disabled
														className="flex-1"
													/>
													<Button
														type="button"
														variant="outline"
														size="icon"
														onClick={() => {
															const newConstraints = field.state.value.filter(
																(c) => c !== constraint,
															);
															field.handleChange(newConstraints);
														}}
														disabled={isSubmitting}
													>
														<X className="size-4" />
													</Button>
												</div>
											))}
											<div className="flex gap-2">
												<Input
													value={newConstraint}
													onChange={(e) => setNewConstraint(e.target.value)}
													placeholder="e.g., Must work offline, No cloud dependencies"
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															if (newConstraint.trim()) {
																field.handleChange([
																	...field.state.value,
																	newConstraint.trim(),
																]);
																setNewConstraint("");
															}
														}
													}}
													disabled={isSubmitting}
												/>
												<Button
													type="button"
													variant="outline"
													size="icon"
													onClick={() => {
														if (newConstraint.trim()) {
															field.handleChange([
																...field.state.value,
																newConstraint.trim(),
															]);
															setNewConstraint("");
														}
													}}
													disabled={isSubmitting}
												>
													<Plus className="size-4" />
												</Button>
											</div>
										</div>
									</div>
								)}
							</form.Field>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Budget & Timeline</CardTitle>
							<CardDescription>
								Set your resource constraints to get tailored recommendations
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Target Budget */}
							<div className="space-y-3">
								<Label>Target Budget</Label>
								<p className="text-muted-foreground text-sm">
									What's your initial investment range?
								</p>
								<div className="flex gap-2">
									<form.Field name="customization.targetBudget.min">
										{(field) => (
											<div className="flex-1">
												<Input
													type="number"
													placeholder="Minimum"
													value={field.state.value || ""}
													onChange={(e) =>
														field.handleChange(
															e.target.value
																? Number.parseInt(e.target.value, 10)
																: undefined,
														)
													}
													disabled={isSubmitting}
												/>
											</div>
										)}
									</form.Field>
									<span className="flex items-center text-muted-foreground">
										to
									</span>
									<form.Field name="customization.targetBudget.max">
										{(field) => (
											<div className="flex-1">
												<Input
													type="number"
													placeholder="Maximum"
													value={field.state.value || ""}
													onChange={(e) =>
														field.handleChange(
															e.target.value
																? Number.parseInt(e.target.value, 10)
																: undefined,
														)
													}
													disabled={isSubmitting}
												/>
											</div>
										)}
									</form.Field>
									<form.Field name="customization.targetBudget.currency">
										{(_field) => (
											<Input
												value="USD"
												disabled
												className="w-[80px] bg-muted"
											/>
										)}
									</form.Field>
								</div>
							</div>

							{/* Target Timeline */}
							<div className="space-y-3">
								<Label>Target Timeline</Label>
								<p className="text-muted-foreground text-sm">
									When do you plan to launch?
								</p>
								<div className="flex gap-2">
									<form.Field name="customization.targetTimeline.value">
										{(field) => (
											<div className="flex-1">
												<Input
													type="number"
													placeholder="Duration"
													value={field.state.value || ""}
													onChange={(e) =>
														field.handleChange(
															e.target.value
																? Number.parseInt(e.target.value, 10)
																: undefined,
														)
													}
													disabled={isSubmitting}
												/>
											</div>
										)}
									</form.Field>
									<form.Field name="customization.targetTimeline.unit">
										{(field) => (
											<Select
												value={field.state.value || "weeks"}
												onValueChange={(value) =>
													field.handleChange(
														value as "days" | "weeks" | "months",
													)
												}
												disabled={isSubmitting}
											>
												<SelectTrigger className="w-[120px]">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="days">Days</SelectItem>
													<SelectItem value="weeks">Weeks</SelectItem>
													<SelectItem value="months">Months</SelectItem>
												</SelectContent>
											</Select>
										)}
									</form.Field>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Form Actions */}
			<div className="flex justify-between gap-3 pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => navigate({ to: "/ideas" })}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<div className="flex gap-2">
					{activeTab === "customization" && (
						<Button
							type="button"
							variant="outline"
							onClick={() => setActiveTab("basic")}
							disabled={isSubmitting}
						>
							Back to Basic Info
						</Button>
					)}
					{activeTab === "basic" && (
						<Button
							type="button"
							variant="outline"
							onClick={() => setActiveTab("customization")}
							disabled={isSubmitting}
						>
							Customize Analysis
						</Button>
					)}
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && <Loader className="mr-2 size-4 animate-spin" />}
						{isSubmitting ? "Validating..." : "Validate Idea"}
					</Button>
				</div>
			</div>

			{/* Framework Details Modal */}
			<FrameworkDetailsModal
				framework={selectedFramework}
				open={isFrameworkModalOpen}
				onOpenChange={setIsFrameworkModalOpen}
				showViewAllButton={true}
			/>
		</form>
	);
}
