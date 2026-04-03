/**
 * Flipwise — OSRS item definitions (for API and tables).
 */
var Flipwise = window.Flipwise || {};

Flipwise.MAX_TAX = 5000000;

// Trade Scanner (match Python)
Flipwise.SCANNER_MIN_PROFIT = 50000;
Flipwise.SCANNER_MIN_ROI = 3.0;
Flipwise.SCANNER_MAX_AGE_SECONDS = 86400;  // 24 hours
Flipwise.SCANNER_TOP_N = 20;
// Trend levels: 3-up = profit >= TREND_MEDIUM_UP, 3-down = profit <= -TREND_MEDIUM_UP (events log only; higher = less frequent)
Flipwise.TREND_NEUTRAL_MIN = -500000;
Flipwise.TREND_NEUTRAL_MAX = 500000;
Flipwise.TREND_SMALL_UP = 5000000;
Flipwise.TREND_MEDIUM_UP = 10000000;

// Unusual Methods (match Python)
Flipwise.KNIFE_BUY_LIMIT = 7000;
Flipwise.KNIFE_ITEMS = [
  { id: 22804, name: "Dragon knife" },
  { id: 22806, name: "Dragon knife(p)" },
  { id: 22808, name: "Dragon knife(p+)" },
  { id: 22810, name: "Dragon knife(p++)" }
];
Flipwise.CANNON_ITEMS = [
  { id: 6, name: "Cannon base" },
  { id: 8, name: "Cannon stand" },
  { id: 10, name: "Cannon barrels" },
  { id: 12, name: "Cannon furnace" }
];
Flipwise.MULTICANNON_ID = 12863;
Flipwise.NULODION_COST = 750000;
Flipwise.CANNON_HOURLY_RATE = 157;
Flipwise.ODIUM_WARD_ID = 11926;
Flipwise.ODIUM_SHARD_ITEMS = [
  { id: 11928, name: "Odium shard 1" },
  { id: 11929, name: "Odium shard 2" },
  { id: 11930, name: "Odium shard 3" }
];
Flipwise.ODIUM_BULK_PER_HOUR = 20;
Flipwise.MALEDICTION_WARD_ID = 11924;
Flipwise.MALEDICTION_SHARD_ITEMS = [
  { id: 11931, name: "Malediction shard 1" },
  { id: 11932, name: "Malediction shard 2" },
  { id: 11933, name: "Malediction shard 3" }
];
Flipwise.MALEDICTION_BULK_PER_HOUR = 20;
Flipwise.BANDITS_BREW_ID = 4627;
Flipwise.BANDIT_TRADER_GP = 750;
Flipwise.BANDIT_HOURLY_RATE = 929;
Flipwise.LOCKPICK_ID = 1523;
Flipwise.LOCKPICK_FIXED_GP = 20;
Flipwise.LOCKPICK_HOURLY_RATE = 6000;
Flipwise.SOUL_RUNE_ID = 566;
Flipwise.WIZARD_AKUTHA_50_GP = 308;
Flipwise.WIZARD_AKUTHA_100_GP = 315;
Flipwise.WIZARD_AKUTHA_150_GP = 338;
Flipwise.SOUL_RUNE_QUANTITY = 67000;
Flipwise.DRAGONFRUIT_ID = 22929;
Flipwise.BOTTLED_DRAGONBREATH_ID = 23002;
Flipwise.DRAGONBREATH_HOURLY_RATE = 450;
Flipwise.MITHRIL_SEED_ID = 299;
Flipwise.MITHRIL_SEED_FIXED_GP = 350;
Flipwise.MITHRIL_SEED_HOURLY_RATE = 1945;
Flipwise.SET_MAKING_RECIPES = [
  { name: "Torva armour set", set_id: 31145, pieces: [{ id: 26382 }, { id: 26384 }, { id: 26386 }] },
  { name: "Inquisitor's armour set", set_id: 24488, pieces: [{ id: 24419 }, { id: 24420 }, { id: 24421 }] },
  { name: "Ancestral robes set", set_id: 21049, pieces: [{ id: 21018 }, { id: 21021 }, { id: 21024 }] },
  { name: "Dragon armour set (lg)", set_id: 21882, pieces: [{ id: 11335 }, { id: 21892 }, { id: 4087 }, { id: 21895 }] },
  { name: "Masori armour set (f)", set_id: 27355, pieces: [{ id: 27235 }, { id: 27238 }, { id: 27241 }] },
  { name: "Virtus armour set", set_id: 31148, pieces: [{ id: 26241 }, { id: 26243 }, { id: 26245 }] }
];

// Enchanting recipes: inputs (buy low) → output (sell high); profit after GE tax
Flipwise.ENCHANTING_RECIPES = [
  {
    key: 'fury',
    title: 'Amulet of fury',
    output_id: 6585,
    output_name: 'Amulet of fury',
    inputs: [
      { id: 6581, name: 'Onyx amulet', qty: 1 },
      { id: 564, name: 'Cosmic rune', qty: 1 },
      { id: 554, name: 'Fire rune', qty: 20 },
      { id: 557, name: 'Earth rune', qty: 20 }
    ]
  },
  {
    key: 'suffering',
    title: 'Ring of suffering',
    output_id: 19550,
    output_name: 'Ring of suffering',
    inputs: [
      { id: 19538, name: 'Zenyte ring', qty: 1 },
      { id: 564, name: 'Cosmic rune', qty: 1 },
      { id: 566, name: 'Soul rune', qty: 20 },
      { id: 565, name: 'Blood rune', qty: 20 }
    ]
  },
  {
    key: 'berserker',
    title: 'Berserker necklace',
    output_id: 11128,
    output_name: 'Berserker necklace',
    inputs: [
      { id: 6577, name: 'Onyx necklace', qty: 1 },
      { id: 564, name: 'Cosmic rune', qty: 1 },
      { id: 554, name: 'Fire rune', qty: 20 },
      { id: 557, name: 'Earth rune', qty: 20 }
    ]
  },
  {
    key: 'anguish',
    title: 'Necklace of anguish',
    output_id: 19547,
    output_name: 'Necklace of anguish',
    inputs: [
      { id: 19535, name: 'Zenyte necklace', qty: 1 },
      { id: 564, name: 'Cosmic rune', qty: 1 },
      { id: 566, name: 'Soul rune', qty: 20 },
      { id: 565, name: 'Blood rune', qty: 20 }
    ]
  },
  {
    key: 'slaughter',
    title: 'Bracelet of slaughter',
    output_id: 21183,
    output_name: 'Bracelet of slaughter',
    inputs: [
      { id: 21123, name: 'Topaz bracelet', qty: 1 },
      { id: 564, name: 'Cosmic rune', qty: 1 },
      { id: 554, name: 'Fire rune', qty: 5 }
    ]
  }
];

// Outfit set recipes (buy pieces, combine/sell set); same tile shape as enchanting. Replaces Item Set Making tile.
Flipwise.OUTFIT_SET_RECIPES = [
  {
    key: 'torva',
    title: 'Torva armour set',
    output_id: 31145,
    output_name: 'Torva armour set',
    inputs: [
      { id: 26382, name: 'Torva full helm', qty: 1 },
      { id: 26384, name: 'Torva platebody', qty: 1 },
      { id: 26386, name: 'Torva platelegs', qty: 1 }
    ]
  },
  {
    key: 'inquisitor',
    title: "Inquisitor's armour set",
    output_id: 24488,
    output_name: "Inquisitor's armour set",
    inputs: [
      { id: 24419, name: "Inquisitor's great helm", qty: 1 },
      { id: 24420, name: "Inquisitor's hauberk", qty: 1 },
      { id: 24421, name: "Inquisitor's plateskirt", qty: 1 }
    ]
  },
  {
    key: 'ancestral',
    title: 'Ancestral robes set',
    output_id: 21049,
    output_name: 'Ancestral robes set',
    inputs: [
      { id: 21018, name: 'Ancestral hat', qty: 1 },
      { id: 21021, name: 'Ancestral robe top', qty: 1 },
      { id: 21024, name: 'Ancestral robe bottom', qty: 1 }
    ]
  },
  {
    key: 'dragon_lg',
    title: 'Dragon armour set (lg)',
    output_id: 21882,
    output_name: 'Dragon armour set (lg)',
    inputs: [
      { id: 11335, name: 'Dragon full helm', qty: 1 },
      { id: 21892, name: 'Dragon platebody', qty: 1 },
      { id: 4087, name: 'Dragon platelegs', qty: 1 },
      { id: 21895, name: 'Dragon kiteshield', qty: 1 }
    ]
  },
  {
    key: 'masori_f',
    title: 'Masori armour set (f)',
    output_id: 27355,
    output_name: 'Masori armour set (f)',
    inputs: [
      { id: 27235, name: 'Masori mask (f)', qty: 1 },
      { id: 27238, name: 'Masori body (f)', qty: 1 },
      { id: 27241, name: 'Masori chaps (f)', qty: 1 }
    ]
  },
  {
    key: 'virtus',
    title: 'Virtus armour set',
    output_id: 31148,
    output_name: 'Virtus armour set',
    inputs: [
      { id: 26241, name: 'Virtus mask', qty: 1 },
      { id: 26243, name: 'Virtus robe top', qty: 1 },
      { id: 26245, name: 'Virtus robe bottom', qty: 1 }
    ]
  },
  {
    key: 'trailblazer_t3',
    title: 'Trailblazer relic hunter (t3) armour set',
    output_id: 25386,
    output_name: 'Trailblazer relic hunter (t3) armour set',
    inputs: [
      { id: 25001, name: 'Trailblazer hood (t3)', qty: 1 },
      { id: 25004, name: 'Trailblazer top (t3)', qty: 1 },
      { id: 25007, name: 'Trailblazer trousers (t3)', qty: 1 },
      { id: 25010, name: 'Trailblazer boots (t3)', qty: 1 }
    ]
  },
  {
    key: 'gilded_lg',
    title: 'Gilded armour set (lg)',
    output_id: 13036,
    output_name: 'Gilded armour set (lg)',
    inputs: [
      { id: 3486, name: 'Gilded full helm', qty: 1 },
      { id: 3481, name: 'Gilded platebody', qty: 1 },
      { id: 3483, name: 'Gilded platelegs', qty: 1 },
      { id: 3488, name: 'Gilded kiteshield', qty: 1 }
    ]
  },
  {
    key: 'gilded_sk',
    title: 'Gilded armour set (sk)',
    output_id: 13038,
    output_name: 'Gilded armour set (sk)',
    inputs: [
      { id: 3486, name: 'Gilded full helm', qty: 1 },
      { id: 3481, name: 'Gilded platebody', qty: 1 },
      { id: 3485, name: 'Gilded plateskirt', qty: 1 },
      { id: 3488, name: 'Gilded kiteshield', qty: 1 }
    ]
  },
  {
    key: 'oathplate',
    title: 'Oathplate armour set',
    output_id: 30744,
    output_name: 'Oathplate armour set',
    inputs: [
      { id: 30750, name: 'Oathplate helm', qty: 1 },
      { id: 30753, name: 'Oathplate chest', qty: 1 },
      { id: 30756, name: 'Oathplate legs', qty: 1 }
    ]
  },
  {
    key: 'hueycoatl_hide',
    title: 'Hueycoatl hide armour set',
    output_id: 31169,
    output_name: 'Hueycoatl hide armour set',
    inputs: [
      { id: 30076, name: 'Hueycoatl hide body', qty: 1 },
      { id: 30079, name: 'Hueycoatl hide chaps', qty: 1 },
      { id: 30073, name: 'Hueycoatl hide coif', qty: 1 },
      { id: 30082, name: 'Hueycoatl hide vambraces', qty: 1 }
    ]
  }
];

// Tree saplings: buy seed, plant, sell sapling. seed_id = GE item ID of the seed.
// profit per = (sapling sell - tax) - seed cost; limit profit = profit per * seed buy limit.
Flipwise.TREE_SAPLING_ITEMS = [
  { id: 5370, name: 'Oak sapling', seed_id: 5312 },
  { id: 5371, name: 'Willow sapling', seed_id: 5313 },
  { id: 5372, name: 'Maple sapling', seed_id: 5314 },
  { id: 5373, name: 'Yew sapling', seed_id: 5315 },
  { id: 5374, name: 'Magic sapling', seed_id: 5316 },
  { id: 5496, name: 'Apple sapling', seed_id: 5283 },
  { id: 5497, name: 'Banana sapling', seed_id: 5284 },
  { id: 5498, name: 'Orange sapling', seed_id: 5285 },
  { id: 5499, name: 'Curry sapling', seed_id: 5286 },
  { id: 5500, name: 'Pineapple sapling', seed_id: 5287 },
  { id: 5501, name: 'Papaya sapling', seed_id: 5288 },
  { id: 5502, name: 'Palm sapling', seed_id: 5289 },
  { id: 22866, name: 'Dragonfruit sapling', seed_id: 22877 },
  { id: 5503, name: 'Calquat sapling', seed_id: 5290 },
  { id: 21477, name: 'Teak sapling', seed_id: 21486 },
  { id: 21480, name: 'Mahogany sapling', seed_id: 21488 },
  { id: 22859, name: 'Redwood sapling', seed_id: 22871 },
  { id: 22856, name: 'Celastrus sapling', seed_id: 22869 }
];

// Decanting: name = (4)-dose display name; id1, id2, id3 = (1)(2)(3)-dose buy IDs; id4 = (4)-dose sell ID.
// Cheapest dose = which of 1/2/3 has lowest cost-per-dose; Cheapest cost = that per-dose × 4; Profit = sell (4) after tax − cheapest cost.
Flipwise.DECANTING_ITEMS = [
  { name: 'Extended super antifire(4)', id1: 22218, id2: 22215, id3: 22212, id4: 22209 },
  { name: 'Bastion potion(4)', id1: 22470, id2: 22467, id3: 22464, id4: 22461 },
  { name: 'Prayer regeneration potion(4)', id1: 30134, id2: 30131, id3: 30128, id4: 30125 },
  { name: 'Goading potion(4)', id1: 30146, id2: 30143, id3: 30140, id4: 30137 },
  { name: 'Battlemage potion(4)', id1: 22458, id2: 22455, id3: 22452, id4: 22449 },
  { name: 'Sanfew serum(4)', id1: 10931, id2: 10929, id3: 10927, id4: 10925 },
  { name: 'Divine magic potion(4)', id1: 23754, id2: 23751, id3: 23748, id4: 23745 },
  { name: 'Forgotten brew(4)', id1: 27638, id2: 27635, id3: 27632, id4: 27629 },
  { name: 'Divine battlemage potion(4)', id1: 24632, id2: 24629, id3: 24626, id4: 24623 },
  { name: 'Divine bastion potion(4)', id1: 24644, id2: 24641, id3: 24638, id4: 24635 },
  { name: 'Extended anti-venom+(4)', id1: 29833, id2: 29830, id3: 29827, id4: 29824 },
  { name: 'Super antifire potion(4)', id1: 21987, id2: 21984, id3: 21981, id4: 21978 },
  { name: 'Divine super strength potion(4)', id1: 23718, id2: 23715, id3: 23712, id4: 23709 },
  { name: 'Divine super attack potion(4)', id1: 23706, id2: 23703, id3: 23700, id4: 23697 },
  { name: 'Guthix rest(4)', id1: 4423, id2: 4421, id3: 4419, id4: 4417 },
  { name: 'Divine super defence potion(4)', id1: 23730, id2: 23727, id3: 23724, id4: 23721 },
  { name: "Relicym's balm(4)", id1: 4848, id2: 4846, id3: 4844, id4: 4842 },
  { name: 'Anti-venom(4)', id1: 12911, id2: 12909, id3: 12907, id4: 12905 },
  { name: 'Ancient brew(4)', id1: 26346, id2: 26344, id3: 26342, id4: 26340 },
  { name: 'Superantipoison(4)', id1: 185, id2: 183, id3: 181, id4: 2448 },
  { name: 'Hunter potion(4)', id1: 10004, id2: 10002, id3: 10000, id4: 9998 },
  { name: 'Guthix balance(4)', id1: 7666, id2: 7664, id3: 7662, id4: 7660 },
  { name: 'Super attack(4)', id1: 149, id2: 147, id3: 145, id4: 2436 },
  { name: 'Divine super combat potion(4)', id1: 23694, id2: 23691, id3: 23688, id4: 23685 },
  { name: 'Divine ranging potion(4)', id1: 23742, id2: 23739, id3: 23736, id4: 23733 },
  { name: 'Super defence(4)', id1: 167, id2: 165, id3: 163, id4: 2442 },
  { name: 'Super energy(4)', id1: 3022, id2: 3020, id3: 3018, id4: 3016 },
  // 25 potions from second image
  { name: 'Defence potion(4)', id1: 137, id2: 135, id3: 133, id4: 2432 },
  { name: 'Menaphite remedy(4)', id1: 27211, id2: 27208, id3: 27205, id4: 27202 },
  { name: 'Antifire potion(4)', id1: 2458, id2: 2456, id3: 2454, id4: 2452 },
  { name: 'Antidote+(4)', id1: 5949, id2: 5947, id3: 5945, id4: 5943 },
  { name: 'Agility potion(4)', id1: 3038, id2: 3036, id3: 3034, id4: 3032 },
  { name: 'Ranging potion(4)', id1: 173, id2: 171, id3: 169, id4: 2444 },
  { name: 'Extended antifire(4)', id1: 11957, id2: 11955, id3: 11953, id4: 11951 },
  { name: 'Super restore(4)', id1: 3030, id2: 3028, id3: 3026, id4: 3024 },
  { name: 'Zamorak brew(4)', id1: 193, id2: 191, id3: 189, id4: 2450 },
  { name: 'Stamina potion(4)', id1: 12631, id2: 12629, id3: 12627, id4: 12625 },
  { name: 'Super strength(4)', id1: 161, id2: 159, id3: 157, id4: 2440 },
  { name: 'Fishing potion(4)', id1: 155, id2: 153, id3: 151, id4: 2438 },
  { name: 'Saradomin brew(4)', id1: 6691, id2: 6689, id3: 6687, id4: 6685 },
  { name: 'Prayer potion(4)', id1: 143, id2: 141, id3: 139, id4: 2434 },
  { name: 'Restore potion(4)', id1: 131, id2: 129, id3: 127, id4: 2430 },
  { name: 'Magic potion(4)', id1: 3046, id2: 3044, id3: 3042, id4: 3040 },
  { name: 'Strength potion(4)', id1: 119, id2: 117, id3: 115, id4: 113 },
  { name: 'Antidote++(4)', id1: 5958, id2: 5956, id3: 5954, id4: 5952 },
  { name: 'Antipoison(4)', id1: 179, id2: 177, id3: 175, id4: 2446 },
  { name: 'Energy potion(4)', id1: 3014, id2: 3012, id3: 3010, id4: 3008 },
  { name: 'Serum 207(4)', id1: 3414, id2: 3412, id3: 3410, id4: 3408 },
  { name: 'Combat potion(4)', id1: 9745, id2: 9743, id3: 9741, id4: 9739 },
  { name: 'Attack potion(4)', id1: 125, id2: 123, id3: 121, id4: 2428 },
  { name: 'Compost potion(4)', id1: 6476, id2: 6474, id3: 6472, id4: 6470 },
  { name: 'Olive oil(4)', id1: 3428, id2: 3426, id3: 3424, id4: 3422 },
  { name: 'Super combat potion(4)', id1: 12701, id2: 12699, id3: 12697, id4: 12695 },
  { name: 'Sacred oil(4)', id1: 3436, id2: 3434, id3: 3432, id4: 3430 },
  { name: 'Anti-venom+(4)', id1: 12919, id2: 12917, id3: 12915, id4: 12913 }
];

// Tooltip / flyover verbage for each money maker (match Python)
Flipwise.MONEY_MAKER_TOOLTIPS = {
  knife: "Buy dragon knives (p) at low price, clean, sell as Dragon knife at high. Per 7k GE limit.",
  cannon: "Buy 4 parts at low price, assemble, sell cannon at high. Or buy from Nulodion. ~157/hour.",
  odium: "Buy 3 shards at low, assemble, sell Odium ward at high. ~20 per hour.",
  malediction: "Buy 3 shards at low, assemble, sell Malediction ward at high. ~20 per hour.",
  bandit: "Buy from Bandit Trader (750 gp), sell on GE. ~929 per hour.",
  lockpicks: "Buy lockpicks for 20 gp each, sell on GE at the higher of buy/sell price (after tax). Uses GE buy limit.",
  soul_rune: "Buy from Wizard Akutha (50: 308, 100: 315, 150: 338 gp), sell on GE. Profit based on 100-tier. 67k per run.",
  dragonbreath: "10 dragonfruit → 1 bottled. ~450 per hour. Buy dragonfruit low, sell bottled high.",
  mithril_seeds: "Fixed cost 350 gp per seed, sell on GE. ~1945 per hour."
};

// Flip items (ids and names). Includes the four card items + rest for table.
Flipwise.FLIP_ITEMS = [
  { id: 20997, name: "Twisted Bow" },
  { id: 22486, name: "Scythe of Vitur" },
  { id: 27277, name: "Tumeken's Shadow" },
  { id: 31145, name: "Torva armour set" },
  { id: 26384, name: "Torva platebody" },
  { id: 24511, name: "Harmonised orb" },
  { id: 12817, name: "Elysian spirit shield" },
  { id: 26374, name: "Zaryte crossbow" },
  { id: 27641, name: "Saturated Heart" },
  { id: 28307, name: "Ultor ring" },
  { id: 23997, name: "Blade of saeldor" },
  { id: 25862, name: "Bow of faerdhinen" },
  { id: 11785, name: "Armadyl crossbow" },
  { id: 29796, name: "Noxious halberd" },
  { id: 12825, name: "Arcane spirit shield" },
  { id: 24417, name: "Inquisitor's mace" },
  { id: 24419, name: "Inquisitor's great helm" },
  { id: 24420, name: "Inquisitor's hauberk" },
  { id: 24421, name: "Inquisitor's plateskirt" },
  { id: 24488, name: "Inquisitor's armour set" },
  { id: 28338, name: "Soulreaper axe" },
  { id: 24517, name: "Eldritch orb" },
  { id: 28316, name: "Bellator ring" },
  { id: 21049, name: "Ancestral robes set" },
  { id: 24514, name: "Volatile orb" },
  { id: 21006, name: "Kodai wand" },
  { id: 26382, name: "Torva full helm" },
  { id: 26386, name: "Torva platelegs" },
  { id: 30750, name: "Oathplate helm" },
  { id: 30753, name: "Oathplate chest" },
  { id: 30756, name: "Oathplate legs" },
  { id: 30744, name: "Oathplate armour set" },
  { id: 31106, name: "Confliction gauntlets" },
  { id: 31088, name: "Avernic treads" },
  { id: 21018, name: "Ancestral hat" },
  { id: 21021, name: "Ancestral robe top" },
  { id: 21024, name: "Ancestral robe bottom" },
  { id: 26235, name: "Zaryte vambraces" },
  { id: 29622, name: "Armageddon teleport scroll" },
  { id: 13239, name: "Primordial boots" },
  { id: 13237, name: "Pegasian boots" },
  { id: 2577, name: "Ranger boots" },
  { id: 20724, name: "Imbued heart" },
  { id: 12827, name: "Arcane sigil" },
  { id: 29801, name: "Amulet of rancour" },
  { id: 31115, name: "Eye of ayak (uncharged)" },
  { id: 28310, name: "Venator ring" },
  { id: 27612, name: "Venator bow (uncharged)" },
  { id: 21003, name: "Elder maul" },
  { id: 27690, name: "Voidwaker" },
  { id: 13652, name: "Dragon claws" },
  { id: 13576, name: "Dragon warhammer" },
  { id: 30634, name: "Twinflame staff" },
  { id: 29625, name: "Armageddon weapon scroll" },
  { id: 32093, name: "Inky paint" },
  { id: 32110, name: "Merchant's paint" }
];

Flipwise.HIGH_VOLUME_ITEMS = [
  { id: 556, name: "Air rune" },
  { id: 555, name: "Water rune" },
  { id: 557, name: "Earth rune" },
  { id: 554, name: "Fire rune" },
  { id: 30843, name: "Aether rune" },
  { id: 21880, name: "Wrath rune" },
  { id: 9075, name: "Astral rune" },
  { id: 566, name: "Soul rune" },
  { id: 565, name: "Blood rune" },
  { id: 560, name: "Death rune" },
  { id: 1436, name: "Rune essence" },
  { id: 4692, name: "Mist rune" },
  { id: 4693, name: "Steam rune" },
  { id: 4694, name: "Dust rune" },
  { id: 4695, name: "Smoke rune" },
  { id: 4696, name: "Mud rune" },
  { id: 4699, name: "Lava rune" },
  { id: 564, name: "Cosmic rune" },
  { id: 563, name: "Law rune" },
  { id: 562, name: "Chaos rune" },
  { id: 561, name: "Nature rune" },
  { id: 559, name: "Body rune" },
  { id: 558, name: "Mind rune" }
];

Flipwise.HERBLORE_ITEMS = [
  { id: 199, name: "Grimy guam leaf" },
  { id: 201, name: "Grimy marrentill" },
  { id: 203, name: "Grimy tarromin" },
  { id: 205, name: "Grimy harralander" },
  { id: 207, name: "Grimy ranarr weed" },
  { id: 3049, name: "Grimy toadflax" },
  { id: 209, name: "Grimy irit leaf" },
  { id: 211, name: "Grimy avantoe" },
  { id: 213, name: "Grimy kwuarm" },
  { id: 3051, name: "Grimy snapdragon" },
  { id: 215, name: "Grimy cadantine" },
  { id: 2485, name: "Grimy lantadyme" },
  { id: 217, name: "Grimy dwarf weed" },
  { id: 219, name: "Grimy torstol" },
  { id: 249, name: "Guam leaf" },
  { id: 251, name: "Marrentill" },
  { id: 253, name: "Tarromin" },
  { id: 255, name: "Harralander" },
  { id: 257, name: "Ranarr weed" },
  { id: 2998, name: "Toadflax" },
  { id: 259, name: "Irit leaf" },
  { id: 261, name: "Avantoe" },
  { id: 263, name: "Kwuarm" },
  { id: 3000, name: "Snapdragon" },
  { id: 265, name: "Cadantine" },
  { id: 2481, name: "Lantadyme" },
  { id: 267, name: "Dwarf weed" },
  { id: 269, name: "Torstol" },
  { id: 91, name: "Guam potion (unf)" },
  { id: 93, name: "Marrentill potion (unf)" },
  { id: 95, name: "Tarromin potion (unf)" },
  { id: 97, name: "Harralander potion (unf)" },
  { id: 99, name: "Ranarr potion (unf)" },
  { id: 3002, name: "Toadflax potion (unf)" },
  { id: 101, name: "Irit potion (unf)" },
  { id: 103, name: "Avantoe potion (unf)" },
  { id: 105, name: "Kwuarm potion (unf)" },
  { id: 3004, name: "Snapdragon potion (unf)" },
  { id: 107, name: "Cadantine potion (unf)" },
  { id: 2483, name: "Lantadyme potion (unf)" },
  { id: 109, name: "Dwarf weed potion (unf)" },
  { id: 111, name: "Torstol potion (unf)" },
  { id: 149, name: "Super attack(1)" },
  { id: 147, name: "Super attack(2)" },
  { id: 145, name: "Super attack(3)" },
  { id: 2436, name: "Super attack(4)" },
  { id: 161, name: "Super strength(1)" },
  { id: 159, name: "Super strength(2)" },
  { id: 157, name: "Super strength(3)" },
  { id: 2440, name: "Super strength(4)" },
  { id: 167, name: "Super defence(1)" },
  { id: 165, name: "Super defence(2)" },
  { id: 163, name: "Super defence(3)" },
  { id: 2442, name: "Super defence(4)" },
  { id: 143, name: "Prayer potion(1)" },
  { id: 141, name: "Prayer potion(2)" },
  { id: 139, name: "Prayer potion(3)" },
  { id: 2434, name: "Prayer potion(4)" },
  { id: 3030, name: "Super restore(1)" },
  { id: 3028, name: "Super restore(2)" },
  { id: 3026, name: "Super restore(3)" },
  { id: 3024, name: "Super restore(4)" },
  { id: 173, name: "Ranging potion(1)" },
  { id: 171, name: "Ranging potion(2)" },
  { id: 169, name: "Ranging potion(3)" },
  { id: 2444, name: "Ranging potion(4)" },
  { id: 3046, name: "Magic potion(1)" },
  { id: 3044, name: "Magic potion(2)" },
  { id: 3042, name: "Magic potion(3)" },
  { id: 3040, name: "Magic potion(4)" },
  { id: 189, name: "Saradomin brew(1)" },
  { id: 191, name: "Saradomin brew(2)" },
  { id: 193, name: "Saradomin brew(3)" },
  { id: 6685, name: "Saradomin brew(4)" },
  { id: 2458, name: "Antifire potion(1)" },
  { id: 2457, name: "Antifire potion(2)" },
  { id: 2456, name: "Antifire potion(3)" },
  { id: 2452, name: "Antifire potion(4)" },
  { id: 12699, name: "Super combat potion(1)" },
  { id: 12697, name: "Super combat potion(2)" },
  { id: 12695, name: "Super combat potion(3)" },
  { id: 12695, name: "Super combat potion(4)" },
  { id: 12629, name: "Stamina potion(1)" },
  { id: 12627, name: "Stamina potion(2)" },
  { id: 12625, name: "Stamina potion(3)" },
  { id: 12625, name: "Stamina potion(4)" },
  { id: 12905, name: "Anti-venom(4)" },
  { id: 12913, name: "Anti-venom+(4)" },
  { id: 21987, name: "Super antifire potion(1)" },
  { id: 21984, name: "Super antifire potion(2)" },
  { id: 21981, name: "Super antifire potion(3)" },
  { id: 21978, name: "Super antifire potion(4)" },
  { id: 22218, name: "Extended super antifire(1)" },
  { id: 22215, name: "Extended super antifire(2)" },
  { id: 22212, name: "Extended super antifire(3)" },
  { id: 22209, name: "Extended super antifire(4)" },
  { id: 10931, name: "Sanfew serum(1)" },
  { id: 10929, name: "Sanfew serum(2)" },
  { id: 10927, name: "Sanfew serum(3)" },
  { id: 10925, name: "Sanfew serum(4)" }
];

Flipwise.THIRD_AGE_ITEMS = [
  { id: 10350, name: "3rd age full helmet" },
  { id: 10348, name: "3rd age platebody" },
  { id: 10346, name: "3rd age platelegs" },
  { id: 10352, name: "3rd age kiteshield" },
  { id: 10338, name: "3rd age robe top" },
  { id: 10340, name: "3rd age robe" },
  { id: 10342, name: "3rd age mage hat" },
  { id: 10330, name: "3rd age range top" },
  { id: 10332, name: "3rd age range legs" },
  { id: 10336, name: "3rd age vambraces" },
  { id: 12426, name: "3rd age longsword" },
  { id: 12422, name: "3rd age wand" },
  { id: 10344, name: "3rd age amulet" },
  { id: 12424, name: "3rd age bow" },
  { id: 23342, name: "3rd age druidic staff" }
];

// Gem Cutting: buy uncut gem, cut, sell cut gem.
// Calculations:
// - GE Price (uncut): cheapest of buy/sell = min(low, high)
// - Cut Value (cut): highest of buy/sell = max(low, high)
// - Profit/Loss: Cut Value - GE Price
// - Limit Profit: Profit/Loss * ge_limit
//
// Notes:
// - `display_name` is what we show in the UI (lets you add "(m)" labels).
// - `uncut_name` / `cut_name` must match OSRS mapping names.
// - Set `ge_limit` when you provide limits; `null` shows as "—".
Flipwise.GEM_CUTTING_ITEMS = [
  { display_name: 'Uncut sapphire', uncut_id: 1623, uncut_name: 'Uncut sapphire', cut_id: 1607, cut_name: 'Sapphire', ge_limit: 10000 },
  { display_name: 'Uncut emerald', uncut_id: 1621, uncut_name: 'Uncut emerald', cut_id: 1605, cut_name: 'Emerald', ge_limit: 10000 },
  { display_name: 'Uncut ruby', uncut_id: 1619, uncut_name: 'Uncut ruby', cut_id: 1603, cut_name: 'Ruby', ge_limit: 10000 },
  { display_name: 'Uncut diamond', uncut_id: 1617, uncut_name: 'Uncut diamond', cut_id: 1601, cut_name: 'Diamond', ge_limit: 10000 },
  { display_name: 'Uncut dragonstone', uncut_id: 1631, uncut_name: 'Uncut dragonstone', cut_id: 1615, cut_name: 'Dragonstone', ge_limit: 10000 },
  { display_name: 'Uncut onyx', uncut_id: 6571, uncut_name: 'Uncut onyx', cut_id: 6573, cut_name: 'Onyx', ge_limit: 11000 },
  { display_name: 'Uncut zenyte', uncut_id: 19496, uncut_name: 'Uncut zenyte', cut_id: 19493, cut_name: 'Zenyte', ge_limit: 10000 },
  { display_name: 'Uncut opal', uncut_id: 1625, uncut_name: 'Uncut opal', cut_id: 1609, cut_name: 'Opal', ge_limit: 10000 },
  { display_name: 'Uncut jade', uncut_id: 1627, uncut_name: 'Uncut jade', cut_id: 1611, cut_name: 'Jade', ge_limit: 10000 },
  { display_name: 'Uncut red topaz', uncut_id: 1629, uncut_name: 'Uncut red topaz', cut_id: 1613, cut_name: 'Red topaz', ge_limit: 10000 }
];

// Shops → GE: buy at fixed shop cost, sell on GE.
// - GE Value uses the higher of buy/sell (max(high, low)), minus tax.
// - Profit per = (GE Value after tax) - shop_cost
// - Profit (limit) = profit per * GE buy limit (from mapping) unless overridden.
Flipwise.SHOPS_TO_GE_ITEMS = [
  // Martin Thwait (shop stock)
  { npc: 'Martin Thwait', display_name: 'Rope', item_id: 954, shop_cost: 18, ge_limit_override: null },
  { npc: 'Martin Thwait', display_name: 'Lockpick', item_id: 1523, shop_cost: 20, ge_limit_override: null },
  { npc: 'Martin Thwait', display_name: 'Chisel', item_id: 1755, shop_cost: 1, ge_limit_override: null },
  { npc: 'Martin Thwait', display_name: 'Knife', item_id: 946, shop_cost: 6, ge_limit_override: null },
  // Note: "Stethoscope" was not found in OSRS Wiki price mapping, so it can't be priced here until we have a valid GE-tracked item id/name.
  { npc: 'Martin Thwait', display_name: 'Bronze knife', item_id: 864, shop_cost: 1, ge_limit_override: null },
  { npc: 'Martin Thwait', display_name: 'Iron knife', item_id: 863, shop_cost: 3, ge_limit_override: null },
  { npc: 'Martin Thwait', display_name: 'Steel knife', item_id: 865, shop_cost: 11, ge_limit_override: null },
  { npc: 'Martin Thwait', display_name: 'Bronze claws', item_id: 3095, shop_cost: 15, ge_limit_override: null },
  { npc: 'Martin Thwait', display_name: 'Iron claws', item_id: 3096, shop_cost: 50, ge_limit_override: null },
  { npc: 'Martin Thwait', display_name: 'Steel claws', item_id: 3097, shop_cost: 175, ge_limit_override: null },

  // Elgan's Exceptional Staffs (Prifddinas)
  { npc: "Elgan's Exceptional Staffs", display_name: 'Battlestaff', item_id: 1391, shop_cost: 7000, ge_limit_override: null },
  { npc: "Elgan's Exceptional Staffs", display_name: 'Staff', item_id: 1379, shop_cost: 15, ge_limit_override: null },
  { npc: "Elgan's Exceptional Staffs", display_name: 'Magic staff', item_id: 1389, shop_cost: 200, ge_limit_override: null },
  { npc: "Elgan's Exceptional Staffs", display_name: 'Staff of air', item_id: 1381, shop_cost: 1500, ge_limit_override: null },
  { npc: "Elgan's Exceptional Staffs", display_name: 'Staff of water', item_id: 1383, shop_cost: 1500, ge_limit_override: null },
  { npc: "Elgan's Exceptional Staffs", display_name: 'Staff of earth', item_id: 1385, shop_cost: 1500, ge_limit_override: null },
  { npc: "Elgan's Exceptional Staffs", display_name: 'Staff of fire', item_id: 1387, shop_cost: 1500, ge_limit_override: null },

  // Filamina's Wares (Arceuus)
  { npc: "Filamina's Wares", display_name: 'Staff', item_id: 1379, shop_cost: 15, ge_limit_override: null },
  { npc: "Filamina's Wares", display_name: 'Magic staff', item_id: 1389, shop_cost: 200, ge_limit_override: null },
  { npc: "Filamina's Wares", display_name: 'Staff of air', item_id: 1381, shop_cost: 1500, ge_limit_override: null },
  { npc: "Filamina's Wares", display_name: 'Staff of water', item_id: 1383, shop_cost: 1500, ge_limit_override: null },
  { npc: "Filamina's Wares", display_name: 'Staff of earth', item_id: 1385, shop_cost: 1500, ge_limit_override: null },
  { npc: "Filamina's Wares", display_name: 'Staff of fire', item_id: 1387, shop_cost: 1500, ge_limit_override: null },

  // Sebamo's Sublime Staffs (Auburnvale)
  { npc: "Sebamo's Sublime Staffs", display_name: 'Staff', item_id: 1379, shop_cost: 15, ge_limit_override: null },
  { npc: "Sebamo's Sublime Staffs", display_name: 'Magic staff', item_id: 1389, shop_cost: 200, ge_limit_override: null },
  { npc: "Sebamo's Sublime Staffs", display_name: 'Staff of air', item_id: 1381, shop_cost: 1500, ge_limit_override: null },
  { npc: "Sebamo's Sublime Staffs", display_name: 'Staff of water', item_id: 1383, shop_cost: 1500, ge_limit_override: null },
  { npc: "Sebamo's Sublime Staffs", display_name: 'Staff of earth', item_id: 1385, shop_cost: 1500, ge_limit_override: null },
  { npc: "Sebamo's Sublime Staffs", display_name: 'Staff of fire', item_id: 1387, shop_cost: 1500, ge_limit_override: null }
];

window.Flipwise = Flipwise;
