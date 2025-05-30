/**
 * magic_item_generator/categories/shields/shieldDefinitions.js
 * Contains all data definitions specific to SHIELD type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- SHIELD CATEGORY & SUB-TYPES ---
export const SHIELD_SUB_TYPES = {
    BUCKLER: {
        id: "BUCKLER", name: "Buckler",
        equipSlot: EQUIP_SLOTS.OFF_HAND,
        pixelArtGeneratorKey: "generateShield",
        pixelArtSubType: "round", // Visually a small round shield
        baseAcBonus: 1,
        baseValue: 25, // User updated
        minStrMod: -1,
        minConMod: -2,
        materials: ["WOOD", "LEATHER", "BRONZE", "IRON", "STEEL"],
    },
    ROUND_SHIELD: {
        id: "ROUND_SHIELD", name: "Round Shield",
        equipSlot: EQUIP_SLOTS.OFF_HAND,
        pixelArtGeneratorKey: "generateShield",
        pixelArtSubType: "round",
        baseAcBonus: 2,
        baseValue: 50, // User updated
        minStrMod: 1,  // User updated
        minConMod: 1,  // User updated
        materials: ["WOOD", "IRON", "STEEL", "BRONZE", "DARK_STEEL"],
    },
    HEATER_SHIELD: {
        id: "HEATER_SHIELD", name: "Heater Shield",
        equipSlot: EQUIP_SLOTS.OFF_HAND,
        pixelArtGeneratorKey: "generateShield",
        pixelArtSubType: "heater",
        baseAcBonus: 2,
        baseValue: 75, // User updated
        minStrMod: 0,  // User updated
        minConMod: 1,
        materials: ["WOOD", "STEEL", "IRON", "DARK_STEEL"],
    },
    KITE_SHIELD: {
        id: "KITE_SHIELD", name: "Kite Shield",
        equipSlot: EQUIP_SLOTS.OFF_HAND,
        pixelArtGeneratorKey: "generateShield",
        pixelArtSubType: "kite",
        baseAcBonus: 3,
        baseValue: 100, // User updated
        minStrMod: 2,
        minConMod: 2,
        materials: ["WOOD", "STEEL", "DARK_STEEL", "ENCHANTED_METAL"],
    },
    TOWER_SHIELD: {
        id: "TOWER_SHIELD", name: "Tower Shield",
        equipSlot: EQUIP_SLOTS.OFF_HAND,
        pixelArtGeneratorKey: "generateShield",
        pixelArtSubType: "tower",
        baseAcBonus: 4,
        baseValue: 200, // User updated
        minStrMod: 3,
        minConMod: 3,
        materials: ["WOOD", "STEEL", "DARK_STEEL", "IRON", "ENCHANTED_METAL"],
    }
};

// --- MATERIALS specific to or with different properties for Shields ---
export const SHIELD_MATERIALS = {};

// --- AFFIXES specific to SHIELDS ---
export const SHIELD_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Sturdy", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.35 }, weight: 20, allowedItemTypes: ["SHIELD"] },
            { name: "Reinforced", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 5, valueMod: 0.20 }, weight: 15, allowedItemTypes: ["SHIELD"] },
            { name: "Warding", description: "+1 to All Saving Throws", rarityMax: "EPIC", effect: { type: "save_boost_all", value: 1, valueMod: 0.55 }, weight: 10, allowedItemTypes: ["SHIELD"] },
            { name: "Flameguard", description: "Fire Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "fire", value: true, valueMod: 0.30 }, weight: 8, allowedItemTypes: ["SHIELD"] },
            { name: "Frostguard", description: "Cold Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "cold", value: true, valueMod: 0.30 }, weight: 8, allowedItemTypes: ["SHIELD"] },
            { name: "Stormguard", description: "Lightning Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "lightning", value: true, valueMod: 0.30 }, weight: 7, allowedItemTypes: ["SHIELD"] },
            { name: "Acid-Ward", description: "Acid Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "acid", value: true, valueMod: 0.25 }, weight: 6, allowedItemTypes: ["SHIELD"] },
            { name: "Toxin-Ward", description: "Poison Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "poison", value: true, valueMod: 0.25 }, weight: 6, allowedItemTypes: ["SHIELD"] },
            { name: "Necrotic-Ward", description: "Necrotic Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "necrotic", value: true, valueMod: 0.25 }, weight: 5, allowedItemTypes: ["SHIELD"] },
            { name: "Radiant-Ward", description: "Radiant Resistance", rarityMax: "EPIC", effect: { type: "resistance", damageType: "radiant", value: true, valueMod: 0.25 }, weight: 4, allowedItemTypes: ["SHIELD"] },
            { name: "Lightened", description: "-1 STR Requirement", rarityMax: "EPIC", effect: { type: "attribute_requirement_mod", attribute: "STR", value: -1, valueMod: 0.25 }, weight: 6, subTypes: ["TOWER_SHIELD", "KITE_SHIELD"] },
            { name: "Balanced", description: "-1 CON Requirement", rarityMax: "EPIC", effect: { type: "attribute_requirement_mod", attribute: "CON", value: -1, valueMod: 0.20 }, weight: 5, subTypes: ["TOWER_SHIELD", "KITE_SHIELD", "HEATER_SHIELD"] },
            { name: "Thorned", description: "Reflects 1 piercing damage to melee attackers", rarityMax: "EPIC", effect: { type: "damage_reflection_melee", damageType: "piercing", value: 1, valueMod: 0.20 }, weight: 6, subTypes: ["BUCKLER", "ROUND_SHIELD", "KITE_SHIELD"] },
            { name: "Agile", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.25 }, weight: 5, subTypes: ["BUCKLER", "ROUND_SHIELD"] },
            { name: "Commanding", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.20 }, weight: 4, allowedItemTypes: ["SHIELD"] },
            { name: "Absorbent", description: "Absorbs 1 point of damage", rarityMax: "EPIC", effect: { type: "flat_damage_absorption", value: 1, valueMod: 0.30 }, weight: 7, allowedItemTypes: ["SHIELD"] },
            { name: "Resolute", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.25 }, weight: 6, allowedItemTypes: ["SHIELD"] },
            { name: "Heavy-Duty", description: "+2 STR Requirement, +1 AC", rarityMax: "EPIC", effect: { type: "multi_boost", effects:[{type:"attribute_requirement_mod", attribute:"STR", value:2}, {type:"ac_boost", value:1}], valueMod: 0.40 }, weight: 6, subTypes: ["ROUND_SHIELD", "HEATER_SHIELD", "KITE_SHIELD", "TOWER_SHIELD"] },
        ],
        MAJOR: [
            { name: "Impenetrable", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.80 }, weight: 15, allowedItemTypes: ["SHIELD"] },
            { name: "Towering", description: "+1 AC, +10 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"ac_boost", value:1}, {type:"hp_boost", value:10}], valueMod: 1.1 }, weight: 10, subTypes: ["TOWER_SHIELD", "KITE_SHIELD"] },
            { name: "Spellguard", description: "Advantage on Saving Throws vs Spells", rarityMax: "LEGENDARY", effect: { type: "special", description: "Advantage on Spell Saves", id:"ADV_SPELL_SAVES", valueMod: 1.2 }, weight: 5, allowedItemTypes: ["SHIELD"] },
            { name: "Guardian Angel's", description: "+1 AC, +1 All Saves", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"ac_boost", value:1}, {type:"save_boost_all", value:1}], valueMod: 1.0 }, weight: 6, allowedItemTypes: ["SHIELD"] },
            { name: "Sentinel's", description: "+1 AC, +2 Perception", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"ac_boost", value:1}, {type:"skill_boost", skill:"Perception", value:2}], valueMod: 0.75 }, weight: 7, allowedItemTypes: ["SHIELD"] },
            { name: "Indomitable", description: "+1 to All Attributes", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 0.9 }, weight: 3, allowedItemTypes: ["SHIELD"] },
            { name: "Aegis", description: "Absorbs 2 points of damage", rarityMax: "LEGENDARY", effect: { type: "flat_damage_absorption", value: 2, valueMod: 0.7 }, weight: 5, allowedItemTypes: ["SHIELD"] },
            { name: "Resplendent", description: "+1 CHA", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CHA", value: 2, valueMod: 0.65 }, weight: 4, allowedItemTypes: ["SHIELD"] },
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Deflection", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.35 }, weight: 20, allowedItemTypes: ["SHIELD"] },
            { name: "of Steadfastness", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.45 }, weight: 12, allowedItemTypes: ["SHIELD"] },
            { name: "of Bashing", description: "Can be used as a light weapon (1d4 Bludgeoning)", rarityMax: "EPIC", effect: { type: "special_utility", id: "SHIELD_BASH_1D4", valueMod: 0.15 }, weight: 7, subTypes: ["BUCKLER", "ROUND_SHIELD", "HEATER_SHIELD"] },
            { name: "of Quick Reactions", description: "+1 Initiative", rarityMax: "EPIC", effect: { type: "initiative_boost", value: 1, valueMod: 0.20 }, weight: 6, allowedItemTypes: ["SHIELD"] },
            { name: "of the Stalwart", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.40 }, weight: 7, allowedItemTypes: ["SHIELD"] },
            { name: "of Minor Fortification", description: "+3 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 3, valueMod: 0.15 }, weight: 10, allowedItemTypes: ["SHIELD"] },
            { name: "of Minor Magic Warding", description: "+1 on saves vs spells", rarityMax: "EPIC", effect: { type: "save_boost_vs_magic", value: 1, valueMod: 0.40 }, weight: 6, allowedItemTypes: ["SHIELD"] },
            { name: "of Insight", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.20 }, weight: 3, allowedItemTypes: ["SHIELD"] },
            { name: "of Minor Reflection", description: "Reflects 1 damage to melee attackers", rarityMax: "EPIC", effect: { type: "damage_reflection_melee_any", value: 1, valueMod: 0.25 }, weight: 6, allowedItemTypes: ["SHIELD"] },
            { name: "of the Barricade", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.35 }, weight: 5, subTypes: ["TOWER_SHIELD"]},
        ],
        MAJOR: [
            { name: "of the Bulwark", description: "+2 AC, +5 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"ac_boost", value:2}, {type:"hp_boost", value:5}], valueMod: 0.95 }, weight: 15, allowedItemTypes: ["SHIELD"] },
            { name: "of Elemental Resistance", description: "Grants multiple Elemental Resistances", rarityMax: "LEGENDARY", effect: { type: "resistance_all_elemental", value: true, count: 2, valueMod: 1.0 }, weight: 6, allowedItemTypes: ["SHIELD"] },
            { name: "of the Unbreakable Will", description: "+2 CON, +1 All Saves", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"CON", value:2}, {type:"save_boost_all", value:1}], valueMod: 1.1 }, weight: 7, allowedItemTypes: ["SHIELD"] },
            { name: "of Defiance", description: "+2 to all Saving Throws", rarityMax: "LEGENDARY", effect: { type: "save_boost_all", value: 2, valueMod: 1.15 }, weight: 5, allowedItemTypes: ["SHIELD"] },
            { name: "of Greater Absorption", description: "Absorbs 3 points of damage", rarityMax: "LEGENDARY", effect: { type: "flat_damage_absorption", value: 3, valueMod: 1.0 }, weight: 4, allowedItemTypes: ["SHIELD"] },
            { name: "of Iron Resolve", description: "+2 CON, +1 STR", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"CON", value:2}, {type:"attribute_boost", attribute:"STR", value:1}], valueMod: 0.85 }, weight: 5, allowedItemTypes: ["SHIELD"] },
            { name: "of the Archon", description: "+1 to All Attributes", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 1.8 }, weight: 2, allowedItemTypes: ["SHIELD"] },
            { name: "of the Stalwart Heart", description: "+2 CON, +5 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"CON", value:2}, {type:"hp_boost", value:5}], valueMod: 0.95 }, weight: 6, allowedItemTypes: ["SHIELD"] },
            { name: "of Trollblood", description: "Regenerates 1 HP per round in combat", rarityMax: "LEGENDARY", effect: { type: "hp_regen_per_round_combat", value: 1, valueMod: 0.8 }, weight: 4, allowedItemTypes: ["SHIELD"] },
            { name: "of the Packrat", description: "+10 Carry Capacity", rarityMax: "LEGENDARY", effect: { type: "carry_capacity_boost", value: 10, valueMod: 0.4 }, weight: 4, allowedItemTypes: ["SHIELD"] },
            { name: "of Greater Bashing", description: "Shield bash deals 1d6 Bludgeoning damage", rarityMax: "LEGENDARY", effect: {type: "special_utility", id:"SHIELD_BASH_1D6", valueMod: 0.4}, weight: 4, subTypes: ["ROUND_SHIELD", "HEATER_SHIELD", "KITE_SHIELD", "TOWER_SHIELD"]},
        ]
    }
};

// --- SHIELD-SPECIFIC NAME PARTS & TEMPLATES ---
export const SHIELD_NAME_PARTS = {
    ADJECTIVES: ["Sturdy", "Heavy", "Reinforced", "Ornate", "Battered", "Shining", "Darkened", "Guardian's", "Defender's", "Ancient", "Towering", "Round", "Kite-Shaped", "Heater-Style", "Vigilant", "Impenetrable", "Warding", "Polished", "Agile", "Commanding", "Resolute", "Absorbent", "Thorned", "Gleaming"],
    NOUNS_ABSTRACT: ["Defense", "Protection", "the Wall", "the Aegis", "Fortitude", "the Rampart", "Vigilance", "the Bastion", "Honor", "Valor", "the Keep", "the Mountain", "Reflection", "Resolve", "Insight", "Absorption"],
    SHIELD_NOUNS: ["Shield", "Buckler", "Targe", "Barrier", "Bulwark", "Wall", "Aegis", "Defender", "Protector", "Guard", "Rampart", "Mirror", "Spikes"],
    PREFIX_WORDS: ["Iron", "Steel", "Wood", "Stone", "Dragon", "Lion", "Bear", "Eagle", "Sun", "Moon", "War", "Battle", "Fortress", "Knight", "Aegis", "Spell", "Thorn"],
    SUFFIX_WORDS: ["guard", "wall", "ward", "breaker", "defender", "protector", "barrier", "shield", "aegis", "bulwark", "heart", "resolve", "mirror", "bane", "spikes"]
};

export const SHIELD_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{adjective} {SHIELD_NOUNS}",
    "{prefix_word}'s {material} {subTypeName}",
    "{subTypeName} of the {prefix_word}{suffix_word}"
];

console.log("magic_item_generator/categories/shields/shieldDefinitions.js (Affix Expansion v3 - User Revisions + New Simple Affixes) loaded.");
