import type { Framework } from "./framework-schema";

/**
 * Marketplace Validation Framework
 *
 * This framework evaluates two-sided marketplace platforms.
 *
 * Focus: Chicken-and-egg problem, liquidity, take rate, trust and safety
 */
export const MARKETPLACE_FRAMEWORK: Framework = {
	name: "Marketplace Validation Framework",
	version: "1.0.0",
	ideaType: "marketplace" as const,

	description: `
This framework evaluates two-sided marketplace ideas with emphasis on:
- Solving the chicken-and-egg cold start problem
- Building liquidity on both sides
- Sustainable take rate and unit economics
- Trust and safety mechanisms
- Defensibility through network effects
- Competitive moat and switching costs
`,

	evaluationCriteria: {
		coldStartSolution: {
			weight: 0.25,
			description: "How will you solve the chicken-and-egg problem?",
			keyQuestions: [
				"Which side do you start with (supply or demand)?",
				"Can you manually seed the initial supply?",
				"Is there a single-player mode that works before network effects kick in?",
				"What's the minimum viable density needed?",
				"How long to reach critical mass?",
			],
			scoringGuidelines: {
				"9-10":
					"Clear, proven cold start strategy with path to critical mass in 3-6 months",
				"7-8":
					"Viable cold start approach, may take 6-12 months to critical mass",
				"5-6":
					"Possible but challenging cold start, 12-18 months to critical mass",
				"3-4": "Very difficult cold start with unclear path forward",
				"1-2": "No viable solution to chicken-and-egg problem",
			},
		},

		marketplaceFit: {
			weight: 0.2,
			description: "Is a marketplace the right solution for this problem?",
			keyQuestions: [
				"Is matching/discovery truly valuable here?",
				"Are current alternatives highly fragmented?",
				"Is there meaningful heterogeneity in supply?",
				"Do transactions benefit from marketplace features?",
				"Would users prefer marketplace vs direct relationships?",
			],
			scoringGuidelines: {
				"9-10": "Perfect marketplace fit, clear inefficiency in current market",
				"7-8":
					"Good marketplace fit, meaningful improvements over alternatives",
				"5-6":
					"Marketplace could work but not obviously better than alternatives",
				"3-4": "Questionable fit, direct relationships might be better",
				"1-2": "Poor marketplace fit, doesn't solve real matching problem",
			},
		},

		unitEconomics: {
			weight: 0.2,
			description: "Are the economics sustainable on both sides?",
			keyQuestions: [
				"What take rate can you charge without disintermediation?",
				"What's the customer acquisition cost for each side?",
				"What's the lifetime value of users on each side?",
				"Can you be profitable at scale?",
				"What are the transaction sizes and frequencies?",
			],
			scoringGuidelines: {
				"9-10":
					"Strong unit economics, 15-30% take rate viable, LTV >> CAC on both sides",
				"7-8": "Healthy economics, 10-20% take rate, positive unit economics",
				"5-6": "Marginal economics, low take rate or high CAC concerns",
				"3-4": "Questionable economics, disintermediation risk high",
				"1-2": "Economics don't work, impossible take rate or CAC > LTV",
			},
		},

		trustAndSafety: {
			weight: 0.15,
			description: "Can you ensure trust and safety on the platform?",
			keyQuestions: [
				"What fraud or safety risks exist?",
				"How will you verify/vet participants?",
				"What payment and dispute resolution mechanisms needed?",
				"Are there regulatory/compliance requirements?",
				"How will you handle bad actors?",
			],
			scoringGuidelines: {
				"9-10": "Low risk or clear mechanisms to ensure trust and safety",
				"7-8": "Moderate risk with viable trust mechanisms",
				"5-6": "Significant trust challenges but addressable",
				"3-4": "High risk, difficult to ensure safety",
				"1-2": "Extreme risk or impossible to moderate effectively",
			},
		},

		networkEffects: {
			weight: 0.1,
			description: "How strong are the network effects and defensibility?",
			keyQuestions: [
				"Do network effects strengthen with scale?",
				"Is there winner-take-all dynamics?",
				"What prevents users from leaving once established?",
				"Are there data advantages that compound?",
				"Can you create lock-in or switching costs?",
			],
			scoringGuidelines: {
				"9-10": "Very strong network effects, clear winner-take-all dynamics",
				"7-8": "Meaningful network effects with some defensibility",
				"5-6": "Moderate network effects, some switching costs",
				"3-4": "Weak network effects, easy to switch",
				"1-2": "No meaningful network effects or lock-in",
			},
		},

		liquidityAndMatching: {
			weight: 0.1,
			description: "Can you create good matching and liquidity?",
			keyQuestions: [
				"How will you ensure good match quality?",
				"What's the acceptable liquidity level?",
				"Can you start hyperlocal and expand?",
				"What's the search/discovery mechanism?",
				"How will you handle supply-demand imbalances?",
			],
			scoringGuidelines: {
				"9-10": "Excellent matching algorithms with clear liquidity strategy",
				"7-8": "Good matching possible with acceptable liquidity requirements",
				"5-6": "Matching works but liquidity will be challenging",
				"3-4": "Poor matching or very high liquidity requirements",
				"1-2": "Matching is extremely difficult or liquidity impossible",
			},
		},
	},

	specificRequirements: {
		minimumMarketSize:
			"Fragmented market with $100M+ annual transaction volume",
		targetMetrics: {
			timeToLiquidity: "3-12 months depending on density requirements",
			initialTakeRate: "10-30% depending on category",
			supplyGrowthRate: "20-40% month over month in early stages",
			demandGrowthRate: "30-50% month over month in early stages",
			transactionSuccessRate: ">70%",
			repeatUsageRate: ">40% in first 90 days",
		},
		criticalFactors: [
			"Clear cold start strategy",
			"Viable unit economics on both sides",
			"Trust and safety mechanisms",
			"Geographic or category focus initially",
			"Strong network effects potential",
			"Sustainable take rate without disintermediation",
		],
	},

	commonPitfalls: [
		"Not solving the chicken-and-egg problem - marketplace never reaches liquidity",
		"Taking too high a take rate causing disintermediation",
		"Trying to be national from day one instead of dominating one city",
		"Poor matching algorithms leading to bad experiences",
		"Inadequate trust and safety causing fraud or bad actors",
		"Ignoring supply or demand side and focusing only on one",
		"Building features before achieving basic liquidity",
		"Underestimating customer acquisition costs on both sides",
		"No plan to prevent users from going direct (disintermediation)",
		"Choosing a category with insufficient transaction frequency",
		"Not having payment processing or it being too complex",
	],

	successIndicators: [
		"Reached critical mass in first geographic/category",
		"Both sides growing organically (word of mouth)",
		"Transaction success rate >70%",
		"Users completing multiple transactions (repeat usage)",
		"Supply utilization rate increasing over time",
		"Take rate sustainable without significant leakage",
		"Net Promoter Score >50 on both sides",
		"Positive unit economics on both sides",
		"Natural defensibility emerging from network effects",
	],

	dealBreakers: [
		"No viable solution to cold start problem",
		"Transaction frequency too low to sustain marketplace",
		"Category has successful incumbent with strong network effects",
		"Impossible to prevent disintermediation at any reasonable take rate",
		"High trust/safety risks that cannot be adequately addressed",
		"Unit economics don't work even at scale",
		"Regulatory barriers make marketplace model illegal/impossible",
		"Supply or demand side has no willingness to pay platform fees",
		"Market size too small to support marketplace dynamics",
	],

	extensions: {
		coldStartStrategies: {
			supplyFirst: {
				description: "Build supply before demand",
				examples: [
					"Uber (recruit drivers first)",
					"DoorDash (sign up restaurants)",
				],
				whenToUse: "When supply is easier to aggregate or incentivize",
				risks: "Supply churn if no demand materialized quickly",
			},
			demandFirst: {
				description: "Build demand before supply",
				examples: ["Thumbtack (get customer requests, then find pros)"],
				whenToUse: "When supply naturally follows clear demand signals",
				risks: "Poor experience if can't fulfill demand quickly",
			},
			singlePlayer: {
				description: "Create value before network effects",
				examples: [
					"OpenTable (restaurant management software first)",
					"Zillow (home values first)",
				],
				whenToUse: "When one side can get value standalone",
				risks: "May not transition to marketplace successfully",
			},
			marquee: {
				description: "Land key supply to attract demand",
				examples: ["AirBnB (professional photographers for hosts)"],
				whenToUse: "When quality of initial supply matters more than quantity",
				risks: "Expensive, doesn't guarantee demand follows",
			},
			geographic: {
				description: "Start in one city/area and expand",
				examples: ["Most local marketplaces (Uber, DoorDash, etc.)"],
				whenToUse: "When density matters for liquidity",
				risks: "Slow expansion, regional competitors",
			},
		},
		takeRateBenchmarks: {
			services: {
				range: "15-30%",
				examples: ["Upwork: 20%", "TaskRabbit: 15-30%", "Airbnb: 14-16%"],
				considerations:
					"Higher for curated/vetted supply, lower for commoditized",
			},
			goods: {
				range: "8-15%",
				examples: ["Etsy: 6.5%+3.5%", "eBay: 10-12%", "Amazon: 8-15%"],
				considerations: "Lower due to competition and disintermediation risk",
			},
			digital: {
				range: "20-40%",
				examples: ["Uber Eats: 30%", "App Stores: 15-30%"],
				considerations: "Higher for convenience and platform value",
			},
			b2b: {
				range: "10-20%",
				examples: ["Faire: 15%", "Alibaba: 5-10%"],
				considerations: "Lower for larger transaction sizes",
			},
		},
		marketplaceTypes: {
			peer2peer: {
				description: "Individuals on both sides",
				examples: ["Airbnb", "eBay", "Craigslist"],
				considerations:
					"Harder to ensure quality, higher trust issues, lower take rates",
			},
			managed: {
				description: "Platform vets and manages supply side",
				examples: ["Uber", "DoorDash", "Thumbtack"],
				considerations:
					"Higher quality, higher operational overhead, can charge more",
			},
			b2b: {
				description: "Businesses on both or one side",
				examples: ["Faire", "Alibaba"],
				considerations:
					"Larger transactions, longer sales cycles, different economics",
			},
			vertical: {
				description: "Deep in one category",
				examples: ["Reverb (music gear)", "1stDibs (luxury antiques)"],
				considerations: "Better liquidity in niche, limited total market",
			},
			horizontal: {
				description: "Many categories",
				examples: ["Amazon", "eBay"],
				considerations:
					"Huge potential, very difficult to achieve liquidity in all",
			},
		},
	},

	idealCharacteristics: [
		"Highly fragmented market with poor discovery",
		"Clear cold start strategy with single-player mode or supply-first approach",
		"High transaction frequency (at least monthly)",
		"Meaningful transaction sizes ($50+ average)",
		"Natural network effects that strengthen over time",
		"Sustainable 15-25% take rate without disintermediation risk",
		"Trust and safety risks are manageable",
		"Geographic or category start that can expand",
		"Both supply and demand willing to pay for value",
		"Repeat transaction potential (not one-off)",
	],
};
