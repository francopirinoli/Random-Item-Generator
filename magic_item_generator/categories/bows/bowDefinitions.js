/**
 * magic_item_generator/categories/bows/bowDefinitions.js
 * Contains all data definitions specific to BOW type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- BOW CATEGORY & SUB-TYPES ---
export const BOW_SUB_TYPES = {
    SHORTBOW: {
        id: "SHORTBOW", name: "Shortbow",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateBow",
        pixelArtSubType: "shortbow",
        baseDamage: "1d6",
        twoHanded: true,
        baseValue: 50,
        damageAttribute: "DEX",
        minStrMod: -2,
        materials: ["WOOD", "BONE", "ENCHANTED_METAL", "OBSIDIAN"]
    },
    LONGBOW: {
        id: "LONGBOW", name: "Longbow",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateBow",
        pixelArtSubType: "longbow",
        baseDamage: "1d10",
        twoHanded: true,
        baseValue: 100,
        damageAttribute: "DEX",
        minStrMod: 0,
        materials: ["WOOD", "ENCHANTED_METAL", "DARK_STEEL", "OBSIDIAN"]
    },
    RECURVE_BOW: {
        id: "RECURVE_BOW", name: "Recurve Bow",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateBow",
        pixelArtSubType: "recurve",
        baseDamage: "1d8",
        twoHanded: true,
        baseValue: 75,
        damageAttribute: "DEX",
        minStrMod: -1,
        materials: ["WOOD", "BONE", "ENCHANTED_METAL", "DARK_STEEL", "OBSIDIAN"]
    }
};

// --- MATERIALS specific to or with different properties for Bows ---
export const BOW_MATERIALS = {
    OBSIDIAN: { paletteKey: "OBSIDIAN", valueMod: 1.1, statModifiers: { damage: 0, strReqMod: 1 } }
};

// --- Material options for bow components ---
export const BOW_LIMB_MATERIALS = ["WOOD", "BONE", "ENCHANTED_METAL", "DARK_STEEL", "IRON", "OBSIDIAN"];
export const BOW_GRIP_MATERIALS = ["LEATHER", "DARK_LEATHER", "CLOTH", "ROPE"];
export const BOW_STRING_MATERIALS = ["SILK_STRING", "GUT_STRING", "WIRE_STRING"];

// --- AFFIXES specific to BOWS ---
export const BOW_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Accurate", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.30 }, weight: 18 },
            { name: "Swift", description: "+1 Initiative", rarityMax: "EPIC", effect: { type: "initiative_boost", value: 1, valueMod: 0.18 }, weight: 12 },
            { name: "Lightweight", description: "-1 STR Requirement", rarityMax: "EPIC", effect: { type: "attribute_requirement_mod", attribute: "STR", value: -1, valueMod: 0.15 }, weight: 7 },
            { name: "Sure-Shot", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.48 }, weight: 10 },
            { name: "Venomous", description: "+1d2 Poison Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "poison", dice: "1d2", valueMod: 0.36 }, weight: 8 },
            { name: "Fiery", description: "+1d2 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1d2", valueMod: 0.36 }, weight: 8 }, // Renamed from Flame-Kissed
            { name: "Icy", description: "+1d2 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1d2", valueMod: 0.36 }, weight: 8 }, // Renamed from Frost-Bound
            { name: "Barbed", description: "+1d2 Bleed Damage on Crit", rarityMax: "EPIC", effect: { type: "damage_add_bleed_crit", dice: "1d2", durationRounds: 1, valueMod: 0.39 }, weight: 7}, // Renamed from Barbed-Tip
            { name: "Spirit-Focus", description: "+2 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 5, valueMod: 0.24 }, weight: 8},
            { name: "Forceful", description: "+1 Force Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", damageType: "force", value: 1, valueMod: 0.30 }, weight: 6}, // Renamed & changed effect type
            { name: "Caustic", description: "+1d2 Acid Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "acid", dice: "1d2", valueMod: 0.36 }, weight: 7}, // Renamed
            { name: "Mind-Venomed", description: "+1d2 Psychic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "psychic", dice: "1d2", valueMod: 0.39 }, weight: 6}, // Renamed
            { name: "Thunder-Struck", description: "+1d2 Thunder Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "thunder", dice: "1d2", valueMod: 0.39 }, weight: 6},
            { name: "Resilient", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.36 }, weight: 7},
        ],
        MAJOR: [
            { name: "Deadly Aim", description: "+2 to Attack Rolls, +1 Damage", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attack_roll_boost", value:2}, {type:"damage_boost_flat", value:1}], valueMod: 0.75 }, weight: 12 },
            { name: "Eagle-Eye", description: "+10% Critical Hit Chance", rarityMax: "LEGENDARY", effect: { type: "crit_chance_boost_percent", value: 10, valueMod: 0.90 }, weight: 8 },
            { name: "Dragon's Breath", description: "+1d8 Fire Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "fire", dice: "1d8", valueMod: 1.20 }, weight: 6 },
            { name: "Shadowstrike", description: "+1d6 Necrotic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "necrotic", dice: "1d6", valueMod: 1.14 }, weight: 6 },
            { name: "Sky-Piercer", description: "+2 DEX", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "DEX", value: 2, valueMod: 1.50 }, weight: 5 },
            { name: "Storm-Caller", description: "+1d8 Lightning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "lightning", dice: "1d8", valueMod: 1.26 }, weight: 4 },
            { name: "Corrupting", description: "+1d8 Acid Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "acid", dice: "1d8", valueMod: 1.14 }, weight: 5}, // Renamed
            { name: "Mind-Piercer", description: "+1d8 Psychic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "psychic", dice: "1d8", valueMod: 1.20 }, weight: 4},
            { name: "Magebane", description: "+5 MP, +1d4 Force Damage", rarityMax: "LEGENDARY", effect: { type: "multi_effect", effects: [{type:"mp_boost", value:10}, {type:"damage_add", damageType:"force", dice:"1d4"}], valueMod: 1.5 }, weight: 3}, // Changed arrow_damage_add to damage_add
            { name: "Trueshot", description: "+1 to All Attributes", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 1.8}, weight: 2},
            { name: "Energized", description: "+10 MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 15, valueMod: 0.75 }, weight: 4},
            { name: "Guardian's", description: "+2 CON", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CON", value: 2, valueMod: 0.96}, weight: 4},
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Accuracy", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.30 }, weight: 18 },
            { name: "of Speed", description: "+2 Initiative", rarityMax: "EPIC", effect: { type: "initiative_boost", value: 2, valueMod: 0.27 }, weight: 10 },
            { name: "of Farsight", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.45 }, weight: 7 },
            { name: "of Quickening", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 5, valueMod: 0.24 }, weight: 9 },
            { name: "of the Marksman", description: "+1 Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", value: 1, valueMod: 0.27 }, weight: 15 },
            { name: "of Minor Shock", description: "+1d2 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1d2", valueMod: 0.33 }, weight: 8 },
            { name: "of Minor Venom", description: "+1d2 Poison Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "poison", dice: "1d2", valueMod: 0.36 }, weight: 8 },
            { name: "of Minor Decay", description: "+1d2 Necrotic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "necrotic", dice: "1d2", valueMod: 0.36 }, weight: 6 },
            { name: "of Minor Force", description: "+1d2 Force Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "force", dice: "1d2", valueMod: 0.36}, weight: 6},
            { name: "of Minor Energy", description: "+3 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 5, valueMod: 0.24 }, weight: 8},
            { name: "of Biting Frost", description: "+2 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", damageType: "cold", value: 2, valueMod: 0.30 }, weight: 7}, // Changed from arrow_damage_add
            { name: "of Minor Warding", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.30 }, weight: 6},
        ],
        MAJOR: [
            { name: "of Pinpoint Accuracy", description: "+15% Critical Hit Chance", rarityMax: "LEGENDARY", effect: { type: "crit_chance_boost_percent", value: 15, valueMod: 1.35 }, weight: 5 },
            { name: "of the Phantom", description: "+1d8 Force Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "force", dice: "1d8", valueMod: 1.20 }, weight: 6 }, // Renamed
            { name: "of the Serpent", description: "+1d8 Poison Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "poison", dice: "1d8", valueMod: 1.26 }, weight: 4 }, // Renamed
            { name: "of Winter's Bite", description: "+1d8 Cold Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "cold", dice: "1d8", valueMod: 1.14 }, weight: 6 }, // Renamed
            { name: "of the Wind", description: "+2 DEX, +2 Initiative", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"attribute_boost", attribute:"DEX", value:2}, {type:"initiative_boost", value:2}], valueMod: 1.65 }, weight: 3 },
            { name: "of Arcane Archery", description: "+10 MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 10, valueMod: 0.60 }, weight: 5},
            { name: "of Smiting Force", description: "+1d6 Force Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "force", dice: "1d6", valueMod: 1.0 }, weight: 3 },
            { name: "of Thunderous Volleys", description: "+1d6 Thunder Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "thunder", dice: "1d6", valueMod: 1.05 }, weight: 5},
            { name: "of the Spirit Seeker", description: "+15 MP, +1 WIS", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"mp_boost", value:15}, {type:"attribute_boost", attribute:"WIS", value:1}], valueMod: 1.2 }, weight: 3},
        ]
    }
};

// --- BOW-SPECIFIC NAME PARTS & TEMPLATES ---
export const BOW_NAME_PARTS = {
    ADJECTIVES: ["Swift", "Keen-Eyed", "Long", "Short", "Recurved", "Elven", "Hunter's", "Forest", "Wind", "Silent", "Shadow", "Moon", "Sun", "Eagle's", "Hawkeye", "Trueflight", "Unerring", "Whispering", "Ghostly", "Surewood", "Heartwood"],
    NOUNS_ABSTRACT: ["Wind", "Forest", "Silence", "Hunt", "Arrow", "Flight", "Precision", "Sky", "Moon", "Sun", "Shadows", "Whispers", "Mark", "Target", "Veil", "Stars", "Destiny", "Fate"],
    PREFIX_WORDS: ["Bow", "Sniper", "Eye", "Prey", "Kill", "Swift", "Wind", "Shadow", "Moon", "Sun", "Eagle", "Hawk", "Forest", "Heart", "True", "Star", "Ghost", "Sky"],
    SUFFIX_WORDS: ["string", "flight", "shot", "hunter", "stalker", "piercer", "finder", "whisper", "song", "strike", "wing", "seeker", "eye", "fang", "glance", "singer", "caller"]
};

export const BOW_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{prefix_word}{suffix_word}",
    "{adjective} {prefix_word} {subTypeName_root_alt}",
    "{subTypeName} of the {adjective} {noun_abstract}"
];

console.log("magic_item_generator/categories/bows/bowDefinitions.js (Standardized Damage Affixes) loaded.");
