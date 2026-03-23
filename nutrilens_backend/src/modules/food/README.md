const fruitIds = [
	"apple",
	"banana",
	"raw_banana",
	"mango",
	"raw_mango",
	"orange",
	"sweet_orange",
	"blood_orange",
	"mandarin",
	"tangerine",
	"grapefruit",
	"lemon",
	"lime",
	"pomelo",
	"papaya",
	"pineapple",
	"watermelon",
	"muskmelon",
	"kiwi",
	"pear",
	"guava",
	"pomegranate",
	"grapes",
	"green_grapes",
	"black_grapes",
	"red_grapes",
	"strawberry",
	"blueberry",
	"raspberry",
	"blackberry",
	"cherry",
	"plum",
	"apricot",
	"peach",
	"nectarine",
	"fig",
	"dragon_fruit",
	"passion_fruit",
	"lychee",
	"jamun",
	"karonda",
	"mulberry",
	"persimmon",
	"cranberry",
	"gooseberry",
	"elderberry",
	"jackfruit",
	"raw_jackfruit",
	"coconut",
	"tender_coconut",
	"dates",
	"raisins",
	"prunes"
];

const vegetables = [
	"potato",
	"sweet_potato",
	"tomato",
	"onion",
	"red_onion",
	"garlic",
	"ginger",
	"carrot",
	"beetroot",
	"radish",
	"turnip",
	"cabbage",
	"red_cabbage",
	"cauliflower",
	"broccoli",
	"spinach",
	"lettuce",
	"kale",
	"fenugreek_leaves",
	"mustard_greens",
	"okra",
	"brinjal",
	"capsicum",
	"green_capsicum",
	"red_capsicum",
	"yellow_capsicum",
	"cucumber",
	"zucchini",
	"pumpkin",
	"bottle_gourd",
	"ridge_gourd",
	"bitter_gourd",
	"snake_gourd",
	"drumstick",
	"peas",
	"green_beans",
	"cluster_beans",
	"spring_onion",
	"leek",
	"celery",
	"parsley",
	"coriander_leaves",
	"mint_leaves"
];

const dairy = [
	"milk",
	"cow_milk",
	"buffalo_milk",
	"skim_milk",
	"full_cream_milk",
	"curd",
	"yogurt",
	"greek_yogurt",
	"buttermilk",
	"butter",
	"ghee",
	"cheese",
	"paneer",
	"cream",
	"condensed_milk"
];

const meats = ["chicken", "chicken_breast", "chicken_thigh", "mutton", "lamb", "goat_meat", "beef", "pork", "turkey", "duck"];

const fish = ["salmon", "tuna", "sardine", "mackerel", "rohu", "katla", "hilsa", "prawns", "shrimp", "crab", "lobster", "oyster", "clams"];

const grains = [
	"rice",
	"white_rice",
	"brown_rice",
	"basmati_rice",
	"wheat",
	"whole_wheat",
	"refined_wheat",
	"atta",
	"maida",
	"oats",
	"barley",
	"quinoa",
	"millet",
	"ragi",
	"bajra",
	"jowar",
	"corn",
	"maize"
];

const legumes = [
	"lentils",
	"toor_dal",
	"moong_dal",
	"masoor_dal",
	"urad_dal",
	"chana_dal",
	"black_chana",
	"chickpeas",
	"kidney_beans",
	"rajma",
	"soybeans",
	"green_gram",
	"horse_gram"
];

const nuts = ["almonds", "cashews", "walnuts", "pistachios", "hazelnuts", "pecans", "macadamia", "brazil_nuts", "pine_nuts"];

const seeds = ["chia_seeds", "flax_seeds", "pumpkin_seeds", "sunflower_seeds", "sesame_seeds", "watermelon_seeds", "hemp_seeds", "poppy_seeds"];

// ✅ cleaned (removed duplicates already defined above)
const proteinFoods = ["eggs", "egg_white", "fish", "tofu", "peanut_butter"];

const others = ["sugar", "jaggery", "honey", "salt", "black_salt", "oil", "olive_oil", "mustard_oil", "coconut_oil"];

// ✅ cleaned (removed duplicates from vegetables)
const plantLeaves = [
	"curry_leaves",
	"mustard_leaves",
	"amaranth_leaves",
	"drumstick_leaves",
	"betel_leaves",
	"basil_leaves",
	"thyme",
	"oregano",
	"rosemary",
	"dill_leaves",
	"spring_onion_leaves"
];

// ✅ cleaned (removed duplicates like rajma, chole handled via legumes)
const indianFoods = [
	"roti",
	"chapati",
	"paratha",
	"naan",
	"puri",
	"bhatura",
	"rice_cooked",
	"jeera_rice",
	"fried_rice",
	"biryani",
	"pulao",
	"dal",
	"dal_tadka",
	"dal_makhani",
	"sambar",
	"rasam",
	"paneer_butter_masala",
	"palak_paneer",
	"kadai_paneer",
	"aloo_sabzi",
	"bhindi_sabzi",
	"baingan_bharta",
	"mix_vegetable",
	"chana_masala",
	"idli",
	"dosa",
	"masala_dosa",
	"uttapam",
	"upma",
	"poha",
	"khichdi",
	"curd_rice",
	"samosa",
	"kachori",
	"pakora",
	"halwa",
	"kheer",
	"gulab_jamun",
	"jalebi",
	"ladoo"
];

// ✅ cleaned (removed duplicates like bread variants handled later)
const snacks = [
	"chips",
	"potato_chips",
	"nachos",
	"popcorn",
	"salted_popcorn",
	"buttered_popcorn",
	"biscuits",
	"cookies",
	"cream_biscuits",
	"burger",
	"pizza",
	"sandwich",
	"french_fries",
	"cheese_balls",
	"noodles",
	"instant_noodles",
	"chocolate",
	"dark_chocolate",
	"milk_chocolate",
	"ice_cream",
	"soft_drink",
	"cola",
	"energy_drink"
];

const flours = [
	"whole_wheat_flour",
	"refined_flour",
	"multigrain_flour",
	"besan",
	"rice_flour",
	"corn_flour",
	"ragi_flour",
	"bajra_flour",
	"jowar_flour",
	"oats_flour",
	"soy_flour"
];

// ✅ cleaned (removed duplicates already in grains & indianFoods)
const riceItems = ["steamed_rice", "boiled_rice", "half_boiled_rice", "pressure_cooked_rice"];

// ✅ cleaned (removed duplicates already defined in indianFoods/snacks)
const grainProducts = ["phulka", "multigrain_bread"];

// ✅ cleaned (removed duplicates already defined)
const simpleFoods = ["plain_dal", "plain_khichdi", "boiled_vegetables", "mixed_vegetable_curry"];
