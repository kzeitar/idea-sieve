/**
 * Database Seed Script
 *
 * This script seeds the database with initial data:
 * - All validation frameworks from frameworks.json
 */

import { getAllFrameworks } from "../data/frameworks";
import prisma from "../src";

async function main() {
	console.log("🌱 Starting database seeding...");

	// Seed Frameworks
	console.log("\n📚 Seeding frameworks...");

	const frameworks = getAllFrameworks();

	for (const framework of frameworks) {
		const result = await prisma.framework.upsert({
			where: { ideaType: framework.ideaType },
			update: {
				name: framework.name,
				version: framework.version,
				description: framework.description.trim(),
				frameworkData: framework as any,
			},
			create: {
				ideaType: framework.ideaType,
				name: framework.name,
				version: framework.version,
				description: framework.description.trim(),
				frameworkData: framework as any,
			},
		});

		console.log(
			`  ✅ ${result.name} (${result.ideaType}) - version ${result.version}`,
		);
	}

	console.log(`\n✨ Successfully seeded ${frameworks.length} frameworks!`);
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
