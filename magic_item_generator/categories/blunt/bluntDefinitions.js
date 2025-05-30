/**
 * magic_item_generator/categories/blunt/bluntDefinitions.js
 * Contains all data definitions specific to BLUNT WEAPON type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- BLUNT WEAPON CATEGORY & SUB-TYPES ---
export const BLUNT_SUB_TYPES = {
    CLUB_SIMPLE: {
        id: "CLUB_SIMPLE", name: "Club",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: true,
        pixelArtGeneratorKey: "generateBluntWeapon",
        pixelArtSubType: "club",
        baseDamage: "1d4", twoHanded: false,
        baseValue: 15,
        damageAttribute: "STR",
        minStrMod: -1,
        materials: ["WOOD", "BONE", "STONE", "IRON", "STEEL",]
    },
    MACE_STANDARD: {
        id: "MACE_STANDARD", name: "Mace",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateBluntWeapon",
        pixelArtSubType: "mace",
        baseDamage: "1d6", twoHanded: false,
        baseValue: 40,
        damageAttribute: "STR",
        minStrMod: 0,
        materials: ["IRON", "STEEL", "BRONZE", "DARK_STEEL"]
    },
    MORNINGSTAR: {
        id: "MORNINGSTAR", name: "Morningstar",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateBluntWeapon",
        pixelArtSubType: "morningstar",
        baseDamage: "1d8", twoHanded: false, // Deals piercing damage typically
        baseValue: 60,
        damageAttribute: "STR",
        minStrMod: 1,
        materials: ["IRON", "STEEL", "DARK_STEEL"]
    },
    WARHAMMER_ONE_HANDED: {
        id: "WARHAMMER_ONE_HANDED", name: "Warhammer",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateBluntWeapon",
        pixelArtSubType: "hammer",
        baseDamage: "1d10",
        twoHanded: false,
        baseValue: 80,
        damageAttribute: "STR",
        minStrMod: 2,
        materials: ["STEEL", "IRON", "DARK_STEEL", "ENCHANTED_METAL"]
    },
    WARHAMMER_GREAT: {
        id: "WARHAMMER_GREAT", name: "Great Warhammer",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateBluntWeapon",
        pixelArtSubType: "hammer", // Art generator might use same 'hammer' base for larger version
        baseDamage: "2d6", twoHanded: true,
        baseValue: 100,
        damageAttribute: "STR",
        minStrMod: 3,
        materials: ["STEEL", "DARK_STEEL", "IRON", "ENCHANTED_METAL", "STONE"]
    }
};

// --- MATERIALS specific to or with different properties for Blunt Weapons ---
export const BLUNT_MATERIALS = {};

// --- Material options for blunt weapon components ---
export const BLUNT_HAFT_MATERIALS = ["WOOD", "BONE", "IRON", "STEEL", "DARK_STEEL", "ENCHANTED_METAL"];
export const BLUNT_GRIP_MATERIALS = ["LEATHER", "DARK_LEATHER", "CLOTH", "WIRE_WRAPPED_STEEL"];


// --- AFFIXES specific to BLUNT WEAPONS ---
export const BLUNT_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Heavy", description: "+1 Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", value: 1, valueMod: 0.27 }, weight: 18 },
            { name: "Solid", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.27 }, weight: 15 },
            { name: "Crushing", description: "+1 damage vs armored", rarityMax: "EPIC", effect: { type: "conditional_damage_boost", condition: "armored", value: 1, valueMod: 0.30 }, weight: 10 },
            { name: "Weighted", description: "+1 STR Req, +1 Dmg", rarityMax: "EPIC", effect: { type: "multi_boost", effects: [{type:"attribute_requirement_mod", attribute:"STR", value:1},{type:"damage_boost_flat", value:1}], valueMod: 0.36 }, weight: 9 },
            { name: "Dazing", description: "+1d2 Psychic Dmg", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "psychic", dice: "1d2", valueMod: 0.39 }, weight: 7 }, // Changed from "Stunning"
            { name: "Forceful", description: "+1d2 Force Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "force", dice: "1d2", valueMod: 0.36 }, weight: 8 },
            { name: "Mighty", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.48 }, weight: 7 },
            { name: "Resonating", description: "+1d2 Thunder Dmg", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "thunder", dice: "1d2", valueMod: 0.33 }, weight: 8},
            { name: "Earthen", description: "+1d2 Bludgeoning Dmg", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "bludgeoning", dice: "1d2", valueMod: 0.30 }, weight: 9},
            { name: "Sparking", description: "+1 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1", valueMod: 0.30 }, weight: 9 },
            { name: "Smoldering", description: "+1 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1", valueMod: 0.30 }, weight: 9 },
            { name: "Frosted", description: "+1 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1", valueMod: 0.30 }, weight: 9 },
            { name: "Hardy", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 5, valueMod: 0.24 }, weight: 9 }, // Adjusted valueMod for consistency
            { name: "Attuned", description: "+5 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 5, valueMod: 0.24 }, weight: 9 }, // Adjusted valueMod
            { name: "Balanced", description: "-1 STR Requirement", rarityMax: "EPIC", effect: { type: "attribute_requirement_mod", attribute: "STR", value: -1, valueMod: 0.18 }, weight: 5 },
            { name: "Keen", description: "+5% Critical Hit Chance", rarityMax: "EPIC", effect: {type:"crit_chance_boost_percent", value: 5, valueMod: 0.45}, weight: 7 }, // Buffed crit chance slightly
            { name: "Sturdy", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.36 }, weight: 10 },
            { name: "Insightful", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.39 }, weight: 6 },
            { name: "Agile", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.45 }, weight: 4 }, // Less common for blunt
        ],
        MAJOR: [
            { name: "Brutal", description: "+3 Damage", rarityMax: "LEGENDARY", effect: { type: "damage_boost_flat", value: 3, valueMod: 0.75 }, weight: 15 },
            { name: "Shattering", description: "Ignores 2 DR", rarityMax: "LEGENDARY", effect: { type: "special", description: "Ignores 2 DR", id:"IGNORE_DR_2", valueMod: 0.96 }, weight: 9 },
            { name: "Tremor", description: "+1d8 Thunder Dmg", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "thunder", dice: "1d8", valueMod: 1.5 }, weight: 5 }, // Changed from Earthshaker
            { name: "Colossal", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 1.44 }, weight: 6 },
            { name: "Impactful", description: "+1d8 Bludgeoning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "bludgeoning", dice: "1d8", valueMod: 1.14 }, weight: 8 },
            { name: "Quake", description: "+1d6 Thunder Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "thunder", dice: "1d6", valueMod: 1.05 }, weight: 7 },
            { name: "Dominating", description: "+1 to All Attributes", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 1.8 }, weight: 3 },
            { name: "Blazing", description: "+1d8 Fire Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "fire", dice: "1d8", valueMod: 1.14 }, weight: 6 },
            { name: "Stormcharged", description: "+1d8 Lightning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "lightning", dice: "1d8", valueMod: 1.14 }, weight: 6 },
            { name: "Glacial", description: "+1d6 Cold Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "cold", dice: "1d6", valueMod: 1.05 }, weight: 7 },
            { name: "Virulent", description: "+1d8 Poison Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "poison", dice: "1d8", valueMod: 1.14 }, weight: 5 },
            { name: "Vitrifying", description: "+1d6 Acid Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "acid", dice: "1d6", valueMod: 1.05 }, weight: 5 },
            { name: "Vorpal", description: "+10% Crit Chance & +50% Crit Dmg", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"crit_chance_boost_percent", value:10}, {type:"crit_damage_boost_percent", value:50}], valueMod: 1.8 }, weight: 2 },
            { name: "Titan's", description: "+15 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 15, valueMod: 0.75 }, weight: 4 },
            { name: "Defender's", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.75 }, weight: 3 },
            { name: "Holy", description: "+1d8 Radiant Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "radiant", dice: "1d8", valueMod: 1.2 }, weight: 3 },
            { name: "Unholy", description: "+1d8 Necrotic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "necrotic", dice: "1d8", valueMod: 1.2 }, weight: 3 },
            { name: "Psychic Shatter", description: "+1d8 Psychic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "psychic", dice: "1d8", valueMod: 1.2 }, weight: 3 },
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Bashing", description: "+1 Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", value: 1, valueMod: 0.27 }, weight: 18 },
            { name: "of Striking", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.27 }, weight: 15 },
            { name: "of Breaking", description: "+1 Dmg vs Constructs", rarityMax: "EPIC", effect: { type: "conditional_damage_boost", condition: "construct_target", value: 1, valueMod: 0.30 }, weight: 10 },
            { name: "of Concussion", description: "+1d2 Bludgeoning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "bludgeoning", dice: "1d2", valueMod: 0.33 }, weight: 12 },
            { name: "of Steadiness", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.48 }, weight: 8 },
            { name: "of Warding", description: "+1 AC", rarityMax: "EPIC", effect: {type: "ac_boost", value: 1, valueMod: 0.30}, weight: 7},
            { name: "of Sagacity", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.45 }, weight: 6},
            { name: "of Minor Flame", description: "+1d2 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "of Minor Frost", description: "+1d2 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "of Minor Sparking", description: "+1d2 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "of Vigor", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 5, valueMod: 0.24 }, weight: 11 },
            { name: "of Readiness", description: "+2 Initiative", rarityMax: "EPIC", effect: { type: "initiative_boost", value: 2, valueMod: 0.24 }, weight: 9 },
            { name: "of Minor Venom", description: "+1d2 Poison Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "poison", dice: "1d2", valueMod: 0.33 }, weight: 6 },
            { name: "of Minor Decay", description: "+1d2 Necrotic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "necrotic", dice: "1d2", valueMod: 0.36 }, weight: 6 },
        ],
        MAJOR: [
            { name: "of Bonecrushing", description: "+5% Crit Chance, +25% Crit Dmg", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"crit_chance_boost_percent", value:5}, {type:"crit_damage_boost_percent", value:25}], valueMod: 1.05 }, weight: 7 },
            { name: "of Obliteration", description: "+2d4 Force Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "force", dice: "2d4", valueMod: 1.35 }, weight: 4 },
            { name: "of the Juggernaut", description: "+10 HP, +1 STR", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"hp_boost", value:10}, {type:"attribute_boost", attribute:"STR", value:1}], valueMod: 0.90 }, weight: 6 },
            { name: "of Stunning Blows", description: "+1d4 Psychic Dmg, 15% Daze", rarityMax: "LEGENDARY", effect: { type: "multi_effect", effects: [{type:"damage_add", damageType:"psychic", dice:"1d4"}, {type:"special_on_hit", description:"15% chance to daze", id:"CHANCE_DAZE_15_BLUNT"}], valueMod: 1.2 }, weight: 3 },
            { name: "of Dominance", description: "+2 CHA", rarityMax: "LEGENDARY", effect: {type: "attribute_boost", attribute: "CHA", value: 2, valueMod: 1.05}, weight: 4},
            { name: "of Power", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 1.05 }, weight: 8 },
            { name: "of Burning Impact", description: "+1d8 Fire Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "fire", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "of Freezing Blows", description: "+1d6 Cold Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "cold", dice: "1d6", valueMod: 0.99 }, weight: 6 },
            { name: "of Shocking Grasp", description: "+1d8 Lightning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "lightning", dice: "1d8", valueMod: 1.2 }, weight: 4},
            { name: "of Greater Vigor", description: "+10 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 10, valueMod: 0.6 }, weight: 5 },
            { name: "of True Impact", description: "+3 to Attack Rolls", rarityMax: "LEGENDARY", effect: { type: "attack_roll_boost", value: 3, valueMod: 0.75 }, weight: 3 },
            { name: "of Devastation", description: "+4 Damage", rarityMax: "LEGENDARY", effect: { type: "damage_boost_flat", value: 4, valueMod: 0.90 }, weight: 3 },
        ]
    }
};

// --- BLUNT WEAPON-SPECIFIC NAME PARTS & TEMPLATES ---
export const BLUNT_NAME_PARTS = {
    ADJECTIVES: ["Heavy", "Solid", "Crushing", "Mighty", "Iron", "Steel", "Stone", "Bone", "Spiked", "Flanged", "Brutal", "War", "Dire", "Giant's", "Ogre's", "Earth", "Mountain", "Thick", "Weighted", "Bludgeoning", "Grim", "Adamant"],
    NOUNS_ABSTRACT: ["Might", "Earth", "Stone", "Skulls", "Bones", "Destruction", "Impact", "Fury", "Mountain", "Giant", "Thunder", "Quake", "Dominion", "Power", "Force", "Ancients", "Forge"],
    PREFIX_WORDS: ["Mace", "Hammer", "Club", "Star", "Stone", "Iron", "War", "Skull", "Bone", "Earth", "Rock", "Spike", "Crag", "Boulder", "Mallet", "Crusher", "Sledge"],
    SUFFIX_WORDS: ["crusher", "breaker", "smasher", "pounder", "maul", "fist", "head", "shaker", "splitter", "ram", "fall", "strike", "blow", "impact", "weight", "doom", "toll"]
};

export const BLUNT_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{prefix_word}{suffix_word}",
    "{adjective} {prefix_word} {subTypeName_root_alt}",
    "{subTypeName} of the {adjective} {noun_abstract}"
];

console.log("magic_item_generator/categories/blunt/bluntDefinitions.js (Expanded Affixes & Balanced Values) loaded.");
