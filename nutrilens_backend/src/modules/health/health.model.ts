import { Schema, model } from "mongoose";

const NutrientRulesSchema = new Schema(
	{
		recommended: [{ type: String, ref: "Nutrient" }],
		limited: [{ type: String, ref: "Nutrient" }],
		avoided: [{ type: String, ref: "Nutrient" }]
	},
	{ _id: false }
);

const FoodOverridesSchema = new Schema(
	{
		recommended: [{ type: String, ref: "Foods" }],
		limited: [{ type: String, ref: "Foods" }],
		avoided: [{ type: String, ref: "Foods" }]
	},
	{ _id: false }
);

const HealthConditionSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
        healthConditionId: { type: String, required: true, unique: true, lowercase: true, trim: true }, // e.g. "diabetes", "weight_loss", "thyroid"
		slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
		description: { type: String, required: true },
		aliases: { type: [String], default: [] },   // alternate names: ["sugar disease", "insulin resistance"]
		variants: { type: [String], default: [] },  // searchable slugs: ["diabetes", "diabetes_type_2", "prediabetes"]
		symptoms: { type: [String], default: [] },
		causes: { type: [String], default: [] },
		guidelines: { type: [String], default: [] },
		nutrientRules: { type: NutrientRulesSchema, required: true },
		foodOverrides: { type: FoodOverridesSchema, default: undefined },
		categories: { type: [String], default: [] }
	},
	{ timestamps: true }
);

HealthConditionSchema.index({ name: "text", aliases: "text", variants: "text" });
HealthConditionSchema.index({ healthConditionId: 1 });
HealthConditionSchema.index({ variants: 1 });

export default model("HealthConditions", HealthConditionSchema);
