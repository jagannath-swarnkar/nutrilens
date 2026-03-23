import {
    getAllCategoriesService,
    getAllFoodsService,
    getFoodBySlugOrFoodIdService
} from "./food.service";

export const getAllFoods = async (req: any, res: any) => {
	try {
		const { search, nutrient, category, tag, healthKey, healthStatus, page, limit } = req.query;
		const data = await getAllFoodsService({
			search,
			nutrient,
			category,
			tag,
			healthKey,
			healthStatus,
			page: page ? Number(page) : undefined,
			limit: limit ? Number(limit) : undefined
		});
		return res.json(data);
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch foods", err });
	}
};


export const getFoodBySlugOrFoodId = async (req: any, res: any) => {
	try {
		const { identifier } = req.params;
		const data = await getFoodBySlugOrFoodIdService(identifier);
		if (!data) return res.status(404).json({ message: "Food not found" });
		return res.json(data);
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch food", err });
	}
};

export const getAllCategories = async (_req: any, res: any) => {
	try {
		const categories = await getAllCategoriesService();
		return res.json({ categories });
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch categories", err });
	}
};
