/**
 * magic_item_generator/categories/accessories/accessoryDefinitions.js
 * Contains all data definitions specific to ACCESSORY type items (rings, amulets, gloves, etc.).
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- ACCESSORY CATEGORY & SUB-TYPES ---
export const ACCESSORY_SUB_TYPES = {
    RING: {
        id: "RING", name: "Ring",
        equipSlot: EQUIP_SLOTS.ACCESSORY,
        pixelArtGeneratorKey: "generateJewelry",
        pixelArtSubType: "ring",
        baseValue: 50,
        materials: ["GOLD", "SILVER", "COPPER", "BRONZE", "STEEL", "IRON", "WOOD", "BONE", "OBSIDIAN", "ROSE_GOLD", "ENCHANTED_METAL", "PLATINUM", "LEAD"],
        baseStatsBonuses: [],
        canHaveRandomAttributeBonus: true
    },
    EARRINGS: {
        id: "EARRINGS", name: "Earrings",
        equipSlot: EQUIP_SLOTS.ACCESSORY,
        pixelArtGeneratorKey: "generateJewelry",
        pixelArtSubType: "earring",
        baseValue: 50,
        materials: ["GOLD", "SILVER", "COPPER", "STEEL", "OBSIDIAN", "BRONZE", "ENCHANTED_METAL", "BONE", "WOOD"],
        baseStatsBonuses: [],
        canHaveRandomAttributeBonus: true
    },
    NECKLACE: {
        id: "NECKLACE", name: "Necklace",
        equipSlot: EQUIP_SLOTS.ACCESSORY,
        pixelArtGeneratorKey: "generateJewelry",
        pixelArtSubType: "necklace",
        baseValue: 75,
        materials: ["SILVER", "BRONZE", "COPPER", "WOOD", "BONE", "STONE", "LEATHER", "GOLD", "ENCHANTED_METAL", "PLATINUM", "STEEL", "CLOTH"],
        baseStatsBonuses: [],
        canHaveRandomAttributeBonus: true
    },
    COLLAR: {
        id: "COLLAR", name: "Collar",
        equipSlot: EQUIP_SLOTS.ACCESSORY,
        pixelArtGeneratorKey: "generateJewelry",
        pixelArtSubType: "collar",
        baseValue: 50,
        materials: ["LEATHER", "DARK_LEATHER", "CLOTH", "SILVER", "GOLD", "STEEL", "ENCHANTED_SILK"],
        baseStatsBonuses: [],
        canHaveRandomAttributeBonus: true
    },
    CIRCLET: {
        id: "CIRCLET", name: "Circlet",
        equipSlot: EQUIP_SLOTS.ACCESSORY,
        pixelArtGeneratorKey: "generateJewelry",
        pixelArtSubType: "circlet",
        baseValue: 75,
        materials: ["GOLD", "SILVER", "ENCHANTED_METAL", "BRONZE", "COPPER", "IVORY", "WOOD", "LEATHER", "BONE"],
        baseStatsBonuses: [],
        canHaveRandomAttributeBonus: true
    },
    GLOVES: {
        id: "GLOVES", name: "Gloves",
        equipSlot: EQUIP_SLOTS.ACCESSORY,
        pixelArtGeneratorKey: "generateGloves",
        pixelArtSubType: "gloves_generic",
        baseValue: 50,
        materials: ["CLOTH", "ENCHANTED_SILK", "LEATHER", "DARK_LEATHER", "STUDDED_LEATHER", "STEEL", "IRON", "BRONZE", "DARK_STEEL", "BONE"],
        baseStatsBonuses: [],
        canHaveRandomAttributeBonus: true
    }
};

// --- MATERIALS specific to or with different properties for Accessories ---
export const ACCESSORY_MATERIALS = {
    PLATINUM: { id: "PLATINUM", name: "Platinum", paletteKey: "SILVER", valueMod: 3.0, statModifiers: {}, applicableToCategories: ["ACCESSORY"] },
    LEAD: { id: "LEAD", name: "Lead", paletteKey: "IRON", valueMod: 0.3, statModifiers: {wisReqMod: 1}, applicableToCategories: ["ACCESSORY"] },
};

// --- AFFIXES specific to ACCESSORIES ---
export const ACCESSORY_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Nimble", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.20 }, weight: 12 },
            { name: "Insightful", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.20 }, weight: 12 },
            { name: "Clever", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.20 }, weight: 12 },
            { name: "Charming", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.20 }, weight: 12 },
            { name: "Hardy", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.20 }, weight: 12 },
            { name: "Forceful", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.20 }, weight: 10, subTypes: ["GLOVES", "RING"] },
            { name: "Vitalizing", description: "+3 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 3, valueMod: 0.10 }, weight: 15 }, // Renamed from Sturdy
            { name: "Apprentice's", description: "+2 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 2, valueMod: 0.08 }, weight: 15 },
            { name: "Thickened", description: "+2 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 2, valueMod: 0.07 }, weight: 13 },
            { name: "Warding", description: "Fire Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "fire", value: true, valueMod: 0.15 }, weight: 8 },
            { name: "Guarded", description: "Cold Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "cold", value: true, valueMod: 0.15 }, weight: 8 },
            { name: "Insulated", description: "Lightning Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "lightning", value: true, valueMod: 0.15 }, weight: 7 },
            { name: "Antitoxic", description: "Poison Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "poison", value: true, valueMod: 0.15 }, weight: 7 }, // Added
            { name: "Proofed", description: "Acid Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "acid", value: true, valueMod: 0.15 }, weight: 6 }, // Added
        ],
        MAJOR: [
            { name: "Champion's", description: "+2 DEX", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "DEX", value: 2, valueMod: 0.5 }, weight: 7 },
            { name: "Sage's", description: "+2 WIS", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "WIS", value: 2, valueMod: 0.5 }, weight: 7 },
            { name: "Baron's", description: "+2 CHA", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CHA", value: 2, valueMod: 0.5 }, weight: 7 },
            { name: "Giant's Strength", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 0.5 }, weight: 6, subTypes: ["GLOVES", "RING"] },
            { name: "Archmage's", description: "+2 INT, +5 Max MP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"INT", value:2}, {type:"mp_boost", value:5}], valueMod: 0.6 }, weight: 6, subTypes: ["RING", "NECKLACE", "CIRCLET"] },
            { name: "Hierophant's", description: "+2 WIS, +5 Max MP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"WIS", value:2}, {type:"mp_boost", value:5}], valueMod: 0.6 }, weight: 6, subTypes: ["RING", "NECKLACE", "CIRCLET"] },
            { name: "Vanguard's", description: "+2 CON, +5 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"CON", value:2}, {type:"hp_boost", value:5}], valueMod: 0.55 }, weight: 7 },
            { name: "Invigorating", description: "+10 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 10, valueMod: 0.3 }, weight: 8 },
            { name: "Energized", description: "+8 MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 8, valueMod: 0.25 }, weight: 8 },
            { name: "Elemental Ward", description: "Resistance to Fire & Cold", rarityMax: "LEGENDARY", effect: { type: "multi_resistance", damageTypes: ["fire", "cold"], value: true, valueMod: 0.45 }, weight: 5 },
            { name: "Dragonscale", description: "Resistance to Fire & Acid", rarityMax: "LEGENDARY", effect: {type: "multi_resistance", damageTypes: ["fire", "acid"], value:true, valueMod: 0.45}, weight: 4}, // Added
            { name: "Stormheart", description: "Resistance to Lightning & Thunder", rarityMax: "LEGENDARY", effect: {type: "multi_resistance", damageTypes: ["lightning", "thunder"], value:true, valueMod: 0.45}, weight: 4}, // Added
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Protection", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.22 }, weight: 10, subTypes: ["RING", "NECKLACE", "GLOVES", "CIRCLET", "COLLAR"] }, // Added Collar
            { name: "of Health", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 5, valueMod: 0.12 }, weight: 15 },
            { name: "of Minor Magic", description: "+3 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 3, valueMod: 0.10 }, weight: 15 },
            { name: "of Resistance", description: "Poison Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "poison", value: true, valueMod: 0.15 }, weight: 8 },
            { name: "of Shielding", description: "Acid Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "acid", value: true, valueMod: 0.15 }, weight: 7 }, // Was 6
            { name: "of Grounding", description: "Thunder Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "thunder", value: true, valueMod: 0.15 }, weight: 6 }, // Was 5
            { name: "of Warding Flame", description: "Fire Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "fire", value: true, valueMod: 0.15 }, weight: 8 }, // Added
            { name: "of Warding Frost", description: "Cold Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "cold", value: true, valueMod: 0.15 }, weight: 8 }, // Added
            { name: "of Warding Storm", description: "Lightning Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "lightning", value: true, valueMod: 0.15 }, weight: 7 }, // Added
        ],
        MAJOR: [
            { name: "of Greater Protection", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.5 }, weight: 7, subTypes: ["RING", "NECKLACE", "GLOVES", "CIRCLET", "COLLAR"] }, // Added Collar
            { name: "of Major Health", description: "+15 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 15, valueMod: 0.4 }, weight: 8 },
            { name: "of Greater Magic", description: "+10 MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 10, valueMod: 0.3 }, weight: 8 },
            { name: "of the Archon", description: "+1 to All Attributes", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 0.9 }, weight: 3 }, // Was 2
            { name: "of Power", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 0.5 }, weight: 6, subTypes: ["GLOVES", "RING"] }, // Added
            { name: "of Grace", description: "+2 DEX", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "DEX", value: 2, valueMod: 0.5 }, weight: 6 }, // Added
            { name: "of Vigor", description: "+2 CON", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CON", value: 2, valueMod: 0.5 }, weight: 6 }, // Added
            { name: "of Acuity", description: "+2 INT", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "INT", value: 2, valueMod: 0.5 }, weight: 6, subTypes: ["RING", "NECKLACE", "CIRCLET", "EARRINGS"] }, // Added
            { name: "of Sagacity", description: "+2 WIS", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "WIS", value: 2, valueMod: 0.5 }, weight: 6, subTypes: ["RING", "NECKLACE", "CIRCLET", "EARRINGS"] }, // Added
            { name: "of Presence", description: "+2 CHA", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CHA", value: 2, valueMod: 0.5 }, weight: 6 }, // Added
            { name: "of the Mind Shield", description: "Psychic Resistance", rarityMax: "LEGENDARY", effect: { type: "resistance", damageType: "psychic", value: true, valueMod: 0.4 }, weight: 6 }, // Was 5
            { name: "of Resilience", description: "Necrotic Resistance", rarityMax: "LEGENDARY", effect: { type: "resistance", damageType: "necrotic", value: true, valueMod: 0.4 }, weight: 5 }, // Was 4
            { name: "of Brilliance", description: "Radiant Resistance", rarityMax: "LEGENDARY", effect: { type: "resistance", damageType: "radiant", value: true, valueMod: 0.4 }, weight: 4 }, // Was 3
        ]
    }
};

// --- ACCESSORY-SPECIFIC NAME PARTS & TEMPLATES ---
export const ACCESSORY_NAME_PARTS = {
    ADJECTIVES: ["Shining", "Glowing", "Ancient", "Runed", "Delicate", "Ornate", "Simple", "Heavy", "Light", "Protective", "Warding", "Blessed", "Cursed", "Enchanted", "Mystic", "Arcane", "Keen", "Vigilant", "Vitalizing", "Energized"],
    NOUNS_JEWELRY: ["Ring", "Band", "Loop", "Amulet", "Pendant", "Necklace", "Choker", "Charm", "Talisman", "Earring", "Stud", "Hoop", "Bauble", "Trinket", "Circlet", "Collar"],
    NOUNS_GLOVES: ["Gloves", "Gauntlets", "Mitts", "Handwraps", "Grips"],
    NOUNS_ABSTRACT: ["Power ", "Protection ", "Secrets ", "the Elements ", "Mind ", "Spirit ", "Fortune ", "Sight ", "Warding ", "the Serpent ", "the Eagle ", "the Lion ", "Shadows ", "Light ", "Vigilance ", "Knowledge ", "Health ", "Magic "],
    PREFIX_WORDS: ["Circlet", "Ring", "Gem", "Amulet", "Charm", "Glove", "Gauntlet", "Sun", "Moon", "Star", "Dragon", "Shadow", "Spirit", "Soul", "Mind", "Eye", "Life", "Mana"],
    SUFFIX_WORDS: ["band", "charm", "ward", "guard", "grasp", "touch", "eye", "heart", "whisper", "of the Magi", "of the Thief", "of the Warrior", "of the Stars", "of Insight", "of Swiftness", "of Vigor", "of Clarity"]
};

export const ACCESSORY_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{adjective} {NOUNS_JEWELRY}",
    "{adjective} {NOUNS_GLOVES}",
    "{prefix_word}'s {material} {subTypeName}",
    "{subTypeName} of the {prefix_word}{suffix_word}"
];

if (SHARED_MATERIALS && !SHARED_MATERIALS.PLATINUM) {
    SHARED_MATERIALS.PLATINUM = ACCESSORY_MATERIALS.PLATINUM;
}
if (SHARED_MATERIALS && !SHARED_MATERIALS.LEAD) {
    SHARED_MATERIALS.LEAD = ACCESSORY_MATERIALS.LEAD;
}

console.log("magic_item_generator/categories/accessories/accessoryDefinitions.js (v7 - Further Affix Refinement) loaded.");
