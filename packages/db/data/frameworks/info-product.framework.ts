import type { Framework } from "./framework-schema";

/**
 * Info Product Validation Framework
 *
 * This framework evaluates information products (courses, ebooks, templates, etc.).
 *
 * Focus: Audience building, expertise credibility, pricing, delivery format, market demand
 */
export const INFO_PRODUCT_FRAMEWORK: Framework = {
	name: "Info Product Validation Framework",
	version: "1.0.0",
	ideaType: "info-product" as const,

	description: `
This framework evaluates information product ideas with emphasis on:
- Your credibility and expertise in the topic
- Proven audience or ability to build one
- Clear transformation or outcome for customers
- Pricing strategy and willingness to pay
- Competition from free content
- Delivery format and production quality
`,

	evaluationCriteria: {
		expertiseAndCredibility: {
			weight: 0.25,
			description: "Do you have the credibility to teach this topic?",
			keyQuestions: [
				"What are your credentials or results in this area?",
				"Do you have proof of expertise (portfolio, case studies, testimonials)?",
				"Are you known in the community for this topic?",
				"Can you demonstrate you've achieved what you're teaching?",
				"Why should someone learn from you vs others?",
			],
			scoringGuidelines: {
				"9-10": "Well-known expert with proven results and strong credibility",
				"7-8": "Clear expertise with demonstrable results and some recognition",
				"5-6": "Some expertise but limited proof or recognition",
				"3-4": "Questionable expertise, little proof of results",
				"1-2": "No credible expertise in the topic",
			},
		},

		audienceAndDistribution: {
			weight: 0.25,
			description: "Do you have or can you build an audience?",
			keyQuestions: [
				"Do you have an existing audience (email, social, YouTube)?",
				"How many potential customers can you reach?",
				"What's your content strategy to build audience?",
				"Can you partner with others who have audiences?",
				"What organic discovery channels exist?",
			],
			scoringGuidelines: {
				"9-10": "Existing audience of 10K+ engaged followers in niche",
				"7-8": "Growing audience or clear path to reach target customers",
				"5-6": "Small audience but viable organic growth channels",
				"3-4": "No audience and unclear how to reach customers",
				"1-2": "No distribution and no viable path to customers",
			},
		},

		transformationClarity: {
			weight: 0.2,
			description: "Is the transformation/outcome clear and valuable?",
			keyQuestions: [
				"What specific outcome will customers achieve?",
				"Is the transformation measurable?",
				"How long does it take to see results?",
				"Is this a burning pain point or nice-to-have?",
				"Can you guarantee or show proof of results?",
			],
			scoringGuidelines: {
				"9-10":
					"Crystal clear, measurable transformation that solves burning pain",
				"7-8": "Clear outcome with evidence it's achievable and valuable",
				"5-6": "Somewhat clear transformation but may be soft/hard to measure",
				"3-4": "Vague outcomes or questionable value",
				"1-2": "No clear transformation or value proposition",
			},
		},

		competitiveAdvantage: {
			weight: 0.15,
			description: "Why buy yours vs free content or competitors?",
			keyQuestions: [
				"What makes your approach unique or better?",
				"Is there high-quality free content on this topic?",
				"What competitive courses/products exist?",
				"What's your unique angle or methodology?",
				"Can you deliver this better than alternatives?",
			],
			scoringGuidelines: {
				"9-10": "Unique methodology/approach with no direct alternatives",
				"7-8": "Clear differentiation from free and paid alternatives",
				"5-6": "Some differentiation but competitive landscape crowded",
				"3-4": "Marginal differentiation, lots of alternatives",
				"1-2": "No differentiation, commoditized topic with free alternatives",
			},
		},

		pricingAndWillingness: {
			weight: 0.15,
			description: "Can you price this profitably and will people pay?",
			keyQuestions: [
				"What can you realistically charge?",
				"What are comparable products priced at?",
				"Is the outcome valuable enough to justify price?",
				"What's the target customer's ability to pay?",
				"Can you validate willingness to pay before building?",
			],
			scoringGuidelines: {
				"9-10": "Can charge $500+ with strong willingness to pay validation",
				"7-8": "Can charge $200-500 with evidence people will pay",
				"5-6": "Can charge $50-200 but uncertain demand",
				"3-4": "Low price point (<$50) or unclear willingness to pay",
				"1-2": "No one would pay for this information",
			},
		},
	},

	specificRequirements: {
		minimumMarketSize:
			"Depends on niche, but generally 1,000+ engaged followers or ability to reach 10,000+ through paid ads",
		targetMetrics: {
			conversionRate: "2-5% for warm audience, 0.5-2% for cold traffic",
			productionTime: "2-8 weeks for first version",
			refundRate: "<5%",
			completionRate: ">40% for courses",
			testimonialsNeeded: "3-5 strong testimonials minimum",
		},
		criticalFactors: [
			"Credible expertise and proof of results",
			"Existing audience or clear acquisition strategy",
			"Specific, measurable transformation",
			"Differentiation from free content",
			"Price point that allows profitability",
			"Production quality meets market standards",
		],
	},

	validationSteps: [
		{
			phase: "Phase 1",
			title: "Validate Demand",
			description: "Validate demand before creating content",
			actions: [
				"Create landing page with promise of transformation",
				"Offer pre-sale or waitlist at target price",
				"Run small ad campaign to gauge interest",
				"Survey target audience about pain points",
				"Analyze competitor offerings and gaps",
			],
			successCriteria: "100+ waitlist signups or 10+ pre-sales",
			estimatedTime: "2-4 weeks",
		},
		{
			phase: "Phase 2",
			title: "Create MVP",
			description: "Create minimum viable product quickly",
			actions: [
				"Outline curriculum or content structure",
				"Create first 20-30% of content",
				"Recruit 10-20 beta customers at discount",
				"Deliver to beta group and gather feedback",
				"Iterate based on feedback and results",
			],
			successCriteria: ">70% beta completion, 5+ strong testimonials",
			estimatedTime: "4-8 weeks",
		},
		{
			phase: "Phase 3",
			title: "Scale",
			description: "Refine and scale to wider audience",
			actions: [
				"Complete remaining content with learnings",
				"Set up automated delivery and onboarding",
				"Develop marketing funnel with retargeting",
				"Launch affiliate or referral program",
				"Scale paid acquisition if LTV > 3x CAC",
			],
			successCriteria: "Profitable customer acquisition, growing MRR/sales",
			estimatedTime: "Ongoing",
		},
	],

	commonPitfalls: [
		"Creating content before validating demand",
		"Not building audience before launching",
		"Poor production quality that doesn't meet market standards",
		"Pricing too low to be profitable after ads/marketing",
		"Teaching something you haven't mastered yourself",
		"No unique angle or methodology - just rehashing existing content",
		"Overproducing - making it perfect instead of validating",
		"No clear transformation or outcome for customers",
		"Ignoring completion rates and student success",
		"Not collecting testimonials and social proof early",
		"Launching without email list or retargeting setup",
	],

	successIndicators: [
		"Pre-sales or waitlist sign-ups before creating content",
		"Existing audience engaging with free content on topic",
		"Clear testimonials from beta customers",
		">50% completion rate for courses",
		"<5% refund rate",
		"Students achieving promised transformation",
		"Organic word-of-mouth and referrals",
		"Profitable customer acquisition (LTV > 3x CAC)",
		"Building email list of engaged potential customers",
	],

	dealBreakers: [
		"No credible expertise or results in the topic",
		"Topic completely saturated with high-quality free content",
		"No audience and no viable way to reach target customers",
		"Transformation is not valuable or measurable",
		"Unable to differentiate from existing alternatives",
		"Price point too low to profitably acquire customers",
		"Regulatory/legal issues with teaching this topic",
		"Can't produce content at quality level market expects",
		"Topic too broad or vague to teach effectively",
	],

	extensions: {
		productTypes: {
			course: {
				description: "Video or text-based educational course",
				priceRange: "$99 - $2,000+",
				productionTime: "4-12 weeks",
				pros: [
					"Highest price point",
					"Can include community",
					"Reusable content",
				],
				cons: [
					"High production effort",
					"Completion rates often low",
					"Requires ongoing support",
				],
				bestFor: "Complex topics requiring step-by-step instruction",
			},
			ebook: {
				description: "Written guide or book",
				priceRange: "$7 - $99",
				productionTime: "2-8 weeks",
				pros: ["Quick to produce", "Easy to deliver", "Low overhead"],
				cons: [
					"Lower price point",
					"High competition",
					"Perceived as less valuable",
				],
				bestFor: "Tactical knowledge, frameworks, specific processes",
			},
			templates: {
				description: "Ready-to-use templates, spreadsheets, or tools",
				priceRange: "$19 - $199",
				productionTime: "1-4 weeks",
				pros: [
					"Fast production",
					"Clear immediate value",
					"Low support burden",
				],
				cons: [
					"Can be copied easily",
					"Less teaching involved",
					"Lower price points",
				],
				bestFor: "Practical, plug-and-play solutions",
			},
			membership: {
				description: "Ongoing access to content and community",
				priceRange: "$19 - $199/month",
				productionTime: "Ongoing",
				pros: ["Recurring revenue", "Community value", "Continuous learning"],
				cons: [
					"Requires constant content creation",
					"Churn risk",
					"Higher support needs",
				],
				bestFor: "Rapidly evolving topics, community-driven learning",
			},
			cohortBased: {
				description: "Live, time-bound group learning experience",
				priceRange: "$500 - $5,000+",
				productionTime: "2-4 weeks prep + live delivery",
				pros: ["Premium pricing", "High completion rates", "Strong community"],
				cons: ["Not scalable", "Time-intensive", "Limited to cohort size"],
				bestFor: "Transformation-heavy topics, accountability needed",
			},
			workshop: {
				description: "Short, intensive live or recorded session",
				priceRange: "$49 - $499",
				productionTime: "1-2 weeks",
				pros: ["Quick to produce", "Clear outcome", "Can record and resell"],
				cons: ["One-time pricing", "Limited depth", "Competitive"],
				bestFor: "Specific skills, tactical knowledge, quick wins",
			},
		},
		audienceBuilding: {
			organic: [
				"Consistent content marketing (blog, YouTube, podcast)",
				"Social media presence in niche communities",
				"Guest appearances on podcasts/channels",
				"Speaking at events and conferences",
				"SEO for topic-related searches",
				"Free lead magnets and email list building",
				"Active participation in relevant communities",
			],
			paid: [
				"Facebook/Instagram ads to lookalike audiences",
				"YouTube ads targeting competitor videos",
				"Google ads for commercial intent keywords",
				"Sponsored content with influencers",
				"Affiliate partnerships with related products",
				"Podcast sponsorships in niche",
			],
			partnerships: [
				"Co-marketing with complementary products",
				"Affiliate programs with existing audiences",
				"Guest expert in other people's courses",
				"Bundle deals with related products",
				"Platform partnerships (Udemy, Skillshare, etc.)",
			],
		},
	},

	idealCharacteristics: [
		"You have proven results and credibility in topic",
		"Existing audience of 1,000+ or growing quickly",
		"Clear, measurable transformation customers want",
		"Unique methodology or approach",
		"Can charge $200+ profitably",
		"Topic not commoditized by high-quality free content",
		"You're passionate and can consistently create content",
		"Strong understanding of target customer pain points",
		"Able to provide ongoing support and updates",
		"Market is growing or stable, not declining",
	],
};
