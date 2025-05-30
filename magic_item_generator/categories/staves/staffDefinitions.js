/**
 * magic_item_generator/categories/staves/staffDefinitions.js
 * Contains all data definitions specific to STAFF, WAND, and SCEPTER type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- STAFF CATEGORY & SUB-TYPES ---
export const STAFF_SUB_TYPES = {
    WAND: {
        id: "WAND", name: "Wand",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: true,
        pixelArtGeneratorKey: "generateStaff",
        pixelArtSubType: "wand",
        baseDamage: "1d4",
        twoHanded: false,
        baseValue: 50, // User updated
        damageAttribute: "INT", 
        minIntMod: 1,  // User updated
        materials: ["WOOD", "BONE", "IVORY", "SILVER", "ENCHANTED_METAL", "OBSIDIAN"]
    },
    SCEPTER: {
        id: "SCEPTER", name: "Scepter",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateStaff",
        pixelArtSubType: "scepter",
        baseDamage: "1d6",
        twoHanded: false,
        baseValue: 100, // User updated
        damageAttribute: "WIS", // User updated
        minIntMod: 1, // User updated (should this be minWisMod if attr is WIS?)
        materials: ["WOOD", "BONE", "IVORY", "SILVER", "GOLD", "ENCHANTED_METAL", "DARK_STEEL"]
    },
    STAFF: {
        id: "STAFF", name: "Staff",
        equipSlot: EQUIP_SLOTS.MAIN_HAND,
        canBeOffHand: false,
        pixelArtGeneratorKey: "generateStaff",
        pixelArtSubType: "staff",
        baseDamage: "1d6",
        twoHanded: true,
        baseValue: 100, // User updated
        damageAttribute: "INT", // User updated
        minIntMod: 2, // User updated
        materials: ["WOOD", "BONE", "ENCHANTED_METAL", "DARK_STEEL", "IVORY"]
    }
};

// --- MATERIALS specific to or with different properties for Staves ---
export const STAFF_MATERIALS = {};

// --- Material options for staff components ---
export const STAFF_SHAFT_MATERIALS = ["WOOD", "BONE", "IVORY", "DARK_STEEL", "ENCHANTED_METAL", "SILVER", "GOLD", "OBSIDIAN"];
export const STAFF_GRIP_MATERIALS = ["LEATHER", "CLOTH", "SILK_STRING", "WIRE_STRING"];
export const STAFF_TOPPER_GEM_MATERIALS = ['GEM_RED', 'GEM_BLUE', 'GEM_GREEN', 'GEM_PURPLE', 'GEM_YELLOW', 'GEM_ORANGE', 'GEM_CYAN', 'GEM_WHITE', 'OBSIDIAN', 'ENCHANTED', 'PEARL', 'OPAL'];
export const STAFF_TOPPER_METAL_MATERIALS = ['GOLD', 'SILVER', 'BRONZE', 'DARK_STEEL', 'ENCHANTED_METAL', 'COPPER'];


// --- AFFIXES specific to STAVES/WANDS/SCEPTERS ---
export const STAFF_AFFIXES = {
    PREFIXES: {
        MINOR: [
            { name: "Apprentice's", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.45 }, weight: 15 },
            { name: "Acolyte's", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.45 }, weight: 15 },
            { name: "Charged", description: "+5 Max MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 5, valueMod: 0.24 }, weight: 12 },
            { name: "Focused", description: "+1 to Spell Attack Rolls", rarityMax: "EPIC", effect: { type: "spell_attack_boost", value: 1, valueMod: 0.36 }, weight: 10 },
            { name: "Glowing", description: "Emits a faint light", rarityMax: "EPIC", effect: { type: "special_utility", id: "EMITS_LIGHT_FAINT", valueMod: 0.09 }, weight: 10 },
            { name: "Sparking", description: "+1d2 Lightning Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "lightning", dice: "1d2", valueMod: 0.33 }, weight: 8 },
            { name: "Flaming", description: "+1d2 Fire Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "fire", dice: "1d2", valueMod: 0.33 }, weight: 8 },
            { name: "Icy", description: "+1d2 Cold Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "cold", dice: "1d2", valueMod: 0.33 }, weight: 8 },
            { name: "Corrosive", description: "+1d2 Acid Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "acid", dice: "1d2", valueMod: 0.33 }, weight: 7 },
            { name: "Whispering", description: "+1d2 Psychic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "psychic", dice: "1d2", valueMod: 0.39 }, weight: 6 },
            { name: "Resonant", description: "+1d2 Thunder Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "thunder", dice: "1d2", valueMod: 0.39 }, weight: 6 },
            { name: "Enduring", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.36 }, weight: 7},
            { name: "Charming", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.45 }, weight: 7},
        ],
        MAJOR: [
            { name: "Adept's", description: "+2 INT", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "INT", value: 2, valueMod: 0.96 }, weight: 10 },
            { name: "Seer's", description: "+2 WIS", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "WIS", value: 2, valueMod: 0.96 }, weight: 10 },
            { name: "Empowered", description: "+10 Max MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 10, valueMod: 0.60 }, weight: 9 },
            { name: "Archmage's", description: "+2 Spell Attack, +1 Spell Damage", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects: [{type:"spell_attack_boost", value:2}, {type:"spell_damage_boost", value:1}], valueMod: 1.5 }, weight: 5 },
            { name: "Inferno", description: "+1d6 Fire Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "fire", dice: "1d6", valueMod: 1.05 }, weight: 6 },
            { name: "Winter's", description: "+1d6 Cold Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "cold", dice: "1d6", valueMod: 1.05 }, weight: 6 },
            { name: "Tempest", description: "+1d6 Lightning Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "lightning", dice: "1d6", valueMod: 1.05 }, weight: 6 },
            { name: "Void-Touched", description: "+1d6 Necrotic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "necrotic", dice: "1d6", valueMod: 1.14 }, weight: 5},
            { name: "Celestial", description: "+1d6 Radiant Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "radiant", dice: "1d6", valueMod: 1.14 }, weight: 5},
            { name: "Master's", description: "+1 to All Attributes", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 1.8 }, weight: 3},
            { name: "Resplendent", description: "+15 MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 15, valueMod: 0.75 }, weight: 5},
            { name: "Illusionist's", description: "+2 CHA", rarityMax: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CHA", value: 2, valueMod: 0.45 }, weight: 7},
            { name: "Greater Channeling", description: "+20 Max MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 20, valueMod: 0.90 }, weight: 4},
            { name: "Psionic", description: "+1d6 Psychic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "psychic", dice: "1d6", valueMod: 1.14 }, weight: 5},
            { name: "Sonic", description: "+1d6 Thunder Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "thunder", dice: "1d6", valueMod: 1.14 }, weight: 5},
            { name: "Warding", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.45 }, weight: 6}, 
        ]
    },
    SUFFIXES: {
        MINOR: [
            { name: "of Minor Warding", description: "+1 AC", rarityMax: "EPIC", effect: { type: "ac_boost", value: 1, valueMod: 0.30 }, weight: 10 },
            { name: "of Concentration", description: "+1 CON", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 1, valueMod: 0.36 }, weight: 9 },
            { name: "of Insight", description: "+1 WIS", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 1, valueMod: 0.21 }, weight: 8 }, // Changed from check_bonus
            { name: "of Knowledge", description: "+1 INT", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 1, valueMod: 0.21 }, weight: 8 }, // Changed from check_bonus
            { name: "of Lesser Power", description: "+3 MP", rarityMax: "EPIC", effect: { type: "mp_boost", value: 3, valueMod: 0.12 }, weight: 12 },
            { name: "of Minor Force", description: "+1d2 Force Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "force", dice: "1d2", valueMod: 0.36 }, weight: 7},
            { name: "of Minor Acid", description: "+1d2 Acid Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "acid", dice: "1d2", valueMod: 0.33 }, weight: 7},
            { name: "of Minor Thought", description: "+1d2 Psychic Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "psychic", dice: "1d2", valueMod: 0.39 }, weight: 6},
            { name: "of Minor Sound", description: "+1d2 Thunder Damage", rarityMax: "EPIC", effect: { type: "damage_add", damageType: "thunder", dice: "1d2", valueMod: 0.39 }, weight: 6},
            { name: "of the Orator", description: "+1 CHA", rarityMax: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 1, valueMod: 0.45 }, weight: 7},
        ],
        MAJOR: [
            { name: "of Greater Power", description: "+15 Max MP", rarityMax: "LEGENDARY", effect: { type: "mp_boost", value: 15, valueMod: 0.75 }, weight: 8 },
            { name: "of Spell Focus", description: "+2 Spell Damage", rarityMax: "LEGENDARY", effect: { type: "spell_damage_boost", value: 2, valueMod: 0.90 }, weight: 7 },
            { name: "of the Archon", description: "+1 to All Attributes", rarityMax: "LEGENDARY", effect: { type: "attribute_boost_all", value: 1, valueMod: 1.8 }, weight: 4 },
            { name: "of Elemental Fury", description: "Adds +1d4 of a random element (Fire, Cold, Lightning) to spells", rarityMax: "LEGENDARY", effect: { type: "random_elemental_spell_damage_add", dice: "1d4", elements: ["fire", "cold", "lightning"], valueMod: 1.4 }, weight: 3 },
            { name: "of Quick Casting", description: "+3 Initiative", rarityMax: "LEGENDARY", effect: { type: "initiative_boost", value: 3, valueMod: 0.45 }, weight: 6 },
            { name: "of Malediction", description: "+1d8 Necrotic Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "necrotic", dice: "1d8", valueMod: 1.2 }, weight: 5},
            { name: "of Hallowing", description: "+1d8 Radiant Damage", rarityMax: "LEGENDARY", effect: { type: "damage_add", damageType: "radiant", dice: "1d8", valueMod: 1.2 }, weight: 5},
            { name: "of the Mind Weaver", description: "+2 INT, +5 MP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"attribute_boost", attribute:"INT", value:2}, {type:"mp_boost", value:5}], valueMod: 1.6 }, weight: 4},
            { name: "of the Spirit Warden", description: "+2 WIS, +10 HP", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"attribute_boost", attribute:"WIS", value:2}, {type:"hp_boost", value:10}], valueMod: 1.6 }, weight: 4},
            { name: "of Greater Warding", description: "+2 AC", rarityMax: "LEGENDARY", effect: { type: "ac_boost", value: 2, valueMod: 0.75 }, weight: 5},
            { name: "of the Loremaster", description: "+2 INT, +1 WIS", rarityMax: "LEGENDARY", effect: { type: "multi_boost", effects:[{type:"attribute_boost", attribute:"INT", value:2}, {type:"attribute_boost", attribute:"WIS", value:1}], valueMod: 1.65 }, weight: 3},
            { name: "of Spell Potency", description: "+1 to Spell Save DCs", rarityMax: "LEGENDARY", effect: { type: "spell_save_dc_boost", value: 1, valueMod: 1.5}, weight: 3},
        ]
    }
};

// --- STAFF-SPECIFIC NAME PARTS & TEMPLATES ---
export const STAFF_NAME_PARTS = {
    ADJECTIVES: ["Glowing", "Runed", "Twisted", "Carved", "Crystal", "Obsidian", "Ivory", "Ancient", "Sage's", "Apprentice's", "Archmage's", "Seer's", "Elemental", "Astral", "Lunar", "Solar", "Ethereal", "Whispering", "Shining", "Shadowed"],
    NOUNS_ABSTRACT: ["Power", "Knowledge", "Stars", "Elements", "Secrets", "Wisdom", "Insight", "Focus", "Void", "Light", "Shadow", "Magic", "Sorcery", "Wizardry", "Illusions", "Spirits", "Aether", "Dreams", "Flow"],
    PREFIX_WORDS: ["Staff", "Wand", "Scepter", "Rod", "Branch", "Crystal", "Rune", "Star", "Moon", "Sun", "Sage", "Mage", "Spirit", "Mind", "Soul", "Arcane", "Elder"],
    SUFFIX_WORDS: ["focus", "conduit", "channel", "caller", "binder", "ward", "light", "shadow", "power", "wisdom", "knowledge", "scepter", "wand", "staff", "whisper", "dream", "star", "beam", "ray"]
};

export const STAFF_NAME_TEMPLATES = [
    "{prefix} of {noun_abstract}",
    "The {adjective} {subTypeName}",
    "{material} {subTypeName} {suffix}",
    "{adjective} {material} {subTypeName}",
    "{prefix_word}{suffix_word}",
    "{subTypeName} of the {adjective} {noun_abstract}",
];

console.log("magic_item_generator/categories/staves/staffDefinitions.js (Further Affix Expansion V3) loaded.");
