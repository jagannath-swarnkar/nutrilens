import { searchService, advanceSearchService } from "./search.service";

export const search = async (req: any, res: any) => {
	try {
		const { q } = req.query;

		if (!q) {
			return res.status(400).json({ message: "Query is required" });
		}

		const data = await searchService(q);

		return res.json(data);
	} catch (err) {
		return res.status(500).json({ message: "Search failed", err });
	}
};

export const advanceSearch = async (req: any, res: any) => {
	try {
		const { q } = req.query;

		if (!q) {
			return res.status(400).json({ message: "Query is required" });
		}

		const data = await advanceSearchService(q);

		return res.json(data);
	} catch (err) {
		return res.status(500).json({ message: "Search failed", err });
	}
};

