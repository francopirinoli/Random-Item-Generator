/**
 * magic_item_generator/categories/polearms/polearmDefinitions.js
 * Contains all data definitions specific to POLEARM type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- POLEARM CATEGORY & SUB-TYPES ---
export const POLEARM_SUB_TYPES = {
    SPEAR: {
        id: "SPEAR", name: "Spear",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generatePolearm",
        baseDamage: "1d6",
        twoHanded: false, 
        baseValue: 30,
        damageAttribute: "STR", 
        minStrMod: -1,
        materials: ["WOOD", "STEEL", "IRON", "BRONZE", "BONE", "DARK_STEEL"]
    },
    TRIDENT: {
        id: "TRIDENT", name: "Trident",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generatePolearm",
        pixelArtSubType: "trident_head",
        baseDamage: "2d4", 
        twoHanded: false,
        baseValue: 60,
        damageAttribute: "STR",
        minStrMod: 0,
        materials: ["STEEL", "IRON", "BRONZE", "DARK_STEEL", "ENCHANTED_METAL"]
    },
    POLEAXE: {
        id: "POLEAXE", name: "Poleaxe",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generatePolearm",
        pixelArtSubType: "poleaxe_head",
        baseDamage: "1d10", 
        twoHanded: true,
        baseValue: 100,
        damageAttribute: "STR",
        minStrMod: 1,
        materials: ["STEEL", "DARK_STEEL", "IRON", "ENCHANTED_METAL"]
    },
    GLAIVE: {
        id: "GLAIVE", name: "Glaive",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generatePolearm",
        pixelArtSubType: "glaive_blade",
        baseDamage: "2d6", 
        twoHanded: true,
        baseValue: 150,
        damageAttribute: "STR", 
        minStrMod: 1,
        materials: ["STEEL", "DARK_STEEL", "ENCHANTED_METAL", "OBSIDIAN"]
    },
};

// --- MATERIALS specific to or with different properties for Polearms ---
export const POLEARM_MATERIALS = {};

// --- Material options for polearm components ---
export const POLEARM_HAFT_MATERIALS = ["WOOD", "BONE", "STEEL", "DARK_STEEL", "ENCHANTED_METAL", "IRON"];
export const POLEARM_GRIP_MATERIALS = ["LEATHER", "DARK_LEATHER", "CLOTH", "ROPE"];


// --- AFFIXES specific to POLEARMS ---
export const POLEARM_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Long", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.30 }, weight: 15 },
            { name: "Pointed", description: "+1 Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", value: 1, valueMod: 0.27 }, weight: 15 },
            { name: "Barbed", description: "+1d2 Bleed Damage on Crit", rarityMax: "EPIC", subTypes: ["SPEAR", "TRIDENT"], effect: { type: "damage_add_bleed_crit", dice: "1d2", durationRounds: 1, valueMod: 0.39 }, weight: 8 },
            { name: "Weighted", description: "+1 STR Req, +1 Dmg", rarityMax: "EPIC", effect: { type: "multi_boost", effects: [{type:"attribute_requirement_mod", attribute:"STR", value:1},{type:"damage_boost_flat", value:1}], valueMod: 0.36 }, weight: 9 },
            { name: "Impaler's", description: "+5% Crit Chance", rarityMax: "EPIC", subTypes: ["SPEAR", "TRIDENT", "POLEAXE"], effect: { type: "crit_chance_boost_percent", value: 5, valueMod: 0.45 }, weight: 7 },
            { name: "Balanced", description: "-1 STR Requirement", rarityMax: "EPIC", effect: { type: "attribute_requirement_mod", attribute: "STR", value: -1, valueMod: 0.18 }, weight: 6 },
            { name: "Sure-Grip", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.45 }, weight: 5 },
            { name: "Venomous", description: "+1d2 Poison Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "poison", dice: "1d2", valueMod: 0.36 }, weight: 7 },
            { name: "Charged", description: "+1d2 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1d2", valueMod: 0.33 }, weight: 7 },
            { name: "Burning", description: "+1d2 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1d2", valueMod: 0.33 }, weight: 7 },
            { name: "Chilling", description: "+1d2 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1d2", valueMod: 0.33 }, weight: 7 },
            { name: "Vigorous", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 5, valueMod: 0.24 }, weight: 8 },
            { name: "Acid-Tipped", description: "+1d2 Acid Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "acid", dice: "1d2", valueMod: 0.33 }, weight: 7 },
            { name: "Spirit-Touched", description: "+1d2 Psychic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "psychic", dice: "1d2", valueMod: 0.36 }, weight: 6 },
            { name: "Channeler's", description: "+2 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 2, valueMod: 0.24 }, weight: 8},
        ],
        MAJOR: [
            { name: "Skirmisher's", description: "+2 to Attack Rolls", rarityMax: "LEGENDARY", effect: { type: "attack_roll_boost", value: 2, valueMod: 0.54 }, weight: 12 },
            { name: "Devastating", description: "+3 Damage", rarityMax: "LEGENDARY", effect: { type: "damage_boost_flat", value: 3, valueMod: 0.75 }, weight: 12 },
            { name: "Piercing", description: "+1d6 Piercing Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "piercing", dice: "1d6", valueMod: 0.90 }, weight: 7 },
            { name: "Smiting", description: "+1d6 Radiant Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "radiant", dice: "1d6", valueMod: 0.96 }, weight: 6 },
            { name: "Reaching", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 1.44 }, weight: 5 },
            { name: "Glaive Master's", description: "+1d10 Slashing Damage", rarityMax: "LEGENDARY", subTypes: ["GLAIVE"], effect: { type: "damage_add", damageType: "slashing", dice: "1d10", valueMod: 1.5 }, weight: 4 },
            { name: "Soulfire", description: "+1d8 Fire Damage, +1d4 Necrotic Damage", rarityMax: "LEGENDARY", effect: { type: "multi_damage_add", effects: [{damageType:"fire", dice:"1d8"}, {damageType:"necrotic", dice:"1d4"}], valueMod: 1.65 }, weight: 3 }, // Slightly increased valueMod
            { name: "Storm-Forged", description: "+1d8 Lightning Damage, +1d4 Thunder Damage", rarityMax: "LEGENDARY", effect: { type: "multi_damage_add", effects: [{damageType:"lightning", dice:"1d8"}, {damageType:"thunder", dice:"1d4"}], valueMod: 1.65 }, weight: 3 }, // Slightly increased valueMod
            { name: "Disrupting", description: "+1d8 Force Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "force", dice: "1d8", valueMod: 1.2 }, weight: 5 },
            { name: "Soul-Thief's", description: "Heal 1d4 HP on critical hit", rarityMax: "LEGENDARY", effect: { type: "heal_on_crit", dice: "1d4", valueMod: 0.9 }, weight: 3 },
            { name: "Archon's", description: "+15 MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 15, valueMod: 0.75 }, weight: 4},
            { name: "Corrupting", description: "+1d8 Acid Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "acid", dice: "1d8", valueMod: 1.14 }, weight: 5},
            { name: "Mind-Carver's", description: "+1d8 Psychic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "psychic", dice: "1d8", valueMod: 1.2 }, weight: 4},
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Thrusting", description: "+1 Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", value: 1, valueMod: 0.27 }, weight: 18 },
            { name: "of Reach", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.27 }, weight: 15 },
            { name: "of Fortitude", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.36 }, weight: 10 },
            { name: "of the Guard", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.33 }, weight: 8 },
            { name: "of Swiftness", description: "+2 Initiative", rarityMax: "EPIC", effect: { type: "initiative_boost", value: 2, valueMod: 0.24 }, weight: 7 },
            { name: "of Acuity", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.45 }, weight: 5 },
            { name: "of Persuasion", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.45 }, weight: 5 },
            { name: "of Withering", description: "+1d2 Necrotic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "necrotic", dice: "1d2", valueMod: 0.36 }, weight: 6 },
            { name: "of Minor Energy", description: "+3 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 3, valueMod: 0.34 }, weight: 8},
            { name: "of Minor Force", description: "+1d2 Force Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "force", dice: "1d2", valueMod: 0.36}, weight: 6},
        ],
        MAJOR: [
            { name: "of Impaling", description: "+10% Crit Chance", rarityMax: "LEGENDARY", effect: { type: "crit_chance_boost_percent", value: 10, valueMod: 0.90 }, weight: 7 },
            { name: "of Sweeping Strikes", description: "+1d4 Slashing Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "slashing", dice: "1d4", valueMod: 1.2 }, weight: 4 },
            { name: "of Piercing Heavens", description: "+2d6 Force Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "force", dice: "2d6", valueMod: 1.65 }, weight: 3 },
            { name: "of the Stalwart", description: "+15 HP, +1 CON", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"hp_boost", value:15}, {type:"attribute_boost", attribute:"CON", value:1}], valueMod: 0.90 }, weight: 5 },
            { name: "of Dragon Slaying", description: "+2d6 damage vs Dragons", rarityMax: "LEGENDARY", effect: { type: "conditional_damage_boost", condition: "dragon_target", dice: "2d6", valueMod: 1.8 }, weight: 2 },
            { name: "of Sundering Might", description: "+2d4 Bludgeoning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "bludgeoning", dice: "2d4", valueMod: 1.0 }, weight: 6 },
            { name: "of the Void", description: "+1d8 Necrotic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "necrotic", dice: "1d8", valueMod: 1.0 }, weight: 6 },
            { name: "of Arcane Power", description: "+10 MP, +1 INT", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"mp_boost", value:10}, {type:"attribute_boost", attribute:"INT", value:1}], valueMod: 0.90 }, weight: 4},
            { name: "of Spellbinding", description: "+2 WIS", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "WIS", value: 2, valueMod: 1.44 }, weight: 3},
        ]
    }
};

// --- POLEARM-SPECIFIC NAME PARTS & TEMPLATES ---
export const POLEARM_NAME_PARTS = {
    ADJECTIVES: ["Long", "Sharp", "Gleaming", "Iron-shod", "Steel-tipped", "Barbed", "Hooked", "Heavy", "Guardian's", "Soldier's", "Ancient", "Runic", "Serpent's", "Dragon's", "Warden's", "Valiant", "Grim", "Stalwart", "Piercing", "Sentinel's", "Ceremonial", "Ethereal", "Shadow"],
    NOUNS_ABSTRACT: ["Guard", "Phalanx", "Impaler", "Sky", "Reach", "Defense", "Vanguard", "Dragons", "Serpents", "the Gate", "Victory", "Distance", "the Heavens", "Depths", "Order", "Legion", "Honor", "Souls", "Void"],
    PREFIX_WORDS: ["Spear", "Pike", "Pole", "Glaive", "Halberd", "Trident", "Lance", "Shaft", "Point", "Blade", "War", "Sky", "Dragon", "Serpent", "Guard", "Reach", "Soul", "Void"],
    SUFFIX_WORDS: ["point", "spike", "tip", "blade", "reaver", "keeper", "guard", "piercer", "skewer", "reach", "arm", "fang", "lance", "halberd", "brand", "staff", "prod", "song", "whisper"]
};

export const POLEARM_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{prefix_word}{suffix_word}",
    "{adjective} {prefix_word} {subTypeName_root_alt}",
    "{subTypeName} of the {adjective} {noun_abstract}"
];

console.log("magic_item_generator/categories/polearms/polearmDefinitions.js (Further Affix Expansion) loaded.");
