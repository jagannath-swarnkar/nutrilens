import { Schema, model } from "mongoose";

const FoodNutritionSchema = new Schema({
	nutrientId: { type: String, ref: "Nutrient", required: true },
    name: { type: String, required: true },
	value: { type: Number, required: true },
	unit: { type: String, required: true },
	level: {
		type: String,
		enum: ["low", "medium", "high", "very_high", "none"],
		required: true
	},
	note: { type: String, default: null }
});

const NutritionGroupSchema = new Schema(
	{
		groupName: { type: String, required: true }, // "Vitamins", "Minerals", "Fiber", "Antioxidants", "Macros"
		emoji: { type: String, default: null },
		nutrients: [FoodNutritionSchema]
	},
	{ _id: false }
);

const HealthEffectSchema = new Schema(
	{
		key: { type: String, required: true, index: true }, // "diabetes", "weight_loss", "thyroid", "heart", etc.
		healthConditionId: { type: String, ref: "HealthConditions", required: true },
		status: {
			type: String,
			enum: ["recommended", "limited", "avoid", "neutral"],
			required: true
		},
		reason: { type: String, required: true },
		priority: { type: Number, default: 0 }, // higher = more important
		relatedNutrients: [{ type: String, ref: "Nutrient" }]
	},
	{ _id: false }
);

const FoodSchema = new Schema(
	{
		name: { type: String, required: true, index: true },
		slug: { type: String, required: true, unique: true },
		foodId: { type: String, required: true, unique: true },
		commonName: { type: String, default: null }, // e.g. "apple" for "green_apple"
		localNames: [{ type: String }],
		image: { type: String, default: null },
		thumbnail: { type: String, default: null },

		category: {
			type: String,
			enum: ["fruit", "vegetable", "grain", "protein", "dairy", "nuts", "seeds", "legume"],
			required: true,
			index: true
		},

		calories: { type: Number, required: true },
		glycemicIndex: { type: Number, default: null },

		nutritionGroups: [NutritionGroupSchema],
		tags: [{ type: String }],

		highlights: [{ type: String }],
		description: { type: String, default: null },

		healthEffects: [HealthEffectSchema],
		warnings: [{ type: String }]
	},
	{ timestamps: true }
);

FoodSchema.index({ name: "text", slug: "text" });
FoodSchema.index({ tags: 1 });
FoodSchema.index({ category: 1 });
FoodSchema.index({ foodId: 1 });
FoodSchema.index({ "nutritionGroups.nutrients.nutrientId": 1 });
FoodSchema.index({ "healthEffects.healthConditionId": 1 });
FoodSchema.index({ "healthEffects.key": 1});

export default model("Foods", FoodSchema);
