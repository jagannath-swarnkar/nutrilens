import Nutrient from "./nutrient.model";
import HealthConditions from "../health/health.model";

export const getAllNutrientsService = async (search?: string) => {
	const filter: Record<string, unknown> = {};
	if (search) {
		// eslint-disable-next-line unicorn/prefer-string-replace-all
		const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
		filter.$or = [
			{ name: new RegExp(escaped, "i") },
			{ slug: new RegExp(escaped, "i") },
			{ description: new RegExp(escaped, "i") }
		];
	}
	return Nutrient.find(filter, { __v: 0 }).sort({ name: 1 }).lean();
};

export const getNutrientByIdOrSlugService = async (identifier: string) => {
	const nutrient = await Nutrient.findOne(
		{ $or: [{ nutritionId: identifier }, { slug: identifier }] },
		{ __v: 0 }
	).lean();

	if (!nutrient) return null;

	const healthIds = [
		...(nutrient.recommendedFor || []),
		...(nutrient.avoidFor || [])
	];

	if (healthIds.length === 0) return nutrient;

	const conditions = await HealthConditions.find(
		{ healthConditionId: { $in: healthIds } },
		{ __v: 0 }
	).lean();

	const healthMap = new Map(conditions.map((c) => [c.healthConditionId, c]));

	const result: Record<string, unknown> = { ...nutrient };
	result.recommendedFor = (nutrient.recommendedFor || []).map(
		(id: string) => healthMap.get(id) || id
	);
	result.avoidFor = (nutrient.avoidFor || []).map(
		(id: string) => healthMap.get(id) || id
	);

	return result;
};
