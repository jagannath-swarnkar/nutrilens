import HealthConditions from "./health.model";
import Nutrient from "../nutrient/nutrient.model";
import Foods from "../food/food.model";
import { FilterQuery } from "mongoose";

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

/** Manually populate nutrientRules and foodOverrides using custom string IDs */
const populateHealthRefs = async (condition: Record<string, any>) => {
	const nutrientIds = [
		...(condition.nutrientRules?.recommended || []),
		...(condition.nutrientRules?.limited || []),
		...(condition.nutrientRules?.avoided || [])
	];

	const foodIds = [
		...(condition.foodOverrides?.recommended || []),
		...(condition.foodOverrides?.limited || []),
		...(condition.foodOverrides?.avoided || [])
	];

	const [nutrients, foods] = await Promise.all([
		nutrientIds.length > 0
			? Nutrient.find({ nutritionId: { $in: nutrientIds } }, { __v: 0 }).lean()
			: [],
		foodIds.length > 0
			? Foods.find({ foodId: { $in: foodIds } }, { __v: 0 }).lean()
			: []
	]);

	const nutrientMap = new Map(nutrients.map((n) => [n.nutritionId, n]));
	const foodMap = new Map(foods.map((f) => [f.foodId, f]));

	const mapNutrients = (ids: string[]) => ids.map((id) => nutrientMap.get(id) || id);
	const mapFoods = (ids: string[]) => ids.map((id) => foodMap.get(id) || id);

	if (condition.nutrientRules) {
		condition.nutrientRules = {
			recommended: mapNutrients(condition.nutrientRules.recommended || []),
			limited: mapNutrients(condition.nutrientRules.limited || []),
			avoided: mapNutrients(condition.nutrientRules.avoided || [])
		};
	}

	if (condition.foodOverrides) {
		condition.foodOverrides = {
			recommended: mapFoods(condition.foodOverrides.recommended || []),
			limited: mapFoods(condition.foodOverrides.limited || []),
			avoided: mapFoods(condition.foodOverrides.avoided || [])
		};
	}

	return condition;
};

export interface IHealthFilters {
	search?: string;
	category?: string;
	page?: number;
	limit?: number;
}

interface HealthDbFilter {
	$or?: Array<Record<string, RegExp>>;
	categories?: string;
}

export const getAllHealthConditionsService = async (filters: IHealthFilters) => {
	const { search, category, page = 1, limit = 500 } = filters;
	const skip = (page - 1) * limit;

	const dbFilter: HealthDbFilter = {};

	if (search) {
		const escaped = escapeRegex(search);
		const regex = new RegExp(escaped, "i");
		dbFilter.$or = [
			{ name: regex },
			{ slug: regex },
			{ aliases: regex },
			{ variants: regex }
		];
	}
	if (category) dbFilter.categories = category.toLowerCase();

	const [conditions, total] = await Promise.all([
		HealthConditions.find(dbFilter as FilterQuery<typeof HealthConditions>, { __v: 0 })
			.sort({ name: 1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		HealthConditions.countDocuments(dbFilter as FilterQuery<typeof HealthConditions>)
	]);

	return { conditions, total };
};

export const getHealthBySlugOrIdService = async (identifier: string) => {
	const condition = await HealthConditions.findOne(
		{ $or: [{ slug: identifier }, { healthConditionId: identifier }] },
		{ __v: 0 }
	).lean();

	if (!condition) return null;
	return populateHealthRefs(condition);
};

export const getAllHealthCategoriesService = async () => {
	return HealthConditions.distinct("categories");
};
