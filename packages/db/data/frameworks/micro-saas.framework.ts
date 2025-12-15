import type { Framework } from "./framework-schema";

/**
 * Micro-SaaS Validation Framework
 *
 * This framework evaluates Micro-SaaS ideas - small, focused SaaS products
 * typically run by solo founders or small teams.
 *
 * Focus: Quick to market, niche focus, profitability over growth, bootstrapped viability
 */
export const MICRO_SAAS_FRAMEWORK: Framework = {
	name: "Micro-SaaS Validation Framework",
	version: "1.0.0",
	ideaType: "micro-saas" as const,

	description: `
This framework evaluates Micro-SaaS ideas with emphasis on:
- Quick time to market and MVP
- Niche market domination
- Profitability over rapid growth
- Solo founder or small team viability
- Minimal operational overhead
- Bootstrap-friendly economics
`,

	evaluationCriteria: {
		nicheViability: {
			weight: 0.25,
			description: "Assess the niche size and opportunity",
			keyQuestions: [
				"Is the niche well-defined and reachable?",
				"Is the market size right-sized for micro-SaaS ($5M-$50M)?",
				"Can you dominate this specific niche?",
				"Are competitors ignoring this segment?",
				"Is there a clear, passionate community?",
			],
			scoringGuidelines: {
				"9-10":
					"Perfect niche: small enough to dominate, large enough to profit, underserved",
				"7-8": "Good niche with clear boundaries and acquisition paths",
				"5-6": "Somewhat defined niche but competitive or hard to reach",
				"3-4": "Vague niche or too small to sustain business",
				"1-2": "No clear niche or massive market requiring VC funding",
			},
		},

		timeToMarket: {
			weight: 0.2,
			description: "Evaluate how quickly an MVP can be launched",
			keyQuestions: [
				"Can an MVP be built in 1-3 months?",
				"Are there existing tools/frameworks to accelerate development?",
				"How complex is the core feature set?",
				"Can you launch with manual processes to validate?",
				"Are there major technical unknowns?",
			],
			scoringGuidelines: {
				"9-10": "Can ship MVP in 2-4 weeks with existing tools",
				"7-8": "Can ship in 1-2 months with moderate effort",
				"5-6": "Requires 3-4 months, some complexity",
				"3-4": "Needs 6+ months or significant technical work",
				"1-2": "Requires years of development or impossible solo",
			},
		},

		operationalSimplicity: {
			weight: 0.2,
			description: "Assess ongoing operational burden",
			keyQuestions: [
				"Can it run with minimal manual intervention?",
				"Does it require 24/7 support or monitoring?",
				"Are there complex integrations to maintain?",
				"Can onboarding be self-serve?",
				"How much customer support is required?",
			],
			scoringGuidelines: {
				"9-10": "Fully automated, self-serve, minimal support needed",
				"7-8": "Mostly automated, occasional support, manageable solo",
				"5-6": "Some manual work required, moderate support burden",
				"3-4": "Significant manual processes or support requirements",
				"1-2": "Requires full-time operations team or constant attention",
			},
		},

		profitabilityPotential: {
			weight: 0.2,
			description: "Evaluate path to profitability and sustainable income",
			keyQuestions: [
				"Can this realistically generate $5K-$50K MRR?",
				"What are the fixed costs (hosting, tools, services)?",
				"Is customer acquisition cost sustainable for a bootstrapper?",
				"Can you reach profitability within 6-12 months?",
				"Are margins healthy (>70%)?",
			],
			scoringGuidelines: {
				"9-10": "Clear path to $20K+ MRR with <$2K fixed costs, low CAC",
				"7-8": "Can reach $10K+ MRR with reasonable costs and CAC",
				"5-6": "Possible to reach $5K MRR but tight margins or high costs",
				"3-4": "Difficult to exceed $5K MRR or poor unit economics",
				"1-2": "No viable path to meaningful revenue",
			},
		},

		soloFounderViability: {
			weight: 0.15,
			description: "Can this be built and run by 1-2 people?",
			keyQuestions: [
				"Does it require specialized skills you don't have?",
				"Can marketing be done through low-effort channels?",
				"Is the scope manageable for a small team?",
				"Can you handle sales, support, and development?",
				"Are there critical dependencies on other people?",
			],
			scoringGuidelines: {
				"9-10": "Perfect for solo founder with existing skills",
				"7-8": "Manageable with 1-2 people or freelance help",
				"5-6": "Challenging solo but possible with outsourcing",
				"3-4": "Really needs a co-founder or small team",
				"1-2": "Impossible without a larger team",
			},
		},
	},

	specificRequirements: {
		idealMarketSize: "$5M-$50M TAM",
		targetMetrics: {
			timeToMVP: "<3 months",
			timeToFirstCustomer: "<1 month after launch",
			targetMRR: "$5K-$50K",
			customerCount: "50-500 paying customers",
			monthlyChurnRate: "<7%",
			profitMargin: ">70%",
		},
		criticalFactors: [
			"Simple, focused problem solving one thing well",
			"Self-serve signup and onboarding",
			"Clear, reachable niche audience",
			"Low operational overhead",
			"Bootstrap-friendly economics",
		],
	},

	monetizationModels: [
		{
			type: "subscription",
			description: "Simple monthly subscription at $29-$99/month price point",
			pros: [
				"Predictable recurring revenue",
				"Simple to understand and budget",
				"Low billing complexity",
				"Easy to forecast",
			],
			cons: [
				"May leave money on the table with high-usage customers",
				"Churn directly impacts revenue",
			],
			idealFor:
				"Most micro-SaaS with consistent value delivery and simple pricing needs",
		},
		{
			type: "freemium",
			description:
				"Free tier with limited features, paid upgrade for full access",
			pros: [
				"Product-led growth potential",
				"Low friction to try",
				"Viral potential in niche communities",
			],
			cons: [
				"Support costs for free users",
				"Low conversion rates (2-5%)",
				"Need to manage free tier limits",
			],
			idealFor: "Tools with viral potential and low marginal cost per user",
		},
		{
			type: "one-time",
			description:
				"One-time purchase with optional updates/support subscription",
			pros: [
				"Easier to sell (no commitment)",
				"Immediate revenue",
				"Appeals to one-person businesses",
			],
			cons: [
				"No recurring revenue",
				"Harder to predict income",
				"Less motivation for updates",
			],
			idealFor: "Tools, templates, or products with one-time value delivery",
		},
		{
			type: "usage-based",
			description:
				"Pay based on specific usage metrics (reports generated, emails sent, etc.)",
			pros: [
				"Fair pricing aligns with value",
				"Natural expansion revenue",
				"Low barrier to entry",
			],
			cons: [
				"Unpredictable revenue",
				"Billing complexity for solo founder",
				"May discourage usage",
			],
			idealFor:
				"Automation tools or services with clear, measurable usage metrics",
		},
	],

	acquisitionChannels: [
		{
			channel: "Niche Content Marketing",
			description:
				"Create targeted content for specific niche communities and forums",
			effectiveness: "high",
			cost: "low",
			timeToResults: "3-6 months",
			idealFor: "Micro-SaaS targeting well-defined, passionate communities",
		},
		{
			channel: "Long-tail SEO",
			description:
				"Target specific, low-competition keywords with high purchase intent",
			effectiveness: "high",
			cost: "low",
			timeToResults: "6-12 months",
			idealFor: "Niche problems with clear search queries and low competition",
		},
		{
			channel: "Direct Community Outreach",
			description:
				"Engage directly in focused communities where your ideal customers gather",
			effectiveness: "high",
			cost: "low",
			timeToResults: "1-3 months",
			idealFor: "Small, accessible communities with clear pain points",
		},
		{
			channel: "Product Hunt & Launch Platforms",
			description:
				"Launch on Product Hunt, Hacker News, and niche-specific platforms",
			effectiveness: "moderate",
			cost: "low",
			timeToResults: "Immediate spike, 1-3 months sustained",
			idealFor: "Products with strong visual appeal or innovative concepts",
		},
		{
			channel: "Integration Marketplaces",
			description: "List in Shopify App Store, WordPress plugins, etc.",
			effectiveness: "high",
			cost: "moderate",
			timeToResults: "3-6 months",
			idealFor: "Tools that extend popular platforms",
		},
		{
			channel: "Affiliate Partnerships",
			description:
				"Partner with complementary tools for referral revenue sharing",
			effectiveness: "moderate",
			cost: "moderate",
			timeToResults: "6-12 months",
			idealFor: "Products with clear complementary tools and good margins",
		},
		{
			channel: "Social Media (Twitter/X, LinkedIn)",
			description: "Build presence in niche communities on social platforms",
			effectiveness: "moderate",
			cost: "low",
			timeToResults: "6-12 months",
			idealFor: "Products serving engaged online communities",
		},
	],

	commonPitfalls: [
		"Building features before validating core problem",
		"Targeting too broad a market instead of a niche",
		"Over-engineering the technical solution",
		"Underpricing due to impostor syndrome ($9/mo when $49/mo is viable)",
		"Trying to compete with well-funded SaaS on features",
		"Ignoring customer support burden until it's overwhelming",
		"Building in isolation without early customer feedback",
		"Not accounting for churn in revenue projections",
	],

	successIndicators: [
		"First 10 customers acquired within 60 days of launch",
		"Strong word-of-mouth within niche community",
		'Customers describing it as "exactly what I needed"',
		"Inbound interest from content marketing or SEO",
		"Low support burden per customer",
		"Positive cash flow within 6 months",
		"Natural expansion opportunities emerging from customers",
	],

	dealBreakers: [
		"Market too small (<$1M TAM) to sustain business",
		"Requires enterprise sales or complex onboarding",
		"Needs 24/7 support or monitoring",
		"Technical complexity beyond solo founder capability",
		"High customer acquisition cost with low LTV",
		"Requires significant ongoing content creation or manual work",
		"Deep technical moat needed that you don't have",
		"Regulatory complexity (healthcare, finance, legal)",
	],

	idealCharacteristics: [
		"Solves a specific, painful problem for a defined group",
		"Can be discovered through organic search or community",
		"Self-serve signup with minimal onboarding",
		"Provides immediate value on day one",
		"Built with proven, stable technology",
		"Pricing sweet spot of $29-$99/month",
		"Serves a passionate, engaged community",
		"Complements existing workflows rather than replacing them",
	],
};
