import {
	getAllHealthConditionsService,
	getHealthBySlugOrIdService,
	getAllHealthCategoriesService
} from "./health.service";

export const getAllHealthConditions = async (req: any, res: any) => {
	try {
		const { search, category, page, limit } = req.query;
		const data = await getAllHealthConditionsService({
			search,
			category,
			page: page ? Number(page) : undefined,
			limit: limit ? Number(limit) : undefined
		});
		return res.json(data);
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch health conditions", err });
	}
};

export const getHealthConditionDetails = async (req: any, res: any) => {
	try {
		const { identifier } = req.params;
		const data = await getHealthBySlugOrIdService(decodeURIComponent(identifier));
		if (!data) return res.status(404).json({ message: "Health condition not found" });
		return res.json(data);
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch health condition", err });
	}
};

export const getAllHealthCategories = async (_req: any, res: any) => {
	try {
		const categories = await getAllHealthCategoriesService();
		return res.json({ categories });
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch categories", err });
	}
};
