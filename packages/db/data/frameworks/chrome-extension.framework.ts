import type { Framework } from "./framework-schema";

/**
 * Chrome Extension / Browser Tool Validation Framework
 *
 * This framework evaluates browser extension and tool ideas.
 *
 * Focus: Chrome Web Store dynamics, user privacy, lightweight value delivery, competition
 */
export const CHROME_EXTENSION_FRAMEWORK: Framework = {
	name: "Chrome Extension / Tool Validation Framework",
	version: "1.0.0",
	ideaType: "chrome-extension" as const,

	description: `
This framework evaluates browser extension ideas with emphasis on:
- Chrome Web Store discoverability
- Privacy and security compliance
- Lightweight, focused functionality
- Quick time-to-value for users
- Cross-browser compatibility potential
- Monetization in constrained environment
`,

	evaluationCriteria: {
		webStoreViability: {
			weight: 0.2,
			description: "Assess competition and discoverability in Chrome Web Store",
			keyQuestions: [
				"How many similar extensions exist?",
				"What are their user counts and ratings?",
				"Can you differentiate meaningfully?",
				"Are there keyword opportunities?",
				"Is the category oversaturated?",
			],
			scoringGuidelines: {
				"9-10": "Clear gap, good keywords, competitors have <50K users",
				"7-8": "Some competition but viable positioning exists",
				"5-6": "Moderate competition, differentiation needed",
				"3-4": "Heavy competition with extensions with millions of users",
				"1-2": "Dominated by well-established extensions",
			},
		},

		focusedUtility: {
			weight: 0.25,
			description: "Does it solve one problem exceptionally well?",
			keyQuestions: [
				"Is the core value immediately obvious?",
				"Does it do one thing really well vs. many things poorly?",
				"Can users understand the benefit in <10 seconds?",
				"Is it something users will use repeatedly?",
				"Does it integrate naturally into browsing workflow?",
			],
			scoringGuidelines: {
				"9-10": "Laser-focused, obvious value, seamless integration",
				"7-8": "Clear primary use case with focused feature set",
				"5-6": "Somewhat focused but feature creep concerns",
				"3-4": "Too broad or unclear primary value",
				"1-2": "Unfocused or solves no clear problem",
			},
		},

		privacyAndSecurity: {
			weight: 0.2,
			description: "Evaluate privacy implications and store policy compliance",
			keyQuestions: [
				"What permissions does it need?",
				"Does it handle sensitive user data?",
				"Will it pass Chrome Web Store review?",
				"Are there privacy concerns users might have?",
				"Can you build trust around data handling?",
			],
			scoringGuidelines: {
				"9-10": "Minimal permissions, no data collection, clear privacy stance",
				"7-8": "Reasonable permissions with clear justification",
				"5-6": "Some sensitive permissions, requires trust building",
				"3-4": "High-risk permissions, difficult to justify",
				"1-2": "Violates store policies or extreme privacy concerns",
			},
		},

		technicalFeasibility: {
			weight: 0.15,
			description: "Assess development complexity",
			keyQuestions: [
				"Can it be built with standard Web Extension APIs?",
				"Are there technical limitations or constraints?",
				"What's the MVP timeline?",
				"Does it require complex backend infrastructure?",
				"Can it work cross-browser (Chrome, Firefox, Edge, Safari)?",
			],
			scoringGuidelines: {
				"9-10":
					"Simple build with standard APIs, MVP in 1-2 weeks, cross-browser ready",
				"7-8": "Moderate complexity, 1 month to MVP, mostly cross-browser",
				"5-6": "Some complex features, 2-3 months, Chrome-specific",
				"3-4": "Very complex, requires advanced APIs, 3-6 months",
				"1-2": "Technically unfeasible or impossible with current browser APIs",
			},
		},

		monetization: {
			weight: 0.15,
			description: "Evaluate revenue potential",
			keyQuestions: [
				"Can users pay via subscription or one-time?",
				"What's the realistic price point?",
				"Is freemium viable?",
				"How many users needed to be sustainable?",
				"Are there alternative revenue streams (affiliate, API access)?",
			],
			scoringGuidelines: {
				"9-10": "Clear willingness to pay $5-20/month, viable freemium model",
				"7-8": "Can charge $2-5/month or $20-50 one-time",
				"5-6": "Low price point but volume potential",
				"3-4": "Hard to monetize, users expect free",
				"1-2": "No viable monetization path",
			},
		},

		userAcquisition: {
			weight: 0.05,
			description: "How will users discover and install the extension?",
			keyQuestions: [
				"Can you rank organically in Web Store search?",
				"Are there communities where target users congregate?",
				"Is there viral potential or sharing mechanics?",
				"Can you leverage existing platforms or integrations?",
				"What's the expected CAC?",
			],
			scoringGuidelines: {
				"9-10": "Strong organic discovery, viral features, active community",
				"7-8": "Good SEO potential or viable acquisition channels",
				"5-6": "Challenging but possible with effort",
				"3-4": "Very difficult to acquire users",
				"1-2": "No clear discovery path",
			},
		},
	},

	specificRequirements: {
		targetMetrics: {
			installToActive: ">70%",
			weeklyActiveUsers: ">50% of installs",
			rating: ">4.0 stars",
			targetUsers: "1000+ for viability",
			uninstallRate: "<10% weekly",
		},
		criticalFactors: [
			"Minimal permission requests",
			"Instant value on first use",
			"Fast, lightweight performance",
			"Clear privacy policy",
			"Responsive to user feedback",
		],
		additionalRequirements: {
			chromeWebStorePolicy: {
				prohibited: [
					"Extensions that mine cryptocurrency",
					"Extensions with obfuscated code",
					"Extensions that modify browser settings without consent",
					"Extensions that collect data without disclosure",
					"Extensions with misleading functionality",
				],
				required: [
					"Clear, honest description of functionality",
					"Justify all requested permissions",
					"Privacy policy if collecting any data",
					"Single purpose description",
					"Functional icon and screenshots",
				],
			},
		},
	},

	monetizationModels: [
		{
			type: "freemium",
			description:
				"Free with premium features - typical: $2-10/month or $20-50 one-time",
			pros: [
				"Lower barrier to entry",
				"Viral potential",
				"Can build trust first",
			],
			cons: [
				"Conversion challenge",
				"Support free users",
				"Feature balance difficult",
			],
			idealFor: "Productivity tools, enhancement tools",
		},
		{
			type: "trial-to-paid",
			description: "7-14 day trial then pay - typical: $3-15/month",
			pros: [
				"Users experience full value",
				"Higher conversion than freemium",
				"Clear commitment",
			],
			cons: [
				"Higher install friction",
				"More refund requests",
				"Shorter trial needed to convert",
			],
			idealFor: "Professional tools, developer tools",
		},
		{
			type: "one-time-purchase",
			description: "One-time payment for lifetime access - typical: $10-50",
			pros: [
				"Simple to understand",
				"No subscription fatigue",
				"Easier to justify",
			],
			cons: [
				"No recurring revenue",
				"Hard to sustain development",
				"Can't grow MRR",
			],
			idealFor: "Niche utilities, one-time-setup tools",
		},
		{
			type: "donation",
			description: "Free with optional donations - typical: $1-10 donations",
			pros: [
				"No monetization friction",
				"Good for open source",
				"Community goodwill",
			],
			cons: [
				"Very low conversion (<1%)",
				"Unsustainable for full-time",
				"Inconsistent income",
			],
			idealFor: "Passion projects, side projects, building reputation",
		},
	],

	commonPitfalls: [
		"Requesting excessive permissions that scare users away",
		"Building features before validating core value proposition",
		"Ignoring Chrome Web Store SEO and screenshots",
		"No clear monetization strategy from day one",
		"Performance issues (slow, memory-heavy)",
		"Poor onboarding - users don't know how to use it",
		"Trying to do too much instead of solving one problem well",
		"Not handling edge cases (different websites behave differently)",
		"Forgetting to test across different Chrome versions",
	],

	successIndicators: [
		"First 100 users install and keep it active",
		"4.5+ star rating in Chrome Web Store",
		"Users mention it solves a specific pain point in reviews",
		"Growing organic installs from Web Store search",
		"Low uninstall rate (<10% within first week)",
		"Freemium conversion rate >3% or trial conversion >20%",
		"Users share it in relevant communities organically",
		"Requests for Firefox/Edge versions appear",
	],

	dealBreakers: [
		"Requires permissions users won't grant (privacy concerns)",
		"Violates Chrome Web Store policies",
		"Technical limitations make core feature impossible",
		"Category completely dominated (e.g., ad blockers)",
		"Users expect it to be completely free (no monetization path)",
		"Requires constant backend maintenance you can't sustain",
		"Target audience too small (<10K potential users globally)",
		"Depends on third-party API that could shut down",
		"Performance impact is unacceptable to users",
	],

	extensions: {
		permissionConsiderations: {
			minimal: {
				risk: "Low",
				examples: ["activeTab", "storage", "alarms"],
				userConcern: "Low - users comfortable installing",
			},
			moderate: {
				risk: "Medium",
				examples: ["tabs", "webRequest", "cookies", "downloads"],
				userConcern: "Moderate - need clear justification",
			},
			sensitive: {
				risk: "High",
				examples: ["<all_urls>", "webRequestBlocking", "history", "bookmarks"],
				userConcern: "High - significant trust barrier",
			},
			extreme: {
				risk: "Very High",
				examples: ["geolocation", "webcam", "microphone", "debugger"],
				userConcern: "Extreme - most users will not install",
			},
		},
		crossBrowserConsiderations: {
			chrome: {
				marketShare: "~65% desktop browser market",
				apis: "Most comprehensive Web Extension API",
				review: "Automated + manual review, typically 1-3 days",
			},
			firefox: {
				marketShare: "~3% desktop browser market",
				apis: "Similar to Chrome with some differences",
				review: "Manual review, can take 1-2 weeks",
			},
			edge: {
				marketShare: "~5% desktop browser market",
				apis: "Same as Chrome (Chromium-based)",
				review: "Similar to Chrome, slightly faster",
			},
			safari: {
				marketShare: "~20% desktop (Mac only)",
				apis: "More limited, requires Xcode and Mac",
				review: "App Store review process, can take weeks",
			},
		},
	},

	idealCharacteristics: [
		"Solves a frequent, annoying micro-problem",
		"Works seamlessly without configuration",
		"Requires minimal permissions",
		"Lightweight and fast (<1MB, <10ms execution)",
		"Visual or functional enhancement users notice immediately",
		"Integrates with popular websites/tools",
		"Price point of $3-10/month or $20-40 one-time",
		"Can be described in one sentence",
		"Works offline or with minimal server dependency",
	],
};
