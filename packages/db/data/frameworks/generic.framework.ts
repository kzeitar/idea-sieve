import type { Framework } from "./framework-schema";

/**
 * Generic Validation Framework
 *
 * This framework evaluates ideas that don't fit into predefined categories.
 *
 * Focus: Universal business viability factors applicable to any digital product or service
 */
export const GENERIC_FRAMEWORK: Framework = {
	name: "Generic Validation Framework",
	version: "1.0.0",
	ideaType: "generic" as const,

	description: `
This framework evaluates any digital product or service idea with emphasis on:
- Market opportunity and demand
- Competitive positioning
- Feasibility with available resources
- Revenue generation potential
- Customer acquisition viability
- Long-term sustainability
`,

	evaluationCriteria: {
		marketOpportunity: {
			weight: 0.25,
			description: "Assess market size, growth, and real demand",
			keyQuestions: [
				"Is there a clear, sizable market for this?",
				"What evidence exists that people have this problem?",
				"How are people currently solving this problem?",
				"Is the market growing, stable, or shrinking?",
				"What is the realistic addressable market size?",
			],
			scoringGuidelines: {
				"9-10": "Large or rapidly growing market with clear, validated demand",
				"7-8": "Substantial market with evidence of real pain points",
				"5-6": "Moderate market with some validation needed",
				"3-4": "Small or uncertain market with weak demand signals",
				"1-2": "No clear market or demand evidence",
			},
		},

		competitivePosition: {
			weight: 0.2,
			description: "Evaluate competitive landscape and differentiation",
			keyQuestions: [
				"Who are the main competitors (direct and indirect)?",
				"What makes this meaningfully different or better?",
				"Can you realistically compete against incumbents?",
				"Is there a defensible moat or competitive advantage?",
				"What would prevent others from copying this?",
			],
			scoringGuidelines: {
				"9-10": "Unique approach with defensible advantages, weak competition",
				"7-8": "Clear differentiation with competitive positioning",
				"5-6": "Some differentiation but competitive",
				"3-4": "Minor differentiation, strong incumbents",
				"1-2": "No differentiation or impossible to compete",
			},
		},

		feasibility: {
			weight: 0.2,
			description: "Assess ability to actually build and deliver this",
			keyQuestions: [
				"Do you have or can you acquire the necessary skills?",
				"What resources (time, money, people) are required?",
				"Are there technical, regulatory, or other barriers?",
				"What's the realistic timeline to launch?",
				"What could prevent this from being built?",
			],
			scoringGuidelines: {
				"9-10": "Highly feasible with current resources and skills",
				"7-8": "Feasible with reasonable effort or learning",
				"5-6": "Challenging but achievable with effort",
				"3-4": "Very difficult, major obstacles exist",
				"1-2": "Unfeasible with available resources",
			},
		},

		revenueModel: {
			weight: 0.2,
			description: "Evaluate how this will generate revenue",
			keyQuestions: [
				"How will this make money?",
				"What can you realistically charge?",
				"What's the unit economics (cost to serve vs revenue)?",
				"How many customers needed to be sustainable?",
				"Is there evidence people will pay?",
			],
			scoringGuidelines: {
				"9-10": "Clear, proven revenue model with healthy unit economics",
				"7-8": "Viable revenue model with realistic pricing",
				"5-6": "Possible monetization but unproven",
				"3-4": "Weak monetization or poor unit economics",
				"1-2": "No viable way to generate revenue",
			},
		},

		customerAcquisition: {
			weight: 0.15,
			description: "Evaluate ability to find and acquire customers",
			keyQuestions: [
				"Who specifically is the target customer?",
				"Where do they spend time (online/offline)?",
				"How will they discover this product/service?",
				"What's the expected cost to acquire a customer?",
				"Is there organic growth potential?",
			],
			scoringGuidelines: {
				"9-10": "Clear target customer with proven acquisition channels",
				"7-8": "Defined customer with viable acquisition plan",
				"5-6": "Somewhat clear customer, uncertain acquisition",
				"3-4": "Vague customer definition, difficult to reach",
				"1-2": "No clear customer or acquisition path",
			},
		},
	},

	specificRequirements: {
		targetMetrics: {
			minimumViabilityChecks:
				"Problem is real, solution buildable, revenue path clear, customers reachable",
		},
		criticalFactors: [
			"Market demand validation",
			"Competitive differentiation",
			"Executable with available resources",
			"Viable business model",
			"Scalable or sustainable",
		],
	},

	validationSteps: [
		{
			phase: "Discovery",
			title: "Customer Discovery",
			description: "Validate that the problem exists and people care",
			actions: [
				"Interview 20-50 potential customers",
				"Survey broader audience for quantitative data",
				"Observe how people currently solve the problem",
				"Join communities where target customers congregate",
				"Analyze search volume and social discussions",
			],
			successCriteria:
				"At least 60% of interviews validate the problem as significant",
			estimatedTime: "2-4 weeks",
		},
		{
			phase: "Analysis",
			title: "Competitive Analysis",
			description: "Understand the competitive landscape thoroughly",
			actions: [
				"Identify all direct and indirect competitors",
				"Analyze their offerings, pricing, and positioning",
				"Read competitor reviews to find gaps",
				"Understand their customer acquisition strategies",
				"Assess their strengths and weaknesses",
			],
			successCriteria:
				"Clear positioning exists that's differentiated and defensible",
			estimatedTime: "1-2 weeks",
		},
		{
			phase: "Validation",
			title: "MVP Validation",
			description: "Build minimum version to test core value proposition",
			actions: [
				"Define the absolute minimum feature set",
				"Build or prototype the core functionality",
				"Get it in front of real users quickly",
				"Measure actual usage and feedback",
				"Iterate based on real data",
			],
			successCriteria:
				"Users demonstrate the problem is solved and would pay for solution",
			estimatedTime: "4-8 weeks",
		},
		{
			phase: "Economics",
			title: "Economics Validation",
			description: "Prove the business model can work",
			actions: [
				"Calculate realistic customer acquisition cost",
				"Determine actual willingness to pay through testing",
				"Model unit economics at various scales",
				"Project cash flow and runway needs",
				"Identify break-even point",
			],
			successCriteria:
				"Path to profitability is clear with realistic assumptions",
			estimatedTime: "2-4 weeks",
		},
	],

	commonPitfalls: [
		"Solution looking for a problem (building what you want vs what's needed)",
		"Underestimating the difficulty of customer acquisition",
		"Overestimating willingness to pay or market size",
		"Ignoring competitive responses from incumbents",
		"Building too much before validating core assumptions",
		"Targeting too broad a market initially",
		"Underestimating time and resources required",
		"No clear path from current state to profitability",
		"Dependency on uncontrollable third parties",
	],

	successIndicators: [
		"Customers express strong interest or pre-pay",
		"Problem is frequently mentioned in target communities",
		"Clear evidence of existing market spend",
		"You have unique insights or advantages in this space",
		"Path to first revenue is clear and near-term",
		"Word-of-mouth potential is obvious",
		"Unit economics work even at small scale",
	],

	dealBreakers: [
		"No evidence of real demand despite search",
		"Fundamentally impossible with current technology",
		"Requires resources far beyond what's available",
		"Legal/regulatory barriers make it unfeasible",
		"Market controlled by one or two players with network effects",
		"No viable revenue model exists",
		"Customer acquisition cost exceeds potential lifetime value",
		"Timing is wrong (too early or too late)",
		"Requires behavior change that's highly unlikely",
	],

	extensions: {
		additionalConsiderations: {
			regulatoryCompliance: {
				checkFor: [
					"Industry-specific regulations",
					"Data privacy laws (GDPR, CCPA, etc.)",
					"Licensing requirements",
					"Insurance needs",
					"Industry certifications",
				],
				impact: "Can add 6-18 months and significant cost if overlooked",
			},
			networkEffects: {
				types: [
					"Direct: More users = more value for all users",
					"Indirect: Platform connecting two sides",
					"Data: More usage = better product",
				],
				importance: "Can create winner-take-all dynamics and defensibility",
			},
			timing: {
				questions: [
					"Why is this the right time for this idea?",
					"Are there technology enablers now that didn't exist before?",
					"Is there a cultural or market shift happening?",
					"Is this too early or too late?",
				],
			},
			scalability: {
				dimensions: [
					"Can you serve 10x users without 10x costs?",
					"Does operational complexity increase linearly or exponentially?",
					"Are there physical/geographic constraints?",
					"Can you maintain quality at scale?",
				],
			},
		},
	},
};
