/**
 * magic_item_generator/categories/bows/bowGenerator.js
 * Contains the logic to generate a complete Bow RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    BOW_SUB_TYPES, BOW_MATERIALS, BOW_AFFIXES,
    BOW_NAME_PARTS, BOW_NAME_TEMPLATES,
    BOW_LIMB_MATERIALS, BOW_GRIP_MATERIALS, BOW_STRING_MATERIALS
} from './bowDefinitions.js';

// --- IMPORT PIXEL ART GENERATOR ---
// Ensure generateBow is exported from your item_api.js
import { generateBow as generateBowPixelArt } from '../../../pixel_art_generator/item_api.js';


/**
 * Helper function to select a random affix from a given pool.
 */
function selectAffixFromPool(pool, itemCategory, itemSubTypeId, currentRarityId, usedAffixNamesSet, affixTier) {
    if (!pool || pool.length === 0) return null;
    const rarityOrder = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];
    const currentRarityIndex = rarityOrder.indexOf(currentRarityId);

    const possibleAffixes = pool.filter(a => {
        const affixMaxRarityIndex = rarityOrder.indexOf(a.rarityMax);
        const typeMatch = !a.allowedItemTypes || a.allowedItemTypes.includes(itemCategory);
        const categoryMatch = !a.category || a.category === itemCategory;
        const subTypeMatch = !a.subTypes || a.subTypes.includes(itemSubTypeId);
        const rarityCondition = currentRarityIndex <= affixMaxRarityIndex;
        return typeMatch && categoryMatch && subTypeMatch && rarityCondition && !usedAffixNamesSet.has(a.name);
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
 */
function getArticle(word) {
    if (!word) return "a";
    const firstLetter = word.trim()[0].toLowerCase();
    return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? "an" : "a";
}

/**
 * Helper function to format material names for descriptions.
 */
function formatMaterialNameForDesc(materialKey) {
    if (!materialKey) return null;
    const keyUpper = materialKey.toUpperCase();
    const materialObj = SHARED_MATERIALS[keyUpper];
    if (materialObj && materialObj.name) {
        return materialObj.name.toLowerCase().replace(/_/g, ' ');
    }
    return materialKey.toLowerCase().replace(/_/g, ' ');
}


/**
 * Generates a bow RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory] - The category ID for this item (e.g., "BOWS").
 * @param {string} [options.itemSubTypeId] - Specific bow sub-type ID (e.g., "LONGBOW").
 * @param {string} [options.rarityId] - Specific rarity ID (e.g., "RARE").
 * @param {string} [options.materialId] - Specific material ID for the bow limbs (e.g., "WOOD").
 * @returns {object|null} The generated bow item object, or null on error.
 */
export function generateBowRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(BOW_SUB_TYPES));
        const subType = BOW_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Bow SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for bow.");
            return { ...RARITIES.COMMON, name: "Fallback Common Bow", description: "Error determining rarity." };
        }

        // 3. Determine Materials for Limbs, Grip, String
        const applicableLimbMaterials = subType.materials || BOW_LIMB_MATERIALS;
        const limbMaterialKey = options.materialId && applicableLimbMaterials.includes(options.materialId) ? options.materialId : getRandomElement(applicableLimbMaterials);
        const limbBaseMaterialProps = SHARED_MATERIALS[limbMaterialKey] || SHARED_MATERIALS["WOOD"]; // Fallback to WOOD
        const limbBowSpecificMaterialProps = BOW_MATERIALS[limbMaterialKey] || {};
        const limbMaterial = {
            ...limbBaseMaterialProps,
            ...limbBowSpecificMaterialProps,
            id: limbMaterialKey,
            name: limbBaseMaterialProps.name || limbMaterialKey,
            paletteKey: limbBaseMaterialProps.paletteKey,
            statModifiers: { ...(limbBaseMaterialProps.statModifiers || {}), ...(limbBowSpecificMaterialProps.statModifiers || {}) }
        };
        if (!limbMaterial.paletteKey) {
            console.error(`Error: Bow Limb Material or paletteKey not found for '${limbMaterialKey}'. Using WOOD as fallback.`);
            const fallbackMat = SHARED_MATERIALS["WOOD"];
            Object.assign(limbMaterial, { id: "WOOD", name: fallbackMat.name, paletteKey: fallbackMat.paletteKey, statModifiers: fallbackMat.statModifiers });
        }

        // Grip and String materials are often visual choices in the pixel art generator.
        // We'll select them here to pass to the art generator and store in the item data.
        const gripMaterialKey = getRandomElement(BOW_GRIP_MATERIALS);
        const gripMaterial = SHARED_MATERIALS[gripMaterialKey] || SHARED_MATERIALS["LEATHER"];

        const stringMaterialKey = getRandomElement(BOW_STRING_MATERIALS);
        // String materials might not be in SHARED_MATERIALS if they are just conceptual (e.g., "SILK_STRING")
        // The pixel art generator will use its own palette for the string.
        const stringMaterial = {
            id: stringMaterialKey,
            name: stringMaterialKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format it nicely
            paletteKey: stringMaterialKey // Pass the key, art gen handles actual color
        };


        // 4. Generate Pixel Art
        let artGenerationResult = { imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", itemData: {} };
        if (typeof generateBowPixelArt === 'function') {
            artGenerationResult = generateBowPixelArt({
                subType: subType.pixelArtSubType, // e.g., "shortbow", "longbow", "recurve"
                material: limbMaterial.paletteKey, // For the bow limbs
                gripMaterial: gripMaterial.paletteKey, // For the grip (pixel art gen might use its own logic if not directly supported)
                stringMaterial: stringMaterial.paletteKey, // For the string (pixel art gen might use its own logic)
                complexity: rarity.artComplexityHint
            });
        } else {
            console.warn(`Pixel art generator function 'generateBowPixelArt' not found. Using placeholder.`);
        }

        // 5. Calculate Base RPG Stats & Requirements
        let currentMinStrMod = subType.minStrMod !== undefined ? subType.minStrMod : 0;
        if (limbMaterial.statModifiers && typeof limbMaterial.statModifiers.strReqMod === 'number') {
            currentMinStrMod += limbMaterial.statModifiers.strReqMod;
        }

        const baseStats = {
            damage: subType.baseDamage || "1d6", // Bows usually determine arrow damage, but can have a base
            acBonus: 0,
            minStrMod: currentMinStrMod,
        };
        if (subType.damageAttribute) baseStats.damageAttribute = subType.damageAttribute;

        if (limbMaterial.statModifiers) {
            if (typeof limbMaterial.statModifiers.damage === 'number') { // This could be a bonus to arrow damage
                baseStats.damageMaterialMod = (baseStats.damageMaterialMod || 0) + limbMaterial.statModifiers.damage;
            }
        }

        // 6. Generate Magical Properties
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
            const pool = isPrefix ? (BOW_AFFIXES.PREFIXES.MAJOR || []) : (BOW_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "BOWS", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (BOW_AFFIXES.PREFIXES.MINOR || []) : (BOW_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "BOWS", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }

        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            console.warn(`RARE bow initially got no affixes. Forcing one minor affix.`);
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (BOW_AFFIXES.PREFIXES.MINOR || []) : (BOW_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "BOWS", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) {
                magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
            } else {
                const isPrefixMajor = Math.random() < 0.5;
                const poolMajor = isPrefixMajor ? (BOW_AFFIXES.PREFIXES.MAJOR || []) : (BOW_AFFIXES.SUFFIXES.MAJOR || []);
                const affixMajor = selectAffixFromPool(poolMajor, options.itemCategory || "BOWS", subType.id, rarity.id, usedAffixNames, "MAJOR");
                if (affixMajor) {
                     magicalProperties.push({ ...affixMajor, isPrefix: isPrefixMajor, tier: "MAJOR" });
                } else {
                    console.warn("RARE bow could not be enchanted even with fallback.");
                }
            }
        }

        magicalProperties.forEach(prop => {
            if (prop.effect && prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "STR") {
                baseStats.minStrMod += prop.effect.value;
            }
            // Arrow-specific damage additions are handled by the game engine, not directly modifying bow stats
        });

        // 7. Generate Name
        let itemName = "";
        const prefixAffix = magicalProperties.find(p => p.isPrefix);
        const suffixAffix = magicalProperties.find(p => !p.isPrefix && (!prefixAffix || p.name !== prefixAffix.name));
        const nameTemplatePool = BOW_NAME_TEMPLATES || SHARED_NAME_TEMPLATES.GENERIC;
        let nameTemplate = getRandomElement(nameTemplatePool);
        const getBowNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";
        let prefixWord = getBowNamePart(BOW_NAME_PARTS.PREFIX_WORDS);
        let suffixWord = getBowNamePart(BOW_NAME_PARTS.SUFFIX_WORDS);

        if (nameTemplate === "{prefix_word}{suffix_word}") {
            itemName = prefixWord + suffixWord;
        } else if (nameTemplate === "{adjective} {prefix_word} {subTypeName_root_alt}") {
            let root = subType.name.replace(/Bow/i, '').trim();
            if (!root || root.toLowerCase() === subType.name.toLowerCase()) root = "Bow";
            const adj = getBowNamePart(BOW_NAME_PARTS.ADJECTIVES);
            itemName = `${adj} ${prefixWord}${prefixWord && root ? " " : ""}${root}`;
        } else {
            itemName = nameTemplate
                .replace("{prefix}", prefixAffix ? prefixAffix.name : getBowNamePart(BOW_NAME_PARTS.ADJECTIVES))
                .replace("{material}", limbMaterial.name) // Name uses limb material
                .replace("{subTypeName}", subType.name)
                .replace("{suffix}", suffixAffix ? suffixAffix.name : "")
                .replace("{adjective}", getBowNamePart(BOW_NAME_PARTS.ADJECTIVES))
                .replace("{noun_abstract}", getBowNamePart(BOW_NAME_PARTS.NOUNS_ABSTRACT));
        }
        itemName = itemName.replace(/\s{2,}/g, ' ').trim();
        if (!prefixAffix && !suffixAffix && magicalProperties.length > 0) {
            const firstProp = magicalProperties[0];
            itemName = `${firstProp.name} ${limbMaterial.name} ${subType.name}`;
        } else if (magicalProperties.length === 0) {
             if(Math.random() < 0.3 && BOW_NAME_PARTS.ADJECTIVES.length > 0) itemName = `The ${getBowNamePart(BOW_NAME_PARTS.ADJECTIVES)} ${limbMaterial.name} ${subType.name}`;
             else itemName = `${limbMaterial.name} ${subType.name}`;
        }
        itemName = itemName.replace(/undefined|null/gi, '').replace(/\s{2,}/g, ' ').trim();

        // 8. Generate Description
        const limbMaterialNameFormatted = formatMaterialNameForDesc(limbMaterial.id);
        const gripMaterialNameFormatted = formatMaterialNameForDesc(gripMaterial.id);
        const stringMaterialNameFormatted = stringMaterial.name.toLowerCase(); // Already formatted

        let description = `${getArticle(rarity.name)} ${rarity.name.toLowerCase()} ${subType.name.toLowerCase()} crafted with ${getArticle(limbMaterialNameFormatted)} ${limbMaterialNameFormatted} limbs`;
        if (gripMaterial.id.toLowerCase() !== limbMaterial.id.toLowerCase()) {
            description += ` and ${getArticle(gripMaterialNameFormatted)} ${gripMaterialNameFormatted} grip.`;
        } else {
            description += ".";
        }
        description += ` It is strung with ${getArticle(stringMaterialNameFormatted)} ${stringMaterialNameFormatted}.`;


        if (magicalProperties.length > 0) {
            description += ` This bow hums with magical energy.`;
        }

        // Add details from artGenerationResult if available (e.g., tip style)
        const artTipStyle = artGenerationResult.itemData?.bow?.tipStyle; // Assuming pixel art returns this
        if (artTipStyle && artTipStyle !== 'simple') {
            description += ` The limbs feature ${artTipStyle.replace(/_/g, ' ')} tips.`;
        }

        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_WEAPON;
        goldValue *= (limbMaterial.valueMod || 1.0);
        goldValue *= (gripMaterial.valueMod || 1.0) * 0.3; // Grip less impactful
        // String material value is minor, mostly aesthetic
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || 25) * (prop.effect.valueMod || 0.1); // Bows base value for affixes
        });
        if (baseStats.minStrMod > 0) goldValue *= (1 + baseStats.minStrMod * 0.04); // STR req less impactful for bows
        else if (baseStats.minStrMod < 0) goldValue *= (1 + baseStats.minStrMod * 0.01);
        goldValue = Math.max(1, Math.round(goldValue));

        const finalItem = {
            id: `bow_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: options.itemCategory || "BOWS",
            subType: subType.id,
            equipSlot: subType.equipSlot,
            canBeOffHand: subType.canBeOffHand || false,
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${limbMaterial.name} ${subType.name}`,
            rarity: rarity.id,
            material: limbMaterial.id, // Primary material is the limb's
            materials: {
                limbs: limbMaterial.id,
                grip: gripMaterial.id,
                string: stringMaterial.id,
            },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            isTwoHanded: subType.twoHanded || true, // Bows are generally two-handed
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Bow: ${finalItem.name} (Rarity: ${finalItem.rarity}, Limbs: ${limbMaterial.name}, Grip: ${gripMaterial.name})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateBowRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/bows/bowGenerator.js loaded.");
