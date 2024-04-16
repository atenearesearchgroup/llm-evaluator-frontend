import { Interaction, Draft, db } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	// TODO
	await db.insert(Draft).values([
		{ id: 1, title: "Amphibious Vehicle", currentPhase: "zero", lastDate: new Date() },
		{ id: 2, title: "Purchase Order", currentPhase: "zero", lastDate: new Date() }
	]);
	// await db.insert(Interaction).values([
	// 	{ phaseId: 'zero', draftId: 1, prompt: "What is the name of the vehicle?", response: "Amphibious Vehicle", score: 0, date: new Date() },
	// 	{ phaseId: 'classes_prompt', draftId: 1, prompt: "What is the cost of the vehicle?", response: "100000", score: 0, date: new Date() },
	// 	{ phaseId: 'zero', draftId: 2, prompt: "What is the name of the product?", response: "Purchase Order", score: 0, date: new Date() },
	// ])
}
