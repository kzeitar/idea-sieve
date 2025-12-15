import type { Framework } from "./framework-schema";

/**
 * API Tool / API as a Service Validation Framework
 *
 * This framework evaluates API products and developer-focused tools.
 *
 * Focus: Developer adoption, documentation quality, pricing models, API design
 */
export const API_TOOL_FRAMEWORK: Framework = {
	name: "API Tool / API as a Service Validation Framework",
	version: "1.0.0",
	ideaType: "api-tool" as const,

	description: `
This framework evaluates API products and developer tools with emphasis on:
- Developer experience and adoption
- API design and documentation quality
- Pricing models (usage-based, tiered, etc.)
- Integration ecosystem
- Rate limiting and scalability
- Developer support and community
`,

	evaluationCriteria: {
		developerNeed: {
			weight: 0.25,
			description: "Assess if developers actually need this API/tool",
			keyQuestions: [
				"Is there clear developer pain this solves?",
				"Are developers currently using inferior alternatives?",
				"Is the problem frequent enough to warrant API usage?",
				"What's the market size for this developer segment?",
				"Is this a must-have or nice-to-have for developers?",
			],
			scoringGuidelines: {
				"9-10":
					"Solves critical, frequent developer problem with no good alternatives",
				"7-8": "Addresses real pain point with existing but poor solutions",
				"5-6": "Useful but developers have acceptable alternatives",
				"3-4": "Marginal benefit or very niche use case",
				"1-2": "No clear developer need or problem already well-solved",
			},
		},

		developerExperience: {
			weight: 0.2,
			description: "Evaluate the quality of developer experience",
			keyQuestions: [
				"How easy is it to integrate (time to first API call)?",
				"Is the API design intuitive and well-documented?",
				"Are there SDKs in major languages?",
				"Is there a sandbox/playground for testing?",
				"How good is the error handling and debugging?",
			],
			scoringGuidelines: {
				"9-10":
					"Excellent DX, integration in <5 minutes, comprehensive docs and SDKs",
				"7-8": "Good DX, clear docs, integration possible in <30 minutes",
				"5-6": "Acceptable DX, basic docs, some friction in integration",
				"3-4": "Poor DX, confusing docs, difficult integration",
				"1-2": "Terrible DX, would frustrate developers",
			},
		},

		technicalDifferentiation: {
			weight: 0.2,
			description: "What makes this API technically superior or unique?",
			keyQuestions: [
				"What's the unique technical advantage?",
				"Is performance/latency better than alternatives?",
				"Does it offer unique data or capabilities?",
				"Is the API design more elegant than competitors?",
				"Are there proprietary algorithms or data?",
			],
			scoringGuidelines: {
				"9-10": "Significant technical moat, unique capabilities or data",
				"7-8": "Meaningful technical advantages (speed, accuracy, features)",
				"5-6": "Some differentiation but can be replicated",
				"3-4": "Minimal technical differentiation",
				"1-2": "No meaningful technical advantage",
			},
		},

		pricingModel: {
			weight: 0.15,
			description: "Viability of pricing and monetization strategy",
			keyQuestions: [
				"What's the pricing model (per-call, tiered, subscription)?",
				"Is pricing competitive with alternatives?",
				"Can you reach profitability at scale?",
				"What are the margin implications?",
				"Is there potential for expansion revenue?",
			],
			scoringGuidelines: {
				"9-10":
					"Clear, competitive pricing with healthy margins and expansion potential",
				"7-8": "Viable pricing model with acceptable margins",
				"5-6": "Pricing works but tight margins or uncertain adoption",
				"3-4": "Difficult to price profitably",
				"1-2": "No viable pricing model",
			},
		},

		ecosystemPotential: {
			weight: 0.1,
			description: "Potential for integrations and ecosystem growth",
			keyQuestions: [
				"Can this integrate with popular platforms?",
				"Is there potential for marketplace/plugin ecosystems?",
				"Would agencies/integrators build on this?",
				"Are there natural partnership opportunities?",
				"Does usage drive more usage (network effects)?",
			],
			scoringGuidelines: {
				"9-10": "Strong ecosystem potential with network effects",
				"7-8": "Good integration opportunities with major platforms",
				"5-6": "Some integration potential",
				"3-4": "Limited ecosystem opportunities",
				"1-2": "Standalone tool with no ecosystem potential",
			},
		},

		scalabilityAndReliability: {
			weight: 0.1,
			description: "Can this scale reliably to serve many developers?",
			keyQuestions: [
				"What are the infrastructure costs at scale?",
				"Can you maintain low latency at high volume?",
				"What's the uptime/reliability requirement?",
				"Are there rate limiting concerns?",
				"Can you handle traffic spikes?",
			],
			scoringGuidelines: {
				"9-10":
					"Proven scalability, low infrastructure costs, easy to maintain uptime",
				"7-8": "Scalable with reasonable costs and reliability achievable",
				"5-6": "Scalability possible but expensive or complex",
				"3-4": "Significant scaling challenges",
				"1-2": "Fundamental scalability issues",
			},
		},
	},

	specificRequirements: {
		minimumMarketSize: "10,000+ potential developer users",
		targetMetrics: {
			timeToFirstAPICall: "<10 minutes",
			apiUptime: "99.9%+",
			p95Latency: "<200ms",
			documentationQuality: "Clear, with examples in 3+ languages",
			freeTierToPaid: ">5% conversion",
			monthlyChurnRate: "<5%",
		},
		criticalFactors: [
			"Excellent developer documentation",
			"Fast, reliable API responses",
			"Generous free tier for testing",
			"Clear, predictable pricing",
			"Responsive developer support",
			"Well-designed API (RESTful, GraphQL, etc.)",
		],
	},

	monetizationModels: [
		{
			type: "usage-based",
			description:
				"Pay per API call/request - typical: $0.001 - $0.10 per call depending on complexity",
			pros: [
				"Aligns cost with value",
				"Low barrier to entry",
				"Scales with customer success",
			],
			cons: [
				"Unpredictable revenue",
				"Complex billing",
				"Can be expensive for heavy users",
			],
			idealFor: "APIs with variable usage patterns, data/AI services",
		},
		{
			type: "tiered",
			description:
				"Multiple tiers with included API calls - typical: $0/mo (free) → $49/mo → $199/mo → $999/mo+",
			pros: [
				"Predictable revenue",
				"Easy to understand",
				"Natural upgrade path",
			],
			cons: [
				"Doesn't perfectly align with usage",
				"Hard to price tiers correctly",
			],
			idealFor: "APIs with predictable usage patterns, developer tools",
		},
		{
			type: "hybrid",
			description:
				"Base subscription + overage charges - typical: $29/mo + $0.01 per call over 10,000",
			pros: [
				"Predictable base + scales with usage",
				"Balances revenue and customer value",
			],
			cons: ["More complex to explain", "Billing complexity"],
			idealFor: "Most API products, balances predictability and flexibility",
		},
		{
			type: "enterprise",
			description:
				"Custom pricing for large customers - typical: $5,000 - $50,000+/month",
			pros: [
				"High revenue per customer",
				"Negotiable terms",
				"SLAs and support",
			],
			cons: [
				"Requires sales team",
				"Long sales cycles",
				"Custom support needs",
			],
			idealFor: "Mission-critical APIs, high-value use cases",
		},
	],

	acquisitionChannels: [
		{
			channel: "Developer-focused Content Marketing",
			description:
				"Create technical blogs, tutorials, and guides that solve developer problems",
			effectiveness: "high",
			cost: "low",
			timeToResults: "6-12 months",
			idealFor:
				"APIs solving well-defined technical problems with search traffic",
		},
		{
			channel: "Open Source Strategy",
			description:
				"Release open source libraries, SDKs, or tools that complement your API",
			effectiveness: "high",
			cost: "low",
			timeToResults: "3-6 months",
			idealFor: "Developer tools and APIs that benefit from community adoption",
		},
		{
			channel: "Developer Communities",
			description:
				"Engage in Stack Overflow, Reddit, Discord, and developer forums",
			effectiveness: "moderate",
			cost: "low",
			timeToResults: "6-12 months",
			idealFor:
				"APIs solving common pain points discussed in developer communities",
		},
		{
			channel: "Integration Marketplaces",
			description: "List on Zapier, RapidAPI, and other API marketplaces",
			effectiveness: "moderate",
			cost: "moderate",
			timeToResults: "3-6 months",
			idealFor: "APIs that integrate well with popular platforms and workflows",
		},
		{
			channel: "GitHub Presence",
			description:
				"Maintain active GitHub repos, sponsor projects, contribute to open source",
			effectiveness: "moderate",
			cost: "low",
			timeToResults: "6-12 months",
			idealFor: "Developer-facing APIs targeting technical audiences",
		},
		{
			channel: "Technical Conferences & Meetups",
			description:
				"Speak at and sponsor developer conferences and local meetups",
			effectiveness: "moderate",
			cost: "high",
			timeToResults: "12+ months",
			idealFor:
				"Enterprise APIs or those targeting specific developer communities",
		},
	],

	commonPitfalls: [
		"Poor documentation - developers will abandon immediately",
		"Complicated authentication or API design",
		"No free tier or sandbox for testing",
		"Pricing too high for indie developers",
		"Slow API response times or unreliable service",
		"No SDKs in popular languages (forcing raw HTTP)",
		"Unclear error messages making debugging hard",
		"Rate limits that are too restrictive for development",
		"No versioning strategy leading to breaking changes",
		"Ignoring developer feedback and feature requests",
		"Over-promising capabilities that don't work well",
	],

	successIndicators: [
		"Developers integrate successfully within first session",
		"Active community asking questions and sharing examples",
		"Free tier users converting to paid at >5%",
		"Strong API uptime (99.9%+) and performance",
		"Positive sentiment on developer forums",
		"Growth in API calls month-over-month",
		"Low support ticket volume (good docs = less support)",
		"Developers building and sharing integration examples",
		"Featured in 'awesome' lists or developer tool directories",
	],

	dealBreakers: [
		"Solves a problem easily solvable without an API",
		"Requires complex setup or onboarding (>30 min)",
		"Competing with free, open-source alternatives that work well",
		"API response times too slow for real-time use cases",
		"Cannot achieve 99.9%+ uptime",
		"Infrastructure costs exceed revenue potential",
		"Regulatory compliance makes it impossible (e.g., data privacy)",
		"Requires proprietary data you don't have access to",
		"Market too small (<1,000 potential paying developers)",
	],

	technicalConsiderations: {
		apiDesign: [
			"RESTful vs GraphQL vs gRPC - choose based on use case",
			"Consistent naming conventions and patterns",
			"Versioning strategy from day one",
			"Comprehensive error handling with clear messages",
			"Rate limiting and throttling strategy",
			"Authentication (API keys, OAuth, JWT)",
			"Pagination for list endpoints",
			"Webhooks for real-time notifications",
		],
		documentation: [
			"Interactive API explorer (Swagger/OpenAPI)",
			"Quick start guide (<5 minutes to first call)",
			"Code examples in 3+ major languages",
			"Clear error code documentation",
			"Rate limit information",
			"Changelog for API updates",
			"Migration guides for breaking changes",
			"Common use case tutorials",
		],
		infrastructure: [
			"Load balancing and auto-scaling",
			"Caching strategy for performance",
			"CDN for global latency reduction",
			"Monitoring and alerting",
			"Disaster recovery and backups",
			"DDoS protection",
			"Compliance (SOC 2, GDPR, etc.)",
		],
	},

	idealCharacteristics: [
		"Solves a frequent, painful developer problem",
		"Integration takes <10 minutes",
		"Clear, predictable pricing developers can budget for",
		"Excellent documentation with code examples",
		"99.9%+ uptime with <200ms p95 latency",
		"Generous free tier for testing and small projects",
		"SDKs in JavaScript, Python, and at least one other language",
		"Active developer community and responsive support",
		"Clear versioning with no surprise breaking changes",
		"Integrates well with popular platforms and tools",
	],
};
