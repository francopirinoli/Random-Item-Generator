/**
 * magic_item_generator/categories/footwear/footwearDefinitions.js
 * Contains all data definitions specific to FOOTWEAR type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- FOOTWEAR CATEGORY & SUB-TYPES ---
export const FOOTWEAR_SUB_TYPES = {
    BOOTS_GENERIC: {
        id: "BOOTS_GENERIC", name: "Boots", 
        equipSlot: EQUIP_SLOTS.FEET,
        pixelArtGeneratorKey: "generateBoots", 
        baseAcBonus: 0, 
        baseValue: 50, 
        minStrMod: -3, 
        minConMod: -3, 
        materials: ["LEATHER", "DARK_LEATHER", "CLOTH", "IRON", "STEEL", "ENCHANTED_METAL", "BONE", "WOOD"],
        randomAttributeBonus: {
            attributes: ["STR", "DEX", "CON", "INT", "WIS", "CHA"],
            value: 1 
        }
    }
};

// --- MATERIALS specific to or with different properties for Footwear ---
export const FOOTWEAR_MATERIALS = {};

// --- AFFIXES specific to FOOTWEAR ---
export const FOOTWEAR_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Sturdy", description: "+3 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 3, valueMod: 0.15 }, weight: 15, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Sure-Footed", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.40 }, weight: 10, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Warm", description: "Cold Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "cold", value: true, valueMod: 0.18 }, weight: 7, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Flame-Lined", description: "Fire Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "fire", value: true, valueMod: 0.18 }, weight: 7, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Shock-Resistant", description: "Lightning Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "lightning", value: true, valueMod: 0.18 }, weight: 6, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Thick-Soled", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.35 }, weight: 8, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Empowered-Step", description: "+2 Max MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 2, valueMod: 0.10 }, weight: 7, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Tough", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.35 }, weight: 8, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Grounded", description: "Thunder Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "thunder", value: true, valueMod: 0.15 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Padded-Step", description: "+2 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 2, valueMod: 0.10 }, weight: 10, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Acid-Proofed", description: "Acid Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "acid", value: true, valueMod: 0.16 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Venom-Warded", description: "Poison Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "poison", value: true, valueMod: 0.16 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Spirit-Touched", description: "+3 Max MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 3, valueMod: 0.15 }, weight: 6, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Stone-Reinforced", description: "+1 AC", rarityMax: "EPIC", effect: {type:"ac_boost", value:1, valueMod: 0.30}, weight: 7, allowedItemTypes:["FOOTWEAR"]},
            { name: "Hardy", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.32 }, weight: 9, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Blessed", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.30 }, weight: 6, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Scholarly", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.30 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] },
        ],
        MAJOR: [
            { name: "Ironshod", description: "+1 AC, +1 STR Requirement", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"ac_boost", value:1}, {type:"attribute_requirement_mod", attribute:"STR", value:1}], valueMod: 0.70 }, weight: 7, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Steel-Plated", description: "+2 AC, +1 STR Requirement", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"ac_boost", value:2}, {type:"attribute_requirement_mod", attribute:"STR", value:1}], valueMod: 1.0 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Magus-Infused", description: "+10 MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 10, valueMod: 0.45 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Vigorous-March", description: "+10 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 10, valueMod: 0.50 }, weight: 6, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Wind-Walker's", description: "+2 DEX", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "DEX", value: 2, valueMod: 0.85 }, weight: 4, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Earth-Shaker's", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 0.85 }, weight: 4, allowedItemTypes: ["FOOTWEAR"] },
            { name: "Invigorating", description: "+12 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 12, valueMod: 0.50 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Arcane-Weave", description: "+8 Max MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 8, valueMod: 0.40 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Guardian's Treads", description: "+1 AC, +5 HP", rarityMax: "LEGENDARY", effect: {type:"multi_boost", effects:[{type:"ac_boost", value:1}, {type:"hp_boost", value:5}]}, valueMod:0.75, weight: 6, allowedItemTypes: ["FOOTWEAR"]},
            { name: "Adamantine Soles", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 1.0 }, weight: 4, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Mystic's", description: "+1 INT, +1 WIS", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"attribute_boost", attribute:"INT", value:1}, {type:"attribute_boost", attribute:"WIS", value:1}], valueMod: 0.7 }, weight: 4, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "Resplendent", description: "+1 CHA, +5 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"attribute_boost", attribute:"CHA", value:1}, {type:"hp_boost", value:5}], valueMod: 0.6 }, weight: 4, allowedItemTypes: ["FOOTWEAR"] },
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Comfort", description: "+2 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 2, valueMod: 0.10 }, weight: 12, allowedItemTypes: ["FOOTWEAR"] },
            { name: "of the Agile Step", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.40 }, weight: 9, allowedItemTypes: ["FOOTWEAR"] },
            { name: "of the Wanderer", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.30 }, weight: 8, allowedItemTypes: ["FOOTWEAR"] },
            { name: "of Firewalking", description: "Fire Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "fire", value: true, valueMod: 0.18 }, weight: 6, allowedItemTypes: ["FOOTWEAR"] },
            { name: "of Frostwalking", description: "Cold Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "cold", value: true, valueMod: 0.18 }, weight: 6, allowedItemTypes: ["FOOTWEAR"] },
            { name: "of Minor Power", description: "+4 Max MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 4, valueMod: 0.12 }, weight: 7, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "of Stomping", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.30 }, weight: 6, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "of the Scribe", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.30 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "of the Shepherd", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.30 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "of the Charming Gait", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.30 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "of Basic Fortification", description: "+1 AC", rarityMax: "EPIC", effect: {type:"ac_boost", value:1, valueMod:0.40}, weight: 7, allowedItemTypes: ["FOOTWEAR"]},
            { name: "of Minor Lightning Resistance", description: "Lightning Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "lightning", value: true, valueMod: 0.18 }, weight: 6, allowedItemTypes: ["FOOTWEAR"] },
            { name: "of Minor Acid Resistance", description: "Acid Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "acid", value: true, valueMod: 0.16 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] },
            { name: "of Minor Poison Resistance", description: "Poison Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "poison", value: true, valueMod: 0.16 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] },
        ],
        MAJOR: [
            { name: "of Greater Endurance", description: "+2 CON, +8 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"CON", value:2}, {type:"hp_boost", value:8}], valueMod: 0.80 }, weight: 5, allowedItemTypes: ["FOOTWEAR"] },
            { name: "of the Titan's Tread", description: "+2 STR, +1 AC", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"STR", value:2}, {type:"ac_boost", value:1}], valueMod: 1.1 }, weight: 3, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "of Arcane Steps", description: "+12 Max MP, +1 INT", rarityMax: "LEGENDARY", effect: {type:"multi_boost", effects:[{type:"mp_boost", value:12}, {type:"attribute_boost", attribute:"INT", value:1}]}, valueMod: 1.0, weight: 3, allowedItemTypes: ["FOOTWEAR"]}, // Corrected comma
            { name: "of Boundless Vitality", description: "+20 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 20, valueMod: 0.9 }, weight: 3, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "of Infinite Mana", description: "+20 Max MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 20, valueMod: 0.9 }, weight: 3, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "of the Unbreakable", description: "Damage Reduction 1 (Physical)", rarityMax: "EPIC", effect: { type: "damage_reduction_physical", value: 1, valueMod: 0.8 }, weight: 4, allowedItemTypes: ["FOOTWEAR"] }, 
            { name: "of Elemental Guard", description: "Resistance to Fire, Cold, and Lightning", rarityMax: "LEGENDARY", effect: {type: "multi_resistance", damageTypes:["fire", "cold", "lightning"], value:true, valueMod: 1.2}, weight: 2, allowedItemTypes: ["FOOTWEAR"]},
            { name: "of the Archon's Path", description: "+1 All Attributes", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 1.7 }, weight: 2, allowedItemTypes: ["FOOTWEAR"] }, 
        ]
    }
};

// --- FOOTWEAR-SPECIFIC NAME PARTS & TEMPLATES ---
export const FOOTWEAR_NAME_PARTS = {
    ADJECTIVES: ["Sturdy", "Comfortable", "Swift", "Silent", "Reinforced", "Traveler's", "Worn", "Fine", "Rugged", "Light", "Heavy", "Protective", "Fashionable", "Fleet", "Sure-Footed", "Warm", "Quiet", "Padded", "Grounded", "Steel-Toed", "Wind-Kissed", "Earth-Bound", "Flame-Resistant", "Frost-Proof", "Vigorous", "Arcane", "Durable", "Sharp-Witted", "Gleaming", "Heavy-Duty", "Deflecting", "Steadying", "Intimidating", "Resplendent", "Unyielding"],
    NOUNS_ABSTRACT: ["the Road", "Journeys", "Swiftness", "Silence", "Comfort", "the Wilds", "Endurance", "the Wanderer", "Protection", "Speed", "Stealth", "the Path", "the Trail", "the Hunt", "Stability", "the Wind", "Firewalking", "Frostwalking", "Secrets", "Shadows", "Fortitude", "Power", "Mana", "Resilience", "Insight"],
    FOOTWEAR_NOUNS: ["Boots", "Shoes", "Sandals", "Greaves", "Slippers", "Moccasins", "Stompers", "Treads", "Sabatons", "Waders", "Trail-Runners", "Climbers", "Steps", "Paces", "Trackers", "Walkers", "Soles", "Footguards", "Sabatons", "Clogs"],
    PREFIX_WORDS: ["Boot", "Shoe", "Path", "Road", "Wind", "Silent", "Iron", "Steel", "Leather", "Swift", "Quick", "Trail", "Sky", "Stone", "Fire", "Frost", "Thunder", "Shadow", "Spirit", "Mage", "Earth"],
    SUFFIX_WORDS: ["striders", "walkers", "treads", "kickers", "guards", "runners", "hoppers", "bounders", "steppers", "marchers", "climbers", "dancers", "soles", "heels", "grips", "boots", "guards", "wardens", "shod", "covers"]
};

export const FOOTWEAR_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}", 
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{adjective} {FOOTWEAR_NOUNS}", 
    "{prefix_word}'s {material} {subTypeName}",
    "{subTypeName} of the {prefix_word}{suffix_word}"
];

console.log("magic_item_generator/categories/footwear/footwearDefinitions.js (Syntax Corrected Affix Expansion v4) loaded.");
