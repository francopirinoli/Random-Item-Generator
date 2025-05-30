/**
 * magic_item_generator/categories/spellbooks/spellbookGenerator.js
 * Contains the logic to generate a complete Spellbook RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES, NAME_TEMPLATES as SHARED_NAME_TEMPLATES, NAME_PARTS as SHARED_NAME_PARTS,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    SPELLBOOK_SUB_TYPES, SPELLBOOK_MATERIALS, SPELLS, // SPELLBOOK_AFFIXES is empty, so not strictly needed yet
    SPELLBOOK_NAME_PARTS, SPELLBOOK_NAME_TEMPLATES
} from './spellbookDefinitions.js';

// Import pixel art generator function
import { generateBook } from '../../../pixel_art_generator/item_api.js';

/**
 * Helper function to select a specified number of unique random spells from a given pool.
 * @param {Array} spellPool - The array of spell objects to choose from.
 * @param {number} count - The number of unique spells to select.
 * @returns {Array} An array of selected spell objects.
 */
function selectUniqueSpells(spellPool, count) {
    if (!spellPool || spellPool.length === 0 || count <= 0) return [];
    if (count >= spellPool.length) return [...spellPool]; // Return all if requested count is too high

    const availableSpells = [...spellPool];
    const selectedSpells = [];
    for (let i = 0; i < count; i++) {
        if (availableSpells.length === 0) break; // No more spells to pick
        const randomIndex = getRandomInt(0, availableSpells.length - 1);
        selectedSpells.push(availableSpells.splice(randomIndex, 1)[0]);
    }
    return selectedSpells;
}


/**
 * Helper function to determine if "a" or "an" should be used.
 * @param {string} word - The word to check.
 * @returns {string} "an" if word starts with a vowel, "a" otherwise.
 */
function getArticle(word) {
    if (!word) return "a";
    const firstLetter = word.trim()[0].toLowerCase();
    return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? "an" : "a";
}

/**
 * Generates a spellbook RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory="SPELLBOOK"] - The category ID.
 * @param {string} [options.itemSubTypeId="SPELLBOOK_GENERIC"] - Sub-type ID.
 * @param {string} [options.rarityId] - Specific rarity ID.
 * @param {string} [options.materialId] - Specific cover material ID.
 * @returns {object|null} The generated spellbook item object, or null on error.
 */
export function generateSpellbookRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type (always SPELLBOOK_GENERIC for now)
        const subTypeKey = options.itemSubTypeId || "SPELLBOOK_GENERIC";
        const subType = SPELLBOOK_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Spellbook SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for spellbook.");
            return { ...RARITIES.COMMON, name: "Fallback Common Spellbook", description: "Error determining rarity." };
        }

        // 3. Determine Cover Material
        const allMaterials = { ...SHARED_MATERIALS, ...SPELLBOOK_MATERIALS }; // Combine if SPELLBOOK_MATERIALS has specifics
        const applicableMaterials = subType.materials || Object.keys(allMaterials);
        let materialKey = options.materialId && applicableMaterials.includes(options.materialId.toUpperCase())
            ? options.materialId.toUpperCase()
            : getRandomElement(applicableMaterials);

        if (!materialKey || !allMaterials[materialKey]) {
            console.warn(`Material key ${materialKey} not found for spellbook. Defaulting to PAPER.`);
            materialKey = "PAPER";
        }
        const material = allMaterials[materialKey];
        if (!material || !material.paletteKey) {
            console.error(`Error: Material or paletteKey not found for '${materialKey}'. SubType: ${subType.id}`);
            return null;
        }

        // 4. Select Spells based on Rarity
        let selectedSpells = [];
        let spellTierForBook = "";
        let numSpells = 0;

        switch (rarity.id) {
            case "COMMON":
                selectedSpells = selectUniqueSpells(SPELLS.MINOR, 1);
                spellTierForBook = "Minor";
                numSpells = 1;
                break;
            case "UNCOMMON":
                selectedSpells = selectUniqueSpells(SPELLS.MINOR, 2);
                spellTierForBook = "Minor";
                numSpells = 2;
                break;
            case "RARE":
                selectedSpells = selectUniqueSpells(SPELLS.MINOR, 3);
                spellTierForBook = "Minor";
                numSpells = 3;
                break;
            case "EPIC":
                selectedSpells = selectUniqueSpells(SPELLS.MAJOR, 1);
                spellTierForBook = "Major";
                numSpells = 1;
                break;
            case "LEGENDARY":
                selectedSpells = selectUniqueSpells(SPELLS.MAJOR, 2);
                spellTierForBook = "Major";
                numSpells = 2;
                break;
            default:
                selectedSpells = selectUniqueSpells(SPELLS.MINOR, 1); // Fallback
                spellTierForBook = "Minor";
                numSpells = 1;
        }
        if (selectedSpells.length === 0) {
            console.warn(`Could not select spells for ${rarity.id} spellbook. This might happen if spell pools are too small or empty.`);
            // Potentially add a placeholder "Empty Pages" spell or similar if needed
        }


        // 5. Generate Pixel Art
        let artGenerationResult = {
            imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            itemData: {}
        };

        const pixelArtOptions = {
            subType: subType.pixelArtSubType, // "spellbook"
            material: material.paletteKey, // Cover material
            complexity: rarity.artComplexityHint,
            // Potentially pass info about spells if art generator can use it (e.g., a symbol on cover)
            // For now, generateBook is generic.
        };

        if (typeof generateBook === 'function') {
            artGenerationResult = generateBook(pixelArtOptions);
        } else {
            console.warn(`Pixel art generator function 'generateBook' not found. Using placeholder art.`);
        }

        // 6. Generate Name
        let itemName = "";
        const nameTemplatePool = SPELLBOOK_NAME_TEMPLATES || SHARED_NAME_TEMPLATES.GENERIC;
        let nameTemplate = getRandomElement(nameTemplatePool);
        const getNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";

        // Make name more specific if possible
        let subjectHint = getNamePart(SPELLBOOK_NAME_PARTS.NOUNS_SUBJECT);
        if (selectedSpells.length > 0 && selectedSpells[0].school) {
            const firstSpellSchool = selectedSpells[0].school.charAt(0).toUpperCase() + selectedSpells[0].school.slice(1);
            if (Math.random() < 0.5) { // 50% chance to use first spell's school in name
                subjectHint = firstSpellSchool;
            }
        }


        itemName = nameTemplate
            .replace("{adjective}", getNamePart(SPELLBOOK_NAME_PARTS.ADJECTIVES))
            .replace("{NOUNS_TITLE}", getNamePart(SPELLBOOK_NAME_PARTS.NOUNS_TITLE))
            .replace("{NOUNS_SUBJECT}", subjectHint)
            .replace("{PREFIX_WORDS}", getNamePart(SPELLBOOK_NAME_PARTS.PREFIX_WORDS))
            .replace("{SUFFIX_WORDS}", getNamePart(SPELLBOOK_NAME_PARTS.SUFFIX_WORDS))
            .replace("{material}", material.name);

        itemName = itemName.replace(/\s+/g, ' ').trim();
        if (!itemName || itemName.length < 3 || itemName.toLowerCase().includes("undefined")) {
            itemName = `${material.name} ${subType.name}`;
        }
        if (itemName) itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);


        // 7. Generate Dynamic Description
        let description = `${getArticle(rarity.name)} ${rarity.name.toLowerCase()} ${subType.name.toLowerCase()} bound in ${material.name.toLowerCase()}.`;
        if (artGenerationResult.itemData && artGenerationResult.itemData.decoration && artGenerationResult.itemData.decoration.type !== 'none') {
            description += ` It is adorned with ${getArticle(artGenerationResult.itemData.decoration.material || "intricate")} ${artGenerationResult.itemData.decoration.material || ""} ${artGenerationResult.itemData.decoration.type.replace('_',' ')}.`;
        }

        if (selectedSpells.length > 0) {
            description += ` This volume contains ${numSpells} ${spellTierForBook.toLowerCase()} spell${numSpells > 1 ? 's' : ''}: `;
            description += selectedSpells.map(s => s.name).join(", ") + ".";
        } else {
            description += " Its pages seem to hold arcane potential, though the specific incantations are yet to be deciphered.";
        }


        // 8. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_SPELLBOOK;
        goldValue *= (material.valueMod || 1.0);
        goldValue *= rarity.valueMultiplier;

        // Add value based on spells
        selectedSpells.forEach(spell => {
            const spellValueMultiplier = (spell.tier === "MAJOR") ? 2.5 : 1.0;
            goldValue += (ITEM_BASE_GOLD_VALUES.DEFAULT_SPELLBOOK * 0.1 * spellValueMultiplier * (spell.mpCost || 1));
        });

        goldValue = Math.max(10, Math.round(goldValue)); // Spellbooks should be somewhat valuable


        const finalItem = {
            id: `spellbook_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: "SPELLBOOK",
            subType: subType.id,
            equipSlot: subType.equipSlot, // null
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${material.name} ${subType.name}`,
            rarity: rarity.id,
            material: material.id, // Cover material
            materials: {
                cover: material.id,
                pages: artGenerationResult.itemData?.pageColor || "paper", // From pixel art if available
            },
            // baseStats: {}, // Spellbooks don't have base stats in the traditional sense
            // magicalProperties: [], // Spellbooks don't have affixes in the traditional sense
            spells: selectedSpells.map(s => ({ // Store key spell details
                id: s.id,
                name: s.name,
                description: s.description,
                minIntMod: s.minIntMod,
                mpCost: s.mpCost,
                tier: s.tier,
                effectType: s.effectType,
                school: s.school,
                // Add other relevant spell properties like damageDice, saveAttribute if needed by game
            })),
            value: goldValue,
            description: description,
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Spellbook: ${finalItem.name} (Rarity: ${finalItem.rarity}, Spells: ${selectedSpells.map(s=>s.name).join(', ') || 'None'})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateSpellbookRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/spellbooks/spellbookGenerator.js (v1 - Initial Setup) loaded.");
