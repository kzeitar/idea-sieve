import type { Framework } from "./framework-schema";

/**
 * Mobile App Validation Framework
 *
 * This framework evaluates mobile app ideas for iOS and Android platforms.
 *
 * Focus: App store dynamics, user retention, monetization models, platform-specific opportunities
 */
export const MOBILE_APP_FRAMEWORK: Framework = {
	name: "Mobile App Validation Framework",
	version: "1.0.0",
	ideaType: "mobile-app" as const,

	description: `
This framework evaluates mobile app ideas with emphasis on:
- App store discoverability and ASO potential
- Mobile-first user behaviors
- Retention and engagement metrics
- Monetization via subscriptions, IAP, or ads
- Platform-specific features and constraints
- Competition in app stores
`,

	evaluationCriteria: {
		appStoreViability: {
			weight: 0.2,
			description: "Assess discoverability and competition in app stores",
			keyQuestions: [
				"What is the competition level for relevant keywords?",
				"Are there dominant apps that own this category?",
				"Is there a clear gap in the current offerings?",
				"Can you rank for realistic search terms?",
				"What's the download velocity of competitors?",
			],
			scoringGuidelines: {
				"9-10":
					"Clear gap in app store, good keyword opportunities, manageable competition",
				"7-8": "Some competition but viable positioning exists",
				"5-6": "Crowded category but unique angle possible",
				"3-4": "Very competitive with strong incumbents",
				"1-2": "Dominated by major players or impossible to rank",
			},
		},

		mobileFirstValue: {
			weight: 0.2,
			description: "Evaluate if this truly benefits from being mobile",
			keyQuestions: [
				"Does this leverage mobile-specific capabilities (camera, GPS, notifications)?",
				"Is the use case naturally mobile-first?",
				"Would a web app serve users just as well?",
				"Does it fit into mobile usage patterns (quick sessions, on-the-go)?",
				"Are there platform features that enable unique value?",
			],
			scoringGuidelines: {
				"9-10": "Must be mobile, leverages platform features excellently",
				"7-8": "Strong mobile benefit, uses platform well",
				"5-6": "Works on mobile but could be web-based",
				"3-4": "Marginal mobile benefit, awkward on mobile",
				"1-2": "No reason to be mobile app, web would be better",
			},
		},

		retentionPotential: {
			weight: 0.2,
			description: "Assess ability to retain users long-term",
			keyQuestions: [
				"Does it create daily or weekly habits?",
				"Are there network effects or social features?",
				"Does value compound over time with usage?",
				"What is the expected D1/D7/D30 retention?",
				"Are there hooks to bring users back?",
			],
			scoringGuidelines: {
				"9-10": "Daily habit-forming with D30 retention >40%",
				"7-8": "Strong weekly usage with D30 retention >25%",
				"5-6": "Periodic usage with D30 retention >15%",
				"3-4": "Low repeat usage, D30 retention <10%",
				"1-2": "One-time use or massive churn",
			},
		},

		monetization: {
			weight: 0.2,
			description: "Evaluate revenue model viability for mobile",
			keyQuestions: [
				"What monetization model fits best (subscription/IAP/ads/paid)?",
				"What's the realistic ARPU (Average Revenue Per User)?",
				"How many users needed to be sustainable?",
				"What do successful competitors charge?",
				"Is freemium or premium model more viable?",
			],
			scoringGuidelines: {
				"9-10": "Clear monetization with $5+ monthly ARPU potential",
				"7-8": "Viable model with $2-5 monthly ARPU",
				"5-6": "Possible but low ARPU ($0.50-2/month)",
				"3-4": "Very low ARPU or unclear monetization",
				"1-2": "No viable monetization path",
			},
		},

		technicalFeasibility: {
			weight: 0.1,
			description: "Assess development complexity and requirements",
			keyQuestions: [
				"Can it be built with React Native/Flutter or needs native?",
				"What's the MVP scope and timeline?",
				"Are there complex backend requirements?",
				"Does it require deep platform integrations?",
				"What are the ongoing maintenance needs?",
			],
			scoringGuidelines: {
				"9-10": "Simple to build with cross-platform tools, MVP in 2-3 months",
				"7-8": "Moderate complexity, achievable in 3-6 months",
				"5-6": "Complex features or native required, 6-9 months",
				"3-4": "Very complex, requires native expertise, 9-12 months",
				"1-2": "Requires breakthrough tech or unfeasible timeline",
			},
		},

		userAcquisition: {
			weight: 0.1,
			description: "Evaluate how users will discover and download the app",
			keyQuestions: [
				"Can you rank organically through ASO?",
				"Is paid UA viable with your expected LTV?",
				"Are there viral mechanics or sharing features?",
				"Can you leverage existing communities or platforms?",
				"What's the realistic CAC?",
			],
			scoringGuidelines: {
				"9-10": "Strong organic potential, viral features, low CAC (<$2)",
				"7-8": "Good ASO opportunity or viable paid UA (CAC $2-5)",
				"5-6": "Possible but expensive UA (CAC $5-10)",
				"3-4": "Very difficult/expensive to acquire (CAC >$10)",
				"1-2": "No viable acquisition strategy",
			},
		},
	},

	specificRequirements: {
		targetMetrics: {
			d1Retention: ">40%",
			d7Retention: ">20%",
			d30Retention: ">10%",
			sessionLength: "Varies by category",
			targetARPU: ">$2/month",
			organicShare: ">30% of downloads",
		},
		criticalFactors: [
			"Passes app store review guidelines",
			"Clear onboarding under 30 seconds",
			"Immediate value demonstration",
			"Retention mechanics built-in",
			"Monetization integrated thoughtfully",
		],
		additionalRequirements: {
			platformConsiderations: {
				iOS: {
					reviewGuidelines: "Must comply with App Store Review Guidelines",
					minimumVersion: "iOS 14+ recommended for good market coverage",
					subscription: "Apple takes 30% (15% after year 1) of subscriptions",
					keyFeatures: [
						"HealthKit",
						"ARKit",
						"Core ML",
						"Widgets",
						"App Clips",
					],
				},
				Android: {
					reviewGuidelines: "Must comply with Google Play policies",
					minimumVersion: "Android 8+ recommended for good coverage",
					subscription: "Google takes 30% (15% after year 1) of subscriptions",
					keyFeatures: [
						"Google Fit",
						"ARCore",
						"ML Kit",
						"Widgets",
						"Instant Apps",
					],
				},
			},
		},
	},

	monetizationModels: [
		{
			type: "subscription",
			description:
				"Monthly or annual recurring subscription for premium features",
			pros: ["Predictable revenue", "High LTV potential", "User commitment"],
			cons: [
				"Requires ongoing value",
				"High churn if not essential",
				"Subscription fatigue",
			],
			idealFor:
				"Productivity, Health & Fitness, Education, Utilities - $2.99-$9.99/month or $19.99-$99.99/year",
		},
		{
			type: "in-app-purchase",
			description: "One-time purchases for features, content, or consumables",
			pros: [
				"One-time conversion easier",
				"No ongoing commitment",
				"Higher conversion for consumables",
			],
			cons: ["Unpredictable revenue", "Requires constant content", "Lower LTV"],
			idealFor:
				"Games, Photo/Video, Social, Entertainment - $0.99-$99.99 per purchase",
		},
		{
			type: "advertising",
			description: "Revenue from displaying ads to users",
			pros: [
				"No payment friction",
				"Can scale with users",
				"Simple to implement",
			],
			cons: [
				"Needs massive scale",
				"Poor UX",
				"Low revenue per user",
				"Ad blocker issues",
			],
			idealFor:
				"Games, News, Entertainment, Utilities (with large user base) - $0.05-$2 per 1000 impressions",
		},
		{
			type: "paid-download",
			description: "Upfront payment to download the app",
			pros: ["Immediate revenue", "Simple model", "Premium positioning"],
			cons: [
				"Lower conversion",
				"Hard to compete with free",
				"No recurring revenue",
				"Refund issues",
			],
			idealFor:
				"Premium games, Professional tools, Niche utilities - $0.99-$9.99 one-time",
		},
		{
			type: "hybrid",
			description: "Combination of multiple monetization strategies",
			pros: [
				"Multiple revenue streams",
				"Broader user base",
				"Optimization flexibility",
			],
			cons: [
				"Complex to balance",
				"Can confuse users",
				"Risk of cannibalizing revenue",
			],
			idealFor:
				"Most categories with careful implementation - Free + IAP + subscription tiers",
		},
	],

	commonPitfalls: [
		"Building app when website would suffice (users prefer web for many use cases)",
		"Ignoring app store review guidelines until rejection",
		"Poor onboarding - users delete apps within first session if confused",
		"Requesting permissions too early without context",
		"Underestimating the 30% app store fee impact on revenue",
		"No retention strategy - acquiring users but not keeping them",
		"Launching on both iOS and Android simultaneously (split focus)",
		"Not implementing proper analytics from day one",
		"Ignoring the power of ASO (App Store Optimization)",
	],

	successIndicators: [
		"D1 retention above category average (>40%)",
		"Organic downloads constitute majority of installs",
		"Positive ratings (4.5+) with meaningful volume",
		"Low uninstall rate within first week",
		"Users complete onboarding flow (>60%)",
		"Conversion to paid/subscription within expected range",
		"Word-of-mouth and social sharing happening naturally",
		"Featured by app stores or in 'Top Charts'",
	],

	dealBreakers: [
		"Violates app store policies (sketchy data collection, misleading, etc.)",
		"Requires functionality Apple/Google explicitly ban",
		"Too expensive to acquire users profitably (CAC > 3x LTV)",
		"Category dominated by free apps with huge budgets",
		"No clear retention hook - one-time use case only",
		"Requires constant content creation you can't sustain",
		"Better served by a web app or PWA",
		"Market too niche (can't get to 10K+ users)",
		"Technical requirements beyond team capability",
	],

	extensions: {
		platformSpecificOpportunities: {
			iOS: [
				"Widgets for persistent presence",
				"App Clips for instant lightweight experiences",
				"ARKit for augmented reality features",
				"HealthKit integration for health apps",
				"Shortcuts automation integration",
				"Apple Watch companion app",
			],
			Android: [
				"Home screen widgets with more flexibility",
				"Deep system integrations",
				"Larger market share globally",
				"More flexible file system access",
				"Alternative app stores (though risky)",
				"Wear OS companion app",
			],
		},
	},
};
