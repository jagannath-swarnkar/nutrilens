import Foods from "../food/food.model";
import HealthConditions from "../health/health.model";
import Nutrient from "../nutrient/nutrient.model";
import Fuse from "fuse.js";

export type SearchType = "food" | "condition" | "all";

const normalize = (str: string) => str.toLowerCase().trim();

/** Remove all separators (spaces, hyphens, underscores) for loose comparison */
const compact = (str: string) => str.replace(/[\s_\-]+/g, "").toLowerCase();

/** Escape special regex characters to prevent ReDoS */
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Build a word-level flex regex that allows optional separators between words.
 * "heart attack" → heart[\s_\-]+attack
 * "heart-attack" → heart[\s_\-]+attack
 * "heartattack" (single word) → heartattack (plain match only; fuzzy handles the rest)
 */
const buildFlexRegex = (query: string): RegExp => {
	const q = normalize(query);
	const words = q.split(/[\s_\-]+/).filter(Boolean);
	const escaped = words.map(escapeRegex);
	// Multi-word: allow any separator between words
	// Single-word: just match as-is
	return new RegExp(escaped.join("[\\s_\\-]*"), "i");
};

/** Score how well a query matches against candidate field values */
const scoreMatch = (query: string, candidates: (string | null | undefined)[]): number => {
	const q = normalize(query);
	const qCompact = compact(query);
	let bestScore = 0;

	for (const c of candidates) {
		if (!c) continue;
		const cn = normalize(c);
		const cc = compact(c);

		// Exact match
		if (cn === q || cc === qCompact) {
			return 100;
		}

		// Starts with query or query starts with candidate
		if (cn.startsWith(q) || cc.startsWith(qCompact)) {
			bestScore = Math.max(bestScore, 85);
			continue;
		}
		if (q.startsWith(cn) || qCompact.startsWith(cc)) {
			bestScore = Math.max(bestScore, 80);
			continue;
		}

		// Contains query — score based on coverage ratio
		if (cc.includes(qCompact)) {
			const ratio = qCompact.length / cc.length;
			// "aata" in "aata" = 100%, "aata" in "tamatar" = 57%
			const score = Math.round(40 + ratio * 40); // range: 40-80
			bestScore = Math.max(bestScore, score);
			continue;
		}

		// Query contains candidate (candidate is a short word inside query)
		if (qCompact.includes(cc)) {
			const ratio = cc.length / qCompact.length;
			const score = Math.round(35 + ratio * 30);
			bestScore = Math.max(bestScore, score);
			continue;
		}
	}

	return bestScore;
};

/** Deduplicate documents by _id */
const dedup = <T extends { _id: any }>(items: T[]): T[] => {
	const seen = new Set<string>();
	return items.filter((item) => {
		const id = item._id.toString();
		if (seen.has(id)) return false;
		seen.add(id);
		return true;
	});
};

/** Fuse.js fuzzy search fallback — handles typos like "heart atak" and compact queries like "heartattack" */
const fuzzySearch = async (query: string) => {
	const [allFoods, allNutrients, allHealth] = await Promise.all([Foods.find().lean(), Nutrient.find().lean(), HealthConditions.find().lean()]);

	const fuseOptions = { threshold: 0.35, includeScore: true, ignoreLocation: true };
	const results: any[] = [];

	// Use only primary identifying fields to reduce false matches
	const foodResults = new Fuse(allFoods, {
		...fuseOptions,
		keys: ["name", "slug", "commonName", "localNames"]
	}).search(query);
	foodResults.forEach(({ item, score }) => {
		results.push({ ...item, _type: "food", _score: Math.round((1 - (score || 0)) * 50) });
	});

	const nutrientResults = new Fuse(allNutrients, { ...fuseOptions, keys: ["name", "slug"] }).search(query);
	nutrientResults.forEach(({ item, score }) => {
		results.push({ ...item, _type: "nutrient", _score: Math.round((1 - (score || 0)) * 50) });
	});

	const healthResults = new Fuse(allHealth, {
		...fuseOptions,
		keys: ["name", "slug", "variants", "aliases"]
	}).search(query);
	healthResults.forEach(({ item, score }) => {
		results.push({ ...item, _type: "health", _score: Math.round((1 - (score || 0)) * 50) });
	});

	return results;
};

const MAX_PER_TYPE = 5;

/** Group results by type, limited to top results per type */
const groupResults = (results: any[]) => ({
	foods: results.filter((r) => r._type === "food").slice(0, MAX_PER_TYPE),
	nutrients: results.filter((r) => r._type === "nutrient").slice(0, MAX_PER_TYPE),
	health: results.filter((r) => r._type === "health").slice(0, MAX_PER_TYPE)
});

export const searchService = async (query: string) => {
	const q = normalize(query);
	const flexRegex = buildFlexRegex(query);

	const results: any[] = [];

	// 🔍 Phase 1: Flexible regex search (handles formatting variations)

	// FOODS
	const foods = await Foods.find({
		$or: [{ name: flexRegex }, { slug: flexRegex }, { foodId: flexRegex }, { commonName: flexRegex }, { localNames: flexRegex }]
	}).lean();

	dedup(foods).forEach((item) => {
		const score = scoreMatch(q, [item.name, item.slug, item.foodId, item.commonName, ...(item.localNames || [])]);
		results.push({ ...item, _type: "food", _score: score });
	});

	// NUTRIENTS
	const nutrients = await Nutrient.find({
		$or: [{ name: flexRegex }, { slug: flexRegex }, { nutritionId: flexRegex }]
	}).lean();

	dedup(nutrients).forEach((item) => {
		const score = scoreMatch(q, [item.name, item.slug, item.nutritionId]);
		results.push({ ...item, _type: "nutrient", _score: score });
	});

	// HEALTH
	const health = await HealthConditions.find({
		$or: [{ name: flexRegex }, { slug: flexRegex }, { healthConditionId: flexRegex }, { variants: flexRegex }, { aliases: flexRegex }]
	}).lean();

	dedup(health).forEach((item) => {
		const score = scoreMatch(q, [item.name, item.slug, item.healthConditionId, ...(item.variants || []), ...(item.aliases || [])]);
		results.push({ ...item, _type: "health", _score: score });
	});

	// 🔍 Phase 2: Fuzzy search fallback (handles typos + compact queries like "heartattack")
	if (results.length === 0) {
		const fuzzyResults = await fuzzySearch(q);
		results.push(...fuzzyResults);
	}

	// Drop results with weak scores (eliminates false positives like substring noise)
	const MIN_SCORE = 30;
	const meaningful = results.filter((r) => r._score >= MIN_SCORE);

	// 🧠 Exact match shortcut
	const exactMatches = meaningful.filter((r) => r._score >= 95);
	if (exactMatches.length > 0) {
		return groupResults(exactMatches);
	}

	// Sort by score descending and drop results far below the top hit
	meaningful.sort((a, b) => b._score - a._score);
	const topScore = meaningful[0]?._score ?? 0;
	const filtered = meaningful.filter((r) => r._score >= topScore * 0.65);

	return groupResults(filtered);
};

/** Lightweight projection fields for advance-search */
const foodProjection = { foodId: 1, name: 1, slug: 1, category: 1 };
const nutrientProjection = { nutritionId: 1, name: 1, slug: 1, type: 1 };
const healthProjection = { healthConditionId: 1, name: 1, slug: 1, categories: 1 };

/** Fast fuzzy fallback for advance-search — uses projected data */
const advanceFuzzySearch = async (query: string) => {
	const [allFoods, allNutrients, allHealth] = await Promise.all([
		Foods.find({}, foodProjection).lean(),
		Nutrient.find({}, nutrientProjection).lean(),
		HealthConditions.find({}, healthProjection).lean()
	]);

	const fuseOptions = { threshold: 0.35, includeScore: true, ignoreLocation: true };
	const results: any[] = [];

	new Fuse(allFoods, { ...fuseOptions, keys: ["name", "slug", "foodId", "commonName", "localNames", "category"] }).search(query).forEach(({ item, score }) => {
		results.push({ ...item, _type: "food", _score: Math.round((1 - (score || 0)) * 50) });
	});

	new Fuse(allNutrients, { ...fuseOptions, keys: ["name", "slug", "nutritionId"] }).search(query).forEach(({ item, score }) => {
		results.push({ ...item, _type: "nutrient", _score: Math.round((1 - (score || 0)) * 50) });
	});

	new Fuse(allHealth, { ...fuseOptions, keys: ["name", "slug", "healthConditionId", "variants", "aliases"] }).search(query).forEach(({ item, score }) => {
		results.push({ ...item, _type: "health", _score: Math.round((1 - (score || 0)) * 50) });
	});

	return results;
};

export const advanceSearchService = async (query: string) => {
	const q = normalize(query);
	const flexRegex = buildFlexRegex(query);

	const results: any[] = [];

	// Phase 1: Regex search with projections (fast — only key fields returned)
	const [foods, nutrients, health] = await Promise.all([
		Foods.find(
			{ $or: [{ name: flexRegex }, { slug: flexRegex }, { foodId: flexRegex }] },
			foodProjection
		).lean(),
		Nutrient.find(
			{ $or: [{ name: flexRegex }, { slug: flexRegex }, { nutritionId: flexRegex }] },
			nutrientProjection
		).lean(),
		HealthConditions.find(
			{ $or: [{ name: flexRegex }, { slug: flexRegex }, { healthConditionId: flexRegex }, { variants: flexRegex }, { aliases: flexRegex }] },
			healthProjection
		).lean()
	]);

	dedup(foods).forEach((item) => {
		const score = scoreMatch(q, [item.name, item.slug, item.foodId]);
		results.push({ ...item, _type: "food", _score: score });
	});

	dedup(nutrients).forEach((item) => {
		const score = scoreMatch(q, [item.name, item.slug, item.nutritionId]);
		results.push({ ...item, _type: "nutrient", _score: score });
	});

	dedup(health).forEach((item) => {
		const score = scoreMatch(q, [item.name, item.slug, item.healthConditionId, ...(item.variants || []), ...(item.aliases || [])]);
		results.push({ ...item, _type: "health", _score: score });
	});

	// Phase 2: Fuzzy fallback
	if (results.length === 0) {
		const fuzzyResults = await advanceFuzzySearch(q);
		results.push(...fuzzyResults);
	}

	// Filter
	const MIN_SCORE = 30;
	const meaningful = results.filter((r) => r._score >= MIN_SCORE);

	const exactMatches = meaningful.filter((r) => r._score >= 95);
	if (exactMatches.length > 0) {
		return groupResults(exactMatches);
	}

	meaningful.sort((a, b) => b._score - a._score);
	const topScore = meaningful[0]?._score ?? 0;
	const filtered = meaningful.filter((r) => r._score >= topScore * 0.65);

	return groupResults(filtered);
};
