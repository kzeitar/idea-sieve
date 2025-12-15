import type { Framework } from "./framework-schema";

/**
 * SaaS Validation Framework
 *
 * This framework evaluates traditional SaaS (Software as a Service) ideas.
 *
 * Focus: Scalability, recurring revenue, enterprise potential, long-term viability
 */
export const SAAS_FRAMEWORK: Framework = {
	name: "SaaS Validation Framework",
	version: "1.0.0",
	ideaType: "saas" as const,

	description: `
This framework evaluates traditional SaaS ideas with emphasis on:
- Recurring revenue potential
- Scalability to enterprise markets
- Long-term business viability
- Customer retention and churn
- Product-led or sales-led growth potential
`,

	evaluationCriteria: {
		marketAnalysis: {
			weight: 0.2,
			description: "Assess market size, growth, and saturation for SaaS model",
			keyQuestions: [
				"Is the total addressable market (TAM) large enough (>$100M)?",
				"What is the current market growth rate?",
				"How many established SaaS competitors exist?",
				"Is there evidence of actual customer pain points?",
				"What is the willingness to pay for SaaS solutions in this space?",
			],
			scoringGuidelines: {
				"9-10":
					"Large, growing market ($1B+ TAM) with clear demand and limited strong competitors",
				"7-8":
					"Substantial market ($100M-$1B TAM) with growth, moderate competition",
				"5-6": "Medium market with some competition, unclear growth",
				"3-4": "Small or shrinking market, heavily saturated",
				"1-2": "Minimal market or no clear demand",
			},
		},

		differentiation: {
			weight: 0.2,
			description: "Evaluate uniqueness and competitive moat potential",
			keyQuestions: [
				"What makes this SaaS fundamentally different from competitors?",
				"Is there a defensible moat (network effects, data, switching costs)?",
				"Can the core value proposition be easily copied?",
				"Does it solve the problem 10x better than alternatives?",
				"Are there unique insights or technology advantages?",
			],
			scoringGuidelines: {
				"9-10":
					"Novel approach with strong moat potential and clear 10x improvement",
				"7-8": "Meaningful differentiation with some defensibility",
				"5-6": "Minor improvements over existing solutions",
				"3-4": "Marginal differentiation, easily replicable",
				"1-2": "No clear differentiation or me-too product",
			},
		},

		technicalFeasibility: {
			weight: 0.15,
			description: "Evaluate technical complexity and buildability",
			keyQuestions: [
				"What is the technical complexity of the MVP?",
				"Are there significant technical risks or unknowns?",
				"What infrastructure and third-party services are required?",
				"Can it scale to handle enterprise-level usage?",
				"Are there compliance requirements (SOC2, GDPR, HIPAA)?",
			],
			scoringGuidelines: {
				"9-10":
					"Straightforward to build with proven tech stack, clear path to scale",
				"7-8": "Moderate complexity, established patterns exist",
				"5-6": "Complex but achievable, some technical risks",
				"3-4": "Very complex, significant technical hurdles",
				"1-2":
					"Requires breakthrough technology or unfeasible with current tech",
			},
		},

		monetization: {
			weight: 0.2,
			description: "Assess revenue model viability and pricing power",
			keyQuestions: [
				"What is the realistic price point per user/month?",
				"Can this support a sustainable business ($100K+ ARR possible in year 1)?",
				"Is there potential for expansion revenue (upsells, add-ons)?",
				"What is the estimated LTV:CAC ratio?",
				"Are there multiple revenue streams possible?",
			],
			scoringGuidelines: {
				"9-10":
					"Strong pricing power ($50+/user/month), clear path to $1M+ ARR",
				"7-8": "Solid pricing ($20-50/user/month), achievable ARR growth",
				"5-6": "Moderate pricing ($10-20/user/month), slower growth potential",
				"3-4": "Low pricing (<$10/user/month), difficult unit economics",
				"1-2": "Unclear how to charge or impossible unit economics",
			},
		},

		userAcquisition: {
			weight: 0.15,
			description: "Evaluate customer acquisition difficulty and channels",
			keyQuestions: [
				"Who is the specific target customer (ICP)?",
				"What channels can effectively reach them?",
				"Is product-led growth (PLG) viable?",
				"What is the expected CAC and payback period?",
				"Are there partnership or integration opportunities?",
			],
			scoringGuidelines: {
				"9-10":
					"Clear ICP, multiple proven channels, strong PLG potential, low CAC",
				"7-8": "Defined ICP, viable channels, moderate CAC",
				"5-6": "Broad ICP, uncertain channels, high CAC",
				"3-4": "Unclear ICP, difficult to reach, very high CAC",
				"1-2": "No clear path to acquire customers profitably",
			},
		},

		retention: {
			weight: 0.1,
			description: "Assess customer retention and churn potential",
			keyQuestions: [
				"Does the product create habitual usage?",
				"Are there high switching costs once implemented?",
				"Is the value realized ongoing or one-time?",
				"What is the expected monthly/annual churn rate?",
				"Does usage increase over time (expansion revenue)?",
			],
			scoringGuidelines: {
				"9-10":
					"Mission-critical tool, high switching costs, expected <3% monthly churn",
				"7-8": "Regular usage, moderate switching costs, 3-5% monthly churn",
				"5-6": "Periodic usage, some stickiness, 5-8% monthly churn",
				"3-4": "Infrequent usage, low switching costs, >8% monthly churn",
				"1-2": "One-time value or expected massive churn",
			},
		},
	},

	specificRequirements: {
		minimumMarketSize: "$100M TAM",
		targetMetrics: {
			monthlyChurnRate: "<5%",
			ltvCacRatio: ">3",
			revenuePerEmployee: "$200K+",
			timeToMVP: "<6 months",
		},
		criticalFactors: [
			"Clear recurring revenue model",
			"Scalable acquisition channel",
			"Product-market fit evidence",
			"Manageable churn rate",
			"Defensible competitive position",
		],
	},

	commonPitfalls: [
		"Building a painkiller that's actually a vitamin (nice-to-have vs must-have)",
		"Targeting SMBs with high-touch sales requirements",
		"Underestimating enterprise sales cycles (6-18 months)",
		"Ignoring compliance requirements (SOC2, GDPR, HIPAA)",
		"Over-engineering the MVP before finding product-market fit",
		"Unclear pricing strategy leading to revenue leakage",
		"No plan for customer success and onboarding",
	],

	successIndicators: [
		"Customers willing to pre-pay or commit to contracts",
		"Strong word-of-mouth and organic interest",
		"Low CAC with high LTV potential",
		"Integration opportunities with existing platforms",
		"Clear upgrade path from free to paid tiers",
		"Positive unit economics within first 100 customers",
	],

	dealBreakers: [
		"No repeatable acquisition channel identified",
		"Market size too small (<$50M TAM)",
		"Impossible unit economics (LTV < CAC)",
		"Requires sales team but targeting low-value customers",
		"Strong network effects favor incumbents",
		"Regulatory barriers too high for new entrant",
		"Technology requirements beyond team capability",
	],

	monetizationModels: [
		{
			type: "subscription",
			description: "Monthly or annual recurring subscription fees",
			pros: [
				"Predictable recurring revenue",
				"Easy to forecast and plan",
				"Aligns incentives for long-term value",
				"Simple for customers to understand",
			],
			cons: [
				"Customers may resist ongoing payments",
				"Churn directly impacts revenue",
				"Requires continuous value delivery",
			],
			idealFor:
				"SaaS products with ongoing value delivery and regular feature updates",
		},
		{
			type: "freemium",
			description: "Free tier with paid upgrades for premium features",
			pros: [
				"Low barrier to entry",
				"Product-led growth potential",
				"Large user base for feedback",
				"Viral potential",
			],
			cons: [
				"High infrastructure costs for free users",
				"Low conversion rates (typically 2-5%)",
				"Complex feature tier management",
			],
			idealFor:
				"Products with viral potential, low marginal cost, and clear premium features",
		},
		{
			type: "usage-based",
			description:
				"Pay based on actual usage metrics (seats, API calls, storage, etc.)",
			pros: [
				"Scales with customer value",
				"Fair pricing model",
				"Natural expansion revenue",
				"Aligns cost with value",
			],
			cons: [
				"Unpredictable revenue",
				"Complex billing",
				"May discourage usage",
			],
			idealFor:
				"Infrastructure tools, APIs, or products with clear usage metrics",
		},
		{
			type: "hybrid",
			description: "Combination of subscription base + usage overage",
			pros: [
				"Predictable base revenue",
				"Captures expansion revenue",
				"Flexible for different customer sizes",
			],
			cons: [
				"More complex to explain",
				"Harder to predict total cost",
				"Billing complexity",
			],
			idealFor: "Enterprise SaaS with variable usage patterns across customers",
		},
	],

	acquisitionChannels: [
		{
			channel: "Content Marketing & SEO",
			description:
				"Create valuable content targeting search queries in your niche",
			effectiveness: "high",
			cost: "low",
			timeToResults: "6-12 months",
			idealFor:
				"B2B SaaS with clear search intent and educational content opportunities",
		},
		{
			channel: "Product-Led Growth (PLG)",
			description:
				"Let the product sell itself through free trials or freemium model",
			effectiveness: "high",
			cost: "low",
			timeToResults: "3-6 months",
			idealFor: "Self-serve SaaS with quick time-to-value and viral potential",
		},
		{
			channel: "Paid Search (Google Ads)",
			description: "Target high-intent keywords related to your solution",
			effectiveness: "high",
			cost: "high",
			timeToResults: "Immediate",
			idealFor: "High LTV products with clear buyer intent keywords",
		},
		{
			channel: "Outbound Sales",
			description:
				"Direct outreach to ideal customer profiles via email, LinkedIn, cold calls",
			effectiveness: "moderate",
			cost: "high",
			timeToResults: "3-6 months",
			idealFor: "Enterprise SaaS with high ACV (>$10K/year)",
		},
		{
			channel: "Partnerships & Integrations",
			description:
				"Partner with complementary tools and platforms for co-marketing",
			effectiveness: "moderate",
			cost: "moderate",
			timeToResults: "6-12 months",
			idealFor: "Products that complement existing popular platforms",
		},
		{
			channel: "Community Building",
			description:
				"Build engaged communities around your solution (Slack, Discord, forums)",
			effectiveness: "moderate",
			cost: "low",
			timeToResults: "12-24 months",
			idealFor: "Developer tools or products with passionate user bases",
		},
	],

	idealCharacteristics: [
		"Solves a critical, recurring business problem",
		"Clear product-market fit with paying customers willing to commit long-term",
		"Scalable architecture that handles enterprise-level usage",
		"Strong unit economics with LTV:CAC ratio of 3:1 or better",
		"Multiple viable acquisition channels identified",
		"Defensible competitive moat (network effects, data, switching costs)",
		"Product-led growth potential or efficient sales process",
		"Reasonable churn rate (<5% monthly) with strong retention",
		"Path to $100K+ ARR within 12 months",
		"Team has domain expertise or unfair advantage in the space",
	],
};
