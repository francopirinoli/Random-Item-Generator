/**
 * magic_item_generator/categories/swords/swordDefinitions.js
 * Contains all data definitions specific to SWORD type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- SWORD CATEGORY & SUB-TYPES ---
export const SWORD_SUB_TYPES = {
    SWORD_DAGGER: {
        id: "SWORD_DAGGER", name: "Dagger",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: true,
        pixelArtGeneratorKey: "generateSword", pixelArtSubType: "dagger",
        baseDamage: "1d4", twoHanded: false,
        baseValue: 10,
        damageAttribute: "STR_OR_DEX",
        minStrMod: -3,
        materials: ["IRON", "STEEL", "BRONZE", "SILVER", "OBSIDIAN", "BONE", "DARK_STEEL", "COPPER"]
    },
    SWORD_SHORTSWORD: {
        id: "SWORD_SHORTSWORD", name: "Shortsword",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: true,
        pixelArtGeneratorKey: "generateSword", pixelArtSubType: "shortsword",
        baseDamage: "1d6", twoHanded: false,
        baseValue: 25,
        damageAttribute: "STR_OR_DEX",
        minStrMod: -2,
        materials: ["IRON", "STEEL", "BRONZE", "SILVER", "DARK_STEEL", "ENCHANTED_METAL"]
    },
    SWORD_LONG: {
        id: "SWORD_LONG", name: "Longsword",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        pixelArtGeneratorKey: "generateSword", pixelArtSubType: "longsword",
        baseDamage: "1d8", twoHanded: false,
        baseValue: 50,
        damageAttribute: "STR",
        minStrMod: 0,
        materials: ["IRON", "STEEL", "SILVER", "DARK_STEEL", "ENCHANTED_METAL"]
    },
    SWORD_RAPIER: {
        id: "SWORD_RAPIER", name: "Rapier",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        pixelArtGeneratorKey: "generateSword", pixelArtSubType: "rapier",
        baseDamage: "1d8", twoHanded: false,
        damageAttribute: "STR_OR_DEX",
        minStrMod: -1,
        baseValue: 60,
        materials: ["STEEL", "SILVER", "ENCHANTED_METAL", "DARK_STEEL"]
    },
    SWORD_KATANA: {
        id: "SWORD_KATANA", name: "Katana",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        pixelArtGeneratorKey: "generateSword", pixelArtSubType: "katana",
        baseDamage: "1d8", twoHanded: false,
        baseValue: 75,
        damageAttribute: "STR_OR_DEX",
        minStrMod: 0,
        materials: ["STEEL", "DARK_STEEL", "ENCHANTED_METAL", "OBSIDIAN", "SILVER"]
    },
    SWORD_GREATSWORD: {
        id: "SWORD_GREATSWORD", name: "Greatsword",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        pixelArtGeneratorKey: "generateSword", pixelArtSubType: "greatsword",
        baseDamage: "2d6", twoHanded: true,
        baseValue: 100,
        damageAttribute: "STR",
        minStrMod: 2,
        materials: ["STEEL", "DARK_STEEL", "ENCHANTED_METAL", "BONE", "OBSIDIAN", "IRON"]
    }
};

// --- MATERIALS specific to or with different properties for Swords ---
export const SWORD_MATERIALS = {
    // Example: If 'OBSIDIAN_FOLDED' needed specific stats for swords
    // OBSIDIAN_FOLDED: { paletteKey: "OBSIDIAN", valueMod: 1.5, statModifiers: { damage: 1 } }
};

// --- NEW: Material options for sword components ---
export const SWORD_HILT_MATERIALS = ["WOOD", "BONE", "IVORY", "STEEL", "IRON", "DARK_STEEL", "BRONZE", "SILVER", "GOLD", "ENCHANTED_METAL", "OBSIDIAN"];
export const SWORD_GRIP_MATERIALS = ["LEATHER", "DARK_LEATHER", "RED_LEATHER", "CLOTH", "WOOD", "BONE", "IVORY", "WIRE_WRAPPED_STEEL"]; // WIRE_WRAPPED_STEEL would need a palette or be handled by art gen
export const SWORD_POMMEL_MATERIALS = ["STEEL", "IRON", "DARK_STEEL", "BRONZE", "SILVER", "GOLD", "ENCHANTED_METAL", "OBSIDIAN", "BONE", "IVORY", "GEM_RED", "GEM_BLUE", "GEM_GREEN"]; // Pommels can be gems


// --- AFFIXES specific to SWORDS ---
export const SWORD_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Reliable", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.24 }, weight: 15 },
            { name: "Honed", description: "+1 to Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", value: 1, valueMod: 0.24 }, weight: 15 },
            { name: "Sparking", description: "+1 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1", valueMod: 0.30 }, weight: 10 },
            { name: "Smoldering", description: "+1 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1", valueMod: 0.30 }, weight: 10 },
            { name: "Frosted", description: "+1 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1", valueMod: 0.30 }, weight: 10 },
            { name: "Quick", description: "+1 Initiative", rarityMax: "EPIC", effect: { type: "initiative_boost", value: 1, valueMod: 0.15 }, weight: 8 },
            { name: "Hardy", description: "+3 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 3, valueMod: 0.12 }, weight: 10 },
            { name: "Attuned", description: "+3 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 3, valueMod: 0.12 }, weight: 10 },
            { name: "Tainted", description: "+1 Poison Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "poison", dice: "1", valueMod: 0.30 }, weight: 10 },
            { name: "Etched", description: "+1 Acid Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "acid", dice: "1", valueMod: 0.30 }, weight: 7 },
            { name: "Light", description: "-1 STR Requirement", rarityMax: "EPIC", effect: { type: "attribute_requirement_mod", attribute: "STR", value: -1, valueMod: 0.15 }, weight: 6 },
            { name: "Jagged", description: "+1d2 Bleed Damage on Crit", rarityMax: "EPIC", effect: { type: "damage_add_bleed_crit", dice: "1d2", durationRounds: 1, valueMod: 0.36 }, weight: 8 },
            { name: "Keen", description: "+2% Critical Hit Chance", rarityMax: "EPIC", effect: {type:"crit_chance_boost_percent", value: 2, valueMod: 0.27}, weight: 7 },
            { name: "Ember", description: "+1d2 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "Static", description: "+1d2 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "Rime", description: "+1d2 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "Noxious", description: "+1d2 Poison Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "poison", dice: "1d2", valueMod: 0.33 }, weight: 9 },
            { name: "Caustic", description: "+1d2 Acid Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "acid", dice: "1d2", valueMod: 0.33 }, weight: 6 },
            { name: "Grave", description: "+1d2 Necrotic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "necrotic", dice: "1d2", valueMod: 0.36 }, weight: 7 },
            { name: "Radiant", description: "+1d2 Radiant Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "radiant", dice: "1d2", valueMod: 0.36 }, weight: 7 },
            { name: "Forceful", description: "+1d2 Force Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "force", dice: "1d2", valueMod: 0.36 }, weight: 7 },
            { name: "Psychic", description: "+1d2 Psychic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "psychic", dice: "1d2", valueMod: 0.36 }, weight: 7 },
            { name: "Thundering", description: "+1d2 Thunder Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "thunder", dice: "1d2", valueMod: 0.36 }, weight: 7 },
            { name: "Valiant", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.45 }, weight: 5 },
            { name: "Deft", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.45 }, weight: 5 },
        ],
        MAJOR: [
            { name: "Warrior's", description: "+2 to Attack Rolls", rarityMax: "LEGENDARY", effect: { type: "attack_roll_boost", value: 2, valueMod: 0.54 }, weight: 15 },
            { name: "Executioner's", description: "+3 to Damage", rarityMax: "LEGENDARY", effect: { type: "damage_boost_flat", value: 3, valueMod: 0.66 }, weight: 15 },
            { name: "Vicious", description: "Deals 1d6 Bleed Damage over 2 rounds", rarityMax: "LEGENDARY", effect: { type: "damage_add_bleed", dice: "1d6", durationRounds: 2, valueMod: 0.84 }, weight: 10 },
            { name: "Perfected", description: "+2 Attack & +2 Damage", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"attack_roll_boost", value:2}, {type:"damage_boost_flat", value:2}], valueMod: 1.05 }, weight: 8 },
            { name: "Assassin's", description: "+30% Critical Hit Damage", rarityMax: "LEGENDARY", subTypes: ["SWORD_DAGGER", "SWORD_SHORTSWORD"], effect: { type: "crit_damage_boost_percent", value: 30, valueMod: 0.75 }, weight: 7 },
            { name: "Duelist's", description: "+2 DEX", rarityMax: "LEGENDARY", subTypes: ["SWORD_RAPIER"], effect: { type: "attribute_boost", attribute: "DEX", value: 2, valueMod: 0.84 }, weight: 6 },
            { name: "Knight's", description: "+2 STR", rarityMax: "LEGENDARY", subTypes: ["SWORD_LONG", "SWORD_GREATSWORD"], effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 0.84 }, weight: 7 },
            { name: "Blazing", description: "+1d8 Fire Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "fire", dice: "1d8", valueMod: 1.14 }, weight: 7 },
            { name: "Stormcharged", description: "+1d8 Lightning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "lightning", dice: "1d8", valueMod: 1.14 }, weight: 7 },
            { name: "Virulent", description: "+1d8 Poison Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "poison", dice: "1d8", valueMod: 1.14 }, weight: 7 },
            { name: "Glacial", description: "+1d6 Cold Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "cold", dice: "1d6", valueMod: 1.05 }, weight: 8 },
            { name: "Vitrifying", description: "+1d6 Acid Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "acid", dice: "1d6", valueMod: 1.05 }, weight: 7 },
            { name: "Heroic", description: "+1 to all Attribute Modifiers", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 1.5 }, weight: 3 },
            { name: "Vorpal", description: "+10% Crit Chance & +50% Crit Dmg", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"crit_chance_boost_percent", value:10}, {type:"crit_damage_boost_percent", value:50}], valueMod: 1.8 }, weight: 2 },
            { name: "Champion's", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 1.35 }, weight: 4 },
            { name: "Shadowdancer's", description: "+2 DEX", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "DEX", value: 2, valueMod: 1.35 }, weight: 4 },
            { name: "Archmage's", description: "+2 INT", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "INT", value: 2, valueMod: 1.35 }, weight: 2 },
            { name: "Hierophant's", description: "+2 WIS", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "WIS", value: 2, valueMod: 1.35 }, weight: 2 },
            { name: "Titan's", description: "+15 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 15, valueMod: 0.75 }, weight: 5 },
            { name: "Sage's", description: "+15 MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 15, valueMod: 0.75 }, weight: 5 },
            { name: "Soul-Drinker", description: "Heal 1d4 HP on kill", rarityMax: "LEGENDARY", effect: { type: "heal_on_kill", dice: "1d4", valueMod: 0.9 }, weight: 3 },
            { name: "Defender's", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.75 }, weight: 4 },
            { name: "Holy", description: "+1d8 Radiant Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "radiant", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "Unholy", description: "+1d8 Necrotic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "necrotic", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "Psychic Blast", description: "+1d8 Psychic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "psychic", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "Sonic Boom", description: "+1d8 Thunder Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "thunder", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "Planar", description: "+1d8 Force Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "force", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "Penetrating", description: "Ignores 2 points of Damage Reduction", rarityMax: "LEGENDARY", effect: { type: "special", description: "Ignores 2 DR", id: "IGNORE_DR_2", valueMod: 0.9 }, weight: 3 },
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Minor Flame", description: "+1d2 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1d2", valueMod: 0.33 }, weight: 10 },
            { name: "of Minor Frost", description: "+1d2 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1d2", valueMod: 0.33 }, weight: 10 },
            { name: "of Minor Sparking", description: "+1d2 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1d2", valueMod: 0.33 }, weight: 10 },
            { name: "of Vigor", description: "+5 HP", rarityMax: "EPIC", effect: { type: "hp_boost", value: 5, valueMod: 0.24 }, weight: 12 },
            { name: "of Clarity", description: "+5 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 5, valueMod: 0.24 }, weight: 12 },
            { name: "of Accuracy", description: "+1 to Attack Rolls", rarityMax: "EPIC", effect: { type: "attack_roll_boost", value: 1, valueMod: 0.24 }, weight: 18 },
            { name: "of Striking", description: "+1 Damage", rarityMax: "EPIC", effect: { type: "damage_boost_flat", value: 1, valueMod: 0.24 }, weight: 18 },
            { name: "of Lesser Warding", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.30 }, weight: 9 },
            { name: "of Biting", description: "+1d2 Acid Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "acid", dice: "1d2", valueMod: 0.33 }, weight: 7 },
            { name: "of Minor Venom", description: "+1d2 Poison Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "poison", dice: "1d2", valueMod: 0.33 }, weight: 7 },
            { name: "of Readiness", description: "+2 Initiative", rarityMax: "EPIC", effect: { type: "initiative_boost", value: 2, valueMod: 0.24 }, weight: 10 },
            { name: "of Might", description: "+1 STR", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 1, valueMod: 0.45 }, weight: 8 },
            { name: "of Agility", description: "+1 DEX", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 1, valueMod: 0.45 }, weight: 8 },
            { name: "of Fortitude", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.45 }, weight: 8 },
            { name: "of Insight", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.45 }, weight: 6 },
            { name: "of Guile", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.45 }, weight: 6 },
            { name: "of Presence", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.45 }, weight: 6 },
            { name: "of the Swift Hand", description: "+2 Initiative", rarityMax: "EPIC", effect: { type: "initiative_boost", value: 2, valueMod: 0.27 }, weight: 9 },
            { name: "of Minor Necrosis", description: "+1d2 Necrotic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "necrotic", dice: "1d2", valueMod: 0.36 }, weight: 6 },
            { name: "of Minor Radiance", description: "+1d2 Radiant Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "radiant", dice: "1d2", valueMod: 0.36 }, weight: 6 },
            { name: "of Minor Force", description: "+1d2 Force Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "force", dice: "1d2", valueMod: 0.36 }, weight: 6 },
            { name: "of Minor Psionics", description: "+1d2 Psychic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "psychic", dice: "1d2", valueMod: 0.36 }, weight: 6 },
            { name: "of Minor Thunder", description: "+1d2 Thunder Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "thunder", dice: "1d2", valueMod: 0.36 }, weight: 6 },
            { name: "of the Sure Aim", description: "+1 to Ranged Attack Rolls (for throwing daggers)", rarityMax: "EPIC", subTypes: ["SWORD_DAGGER"], effect: { type: "attack_roll_boost_ranged", value: 1, valueMod: 0.21 }, weight: 5 },
        ],
        MAJOR: [
            { name: "of Precision", description: "+5% Critical Hit Chance", rarityMax: "LEGENDARY", effect: { type: "crit_chance_boost_percent", value: 5, valueMod: 0.54 }, weight: 12 },
            { name: "of Burning Souls", description: "+1d8 Fire Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "fire", dice: "1d8", valueMod: 1.20 }, weight: 5 },
            { name: "of Freezing Wrath", description: "+1d6 Cold Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "cold", dice: "1d6", valueMod: 0.99 }, weight: 7 },
            { name: "of the Vampire", description: "Heal 2 HP on hit", rarityMax: "LEGENDARY", effect: { type: "life_steal_flat", value: 2, valueMod: 1.2 }, weight: 4 },
            { name: "of Power", description: "+2 STR", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 2, valueMod: 1.05 }, weight: 7 },
            { name: "of Grace", description: "+2 DEX", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "DEX", value: 2, valueMod: 1.05 }, weight: 7 },
            { name: "of Intellect", description: "+2 INT", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "INT", value: 2, valueMod: 1.05 }, weight: 5 },
            { name: "of Wisdom", description: "+2 WIS", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "WIS", value: 2, valueMod: 1.05 }, weight: 5 },
            { name: "of Charisma", description: "+2 CHA", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CHA", value: 2, valueMod: 1.05 }, weight: 5 },
            { name: "of Vitality", description: "+2 CON", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CON", value: 2, valueMod: 1.05 }, weight: 5 },
            { name: "of Lightning Strikes", description: "+1d8 Lightning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "lightning", dice: "1d8", valueMod: 1.20 }, weight: 5},
            { name: "of Venom's Kiss", description: "+1d8 Poison Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "poison", dice: "1d8", valueMod: 1.20 }, weight: 5},
            { name: "of Acidic Bite", description: "+1d8 Acid Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "acid", dice: "1d8", valueMod: 1.20 }, weight: 4},
            { name: "of the Inferno", description: "+2d4 Fire Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "fire", dice: "2d4", valueMod: 1.35 }, weight: 3 },
            { name: "of Greater Vigor", description: "+10 HP", rarityMax: "LEGENDARY", effect: { type: "hp_boost", value: 10, valueMod: 0.6 }, weight: 6 },
            { name: "of Greater Clarity", description: "+10 MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 10, valueMod: 0.6 }, weight: 6 },
            { name: "of True Strike", description: "+3 to Attack Rolls", rarityMax: "LEGENDARY", effect: { type: "attack_roll_boost", value: 3, valueMod: 0.75 }, weight: 4 },
            { name: "of Devastation", description: "+4 to Damage", rarityMax: "LEGENDARY", effect: { type: "damage_boost_flat", value: 4, valueMod: 0.90 }, weight: 4 },
            { name: "of the Paragon", description: "+1 to All Attribute Modifiers", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 1.8 }, weight: 2 },
            { name: "of Alacrity", description: "+5 Initiative", rarityMax: "LEGENDARY", effect: { type: "initiative_boost", value: 5, valueMod: 0.6 }, weight: 3},
            { name: "of Greater Necrosis", description: "+1d8 Necrotic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "necrotic", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "of Greater Radiance", description: "+1d8 Radiant Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "radiant", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "of Greater Force", description: "+1d8 Force Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "force", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "of Greater Psionics", description: "+1d8 Psychic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "psychic", dice: "1d8", valueMod: 1.2 }, weight: 4 },
            { name: "of Greater Thunder", description: "+1d8 Thunder Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "thunder", dice: "1d8", valueMod: 1.2 }, weight: 4 },
        ]
    }
};

// --- SWORD-SPECIFIC NAME PARTS & TEMPLATES ---
export const SWORD_NAME_PARTS = {
    ADJECTIVES: ["Gleaming", "Shadow", "Fiery", "Frozen", "Ancient", "Deadly", "Swift", "Heavy", "Balanced", "Whispering", "Screaming", "Keen", "Runed", "Polished", "Jagged", "Ethereal", "Bloodied", "Silent", "Storm", "Venom", "Adamant", "Mithril", "Ghostly", "Serpent", "Lion", "Wolf", "Flickering", "Singing", "Dancing", "Noble", "Cruel", "Righteous", "Wicked", "Hallowed", "Cursed", "Shimmering", "Valiant", "Fateful", "Grim", "Dire", "Sacred", "Profane", "Astral", "Lunar", "Solar", "Barbed", "Glowing", "Vicious", "Savage"],
    NOUNS_ABSTRACT: ["Doom", "Souls", "Phoenix", "Giants", "Dragons", "Depths", "Sorrow", "Hope", "Void", "Eclipse", "Honor", "Fury", "Silence", "Victor", "Fallen", "King", "Queen", "Star", "Moon", "Comet", "Abyss", "Mountain", "River", "Whisper", "Legend", "Dream", "Nightmare", "Justice", "Tyranny", "Glory", "Ruin", "Destiny", "Fate", "Valor", "Might", "Will", "Bane", "Grace", "Wrath", "Terror", "Majesty", "Vengeance"],
    PREFIX_WORDS: ["Blade", "Edge", "Soul", "War", "Night", "Sun", "Doom", "Star", "Moon", "Blood", "Iron", "Steel", "Sky", "Stone", "Fire", "Ice", "Storm", "Light", "Dark", "Rune", "Oath", "Pain", "Hope", "Kings", "Queens", "Death", "Life", "Ghost", "Dragon", "Truth", "Shadow", "Grief", "Joy", "Terror", "Glory", "Skull", "Bone"],
    SUFFIX_WORDS: ["bane", "reaver", "singer", "keeper", "splitter", "carver", "fang", "brand", "caller", "ward", "breaker", "heart", "song", "fall", "cry", "mark", "guard", "point", "edge", "kiss", "tear", "giver", "render", "crusher", "piercer", "defender", "bringer", "biter", "dancer", "gleam", "whisper", "shout", "sorrow", "joy", "drinker", "eater", "flayer", "shield"]
};

export const SWORD_NAME_TEMPLATES = [
    "{prefix} {material} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{prefix} {subTypeName} {suffix}",
    "The {adjective} {subTypeName} of {noun_abstract}",
    "{prefix_word}{suffix_word}",
    "{adjective} {prefix_word}{subTypeName_root_alt}",
    "{subTypeName} of the {adjective} {noun_abstract}"
];


console.log("magic_item_generator/categories/swords/swordDefinitions.js (ValueMod Tripled) loaded.");
