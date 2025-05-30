/**
 * magic_item_generator/categories/headwear/headwearDefinitions.js
 * Contains all data definitions specific to HEADWEAR type items (Helmets and Hats).
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- HEADWEAR CATEGORY & SUB-TYPES ---
export const HEADWEAR_SUB_TYPES = {
    // --- Helmets (Provide AC, may have STR/CON requirements) ---
    HELMET_SIMPLE: {
        id: "HELMET_SIMPLE", name: "Simple Helm",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "simple_helmet",
        baseAcBonus: 1,
        baseValue: 50, 
        minStrMod: 0,
        minConMod: 1, 
        materials: ["IRON", "STEEL", "BRONZE", "LEATHER", "WOOD", "BONE"],
        mainTypeForArt: "helmet",
    },
    HELMET_CONICAL: {
        id: "HELMET_CONICAL", name: "Conical Helm",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "conical_helmet",
        baseAcBonus: 1, 
        baseValue: 75, 
        minStrMod: 0, 
        minConMod: 1, 
        materials: ["IRON", "STEEL", "DARK_STEEL", "BRONZE"],
        mainTypeForArt: "helmet",
    },
    HELMET_VISORED: {
        id: "HELMET_VISORED", name: "Visored Helm",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "knight_helm_visor",
        baseAcBonus: 2,
        baseValue: 150, 
        minStrMod: 2,
        minConMod: 1,
        materials: ["STEEL", "DARK_STEEL", "ENCHANTED_METAL", "IRON"], 
        mainTypeForArt: "helmet",
    },
    HELMET_BARBUTE: {
        id: "HELMET_BARBUTE", name: "Barbute Helm",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "barbute_helm",
        baseAcBonus: 2,
        baseValue: 200, 
        minStrMod: 1,
        minConMod: 2, 
        materials: ["STEEL", "DARK_STEEL", "IRON", "ENCHANTED_METAL"], 
        mainTypeForArt: "helmet",
    },

    // --- Hats (Provide other bonuses, generally no AC) ---
    HAT_WIZARD: {
        id: "HAT_WIZARD", name: "Wizard Hat",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "wizard_hat",
        baseAcBonus: 0,
        baseValue: 150,
        baseStatsBonuses: [{ type: "attribute_boost", attribute: "INT", value: 1 }],
        minStrMod: -3,
        materials: ["CLOTH", "ENCHANTED_SILK", "LEATHER"],
        mainTypeForArt: "hat",
    },
    HAT_TOPHAT: {
        id: "HAT_TOPHAT", name: "Top Hat",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "top_hat",
        baseAcBonus: 0,
        baseValue: 100, 
        baseStatsBonuses: [{ type: "attribute_boost", attribute: "CHA", value: 1 }],
        minStrMod: -3,
        materials: ["CLOTH", "LEATHER", "ENCHANTED_SILK"],
        mainTypeForArt: "hat",
    },
    HAT_BEANIE: {
        id: "HAT_BEANIE", name: "Beanie",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "beanie",
        baseAcBonus: 0,
        baseValue: 100, 
        baseStatsBonuses: [{ type: "attribute_boost", attribute: "WIS", value: 1 }],
        minStrMod: -3,
        materials: ["CLOTH", "LEATHER"], 
        mainTypeForArt: "hat",
    },
    HAT_FEDORA: {
        id: "HAT_FEDORA", name: "Fedora",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "wide_brim_fedora",
        baseAcBonus: 0,
        baseValue: 100, 
        baseStatsBonuses: [{ type: "attribute_boost", attribute: "DEX", value: 1 }],
        minStrMod: -3,
        materials: ["LEATHER", "CLOTH", "PAPER", "STRAW"],
        mainTypeForArt: "hat",
    },
    HAT_CAP: {
        id: "HAT_CAP", name: "Cap",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "cap",
        baseAcBonus: 0,
        baseValue: 100, 
        baseStatsBonuses: [{ type: "attribute_boost", attribute: "STR", value: 1 }],
        minStrMod: -3,
        materials: ["CLOTH", "LEATHER"],
        mainTypeForArt: "hat",
    },
    HAT_STRAW: {
        id: "HAT_STRAW", name: "Straw Hat",
        equipSlot: EQUIP_SLOTS.HEAD,
        pixelArtGeneratorKey: "generateHat",
        pixelArtSubType: "straw_hat",
        baseAcBonus: 0,
        baseValue: 100, 
        baseStatsBonuses: [{ type: "attribute_boost", attribute: "CON", value: 1 }],
        minStrMod: -3,
        materials: ["STRAW", "CLOTH"],
        mainTypeForArt: "hat",
    }
};

// --- MATERIALS specific to or with different properties for Headwear ---
export const HEADWEAR_MATERIALS = {};

// --- AFFIXES specific to HEADWEAR ---
export const HEADWEAR_AFFIXES = {
    PREFIXES: {
        MINOR: [
            // From user's v2 + my additions from v5 (Affix Expansion v2 - User Revisions + New Simple Affixes)
            { name: "Hardened", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.40 }, weight: 15, subTypes: ["HELMET_SIMPLE", "HELMET_CONICAL", "HELMET_VISORED", "HELMET_BARBUTE"] },
            { name: "Protective", description: "+4 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 4, valueMod: 0.18 }, weight: 12, allowedItemTypes: ["HEADWEAR"] },
            { name: "Thick", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.45 }, weight: 8, subTypes: ["HELMET_SIMPLE", "HELMET_CONICAL", "HELMET_VISORED", "HELMET_BARBUTE", "HAT_STRAW"] },
            { name: "Insightful", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.40 }, weight: 10, subTypes: ["HAT_WIZARD", "HAT_BEANIE", "HAT_FEDORA", "ROBE"] }, 
            { name: "Clever", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.40 }, weight: 10, subTypes: ["HAT_WIZARD", "HAT_CAP", "ROBE"] },
            { name: "Eloquent", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.40 }, weight: 9, subTypes: ["HAT_TOPHAT", "HAT_FEDORA", "ROBE"] },
            { name: "Warm", description: "Cold Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "cold", value: true, valueMod: 0.20 }, weight: 7, subTypes: ["HAT_BEANIE", "HAT_CAP", "PADDED_ARMOR"] }, 
            { name: "Attuned", description: "+5 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 5, valueMod: 0.25 }, weight: 7, subTypes: ["HAT_WIZARD", "ROBE", "HAT_BEANIE"] }, 
            { name: "Thickened", description: "+3 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 3, valueMod: 0.15 }, weight: 9, allowedItemTypes: ["HEADWEAR"] }, 
            { name: "Forceful", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.40 }, weight: 7, subTypes: ["HELMET_SIMPLE", "HELMET_CONICAL", "HELMET_VISORED", "HELMET_BARBUTE", "HAT_CAP"] }, 
            { name: "Keen", description: "+1 Perception", rarityMax: "EPIC", effect: { type: "skill_boost", skill: "Perception", value: 1, valueMod: 0.20 }, weight: 7, allowedItemTypes: ["HEADWEAR"] },
            { name: "Comfortable", description: "-1 Requirement (STR or CON)", rarityMax: "EPIC", effect: { type: "random_attribute_requirement_mod", attributes: ["STR", "CON"], value: -1, valueMod: 0.15 }, weight: 4, subTypes: ["HELMET_VISORED", "HELMET_BARBUTE", "FULL_PLATE_ARMOR", "CHAIN_SHIRT", "SCALE_MAIL"] },
            { name: "Thunderguard", description: "Thunder Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "thunder", value: true, valueMod: 0.25 }, weight: 5, allowedItemTypes: ["HEADWEAR"] },
            { name: "Psychic-Screened", description: "Psychic Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "psychic", value: true, valueMod: 0.25 }, weight: 3, allowedItemTypes: ["HEADWEAR"] },
            { name: "Durable", description: "+2 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 2, valueMod: 0.10 }, weight: 10, allowedItemTypes: ["HEADWEAR"] }, 
            { name: "Light-Footed", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.30 }, weight: 6, subTypes: ["HAT_FEDORA", "HAT_CAP", "LEATHER_ARMOR"] }, 
            { name: "Sharp-Witted", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.30 }, weight: 6, subTypes: ["HAT_WIZARD", "ROBE"] }, 
            { name: "Sure-Grip", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.30 }, weight: 5, subTypes: ["HELMET_SIMPLE", "HELMET_CONICAL", "HELMET_VISORED", "HELMET_BARBUTE"] },
            { name: "Energetic", description: "+3 Max MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 3, valueMod: 0.15 }, weight: 6, subTypes: ["HAT_WIZARD", "HAT_BEANIE", "ROBE"] },
        ],
        MAJOR: [
            // From user's v2 + my additions from v5
            { name: "Knightly", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.90 }, weight: 7, subTypes: ["HELMET_VISORED", "HELMET_BARBUTE"] },
            { name: "Sage's", description: "+2 WIS, +5 MP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"WIS", value:2}, {type:"mp_boost", value:5}], valueMod: 1.0 }, weight: 5, subTypes: ["HAT_WIZARD", "ROBE"] },
            { name: "Archivist's", description: "+2 INT, +5 MP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"INT", value:2}, {type:"mp_boost", value:5}], valueMod: 1.0 }, weight: 5, subTypes: ["HAT_WIZARD", "ROBE"] },
            { name: "Battle-Hardened", description: "+1 AC, +5 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"ac_boost", value:1}, {type:"hp_boost", value:5}], valueMod: 0.75 }, weight: 6, subTypes: ["HELMET_SIMPLE", "HELMET_CONICAL", "HELMET_VISORED", "HELMET_BARBUTE"] }, 
            { name: "Battlemage's", description: "+1 Spell Attack, +5 MP", rarityMax: "LEGENDARY", effect: {type:"multi_boost", effects: [{type:"spell_attack_boost", value:1}, {type:"mp_boost", value:5}], valueMod: 0.8}, weight: 5, subTypes: ["HAT_WIZARD", "HELMET_VISORED", "ROBE"]},
            { name: "Stalwart Guard's", description: "+1 AC, +1 CON", rarityMax: "LEGENDARY", effect: {type:"multi_boost", effects: [{type:"ac_boost", value:1}, {type:"attribute_boost", attribute:"CON", value:1}], valueMod: 0.75}, weight: 6, subTypes: ["HELMET_SIMPLE", "HELMET_CONICAL", "HELMET_VISORED", "HELMET_BARBUTE"]},
            { name: "Invigorating", description: "+10 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 10, valueMod: 0.45 }, weight: 5, allowedItemTypes: ["HEADWEAR"] }, 
            { name: "Arcane-Infused", description: "+10 Max MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 10, valueMod: 0.50 }, weight: 5, subTypes: ["HAT_WIZARD", "ROBE"] }, 
            { name: "Force-Resistant", description: "Force Resistance", rarityMax: "LEGENDARY", effect: { type: "resistance", damageType: "force", value: true, valueMod: 0.40 }, weight: 3, allowedItemTypes: ["HEADWEAR"] }, 
            { name: "Adamantine", description: "+2 AC, Damage Reduction 1", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"ac_boost", value:2}, {type:"damage_reduction_physical", value:1}], valueMod: 1.2 }, weight: 4, subTypes: ["HELMET_VISORED", "HELMET_BARBUTE"] }, 
            { name: "All-Warding", description: "Grants multiple Elemental Resistances", rarityMax: "LEGENDARY", effect: { type: "resistance_all_elemental", value: true, count: 3, valueMod: 1.0 }, weight: 3, allowedItemTypes: ["HEADWEAR"] }, 
            { name: "Champion's", description: "+1 All Attributes, +5 HP", rarityMax: "LEGENDARY", effect: {type:"multi_boost", effects: [{type:"attribute_boost_all", value:1}, {type:"hp_boost", value:5}], valueMod: 1.1}, weight: 3, allowedItemTypes: ["HEADWEAR"]},
            { name: "Spirit-Bound", description: "+15 Max MP, +1 WIS", rarityMax: "LEGENDARY", effect: {type:"multi_boost", effects: [{type:"mp_boost", value:15}, {type:"attribute_boost", attribute:"WIS", value:1}], valueMod: 1.1}, weight: 3, subTypes: ["HAT_WIZARD", "HAT_BEANIE", "ROBE"]},
        ]
    },
    SUFFIXES: {
        MINOR: [
            // From user's v2 + my additions from v5
            { name: "of Minor Protection", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.35 }, weight: 12, subTypes: ["HELMET_SIMPLE", "HELMET_CONICAL", "HELMET_VISORED", "HELMET_BARBUTE"] },
            { name: "of Minor Vigor", description: "+3 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 3, valueMod: 0.15 }, weight: 10, allowedItemTypes: ["HEADWEAR"] },
            { name: "of the Scholar", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.35 }, weight: 7, subTypes: ["HAT_WIZARD", "ROBE", "HAT_CAP"] }, 
            { name: "of the Seer", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.35 }, weight: 7, subTypes: ["HAT_WIZARD", "ROBE", "HAT_BEANIE"] }, 
            { name: "of the Orator", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.35 }, weight: 6, subTypes: ["HAT_TOPHAT", "HAT_FEDORA", "ROBE"] }, 
            { name: "of the Clear Mind", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.30 }, weight: 6, subTypes: ["HAT_WIZARD", "HAT_CAP", "ROBE"] }, 
            { name: "of Hardy Endurance", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.30 }, weight: 8, subTypes: ["HELMET_SIMPLE", "HELMET_CONICAL", "HAT_STRAW"] }, 
            { name: "of Swiftness", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.30 }, weight: 7, subTypes: ["HAT_FEDORA", "HAT_CAP", "LEATHER_ARMOR"] }, 
            { name: "of Lesser Mana", description: "+3 Max MP", rarityMax: "EPIC", effect: {type:"mp_boost", value:3, valueMod: 0.15}, weight: 7, subTypes: ["HAT_WIZARD", "ROBE", "HAT_BEANIE"]}, 
            { name: "of Sturdiness", description: "+1 CON", rarityMax: "EPIC", effect: {type:"attribute_boost", attribute:"CON", value:1, valueMod: 0.28}, weight: 7, allowedItemTypes: ["HEADWEAR"]}, 
            { name: "of Minor Might", description: "+1 STR", rarityMax: "EPIC", effect: {type:"attribute_boost", attribute:"STR", value:1, valueMod: 0.28}, weight: 6, subTypes: ["HELMET_SIMPLE", "HAT_CAP"]}, // New
        ],
        MAJOR: [
            // From user's v2 + my additions from v5
            { name: "of Impregnability", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.90 }, weight: 8, subTypes: ["HELMET_VISORED", "HELMET_BARBUTE", "FULL_PLATE_ARMOR"] },
            { name: "of the Grand Magus", description: "+2 INT, +10 MP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"INT", value:2}, {type:"mp_boost", value:10}], valueMod: 1.2 }, weight: 3, subTypes: ["HAT_WIZARD", "ROBE"] },
            { name: "of the High Priest", description: "+2 WIS, +10 MP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"WIS", value:2}, {type:"mp_boost", value:10}], valueMod: 1.2 }, weight: 3, subTypes: ["HAT_WIZARD", "ROBE"] },
            { name: "of Enduring Vigor", description: "+2 CON, +5 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"CON", value:2}, {type:"hp_boost", value:5}], valueMod: 0.8 }, weight: 6, allowedItemTypes: ["HEADWEAR"] }, 
            { name: "of Unyielding Fortitude", description: "+2 CON, +5 HP", rarityMax: "LEGENDARY", effect: {type:"multi_boost", effects: [{type:"attribute_boost", attribute:"CON", value:2}, {type:"hp_boost", value:5}], valueMod: 0.85}, weight: 5, allowedItemTypes: ["HEADWEAR"]},
            { name: "of the Master Tactician", description: "+2 INT, +1 Initiative", rarityMax: "LEGENDARY", effect: {type:"multi_boost", effects: [{type:"attribute_boost", attribute:"INT", value:2}, {type:"initiative_boost", value:1}], valueMod: 0.9}, weight: 4, subTypes: ["HAT_WIZARD", "HAT_CAP"]},
            { name: "of the Archon's Visage", description: "+1 All Attributes, +5 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost_all", value:1}, {type:"hp_boost", value:5}], valueMod: 1.5 }, weight: 2, allowedItemTypes: ["HEADWEAR"] }, 
            { name: "of Major Fortification", description: "+12 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 12, valueMod: 0.55 }, weight: 4, allowedItemTypes: ["HEADWEAR"] }, 
            { name: "of Greater Mana", description: "+12 Max MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 12, valueMod: 0.60 }, weight: 4, subTypes: ["HAT_WIZARD", "ROBE"] }, 
            { name: "of Mental Acuity", description: "+2 INT, +2 WIS", rarityMax: "LEGENDARY", effect: {type:"multi_boost", effects:[{type:"attribute_boost", attribute:"INT", value:2}, {type:"attribute_boost", attribute:"WIS", value:2}], valueMod:1.3}, weight:2, subTypes: ["HAT_WIZARD", "ROBE", "HAT_BEANIE"]}, // New
        ]
    }
};

// --- HEADWEAR-SPECIFIC NAME PARTS & TEMPLATES ---
export const HEADWEAR_NAME_PARTS = {
    ADJECTIVES: ["Pointed", "Wide-brimmed", "Conical", "Visored", "Feathered", "Jeweled", "Simple", "Ornate", "Sturdy", "Enchanted", "Shadowy", "Gleaming", "Ancient", "Ceremonial", "Top", "Straw", "Warm", "Clever", "Eloquent", "Keen", "Studious", "Resistant", "Comfortable", "Battle-Hardened", "Attuned", "Forceful", "Grave", "Solemn", "Mystic", "Durable", "Sharp-Witted", "Gleaming", "Heavy-Duty", "Sure-Grip", "Energetic", "Invigorating", "Adamantine", "Champion's"],
    HELMET_NOUNS: ["Helm", "Helmet", "Casque", "Sallet", "Barbute", "Coif", "Cap", "Bascinet", "Armet", "Greathelm", "Warhelm", "Visor", "Crown", "Diadem", "Warbonnet", "Faceguard", "Battlecap"],
    HAT_NOUNS: ["Hat", "Cap", "Beanie", "Fedora", "Chapeau", "Cowl", "Hood", "Bonnet", "Beret", "Tricorn", "Bycocket", "Circlet", "Bandana", "Headband", "Headwrap", "Point", "Lid"],
    NOUNS_ABSTRACT: ["Insight", "Wisdom", "Knowledge", "Power", "Protection", "Command", "Vision", "Secrets", "the Magi", "the Knight", "the Sky", "Shadows", "Sorcery", "Intellect", "Charisma", "Presence", "Alertness", "Focus", "Clarity", "Resolve", "Sight", "Leadership", "Tactics", "the Mind", "the Elements", "Endurance", "Potency", "Stealth", "Warding", "Acuity", "Fortitude"],
    PREFIX_WORDS: ["Helm", "Hat", "Cap", "Crown", "Circlet", "Coif", "Cowl", "War", "Battle", "Mage", "Sage", "Knight", "Lord", "Skull", "Iron", "Star", "Mind", "Eye", "Shadow", "Sun", "Spirit", "Thought", "Thunder", "Storm", "Night", "Death"],
    SUFFIX_WORDS: ["guard", "helm", "cap", "hat", "cowl", "hood", "crest", "veil", "tiara", "circlet", "of a Thousand Eyes", "of the Unseen Path", "of Thoughts", "of Command", "of Vision", "of Focus", "of Might", "of Warding", "of Secrets", "of Shadows", "of Endurance", "of Potency", "of Stealth", "of Insight", "of Acuity", "of Fortitude"]
};

export const HEADWEAR_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{adjective} {HELMET_NOUNS}", 
    "{adjective} {HAT_NOUNS}",    
    "{prefix_word}'s {material} {subTypeName}",
    "{subTypeName} of the {prefix_word}{suffix_word}"
];

console.log("magic_item_generator/categories/headwear/headwearDefinitions.js (Affix Expansion v6 - Simpler Effects Focus) loaded.");
