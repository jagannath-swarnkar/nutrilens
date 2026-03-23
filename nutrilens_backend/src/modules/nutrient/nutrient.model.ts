import { Schema, model } from "mongoose";

const NutrientItemSchema = new Schema(
	{
		name: { type: String, required: true },
		nutritionId: { type: String, required: true, unique: true },
		slug: { type: String, required: true, unique: true, lowercase: true },

		type: {
			type: String,
			required: true,
			enum: [
				"vitamin",
				"mineral",
				"protein",
				"carbohydrate",
				"fat",
				"fiber",
				"water",
				"electrolyte", // sodium, potassium, magnesium
				"antioxidant",
				"phytonutrient", // plant compounds (flavonoids, carotenoids)
				"amino_acid",
				"fatty_acid",
				"sugar",
				"starch",
				"enzyme",
				"probiotic",
				"prebiotic"
			]
		},

		unit: { type: String, required: true },
		description: { type: String, required: true },

		benefits: { type: [String], default: [] },
		sources: { type: [String], default: [] },
		recommendedFor: [{ type: String, ref: "HealthConditions" }],
		avoidFor: [{ type: String, ref: "HealthConditions" }],

		dailyRequirement: {
			type: new Schema(
				{
					men: { type: Number },
					women: { type: Number },
					unit: { type: String, required: true }
				},
				{ _id: false }
			),
			default: undefined
		},

		upperLimit: { type: Number }
	},
	{ timestamps: true }
);


export default model("Nutrient", NutrientItemSchema);

