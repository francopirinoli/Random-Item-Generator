/**
 * magic_item_generator/sharedDefinitions.js
 * This file stores definitions that are common across ALL item types.
 */

// --- UTILITY FUNCTIONS ---
export function getRandomElement(array) {
    if (!array || array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- CORE GLOBAL DEFINITIONS ---

export const RARITIES = {
    COMMON:     { id: 'COMMON', name: 'Common', color: '#E0E0E0', affixSlots: [0, 0], valueMultiplier: 1.0, weight: 45, artComplexityHint: 0 },
    UNCOMMON:   { id: 'UNCOMMON', name: 'Uncommon', color: '#5DD353', affixSlots: [0, 1], valueMultiplier: 2.0, weight: 30, artComplexityHint: 1 },
    RARE:       { id: 'RARE', name: 'Rare', color: '#3B82F6', affixSlots: [1, 1], valueMultiplier: 4.0, weight: 15, artComplexityHint: 2 },
    EPIC:       { id: 'EPIC', name: 'Epic', color: '#A855F7', affixSlots: [1, 2], valueMultiplier: 8.0, weight: 7, artComplexityHint: 3 },
    LEGENDARY:  { id: 'LEGENDARY', name: 'Legendary', color: '#F59E0B', affixSlots: [2, 2], valueMultiplier: 12.0, weight: 3, artComplexityHint: 4 }
};

export const EQUIP_SLOTS = {
    HEAD: "head",
    BODY: "body",
    FEET: "feet",
    MAIN_HAND: "main_hand",
    OFF_HAND: "off_hand",
    ACCESSORY: "accessory" // Can be used for rings, amulets, gloves, etc.
};

// --- TOP-LEVEL ITEM CATEGORIES ---
export const ITEM_CATEGORIES = {
    SWORDS:         { id: "SWORDS", name: "Swords", subTypeDefinitionFile: "./categories/swords/swordDefinitions.js", subTypeObjectName: "SWORD_SUB_TYPES", generatorFunctionName: "generateSwordRPGItem" },
    AXES:           { id: "AXES", name: "Axes", subTypeDefinitionFile: "./categories/axes/axeDefinitions.js", subTypeObjectName: "AXE_SUB_TYPES", generatorFunctionName: "generateAxeRPGItem" },
    BLUNT_WEAPONS:  { id: "BLUNT_WEAPONS", name: "Blunt Weapons", subTypeDefinitionFile: "./categories/blunt/bluntDefinitions.js", subTypeObjectName: "BLUNT_SUB_TYPES", generatorFunctionName: "generateBluntWeaponRPGItem" },
    POLEARMS:       { id: "POLEARMS", name: "Polearms", subTypeDefinitionFile: "./categories/polearms/polearmDefinitions.js", subTypeObjectName: "POLEARM_SUB_TYPES", generatorFunctionName: "generatePolearmRPGItem" },
    BOWS:           { id: "BOWS", name: "Bows", subTypeDefinitionFile: "./categories/bows/bowDefinitions.js", subTypeObjectName: "BOW_SUB_TYPES", generatorFunctionName: "generateBowRPGItem" },
    STAVES:         { id: "STAVES", name: "Staves", subTypeDefinitionFile: "./categories/staves/staffDefinitions.js", subTypeObjectName: "STAFF_SUB_TYPES", generatorFunctionName: "generateStaffRPGItem" },
    ARMOR:          { id: "ARMOR", name: "Armor", subTypeDefinitionFile: "./categories/armor/armorDefinitions.js", subTypeObjectName: "ARMOR_SUB_TYPES", generatorFunctionName: "generateArmorRPGItem" },
    SHIELD:         { id: "SHIELD", name: "Shields", subTypeDefinitionFile: "./categories/shields/shieldDefinitions.js", subTypeObjectName: "SHIELD_SUB_TYPES", generatorFunctionName: "generateShieldRPGItem" },
    HEADWEAR:       { id: "HEADWEAR", name: "Headwear", subTypeDefinitionFile: "./categories/headwear/headwearDefinitions.js", subTypeObjectName: "HEADWEAR_SUB_TYPES", generatorFunctionName: "generateHeadwearRPGItem" },
    FOOTWEAR:       { id: "FOOTWEAR", name: "Footwear", subTypeDefinitionFile: "./categories/footwear/footwearDefinitions.js", subTypeObjectName: "FOOTWEAR_SUB_TYPES", generatorFunctionName: "generateFootwearRPGItem" },
    ACCESSORY:      { id: "ACCESSORY", name: "Accessory", subTypeDefinitionFile: "./categories/accessories/accessoryDefinitions.js", subTypeObjectName: "ACCESSORY_SUB_TYPES", generatorFunctionName: "generateAccessoryRPGItem" },
    SPELLBOOK:      { id: "SPELLBOOK", name: "Spellbook", subTypeDefinitionFile: "./categories/spellbooks/spellbookDefinitions.js", subTypeObjectName: "SPELLBOOK_SUB_TYPES", generatorFunctionName: "generateSpellbookRPGItem" },
    CONSUMABLE:     { id: "CONSUMABLE", name: "Consumable", subTypeDefinitionFile: "./categories/consumables/potionDefinitions.js", subTypeObjectName: "CONSUMABLE_SUB_TYPES", generatorFunctionName: "generateConsumableRPGItem" }, // Updated Consumable category
};


// --- MATERIAL DEFINITIONS ---
export const MATERIALS = {
    // Metals
    IRON: { id: "IRON", name: "Iron", paletteKey: "IRON", valueMod: 0.8, statModifiers: { damage: -1, acBonus: 0, strReqMod: 1 }, applicableToCategories: ["SWORDS", "AXES", "BLUNT_WEAPONS", "POLEARMS", "ARMOR", "SHIELD", "HEADWEAR", "FOOTWEAR", "ACCESSORY"] },
    STEEL: { id: "STEEL", name: "Steel", paletteKey: "STEEL", valueMod: 1.0, statModifiers: { damage: 0, acBonus: 0, strReqMod: 0 }, applicableToCategories: ["SWORDS", "AXES", "BLUNT_WEAPONS", "POLEARMS", "ARMOR", "SHIELD", "HEADWEAR", "FOOTWEAR", "ACCESSORY"] },
    BRONZE: { id: "BRONZE", name: "Bronze", paletteKey: "BRONZE", valueMod: 0.9, statModifiers: { damage: -1, acBonus: 0, strReqMod: 1 }, applicableToCategories: ["SWORDS", "AXES", "BLUNT_WEAPONS", "ARMOR", "SHIELD", "HEADWEAR", "FOOTWEAR", "ACCESSORY"] },
    SILVER: { id: "SILVER", name: "Silver", paletteKey: "SILVER", valueMod: 1.5, statModifiers: { damage: 0, vs_undead_bonus: "1d4", strReqMod: 0 }, applicableToCategories: ["SWORDS", "AXES", "BLUNT_WEAPONS", "ACCESSORY", "SHIELD", "HEADWEAR"] }, // Removed CONSUMABLE for now
    GOLD: { id: "GOLD", name: "Gold", paletteKey: "GOLD", valueMod: 2.0, statModifiers: { strReqMod: 1 }, applicableToCategories: ["ACCESSORY", "SHIELD", "HEADWEAR"] }, // Removed CONSUMABLE for now
    DARK_STEEL: { id: "DARK_STEEL", name: "Dark Steel", paletteKey: "DARK_STEEL", valueMod: 1.3, statModifiers: { damage: 1, acBonus: 1, strReqMod: 1 }, applicableToCategories: ["SWORDS", "AXES", "BLUNT_WEAPONS", "POLEARMS", "ARMOR", "SHIELD", "HEADWEAR", "FOOTWEAR", "ACCESSORY"] },
    ENCHANTED_METAL: { id: "ENCHANTED_METAL", name: "Enchanted Metal", paletteKey: "ENCHANTED", valueMod: 1.8, statModifiers: { damage: 1, magicResist: 5, strReqMod: -1, acBonus: 1 }, applicableToCategories: ["SWORDS", "AXES", "BLUNT_WEAPONS", "POLEARMS", "ARMOR", "ACCESSORY", "STAVES", "SHIELD", "HEADWEAR", "FOOTWEAR"] },
    COPPER: { id: "COPPER", name: "Copper", paletteKey: "COPPER", valueMod: 0.7, statModifiers: { strReqMod: 0 }, applicableToCategories: ["ACCESSORY", "SWORDS", "SHIELD", "HEADWEAR"] },
    ROSE_GOLD: { id: "ROSE_GOLD", name: "Rose Gold", paletteKey: "COPPER", valueMod: 1.7, statModifiers: { strReqMod: 1 }, applicableToCategories: ["ACCESSORY", "HEADWEAR"] },
    PLATINUM: { id: "PLATINUM", name: "Platinum", paletteKey: "SILVER", valueMod: 3.0, statModifiers: {}, applicableToCategories: ["ACCESSORY"] },
    LEAD: { id: "LEAD", name: "Lead", paletteKey: "IRON", valueMod: 0.3, statModifiers: {wisReqMod: 1}, applicableToCategories: ["ACCESSORY"] },


    // Leathers & Hides
    LEATHER: { id: "LEATHER", name: "Leather", paletteKey: "LEATHER", valueMod: 0.9, statModifiers: { acBonus: 0, strReqMod: -1 }, applicableToCategories: ["ARMOR", "FOOTWEAR", "ACCESSORY", "HEADWEAR", "SHIELD", "SPELLBOOK"] },
    DARK_LEATHER: { id: "DARK_LEATHER", name: "Dark Leather", paletteKey: "DARK_BROWN_LEATHER", valueMod: 1.0, statModifiers: { strReqMod: -1 }, applicableToCategories: ["ARMOR", "FOOTWEAR", "ACCESSORY", "SHIELD", "HEADWEAR", "SPELLBOOK"] },
    STUDDED_LEATHER: { id: "STUDDED_LEATHER", name: "Studded Leather", paletteKey: "LEATHER", valueMod: 1.1, statModifiers: { acBonus: 1, strReqMod: 0 }, applicableToCategories: ["ARMOR", "ACCESSORY"] },

    // Woods & Natural
    WOOD: { id: "WOOD", name: "Wood", paletteKey: "WOOD", valueMod: 0.7, statModifiers: { strReqMod: -1 }, applicableToCategories: ["SWORDS", "AXES", "BLUNT_WEAPONS", "POLEARMS", "BOWS", "STAVES", "SHIELD", "HEADWEAR", "FOOTWEAR", "ACCESSORY", "SPELLBOOK"] },
    BONE: { id: "BONE", name: "Bone", paletteKey: "BONE", valueMod: 0.6, statModifiers: { damage: -2, strReqMod: -1 }, applicableToCategories: ["SWORDS", "AXES", "BLUNT_WEAPONS", "ACCESSORY", "STAVES", "SHIELD", "HEADWEAR", "FOOTWEAR", "SPELLBOOK"] },
    IVORY: { id: "IVORY", name: "Ivory", paletteKey: "IVORY", valueMod: 1.6, statModifiers: { strReqMod: 0 }, applicableToCategories: ["ACCESSORY", "STAVES", "HEADWEAR", "SPELLBOOK"] },
    STRAW: { id: "STRAW", name: "Straw", paletteKey: "STRAW", valueMod: 0.2, statModifiers: { strReqMod: -2 }, applicableToCategories: ["HEADWEAR"] },

    // Stones & Gems (as primary material)
    OBSIDIAN: { id: "OBSIDIAN", name: "Obsidian", paletteKey: "OBSIDIAN", valueMod: 1.2, statModifiers: { damageFlatBonus: 1, strReqMod: 0 }, applicableToCategories: ["SWORDS", "AXES", "ACCESSORY", "SHIELD", "HEADWEAR", "STAVES", "SPELLBOOK"] },
    STONE: { id: "STONE", name: "Stone", paletteKey: "STONE", valueMod: 0.5, statModifiers: { damage: -1, strReqMod: 2 }, applicableToCategories: ["BLUNT_WEAPONS", "SHIELD", "ACCESSORY"] },

    // Fabrics
    CLOTH: { id: "CLOTH", name: "Cloth", paletteKey: "WHITE_PAINT", valueMod: 0.5, statModifiers: { strReqMod: -2 }, applicableToCategories: ["ARMOR", "HEADWEAR", "FOOTWEAR", "ACCESSORY", "SPELLBOOK"] },
    ENCHANTED_SILK: { id: "ENCHANTED_SILK", name: "Enchanted Silk", paletteKey: "ENCHANTED", valueMod: 1.8, statModifiers: { strReqMod: -2 }, applicableToCategories: ["ARMOR", "HEADWEAR", "FOOTWEAR", "ACCESSORY", "SPELLBOOK"] },

    // Paper/Parchment
    PAPER: { id: "PAPER", name: "Paper", paletteKey: "PAPER", valueMod: 0.3, statModifiers: { strReqMod: -3 }, applicableToCategories: ["SPELLBOOK", "CONSUMABLE", "HEADWEAR", "ACCESSORY"] },
    PARCHMENT: { id: "PARCHMENT", name: "Parchment", paletteKey: "PARCHMENT", valueMod: 0.4, statModifiers: { strReqMod: -3 }, applicableToCategories: ["SPELLBOOK", "CONSUMABLE", "ACCESSORY"] },

    // Special/Magical (can be a base material for some items)
    ENCHANTED: { id: "ENCHANTED", name: "Enchanted", paletteKey: "ENCHANTED", valueMod: 1.5, statModifiers: { strReqMod: 0 }, applicableToCategories: ["SWORDS", "AXES", "BLUNT_WEAPONS", "POLEARMS", "BOWS", "STAVES", "ARMOR", "ACCESSORY", "SHIELD", "HEADWEAR", "FOOTWEAR", "SPELLBOOK"] },

    GLASS: { id: "GLASS", name: "Glass", paletteKey: "ENCHANTED", customPalette: { base: 'rgba(173, 216, 230, 0.35)', highlight: 'rgba(224, 255, 255, 0.55)', shadow: 'rgba(135, 206, 250, 0.35)', name:'Glass' }, valueMod: 0.2, statModifiers: { strReqMod: -3 }, applicableToCategories: ["CONSUMABLE", "ACCESSORY"] },
};


// --- GENERIC AFFIXES ---
export const GENERIC_AFFIXES = {
    PREFIXES: [],
    SUFFIXES: []
};

// --- ITEM BASE GOLD VALUES ---
export const ITEM_BASE_GOLD_VALUES = {
    DEFAULT_WEAPON: 20,
    DEFAULT_ARMOR: 15,
    DEFAULT_ACCESSORY: 30,
    DEFAULT_SHIELD: 10,
    DEFAULT_HEADWEAR: 8,
    DEFAULT_FOOTWEAR: 8,
    DEFAULT_CONSUMABLE: 5,
    DEFAULT_SPELLBOOK: 50,
};

// --- NAME GENERATION TEMPLATES & PARTS ---
export const NAME_TEMPLATES = {
    GENERIC: [
        "{prefix} {material} {subTypeName}",
        "{material} {subTypeName} {suffix}",
        "{prefix} {subTypeName} {suffix}",
        "The {adjective} {subTypeName}"
    ],
};

export const NAME_PARTS = {
    GENERIC_ADJECTIVES: ["Sturdy", "Worn", "Ornate", "Simple", "Forgotten", "Lost", "Shining", "Darkened"],
    GENERIC_NOUNS_ABSTRACT: ["Power", "the Ancients", "Secrets", "the Ages", "Destiny", "Shadows", "Light"],
};

// --- Helper to get a weighted random rarity ---
export function getWeightedRandomRarity() {
    const totalWeight = Object.values(RARITIES).reduce((sum, item) => sum + item.weight, 0);
    let randomNum = Math.random() * totalWeight;
    for (const key in RARITIES) {
        if (randomNum < RARITIES[key].weight) {
            return RARITIES[key];
        }
        randomNum -= RARITIES[key].weight;
    }
    return RARITIES.COMMON; // Fallback
}

console.log("magic_item_generator/sharedDefinitions.js (Consumable Category Added) loaded.");
