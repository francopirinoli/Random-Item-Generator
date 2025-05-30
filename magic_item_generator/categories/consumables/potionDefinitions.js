/**
 * magic_item_generator/categories/consumables/potionDefinitions.js
 * Contains all data definitions specific to POTION type consumable items.
 */

import { MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- CONSUMABLE CATEGORY & SUB-TYPES ---
// For now, we'll focus on potions. Other consumables like scrolls, food, traps can be added later.
export const CONSUMABLE_SUB_TYPES = {
    POTION: {
        id: "POTION",
        name: "Potion",
        pixelArtGeneratorKey: "generatePotion", // Assumes a generic potion visual
        pixelArtSubType: "potion", // Parameter for generatePotion
        baseValue: 5, // Base value, will be modified by effect and rarity
        materials: ["GLASS"], // Potions are typically in glass vials/flasks
        stackable: true, // Potions can usually stack
        equipSlot: null, // Consumables are not equipped
    }
    // Future sub-types: SCROLL, FOOD, POISON_COATING, TRAP_KIT etc.
};

// --- MATERIALS specific to Potions (e.g., vial types, special water) ---
// For now, primary material is just GLASS from SHARED_MATERIALS.
export const POTION_MATERIALS = {
    // Example: If different vial qualities affected anything.
    // CRYSTAL_VIAL: { id: "CRYSTAL_VIAL", name: "Crystal Vial", paletteKey: "GLASS_CRYSTAL", valueMod: 1.5, applicableToCategories: ["CONSUMABLE"] }
};

// --- POTION EFFECT DEFINITIONS ---
// Each effect type has tiers corresponding to potion rarities.
// Duration: "instant", "X_turns", "entire_combat"
// Effect details will be interpreted by game logic.
export const POTION_EFFECT_TYPES = {
    HEALING: {
        namePrefix: "Potion of",
        nameSuffix: "Healing",
        descriptionBase: "A shimmering red liquid that restores health.",
        tiers: [
            { rarity: "COMMON", effect: { type: "heal", dice: "2d4" }, duration: "instant", valueMod: 1.0, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "heal", dice: "4d4" }, duration: "instant", valueMod: 2.5, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "heal", dice: "4d6" }, duration: "instant", valueMod: 5.0, tierName: "" }, // Standard
            { rarity: "EPIC", effect: { type: "heal", dice: "4d10" }, duration: "instant", valueMod: 10.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "heal_full" }, duration: "instant", valueMod: 25.0, tierName: "Superior" }
        ]
    },
    MANA_RECOVERY: {
        namePrefix: "Potion of",
        nameSuffix: "Mana Recovery",
        descriptionBase: "A swirling blue elixir that restores magical energy.",
        tiers: [
            { rarity: "COMMON", effect: { type: "mp_recovery", amount: 5 }, duration: "instant", valueMod: 1.2, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "mp_recovery", amount: 10 }, duration: "instant", valueMod: 2.8, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "mp_recovery", amount: 15 }, duration: "instant", valueMod: 5.5, tierName: "" },
            { rarity: "EPIC", effect: { type: "mp_recovery", amount: 25 }, duration: "instant", valueMod: 11.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "mp_recovery", amount: 40 }, duration: "instant", valueMod: 28.0, tierName: "Superior" }
        ]
    },
    MIGHT_BOOST: { // Attack Roll Bonus
        namePrefix: "Potion of",
        nameSuffix: "Might",
        descriptionBase: "This potion sharpens focus and guides attacks.",
        tiers: [
            { rarity: "COMMON", effect: { type: "attack_roll_boost", value: 1 }, duration: "2_turns", valueMod: 0.9, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "attack_roll_boost", value: 1 }, duration: "4_turns", valueMod: 2.0, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "attack_roll_boost", value: 2 }, duration: "3_turns", valueMod: 4.5, tierName: "" },
            { rarity: "EPIC", effect: { type: "attack_roll_boost", value: 2 }, duration: "5_turns", valueMod: 9.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "attack_roll_boost", value: 3 }, duration: "entire_combat", valueMod: 22.0, tierName: "Superior" }
        ]
    },
    STRENGTH_BOOST: {
        namePrefix: "Potion of",
        nameSuffix: "Strength",
        descriptionBase: "A potent brew that temporarily enhances physical power.",
        tiers: [
            { rarity: "COMMON", effect: { type: "attribute_boost", attribute: "STR", value: 1 }, duration: "3_turns", valueMod: 1.0, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "attribute_boost", attribute: "STR", value: 1 }, duration: "5_turns", valueMod: 2.2, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "attribute_boost", attribute: "STR", value: 2 }, duration: "3_turns", valueMod: 5.0, tierName: "" },
            { rarity: "EPIC", effect: { type: "attribute_boost", attribute: "STR", value: 2 }, duration: "entire_combat", valueMod: 12.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "attribute_boost", attribute: "STR", value: 3 }, duration: "entire_combat", valueMod: 30.0, tierName: "Superior" }
        ]
    },
    DEXTERITY_BOOST: {
        namePrefix: "Potion of",
        nameSuffix: "Agility",
        descriptionBase: "This concoction grants uncanny grace and speed.",
        tiers: [
            { rarity: "COMMON", effect: { type: "attribute_boost", attribute: "DEX", value: 1 }, duration: "3_turns", valueMod: 1.0, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "attribute_boost", attribute: "DEX", value: 1 }, duration: "5_turns", valueMod: 2.2, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "attribute_boost", attribute: "DEX", value: 2 }, duration: "3_turns", valueMod: 5.0, tierName: "" },
            { rarity: "EPIC", effect: { type: "attribute_boost", attribute: "DEX", value: 2 }, duration: "entire_combat", valueMod: 12.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "attribute_boost", attribute: "DEX", value: 3 }, duration: "entire_combat", valueMod: 30.0, tierName: "Superior" }
        ]
    },
    CONSTITUTION_BOOST: {
        namePrefix: "Potion of",
        nameSuffix: "Endurance",
        descriptionBase: "A fortifying draught that bolsters vitality.",
        tiers: [
            { rarity: "COMMON", effect: { type: "attribute_boost", attribute: "CON", value: 1 }, duration: "3_turns", valueMod: 1.0, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "attribute_boost", attribute: "CON", value: 1 }, duration: "5_turns", valueMod: 2.2, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "attribute_boost", attribute: "CON", value: 2 }, duration: "3_turns", valueMod: 5.0, tierName: "" },
            { rarity: "EPIC", effect: { type: "attribute_boost", attribute: "CON", value: 2 }, duration: "entire_combat", valueMod: 12.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CON", value: 3 }, duration: "entire_combat", valueMod: 30.0, tierName: "Superior" }
        ]
    },
    INTELLIGENCE_BOOST: {
        namePrefix: "Potion of",
        nameSuffix: "Intellect",
        descriptionBase: "This brew sharpens the mind and enhances arcane thought.",
        tiers: [
            { rarity: "COMMON", effect: { type: "attribute_boost", attribute: "INT", value: 1 }, duration: "3_turns", valueMod: 1.0, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "attribute_boost", attribute: "INT", value: 1 }, duration: "5_turns", valueMod: 2.2, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "attribute_boost", attribute: "INT", value: 2 }, duration: "3_turns", valueMod: 5.0, tierName: "" },
            { rarity: "EPIC", effect: { type: "attribute_boost", attribute: "INT", value: 2 }, duration: "entire_combat", valueMod: 12.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "attribute_boost", attribute: "INT", value: 3 }, duration: "entire_combat", valueMod: 30.0, tierName: "Superior" }
        ]
    },
    WISDOM_BOOST: {
        namePrefix: "Potion of",
        nameSuffix: "Wisdom",
        descriptionBase: "A calming liquid that enhances perception and intuition.",
        tiers: [
            { rarity: "COMMON", effect: { type: "attribute_boost", attribute: "WIS", value: 1 }, duration: "3_turns", valueMod: 1.0, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "attribute_boost", attribute: "WIS", value: 1 }, duration: "5_turns", valueMod: 2.2, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "attribute_boost", attribute: "WIS", value: 2 }, duration: "3_turns", valueMod: 5.0, tierName: "" },
            { rarity: "EPIC", effect: { type: "attribute_boost", attribute: "WIS", value: 2 }, duration: "entire_combat", valueMod: 12.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "attribute_boost", attribute: "WIS", value: 3 }, duration: "entire_combat", valueMod: 30.0, tierName: "Superior" }
        ]
    },
    CHARISMA_BOOST: {
        namePrefix: "Potion of",
        nameSuffix: "Charisma",
        descriptionBase: "A potion that imbues the drinker with an aura of confidence and allure.",
        tiers: [
            { rarity: "COMMON", effect: { type: "attribute_boost", attribute: "CHA", value: 1 }, duration: "3_turns", valueMod: 1.0, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "attribute_boost", attribute: "CHA", value: 1 }, duration: "5_turns", valueMod: 2.2, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "attribute_boost", attribute: "CHA", value: 2 }, duration: "3_turns", valueMod: 5.0, tierName: "" },
            { rarity: "EPIC", effect: { type: "attribute_boost", attribute: "CHA", value: 2 }, duration: "entire_combat", valueMod: 12.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "attribute_boost", attribute: "CHA", value: 3 }, duration: "entire_combat", valueMod: 30.0, tierName: "Superior" }
        ]
    },
    FIRE_RESISTANCE: {
        namePrefix: "Potion of",
        nameSuffix: "Fire Resistance",
        descriptionBase: "This potion grants protection against fiery attacks.",
        tiers: [
            { rarity: "COMMON", effect: { type: "resistance", damageType: "fire", value: true }, duration: "3_turns", valueMod: 1.1, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "resistance", damageType: "fire", value: true }, duration: "5_turns", valueMod: 2.5, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "resistance", damageType: "fire", value: true }, duration: "entire_combat", valueMod: 6.0, tierName: "" },
            { rarity: "EPIC", effect: { type: "immunity", damageType: "fire", value: true }, duration: "2_turns", valueMod: 15.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "immunity", damageType: "fire", value: true }, duration: "4_turns", valueMod: 35.0, tierName: "Superior" }
        ]
    },
    COLD_RESISTANCE: {
        namePrefix: "Potion of",
        nameSuffix: "Cold Resistance",
        descriptionBase: "This potion grants protection against icy attacks.",
        tiers: [
            { rarity: "COMMON", effect: { type: "resistance", damageType: "cold", value: true }, duration: "3_turns", valueMod: 1.1, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "resistance", damageType: "cold", value: true }, duration: "5_turns", valueMod: 2.5, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "resistance", damageType: "cold", value: true }, duration: "entire_combat", valueMod: 6.0, tierName: "" },
            { rarity: "EPIC", effect: { type: "immunity", damageType: "cold", value: true }, duration: "2_turns", valueMod: 15.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "immunity", damageType: "cold", value: true }, duration: "4_turns", valueMod: 35.0, tierName: "Superior" }
        ]
    },
    LIGHTNING_RESISTANCE: {
        namePrefix: "Potion of",
        nameSuffix: "Lightning Resistance",
        descriptionBase: "This potion grants protection against shocking attacks.",
        tiers: [
            { rarity: "COMMON", effect: { type: "resistance", damageType: "lightning", value: true }, duration: "3_turns", valueMod: 1.1, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "resistance", damageType: "lightning", value: true }, duration: "5_turns", valueMod: 2.5, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "resistance", damageType: "lightning", value: true }, duration: "entire_combat", valueMod: 6.0, tierName: "" },
            { rarity: "EPIC", effect: { type: "immunity", damageType: "lightning", value: true }, duration: "2_turns", valueMod: 15.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "immunity", damageType: "lightning", value: true }, duration: "4_turns", valueMod: 35.0, tierName: "Superior" }
        ]
    },
    // Add similar structures for Acid, Poison, Necrotic, Radiant, Thunder, Force resistance
    SHIELDING: {
        namePrefix: "Potion of",
        nameSuffix: "Shielding",
        descriptionBase: "A potion that conjures a temporary magical barrier.",
        tiers: [
            { rarity: "COMMON", effect: { type: "ac_boost", value: 1 }, duration: "3_turns", valueMod: 0.9, tierName: "Minor" },
            { rarity: "UNCOMMON", effect: { type: "ac_boost", value: 2 }, duration: "3_turns", valueMod: 2.0, tierName: "Lesser" },
            { rarity: "RARE", effect: { type: "ac_boost", value: 2 }, duration: "5_turns", valueMod: 4.5, tierName: "" },
            { rarity: "EPIC", effect: { type: "ac_boost", value: 3 }, duration: "3_turns", valueMod: 9.0, tierName: "Greater" },
            { rarity: "LEGENDARY", effect: { type: "ac_boost", value: 3 }, duration: "entire_combat", valueMod: 22.0, tierName: "Superior" }
        ]
    },
    INVISIBILITY: {
        namePrefix: "Potion of",
        nameSuffix: "Invisibility",
        descriptionBase: "This potion renders the drinker unseen.",
        tiers: [
            { rarity: "RARE", effect: { type: "invisibility", effect_detail: "ends_on_action" }, duration: "3_turns", valueMod: 7.0, tierName: "Brief" },
            { rarity: "EPIC", effect: { type: "invisibility", effect_detail: "ends_on_action" }, duration: "entire_combat", valueMod: 18.0, tierName: "Standard" },
            { rarity: "LEGENDARY", effect: { type: "invisibility", effect_detail: "persists_through_action" }, duration: "3_turns", valueMod: 40.0, tierName: "True" } // Persists through first action
        ]
    },
    // Add more potion types as desired, e.g., Potion of Speed (extra action), Potion of Flying (not for this game), Potion of Water Breathing etc.
};

// --- POTION-SPECIFIC NAME PARTS & TEMPLATES ---
export const POTION_NAME_PARTS = {
    LIQUID_DESCRIPTORS: ["Shimmering", "Bubbling", "Swirling", "Clear", "Murky", "Glowing", "Sparkling", "Viscous", "Fizzy"],
    EFFECT_NOUNS: ["Healing", "Strength", "Might", "Agility", "Stamina", "Intellect", "Wisdom", "Charisma", "Protection", "Resistance", "Invisibility", "Clarity", "Fortitude", "Shielding"],
    CONTAINER_NOUNS: ["Potion", "Elixir", "Draught", "Philter", "Brew", "Concoction", "Vial", "Decoction"],
    ELEMENTS: ["Fire", "Flame", "Frost", "Ice", "Storm", "Lightning", "Acid", "Venom", "Poison", "Shadow", "Necrosis", "Light", "Radiance", "Thunder", "Force", "Might", "Mind", "Spirit"]
};

export const POTION_NAME_TEMPLATES = [
    "{tierName} {namePrefix} {nameSuffix}", // Minor Potion of Healing
    "{namePrefix} {nameSuffix}",           // Potion of Healing (for Rare)
    "{tierName} {LIQUID_DESCRIPTORS} {CONTAINER_NOUNS} of {EFFECT_NOUNS}", // Greater Sparkling Elixir of Strength
    "{LIQUID_DESCRIPTORS} {CONTAINER_NOUNS} of {ELEMENTS} {EFFECT_NOUNS}", // Bubbling Vial of Fire Resistance
];


console.log("magic_item_generator/categories/consumables/potionDefinitions.js (v1 - Initial Potion Setup) loaded.");
