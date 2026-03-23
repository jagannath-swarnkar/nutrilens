import FoodModel from "./food.model";
import Nutrient from "../nutrient/nutrient.model";
import HealthConditions from "../health/health.model";
import { FilterQuery } from "mongoose";

// Escapes special regex metacharacters to prevent invalid-regex 500s from raw user input
// eslint-disable-next-line unicorn/prefer-string-replace-all
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

type FoodCategory = "fruit" | "vegetable" | "grain" | "protein" | "dairy" | "nuts" | "seeds" | "legume";
type HealthStatus = "recommended" | "limited" | "avoid" | "neutral";

/** Manually populate nutrient and health refs using custom string IDs */
const populateFoodRefs = async (food: Record<string, any>) => {
	const nutrientIds = new Set<string>();
	const healthIds = new Set<string>();

	for (const group of food.nutritionGroups || []) {
		for (const n of group.nutrients || []) {
			if (n.nutrientId && typeof n.nutrientId === "string") nutrientIds.add(n.nutrientId);
		}
	}
	for (const he of food.healthEffects || []) {
		if (he.healthConditionId && typeof he.healthConditionId === "string") healthIds.add(he.healthConditionId);
	}

	const [nutrients, conditions] = await Promise.all([
		nutrientIds.size > 0
			? Nutrient.find({ nutritionId: { $in: [...nutrientIds] } }, { __v: 0 }).lean()
			: [],
		healthIds.size > 0
			? HealthConditions.find({ healthConditionId: { $in: [...healthIds] } }, { __v: 0 }).lean()
			: []
	]);

	const nutrientMap = new Map(nutrients.map((n) => [n.nutritionId, n]));
	const healthMap = new Map(conditions.map((c) => [c.healthConditionId, c]));

	for (const group of food.nutritionGroups || []) {
		for (const n of group.nutrients || []) {
			if (typeof n.nutrientId === "string") {
				n.nutrientId = nutrientMap.get(n.nutrientId) || n.nutrientId;
			}
		}
	}
	for (const he of food.healthEffects || []) {
		if (typeof he.healthConditionId === "string") {
			he.healthConditionId = healthMap.get(he.healthConditionId) || he.healthConditionId;
		}
	}

	return food;
};

export interface IFoodFilters {
	search?: string;
	nutrient?: string;
	category?: string;
	tag?: string;
	healthKey?: string;
	healthStatus?: string;
	page?: number;
	limit?: number;
}

interface HealthMatchFilter {
	key: string;
	status?: HealthStatus;
}

interface FoodDbFilter {
	name?: RegExp;
	category?: FoodCategory;
	tags?: string;
	"nutritionGroups.nutrients.name"?: RegExp;
	healthEffects?: { $elemMatch: HealthMatchFilter };
}

// ─── Service functions ────────────────────────────────────────────────────────

export const getAllFoodsService = async (filters: IFoodFilters) => {
	const { search, nutrient, category, tag, healthKey, healthStatus, page = 1, limit = 500 } = filters;
	const skip = (page - 1) * limit;

	const dbFilter: FoodDbFilter = {};

	if (search)   dbFilter.name = new RegExp(escapeRegex(search), "i");
	if (category) dbFilter.category = category.toLowerCase() as FoodCategory;
	if (tag)      dbFilter.tags = tag;
	if (nutrient) dbFilter["nutritionGroups.nutrients.name"] = new RegExp(escapeRegex(nutrient), "i");
	if (healthKey) {
		const healthMatch: HealthMatchFilter = { key: healthKey };
		if (healthStatus) healthMatch.status = healthStatus as HealthStatus;
		dbFilter.healthEffects = { $elemMatch: healthMatch };
	}

	const [foods, total] = await Promise.all([
		FoodModel.find(dbFilter as FilterQuery<typeof FoodModel>, { __v: 0 })
			.sort({ name: 1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		FoodModel.countDocuments(dbFilter as FilterQuery<typeof FoodModel>),
	]);

	return { foods, total };
};


export const getFoodBySlugOrFoodIdService = async (identifier: string) => {
	const food = await FoodModel.findOne(
		{ $or: [{ slug: identifier }, { foodId: identifier }] },
		{ __v: 0 }
	).lean();

	if (!food) return null;
	return populateFoodRefs(food);
};

export const getAllCategoriesService = async () => {
	return FoodModel.distinct("category");
};
