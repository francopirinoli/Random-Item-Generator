/**
 * magic_item_generator/categories/axes/axeDefinitions.js
 * Contains all data definitions specific to AXE type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- AXE CATEGORY & SUB-TYPES ---
export const AXE_SUB_TYPES = {
    AXE_HAND: {
        id: "AXE_HAND", name: "Hand Axe",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: true,
        pixelArtGeneratorKey: "generateAxe",
        pixelArtSubType: "hand_axe",
        baseDamage: "1d6", twoHanded: false,
        baseValue: 20,
        damageAttribute: "STR",
        minStrMod: -1,
        materials: ["IRON", "STEEL", "BRONZE", "OBSIDIAN", "BONE", "DARK_STEEL", "STONE"] // Head materials
    },
    AXE_BATTLE: {
        id: "AXE_BATTLE", name: "Battle Axe",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateAxe",
        pixelArtSubType: "battle_axe",
        baseDamage: "1d8",
        twoHanded: false, // Could be versatile (1d10 two-handed)
        baseValue: 50,
        damageAttribute: "STR",
        minStrMod: 0,
        materials: ["IRON", "STEEL", "BRONZE", "DARK_STEEL", "ENCHANTED_METAL"]
    },
    AXE_GREAT: { // Renamed to Double Axe for consistency with pixel art
        id: "AXE_GREAT", name: "Double Axe", // Changed from "Great Axe"
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateAxe",
        pixelArtSubType: "double_axe", // Changed from "double_blade_axe"
        baseDamage: "1d12", twoHanded: true,
        baseValue: 100,
        damageAttribute: "STR",
        minStrMod: 2,
        materials: ["STEEL", "DARK_STEEL", "IRON", "ENCHANTED_METAL", "OBSIDIAN"]
    },
};

// --- MATERIALS specific to or with different properties for Axes ---
export const AXE_MATERIALS = {};

// --- Material options for axe components ---
export const AXE_HAFT_MATERIALS = ["WOOD", "BONE", "IRON", "STEEL", "DARK_STEEL", "ENCHANTED_METAL"];


// --- AFFIXES specific to AXES ---
export const AXE_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Heavy", description: "+1 Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", value: 1, valueMod: 0.27 }, weight: 15 },
            { name: "Sharp", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.27 }, weight: 15 },
            { name: "Sturdy", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.36 }, weight: 10 },
            { name: "Weighted", description: "+1 STR Requirement, +1 Damage", rarityMax: "EPIC", effect: { type: "multi_boost", effects: [{type:"attribute_requirement_mod", attribute:"STR", value:1},{type:"damage_boost_flat", value:1}], valueMod: 0.36 }, weight: 8 },
            { name: "Venomous", description: "+1d2 Poison Damage", rarityMax: "EPIC", subTypes: ["AXE_HAND"], effect: { type: "damage_add", damageType: "poison", dice: "1d2", valueMod: 0.36 }, weight: 7 },
            { name: "Savage", description: "+1d2 Bleed Damage on Crit", rarityMax: "EPIC", effect: { type: "damage_add_bleed_crit", dice: "1d2", durationRounds: 1, valueMod: 0.39 }, weight: 8 },
            { name: "Insightful", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.39 }, weight: 6 },
            { name: "Valiant", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.48 }, weight: 6 },
            { name: "Sparking", description: "+1 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1", valueMod: 0.30 }, weight: 9 },
            { name: "Smoldering", description: "+1 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1", valueMod: 0.30 }, weight: 9 },
            { name: "Frosted", description: "+1 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1", valueMod: 0.30 }, weight: 9 },
            { name: "Hardy", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 3, valueMod: 0.12 }, weight: 9 },
            { name: "Attuned", description: "+2 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 3, valueMod: 0.12 }, weight: 9 },
            { name: "Balanced", description: "-1 STR Requirement", rarityMax: "EPIC", effect: { type: "attribute_requirement_mod", attribute: "STR", value: -1, valueMod: 0.18 }, weight: 5 },
            { name: "Keen", description: "+5% Critical Hit Chance", rarityMax: "EPIC", effect: {type:"crit_chance_boost_percent", value: 2, valueMod: 0.30}, weight: 7 },
        ],
        MAJOR: [
            { name: "Brutal", description: "+3 Damage", rarityMax: "LEGENDARY", effect: { type: "damage_boost_flat", value: 3, valueMod: 0.75 }, weight: 15 },
            { name: "Executioner's", description: "+2 to Attack Rolls, +2 Damage", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attack_roll_boost", value:2}, {type:"damage_boost_flat", value:2}], valueMod: 1.14 }, weight: 10 },
            { name: "Rending", description: "Deals 1d6 Bleed Damage over 2 rounds", rarityMax: "LEGENDARY", effect: { type: "damage_add_bleed", dice: "1d6", durationRounds: 2, valueMod: 0.90 }, weight: 8 },
            { name: "Forceful Impact", description: "+1d8 Force Damage", rarityMax: "LEGENDARY", subTypes: ["AXE_GREAT", "AXE_BATTLE"], effect: { type: "damage_add", damageType: "force", dice: "1d8", valueMod: 1.2 }, weight: 5 },
            { name: "Berserker's", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 1.44 }, weight: 6 },
            { name: "Giant's", description: "+1d8 Bludgeoning Damage (as if larger size)", rarityMax: "LEGENDARY", subTypes: ["AXE_GREAT"], effect: { type: "damage_add", damageType: "bludgeoning", dice: "1d8", valueMod: 1.26 }, weight: 4 },
            { name: "Blazing", description: "+1d8 Fire Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "fire", dice: "1d8", valueMod: 1.14 }, weight: 6 },
            { name: "Stormcharged", description: "+1d8 Lightning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "lightning", dice: "1d8", valueMod: 1.14 }, weight: 6 },
            { name: "Glacial", description: "+1d6 Cold Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "cold", dice: "1d6", valueMod: 1.05 }, weight: 7 },
            { name: "Vorpal", description: "+10% Crit Chance & +50% Crit Dmg", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"crit_chance_boost_percent", value:10}, {type:"crit_damage_boost_percent", value:50}], valueMod: 1.8 }, weight: 2 },
            { name: "Titan's", description: "+15 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 15, valueMod: 0.75 }, weight: 4 },
            { name: "Defender's", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.75 }, weight: 3 },
            { name: "Holy", description: "+1d8 Radiant Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "radiant", dice: "1d8", valueMod: 1.2 }, weight: 3 },
            { name: "Unholy", description: "+1d8 Necrotic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "necrotic", dice: "1d8", valueMod: 1.2 }, weight: 3 },
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Focus", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.36 }, weight: 12 },
            { name: "of Hewing", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.27 }, weight: 18 },
            { name: "of Might", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.48 }, weight: 9 },
            { name: "of Impact", description: "+1 Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", value: 1, valueMod: 0.27 }, weight: 18 },
            { name: "of Decay", description: "+1d2 Necrotic Damage", rarityMax: "EPIC", subTypes: ["AXE_HAND"], effect: { type: "damage_add", damageType: "necrotic", dice: "1d2", valueMod: 0.39 }, weight: 6 },
            { name: "of Minor Flame", description: "+1d2 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "of Minor Frost", description: "+1d2 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "of Minor Sparking", description: "+1d2 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "of Vigor", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 5, valueMod: 0.24 }, weight: 11 },
            { name: "of Readiness", description: "+2 Initiative", rarityMax: "EPIC", effect: { type: "initiative_boost", value: 2, valueMod: 0.24 }, weight: 9 },
        ],
        MAJOR: [
            { name: "of Sundering", description: "Ignores 2 points of target's AC from armor", rarityMax: "LEGENDARY", effect: { type: "special", description: "Ignores 2 AC from armor", id:"IGNORE_ARMOR_AC_2", valueMod: 0.96 }, weight: 7 },
            { name: "of the Earthquake", description: "+1d6 Thunder Damage, chance to knock prone on hit", rarityMax: "LEGENDARY", effect: { type: "multi_effect", effects: [{type:"damage_add", damageType:"thunder", dice:"1d6"}, {type:"special_on_hit", description:"Chance to knock prone", id:"CHANCE_PRONE_ON_HIT"}], valueMod: 1.5 }, weight: 4 },
            { name: "of Fury", description: "+2 STR, -1 AC", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attribute_boost", attribute:"STR", value:2}, {type:"ac_boost", value:-1}], valueMod: 1.05 }, weight: 6 },
            { name: "of Decapitation", description: "+10% Critical Hit Chance", rarityMax: "LEGENDARY", effect: { type: "crit_chance_boost_percent", value: 10, valueMod: 1.35 }, weight: 3 },
            { name: "of Power", description: "+2 CON", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CON", value: 2, valueMod: 1.05 }, weight: 8 },
            { name: "of Burning Souls", description: "+1d8 Fire Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "fire", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "of Freezing Wrath", description: "+1d6 Cold Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "cold", dice: "1d6", valueMod: 0.99 }, weight: 6 },
            { name: "of Lightning Strikes", description: "+1d8 Lightning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "lightning", dice: "1d8", valueMod: 1.2 }, weight: 4},
            { name: "of Greater Vigor", description: "+10 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 10, valueMod: 0.6 }, weight: 5 },
            { name: "of True Strike", description: "+3 to Attack Rolls", rarityMax: "LEGENDARY", effect: { type: "attack_roll_boost", value: 3, valueMod: 0.75 }, weight: 3 },
            { name: "of Devastation", description: "+4 Damage", rarityMax: "LEGENDARY", effect: { type: "damage_boost_flat", value: 4, valueMod: 0.90 }, weight: 3 },
        ]
    }
};

// --- AXE-SPECIFIC NAME PARTS & TEMPLATES ---
export const AXE_NAME_PARTS = {
    ADJECTIVES: ["Broad", "Heavy", "Keen", "Grisly", "Savage", "Runic", "Bearded", "War-Forged", "Stone-Bit", "Skull", "Timber", "Mountain", "Viking", "Dwarven", "Orcish", "Brutal", "Jagged", "Gleaming", "Shadowed", "Bloodied", "Fierce", "Mighty", "Thundering"],
    NOUNS_ABSTRACT: ["Fury", "Doom", "the Mountain", "the Forest", "Giants", "Dragons", "the Clan", "Wrath", "Might", "Cleaving", "Rage", "the Berserker", "the Chieftain", "Stone", "Iron", "Winter", "Summer", "the North", "the Earth", "the Sky"],
    PREFIX_WORDS: ["Axe", "Edge", "War", "Doom", "Skull", "Stone", "Iron", "Steel", "Gore", "Rage", "Beard", "Broad", "Battle", "Great", "Hand", "Timber", "Rock", "Head", "Foe"],
    SUFFIX_WORDS: ["biter", "hewer", "splitter", "cleaver", "feller", "crusher", "breaker", "caller", "song", "screamer", "reaper", "bringer", "guard", "mark", "brand", "fury", "rage", "fall", "storm", "heart"]
};

export const AXE_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{prefix_word}{suffix_word}",
    "{adjective} {prefix_word} {subTypeName_root_alt}",
    "{subTypeName} of the {adjective} {noun_abstract}"
];


console.log("magic_item_generator/categories/axes/axeDefinitions.js (Affix ValueMod Tripled) loaded.");
