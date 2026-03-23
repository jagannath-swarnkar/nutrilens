import FoodModel from "../modules/food/food.model";

/**
 * Returns global foods that match any of the given tags
 */
export const getFoodsByTags = async (tags: string[]) => {
    return FoodModel.find({ isGlobal: true, tags: { $in: tags } }, { __v: 0 }).lean();
};

/**
 * Returns global foods that contain any of the given nutrient names (case-insensitive)
 */
export const getFoodsByNutrientNames = async (nutrientNames: string[]) => {
    const regexArr = nutrientNames.map((n) => new RegExp(n, "i"));
    return FoodModel.find(
        { isGlobal: true, "nutritionGroups.nutrients.name": { $in: regexArr } },
        { __v: 0 }
    ).lean();
};
