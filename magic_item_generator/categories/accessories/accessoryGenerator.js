/**
 * magic_item_generator/categories/accessories/accessoryGenerator.js
 * Contains the logic to generate a complete Accessory RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES, NAME_TEMPLATES as SHARED_NAME_TEMPLATES, NAME_PARTS as SHARED_NAME_PARTS,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    ACCESSORY_SUB_TYPES, ACCESSORY_MATERIALS, ACCESSORY_AFFIXES,
    ACCESSORY_NAME_PARTS, ACCESSORY_NAME_TEMPLATES
} from './accessoryDefinitions.js';

// Import pixel art generator functions
import { generateJewelry, generateGloves } from '../../../pixel_art_generator/item_api.js';

const CORE_ATTRIBUTES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

/**
 * Helper function to select a random affix from a given pool.
 * @param {Array} pool - The array of affix objects to choose from.
 * @param {string} itemCategory - The category of the item (e.g., "ACCESSORY").
 * @param {string} itemSubTypeId - The sub-type ID of the item.
 * @param {string} currentRarityId - The rarity ID of the item.
 * @param {Set} usedAffixNamesSet - A Set of affix names already used on this item.
 * @param {string} affixTier - "MAJOR" or "MINOR".
 * @returns {object|null} A copy of the chosen affix object or null.
 */
function selectAffixFromPool(pool, itemCategory, itemSubTypeId, currentRarityId, usedAffixNamesSet, affixTier) {
    if (!pool || pool.length === 0) return null;

    const rarityOrder = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];
    const currentRarityIndex = rarityOrder.indexOf(currentRarityId);

    const possibleAffixes = pool.filter(a => {
        const affixMaxRarityIndex = rarityOrder.indexOf(a.rarityMax);
        const typeMatch = !a.allowedItemTypes || a.allowedItemTypes.includes(itemCategory);
        const subTypeMatch = !a.subTypes || a.subTypes.includes(itemSubTypeId);
        const rarityCondition = currentRarityIndex <= affixMaxRarityIndex;

        return typeMatch && subTypeMatch && rarityCondition && !usedAffixNamesSet.has(a.name);
    });

    if (possibleAffixes.length === 0) return null;

    const chosenAffixData = getRandomElement(possibleAffixes);
    if (chosenAffixData) {
        usedAffixNamesSet.add(chosenAffixData.name);
        return { ...chosenAffixData }; 
    }
    return null;
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
 * Generates an accessory RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory="ACCESSORY"] - The category ID.
 * @param {string} [options.itemSubTypeId] - Specific accessory sub-type ID (e.g., "RING", "GLOVES").
 * @param {string} [options.rarityId] - Specific rarity ID.
 * @param {string} [options.materialId] - Specific material ID.
 * @returns {object|null} The generated accessory item object, or null on error.
 */
export function generateAccessoryRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(ACCESSORY_SUB_TYPES));
        const subType = ACCESSORY_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Accessory SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for accessory.");
            return { ...RARITIES.COMMON, name: "Fallback Common Trinket", description: "Error determining rarity." };
        }

        // 3. Determine Material
        const allMaterials = { ...SHARED_MATERIALS, ...ACCESSORY_MATERIALS };
        const applicableMaterials = subType.materials || Object.keys(allMaterials);
        let materialKey = options.materialId && applicableMaterials.includes(options.materialId.toUpperCase())
            ? options.materialId.toUpperCase()
            : getRandomElement(applicableMaterials);

        if (!materialKey || !allMaterials[materialKey]) {
            console.warn(`Material key ${materialKey} not found for accessory sub-type ${subType.id}. Defaulting to SILVER.`);
            materialKey = "SILVER";
            if (!allMaterials[materialKey]) { 
                 console.error("CRITICAL: SILVER material not found. Cannot generate accessory material.");
                 return null;
            }
        }
        const material = allMaterials[materialKey];
        if (!material || !material.paletteKey) {
            console.error(`Error: Material or paletteKey not found for '${materialKey}'. SubType: ${subType.id}`);
            return null;
        }

        // 4. Generate Pixel Art
        let artGenerationResult = {
            imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            itemData: {}
        };

        let actualPixelArtSubType = subType.pixelArtSubType; // Default to what's in accessoryDefinitions

        if (subType.id === "EARRINGS") {
            actualPixelArtSubType = getRandomElement(["earring_stud", "earring_hoop", "earring_dangle"]);
        } else if (subType.id === "NECKLACE") {
            // If "necklace_chain" is chosen conceptually, map it to "pendant" or "amulet" for visual generation,
            // as jewelry_generator.js handles these for items with chains.
            // The distinction of it being *just* a chain would be more in name/description.
            const necklaceVisualTypes = ["pendant", "amulet"]; 
            actualPixelArtSubType = getRandomElement(necklaceVisualTypes);
        }
        // For "GLOVES", pixelArtSubType is "gloves_generic", art generator handles internal variations.
        // For "RING", "COLLAR", "CIRCLET", the subType.pixelArtSubType is already specific and valid.

        const pixelArtOptions = {
            subType: actualPixelArtSubType, 
            material: material.paletteKey,
            complexity: rarity.artComplexityHint
        };

        if (subType.pixelArtGeneratorKey === "generateJewelry" && typeof generateJewelry === 'function') {
            artGenerationResult = generateJewelry(pixelArtOptions);
        } else if (subType.pixelArtGeneratorKey === "generateGloves" && typeof generateGloves === 'function') {
            artGenerationResult = generateGloves(pixelArtOptions);
        } else {
            console.warn(`Pixel art generator function '${subType.pixelArtGeneratorKey}' not found or not specified for ${subType.id}. Using placeholder art.`);
        }

        // 5. Calculate Base RPG Stats
        const baseStats = {
            acBonus: 0,
            str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0,
            hp: 0, mp: 0,
        };

        if (subType.canHaveRandomAttributeBonus) {
            const randomAttribute = getRandomElement(CORE_ATTRIBUTES);
            baseStats[randomAttribute.toLowerCase()] = (baseStats[randomAttribute.toLowerCase()] || 0) + 1;
        }

        (subType.baseStatsBonuses || []).forEach(bonus => {
            if (bonus.type === "attribute_boost") {
                const attrKey = bonus.attribute.toLowerCase();
                baseStats[attrKey] = (baseStats[attrKey] || 0) + bonus.value;
            } else if (bonus.type === "hp_boost") {
                baseStats.hp = (baseStats.hp || 0) + bonus.value;
            } else if (bonus.type === "mp_boost") {
                baseStats.mp = (baseStats.mp || 0) + bonus.value;
            }
        });

        // 6. Generate Magical Properties (Affixes)
        const magicalProperties = [];
        let usedAffixNames = new Set();
        let minorAffixSlots = 0;
        let majorAffixSlots = 0;

        switch (rarity.id) {
            case "UNCOMMON": minorAffixSlots = 1; break;
            case "RARE": majorAffixSlots = Math.random() < 0.5 ? 1 : 0; minorAffixSlots = majorAffixSlots === 1 ? 0 : 2; break;
            case "EPIC": majorAffixSlots = 1; minorAffixSlots = 1; break;
            case "LEGENDARY": majorAffixSlots = 2; break;
        }

        for (let i = 0; i < majorAffixSlots; i++) {
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (ACCESSORY_AFFIXES.PREFIXES.MAJOR || []) : (ACCESSORY_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, "ACCESSORY", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (ACCESSORY_AFFIXES.PREFIXES.MINOR || []) : (ACCESSORY_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "ACCESSORY", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }
        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (ACCESSORY_AFFIXES.PREFIXES.MINOR || []) : (ACCESSORY_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "ACCESSORY", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }

        // Apply affix effects to baseStats
        magicalProperties.forEach(prop => {
            if (prop.effect) {
                if (prop.effect.type === "ac_boost_deflection") {
                    baseStats.acBonus += prop.effect.value;
                } else if (prop.effect.type === "hp_boost") {
                    baseStats.hp = (baseStats.hp || 0) + prop.effect.value;
                } else if (prop.effect.type === "mp_boost") {
                    baseStats.mp = (baseStats.mp || 0) + prop.effect.value;
                } else if (prop.effect.type === "attribute_boost") {
                    const attrKey = prop.effect.attribute.toLowerCase();
                    baseStats[attrKey] = (baseStats[attrKey] || 0) + prop.effect.value;
                } else if (prop.effect.type === "multi_boost" && Array.isArray(prop.effect.effects)) {
                    prop.effect.effects.forEach(eff => {
                        if (eff.type === "attribute_boost") {
                             const attrKey = eff.attribute.toLowerCase();
                             baseStats[attrKey] = (baseStats[attrKey] || 0) + eff.value;
                        } else if (eff.type === "hp_boost") {
                            baseStats.hp = (baseStats.hp || 0) + eff.value;
                        } else if (eff.type === "mp_boost") {
                            baseStats.mp = (baseStats.mp || 0) + eff.value;
                        } else if (eff.type === "ac_boost_deflection") {
                            baseStats.acBonus = (baseStats.acBonus || 0) + eff.value;
                        }
                    });
                }
            }
        });
        CORE_ATTRIBUTES.forEach(attr => {
            const attrKey = attr.toLowerCase();
            if (baseStats[attrKey] === 0) {
                delete baseStats[attrKey];
            }
        });
        if (baseStats.hp === 0) delete baseStats.hp;
        if (baseStats.mp === 0) delete baseStats.mp;
        if (baseStats.acBonus === 0) delete baseStats.acBonus;

        // 7. Generate Name
        let itemName = "";
        const prefixAffixObj = magicalProperties.find(p => p.isPrefix);
        const suffixAffixObj = magicalProperties.find(p => !p.isPrefix && (!prefixAffixObj || p.name !== prefixAffixObj.name));
        const prefixNameStr = prefixAffixObj ? prefixAffixObj.name : "";
        const suffixNameStr = suffixAffixObj ? suffixAffixObj.name : "";

        const nameTemplatePool = ACCESSORY_NAME_TEMPLATES || SHARED_NAME_TEMPLATES.GENERIC;
        let nameTemplate = getRandomElement(nameTemplatePool);

        const getNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";
        const isGloveType = subType.id === "GLOVES";
        let nounPoolKey = isGloveType ? "NOUNS_GLOVES" : "NOUNS_JEWELRY";

        if (isGloveType && nameTemplate.includes("{NOUNS_JEWELRY}")) {
            nameTemplate = nameTemplate.replace("{NOUNS_JEWELRY}", "{NOUNS_GLOVES}");
        } else if (!isGloveType && nameTemplate.includes("{NOUNS_GLOVES}")) {
            nameTemplate = nameTemplate.replace("{NOUNS_GLOVES}", "{NOUNS_JEWELRY}");
        }
        if (nameTemplate.includes("{NOUNS_GLOVES}") && !isGloveType) nounPoolKey = "NOUNS_JEWELRY";
        if (nameTemplate.includes("{NOUNS_JEWELRY}") && isGloveType) nounPoolKey = "NOUNS_GLOVES";

        itemName = nameTemplate
            .replace("{prefix}", prefixNameStr || getNamePart(ACCESSORY_NAME_PARTS.ADJECTIVES))
            .replace("{material}", material.name)
            .replace("{subTypeName}", subType.name) // This is the RPG sub-type name like "Necklace", "Earrings"
            .replace("{suffix}", suffixNameStr)
            .replace("{adjective}", getNamePart(ACCESSORY_NAME_PARTS.ADJECTIVES))
            .replace(isGloveType ? "{NOUNS_GLOVES}" : "{NOUNS_JEWELRY}", getNamePart(ACCESSORY_NAME_PARTS[nounPoolKey]))
            .replace("{noun_abstract}", getNamePart(ACCESSORY_NAME_PARTS.NOUNS_ABSTRACT))
            .replace("{prefix_word}", getNamePart(ACCESSORY_NAME_PARTS.PREFIX_WORDS))
            .replace("{suffix_word}", getNamePart(ACCESSORY_NAME_PARTS.SUFFIX_WORDS));

        itemName = itemName.replace(/\s+/g, ' ').trim();
        if (!itemName || itemName.length < 3 || itemName.toLowerCase().includes("undefined")) {
            itemName = `${prefixNameStr} ${material.name} ${subType.name} ${suffixNameStr}`.replace(/\s+/g, ' ').trim();
            if (!itemName || itemName.length < 3) itemName = `${material.name} ${subType.name}`;
        }
        if (itemName) itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

        // 8. Generate Dynamic Description
        let description = `${getArticle(rarity.name)} ${rarity.name.toLowerCase()} ${subType.name.toLowerCase()} crafted from ${material.name.toLowerCase()}.`;
        // Add more specific description based on actualPixelArtSubType if needed
        if (artGenerationResult.itemData && artGenerationResult.itemData.jewelryType) { // Jewelry specific details
            description += ` It appears as ${getArticle(actualPixelArtSubType)} ${actualPixelArtSubType.replace(/_/g, ' ')}.`;
            if (artGenerationResult.itemData.hasGem && artGenerationResult.itemData.gemMaterial) {
                description += ` It features a prominent ${artGenerationResult.itemData.gemMaterial} ${artGenerationResult.itemData.gemShape || 'gem'}.`;
                if (artGenerationResult.itemData.hasSetting) {
                    description += ` The gem is secured in a ${artGenerationResult.itemData.settingMaterial || material.name.toLowerCase()} ${artGenerationResult.itemData.settingStyle || 'setting'}.`;
                }
            }
            if (artGenerationResult.itemData.decoration && artGenerationResult.itemData.decoration !== 'none' && artGenerationResult.itemData.decoration !== 'spine_details') {
                description += ` The ${artGenerationResult.itemData.metal || material.name.toLowerCase()} is ${artGenerationResult.itemData.decoration}.`;
            }
        } else if (artGenerationResult.itemData && artGenerationResult.itemData.gloveType) { // Glove specific details
            description += ` These are ${artGenerationResult.itemData.gloveLength || 'wrist-length'} ${artGenerationResult.itemData.gloveType.replace('_', ' ')}.`;
            if (artGenerationResult.itemData.hasFingers === false) {
                description += " They are fingerless.";
            }
            if (artGenerationResult.itemData.knuckleStyle && artGenerationResult.itemData.knuckleStyle !== 'none') {
                description += ` Reinforced with ${artGenerationResult.itemData.secondaryMaterial || 'sturdy'} ${artGenerationResult.itemData.knuckleStyle} knuckles.`;
            }
        }


        if (magicalProperties.length > 0) {
            description += ` It feels imbued with a subtle energy.`;
        } else {
            description += ` A fine piece of craftsmanship.`;
        }

        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_ACCESSORY;
        goldValue *= (material.valueMod || 1.0);
        goldValue *= rarity.valueMultiplier;

        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_ACCESSORY) * (prop.effect.valueMod || 0.1);
        });

        const randomAttrBonusCount = CORE_ATTRIBUTES.reduce((count, attr) => {
            return count + (baseStats[attr.toLowerCase()] && baseStats[attr.toLowerCase()] > 0 && subType.canHaveRandomAttributeBonus && magicalProperties.every(p => !(p.effect.type === 'attribute_boost' && p.effect.attribute === attr)) ? 1 : 0);
        }, 0);

        if (randomAttrBonusCount > 0) {
            goldValue += (ITEM_BASE_GOLD_VALUES.DEFAULT_ACCESSORY * 0.20 * randomAttrBonusCount);
        }

        goldValue = Math.max(1, Math.round(goldValue));

        const finalItem = {
            id: `accessory_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: "ACCESSORY",
            subType: subType.id, // RPG SubType (e.g., EARRINGS, NECKLACE)
            equipSlot: subType.equipSlot,
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${material.name} ${subType.name}`,
            rarity: rarity.id,
            material: material.id,
            materials: {
                primary: material.id,
                ...(artGenerationResult.itemData?.materials || {})
            },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            artGeneratorData: { // Ensure artGeneratorData includes the actual visual subtype used
                ...artGenerationResult.itemData,
                visualSubType: actualPixelArtSubType // Store the specific visual subtype chosen
            },
        };

        console.log(`Generated Accessory: ${finalItem.name} (Rarity: ${finalItem.rarity}, Material: ${material.name}, RPG SubType: ${subType.id}, Art SubType: ${actualPixelArtSubType})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateAccessoryRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/accessories/accessoryGenerator.js (v4 - Refined Art SubType Selection for Jewelry) loaded.");
