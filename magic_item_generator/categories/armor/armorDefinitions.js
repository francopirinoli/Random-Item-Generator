/**
 * magic_item_generator/categories/armor/armorDefinitions.js
 * Contains all data definitions specific to ARMOR type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- ARMOR CATEGORY & SUB-TYPES ---
export const ARMOR_SUB_TYPES = {
    // Cloth
    ROBE: {
        id: "ROBE", name: "Robe",
        equipSlot: EQUIP_SLOTS.BODY,
        pixelArtGeneratorKey: "generateRobe",
        pixelArtSubType: "robe",
        baseAcBonus: 0,
        baseValue: 150, // Updated
        minStrMod: -3,
        baseMpBonus: 10, // Added
        materials: ["CLOTH", "ENCHANTED_SILK", "LEATHER"], // Added LEATHER
    },
    PADDED_ARMOR: {
        id: "PADDED_ARMOR", name: "Padded Armor",
        equipSlot: EQUIP_SLOTS.BODY,
        pixelArtGeneratorKey: "generateArmor",
        pixelArtSubType: "padded_armor",
        baseAcBonus: 1,
        baseValue: 30,
        minStrMod: -2,
        materials: ["CLOTH", "LEATHER"],
    },

    // Light Armor
    LEATHER_ARMOR: {
        id: "LEATHER_ARMOR", name: "Leather Armor",
        equipSlot: EQUIP_SLOTS.BODY,
        pixelArtGeneratorKey: "generateArmor",
        pixelArtSubType: "leather_vest",
        baseAcBonus: 2,
        baseValue: 60,
        minStrMod: -1,
        materials: ["LEATHER", "DARK_LEATHER"],
    },
    STUDDED_LEATHER_ARMOR: {
        id: "STUDDED_LEATHER_ARMOR", name: "Studded Leather Armor",
        equipSlot: EQUIP_SLOTS.BODY,
        pixelArtGeneratorKey: "generateArmor",
        pixelArtSubType: "leather_vest",
        baseAcBonus: 3,
        baseValue: 80,
        minStrMod: 0,
        materials: ["STUDDED_LEATHER", "DARK_LEATHER"],
    },

    // Medium Armor
    SCALE_MAIL: {
        id: "SCALE_MAIL", name: "Scale Mail",
        equipSlot: EQUIP_SLOTS.BODY,
        pixelArtGeneratorKey: "generateArmor",
        pixelArtSubType: "scale_mail",
        baseAcBonus: 4,
        baseValue: 120,
        minStrMod: 1,
        minConMod: 1,
        materials: ["IRON", "STEEL", "BRONZE", "DARK_STEEL"],
    },

    // Heavy Armor
    CHAIN_SHIRT: {
        id: "CHAIN_SHIRT", name: "Chain Shirt",
        equipSlot: EQUIP_SLOTS.BODY,
        pixelArtGeneratorKey: "generateArmor",
        pixelArtSubType: "chainmail",
        baseAcBonus: 5,
        baseValue: 200,
        minStrMod: 2,
        minConMod: 2,
        materials: ["IRON", "STEEL", "DARK_STEEL"],
    },
    FULL_PLATE_ARMOR: {
        id: "FULL_PLATE_ARMOR", name: "Full Plate Armor",
        equipSlot: EQUIP_SLOTS.BODY,
        pixelArtGeneratorKey: "generateArmor",
        pixelArtSubType: ["smooth_plate", "muscled_plate"],
        baseAcBonus: 6, // Adjusted from 8 to 6 as per user file
        baseValue: 300, // Adjusted from 1500 to 300 as per user file
        minStrMod: 3,   // Adjusted from 4 to 3 as per user file
        minConMod: 3,
        materials: ["STEEL", "DARK_STEEL", "ENCHANTED_METAL"],
    },
};

// --- MATERIALS specific to or with different properties for Armor ---
export const ARMOR_MATERIALS = {};

// --- AFFIXES specific to ARMOR ---
export const ARMOR_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Reinforced", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.30 }, weight: 20, allowedItemTypes: ["ARMOR"] },
            { name: "Padded", description: "+3 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 3, valueMod: 0.15 }, weight: 15, allowedItemTypes: ["ARMOR"] },
            { name: "Resilient", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.40 }, weight: 10, allowedItemTypes: ["ARMOR"] },
            { name: "Guardian's", description: "+1 to Saving Throws", rarityMax: "EPIC", effect: { type: "save_boost_all", value: 1, valueMod: 0.50 }, weight: 8, allowedItemTypes: ["ARMOR"] },
            { name: "Flame-Warding", description: "Fire Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "fire", value: true, valueMod: 0.25 }, weight: 7, allowedItemTypes: ["ARMOR"] },
            { name: "Frost-Warding", description: "Cold Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "cold", value: true, valueMod: 0.25 }, weight: 7, allowedItemTypes: ["ARMOR"] },
            { name: "Shock-Warding", description: "Lightning Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "lightning", value: true, valueMod: 0.25 }, weight: 7, allowedItemTypes: ["ARMOR"] },
            { name: "Acid-Warding", description: "Acid Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "acid", value: true, valueMod: 0.25 }, weight: 6, allowedItemTypes: ["ARMOR"] },
            { name: "Toxin-Warding", description: "Poison Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "poison", value: true, valueMod: 0.25 }, weight: 6, allowedItemTypes: ["ARMOR"] },
            { name: "Lightweight", description: "-1 STR Requirement", rarityMax: "EPIC", effect: { type: "attribute_requirement_mod", attribute: "STR", value: -1, valueMod: 0.20 }, weight: 5, subTypes: ["FULL_PLATE_ARMOR", "CHAIN_SHIRT", "SCALE_MAIL"] },
            { name: "Nimble", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.40 }, weight: 8, subTypes: ["ROBE", "PADDED_ARMOR", "LEATHER_ARMOR", "STUDDED_LEATHER_ARMOR"] },
            { name: "Blessed", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.40 }, weight: 7, subTypes: ["ROBE", "PADDED_ARMOR"] },
            { name: "Scholarly", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.40 }, weight: 7, subTypes: ["ROBE"] },
            // User removed some affixes here
        ],
        MAJOR: [
            { name: "Impenetrable", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.70 }, weight: 15, allowedItemTypes: ["ARMOR"] },
            { name: "Adamant", description: "+10 HP, +1 AC", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"hp_boost", value:10}, {type:"ac_boost", value:1}], valueMod: 1.0 }, weight: 10, allowedItemTypes: ["ARMOR"] },
            { name: "Dragonscale", description: "Fire Resistance, +1 AC", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"resistance", damageType:"fire", value:true}, {type:"ac_boost", value:1}], valueMod: 0.90 }, weight: 7, allowedItemTypes: ["ARMOR"] },
            { name: "Invulnerable", description: "Damage Reduction 2", rarityMax: "LEGENDARY", effect: { type: "damage_reduction", value: 2, valueMod: 1.2 }, weight: 5, allowedItemTypes: ["ARMOR"] },
            { name: "Archmage's", description: "+15 Max MP, +1 Spell Save DC", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"mp_boost", value:15}, {type:"spell_save_dc_boost", value:1}], valueMod: 1.1 }, weight: 4, subTypes: ["ROBE"] },
            { name: "Iron Will", description: "+2 WIS", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "WIS", value: 2, valueMod: 0.70 }, weight: 7, subTypes: ["ROBE", "PADDED_ARMOR"] }, // User changed from +2 WIS Saving Throws
            { name: "Fortified", description: "+15 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 15, valueMod: 0.65 }, weight: 7, allowedItemTypes: ["ARMOR"] },
            { name: "Aegis of Elements", description: "Grants multiple Elemental Resistances", rarityMax: "LEGENDARY", effect: { type: "resistance_all_elemental", value: true, count: 3, valueMod: 0.95 }, weight: 4, allowedItemTypes: ["ARMOR"] },
            { name: "Stoneform", description: "Damage Reduction 1", rarityMax: "LEGENDARY", effect: { type: "damage_reduction", value: 1, valueMod: 0.6 }, weight: 6, allowedItemTypes: ["ARMOR"] },
            { name: "Bulwark's", description: "+2 CON", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CON", value: 2, valueMod: 0.8 }, weight: 6, allowedItemTypes: ["ARMOR"] },
            // User removed some affixes here
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Protection", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.30 }, weight: 20, allowedItemTypes: ["ARMOR"] },
            { name: "of Health", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 5, valueMod: 0.20 }, weight: 15, allowedItemTypes: ["ARMOR"] },
            { name: "of Vigor", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.40 }, weight: 10, allowedItemTypes: ["ARMOR"] },
            { name: "of the Athlete", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.40 }, weight: 8, subTypes: ["LEATHER_ARMOR", "STUDDED_LEATHER_ARMOR", "CHAIN_SHIRT", "SCALE_MAIL", "FULL_PLATE_ARMOR"] },
            { name: "of Quickness", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.40 }, weight: 8, subTypes: ["ROBE", "PADDED_ARMOR", "LEATHER_ARMOR", "STUDDED_LEATHER_ARMOR"] },
            { name: "of the Mind", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.40 }, weight: 7, subTypes: ["ROBE"] },
            { name: "of the Diplomat", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.40 }, weight: 6, allowedItemTypes: ["ARMOR"] }, // User changed valueMod from 0.45
            { name: "of Stone Skin", description: "Damage Reduction 1", rarityMax: "EPIC", effect: { type: "damage_reduction", value: 1, valueMod: 0.5 }, weight: 5, allowedItemTypes: ["ARMOR"] },
            // User removed some affixes here
        ],
        MAJOR: [
            { name: "of the Fortress", description: "+2 AC, +5 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"ac_boost", value:2}, {type:"hp_boost", value:5}], valueMod: 0.90 }, weight: 15, allowedItemTypes: ["ARMOR"] },
            { name: "of Invincibility", description: "Damage Reduction 1, +1 AC", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"damage_reduction", value:1}, {type:"ac_boost", value:1}], valueMod: 1.3 }, weight: 8, allowedItemTypes: ["ARMOR"] },
            { name: "of the Colossus", description: "+2 STR, +1 AC", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"STR", value:2}, {type:"ac_boost", value:1}], valueMod: 1.0 }, weight: 7, subTypes: ["FULL_PLATE_ARMOR", "CHAIN_SHIRT", "SCALE_MAIL"] },
            { name: "of the Titan", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 0.85 }, weight: 5, subTypes: ["CHAIN_SHIRT", "SCALE_MAIL", "FULL_PLATE_ARMOR"] },
            { name: "of Unburdening", description: "-2 STR Requirement", rarityMax: "LEGENDARY", effect: { type: "attribute_requirement_mod", attribute: "STR", value: -2, valueMod: 0.5 }, weight: 3, subTypes: ["FULL_PLATE_ARMOR", "CHAIN_SHIRT", "SCALE_MAIL"] },
            { name: "of Absorption", description: "Absorb 1d4 elemental damage as HP", rarityMax: "LEGENDARY", effect: { type: "elemental_absorption_hp", dice: "1d4", valueMod: 1.0 }, weight: 3, allowedItemTypes: ["ARMOR"] },
            { name: "of the Archon", description: "+1 to All Attributes", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 1.8 }, weight: 2, allowedItemTypes: ["ARMOR"] },
            // User removed some affixes here
        ]
    }
};

// --- ARMOR-SPECIFIC NAME PARTS & TEMPLATES ---
export const ARMOR_NAME_PARTS = {
    ADJECTIVES: ["Sturdy", "Reinforced", "Shining", "Darkened", "Ornate", "Battleworn", "Masterwork", "Protective", "Guardian's", "Knightly", "Scout's", "Mage's", "Ancient", "Elven", "Dwarven", "Padded", "Scaled", "Blessed", "Cursed", "Imbued"],
    NOUNS_ABSTRACT: ["Protection", "the Bulwark", "Deflection", "Fortitude", "the Aegis", "the Sentinel", "the Wall", "Resilience", "the Guardian", "Vanguard", "Scales", "Might", "Shadows", "Light", "the Elements"],
    ARMOR_PIECE_NOUNS: ["Cuirass", "Breastplate", "Hauberk", "Jerkin", "Vestments", "Robes", "Mail", "Plates", "Carapace", "Scalemail", "Padding", "Armor", "Garb", "Raiment"],
    PREFIX_WORDS: ["Battle", "War", "Iron", "Steel", "Dragon", "Shadow", "Sun", "Moon", "Star", "Knight", "Lord", "King", "Scale", "Spirit", "Ghost"],
    SUFFIX_WORDS: ["guard", "ward", "plate", "mail", "hide", "shell", "mantle", "cloak", "vest", "form", "scales", "heart", "soul", "aegis"]
};

export const ARMOR_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{adjective} {ARMOR_PIECE_NOUNS}",
    "{prefix_word}'s {material} {subTypeName}",
    "{subTypeName} of the {prefix_word}{suffix_word}"
];

console.log("magic_item_generator/categories/armor/armorDefinitions.js (v10 - Robe Enhancements & Affix Expansion) loaded.");
