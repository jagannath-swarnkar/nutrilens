import { getAllNutrientsService, getNutrientByIdOrSlugService } from "./nutrient.service";

export const getAllNutrients = async (_req: any, _res: any) => {
	try {
		const nutrients = await getAllNutrientsService(_req.query.search as string | undefined);
		return _res.status(200).json(nutrients);
	} catch (error: any) {
		return _res.status(500).json({ message: error.message || "Internal Server Error!", code: 500 });
	}
};

export const getNutrientDetails = async (_req: any, _res: any) => {
	const { identifier } = _req.params;
	try {
		const nutrient = await getNutrientByIdOrSlugService(decodeURIComponent(identifier));
		if (!nutrient) return _res.status(404).json({ message: "Nutrient not found.", code: 404 });
		return _res.status(200).json(nutrient);
	} catch (error: any) {
		return _res.status(500).json({ message: error.message || "Internal Server Error!", code: 500 });
	}
};
