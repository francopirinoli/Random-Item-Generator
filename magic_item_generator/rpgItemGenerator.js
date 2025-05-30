/**
 * magic_item_generator/rpgItemGenerator.js
 * Main dispatcher for generating RPG items.
 * It determines the item category and calls the appropriate category-specific generator.
 */

import {
    ITEM_CATEGORIES as ALL_ITEM_CATEGORIES,
    RARITIES,
    EQUIP_SLOTS,
    getRandomElement,
    getWeightedRandomRarity,
    getRandomInt
} from './sharedDefinitions.js';

// Import category-specific generator functions
import { generateSwordRPGItem } from './categories/swords/swordGenerator.js';
import { generateAxeRPGItem } from './categories/axes/axeGenerator.js';
import { generateBluntWeaponRPGItem } from './categories/blunt/bluntGenerator.js';
import { generatePolearmRPGItem } from './categories/polearms/polearmGenerator.js';
import { generateBowRPGItem } from './categories/bows/bowGenerator.js';
import { generateStaffRPGItem } from './categories/staves/staffGenerator.js';
import { generateArmorRPGItem } from './categories/armor/armorGenerator.js';
import { generateShieldRPGItem } from './categories/shields/shieldGenerator.js';
import { generateHeadwearRPGItem } from './categories/headwear/headwearGenerator.js';
import { generateFootwearRPGItem } from './categories/footwear/footwearGenerator.js';
import { generateAccessoryRPGItem } from './categories/accessories/accessoryGenerator.js';
import { generateSpellbookRPGItem } from './categories/spellbooks/spellbookGenerator.js';
import { generateConsumableRPGItem } from './categories/consumables/consumableGenerator.js'; // Added Consumable Generator


/**
 * Main function to generate a random RPG item, dispatching to category-specific generators.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory] - Specific category ID (e.g., "SWORDS", "ARMOR").
 * @param {string} [options.itemSubTypeId] - Specific sub-type ID (e.g., "SWORD_LONG").
 * @param {string} [options.rarityId] - Specific rarity ID (e.g., "RARE").
 * @param {string} [options.materialId] - Specific material ID (e.g., "STEEL").
 * @returns {object|null} The generated RPG item object, or null on error.
 */
export function generateRPGItem(options = {}) {
    let categoryId = options.itemCategory;

    if (!categoryId || !ALL_ITEM_CATEGORIES[categoryId]) {
        const categoryKeys = Object.keys(ALL_ITEM_CATEGORIES).filter(key => ALL_ITEM_CATEGORIES[key].generatorFunctionName);
        if (categoryKeys.length === 0) {
            console.error("No item categories defined or implemented in sharedDefinitions.js");
            return null;
        }
        categoryId = getRandomElement(categoryKeys);
        console.log(`No category specified or invalid, randomly selected: ${categoryId}`);
    }

    const generatorOptions = { ...options, itemCategory: categoryId };

    switch (categoryId) {
        case "SWORDS":
            return generateSwordRPGItem(generatorOptions);
        case "AXES":
            return generateAxeRPGItem(generatorOptions);
        case "BLUNT_WEAPONS":
            return generateBluntWeaponRPGItem(generatorOptions);
        case "POLEARMS":
            return generatePolearmRPGItem(generatorOptions);
        case "BOWS":
            return generateBowRPGItem(generatorOptions);
        case "STAVES":
            return generateStaffRPGItem(generatorOptions);
        case "ARMOR":
            return generateArmorRPGItem(generatorOptions);
        case "SHIELD":
            return generateShieldRPGItem(generatorOptions);
        case "HEADWEAR":
            return generateHeadwearRPGItem(generatorOptions);
        case "FOOTWEAR":
            return generateFootwearRPGItem(generatorOptions);
        case "ACCESSORY":
            return generateAccessoryRPGItem(generatorOptions);
        case "SPELLBOOK":
            return generateSpellbookRPGItem(generatorOptions);
        case "CONSUMABLE": // Added case for CONSUMABLE
            if (typeof generateConsumableRPGItem === 'function') {
                return generateConsumableRPGItem(generatorOptions);
            } else {
                console.warn(`generateConsumableRPGItem function not found or not ready. Using placeholder for CONSUMABLE. Options:`, generatorOptions);
                return generatePlaceholderItem(generatorOptions, "CONSUMABLE", "POTION_PLACEHOLDER");
            }
        default:
            console.error(`Unknown or unhandled item category in dispatcher: ${categoryId}`);
            return null;
    }
}

/**
 * Placeholder function for categories not yet fully implemented.
 */
function generatePlaceholderItem(options, categoryId, subTypeId) {
    const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
    let equipSlot = EQUIP_SLOTS.ACCESSORY; 

    if (categoryId === "ARMOR") equipSlot = EQUIP_SLOTS.BODY;
    else if (categoryId === "SHIELD") equipSlot = EQUIP_SLOTS.OFF_HAND;
    else if (categoryId === "HEADWEAR") equipSlot = EQUIP_SLOTS.HEAD;
    else if (categoryId === "FOOTWEAR") equipSlot = EQUIP_SLOTS.FEET;
    else if (["SWORDS", "AXES", "BLUNT_WEAPONS", "POLEARMS", "BOWS", "STAVES"].includes(categoryId)) equipSlot = EQUIP_SLOTS.MAIN_HAND;
    else if (categoryId === "SPELLBOOK" || categoryId === "CONSUMABLE") equipSlot = null;


    return {
        id: `placeholder_${Date.now()}_${getRandomInt(0,999)}`,
        name: `Placeholder ${subTypeId.replace('_PLACEHOLDER', '').replace(/_/g, ' ')}`,
        type: categoryId,
        subType: subTypeId,
        equipSlot: equipSlot,
        pixelArtDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        visualTheme: "placeholder",
        rarity: rarity?.id || "COMMON",
        material: "UNKNOWN_MATERIAL",
        baseStats: { acBonus: 0 },
        magicalProperties: [],
        value: 1,
        description: `A placeholder ${subTypeId.replace('_PLACEHOLDER', '').replace(/_/g, ' ')}. Generation for this item category is not yet fully implemented.`,
        isTwoHanded: false,
        artGeneratorData: {},
    };
}

console.log("magic_item_generator/rpgItemGenerator.js (Dispatcher - Consumable Category Added) loaded.");
