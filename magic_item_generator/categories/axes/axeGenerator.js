/**
 * magic_item_generator/categories/axes/axeGenerator.js
 * Contains the logic to generate a complete Axe RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    AXE_SUB_TYPES, AXE_MATERIALS, AXE_AFFIXES,
    AXE_NAME_PARTS, AXE_NAME_TEMPLATES,
    AXE_HAFT_MATERIALS
} from './axeDefinitions.js';

// --- IMPORT PIXEL ART GENERATOR ---
import { generateAxe as generateAxePixelArt } from '../../../pixel_art_generator/item_api.js';


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

        // Corrected Rarity Condition:
        // An item can get an affix if the item's rarity is less than or equal to the affix's maximum allowed rarity.
        // The affixTier (MAJOR/MINOR) determines which pool is passed in, not this core rarity check.
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
 * @param {string} materialKey - The material key (e.g., "DARK_STEEL").
 * @returns {string|null} Formatted material name (e.g., "dark steel") or null.
 */
function formatMaterialNameForDesc(materialKey) {
    if (!materialKey) return null;
    const materialObj = SHARED_MATERIALS[materialKey.toUpperCase()];
    if (materialObj && materialObj.name) {
        return materialObj.name.toLowerCase().replace(/_/g, ' ');
    }
    return materialKey.toLowerCase().replace(/_/g, ' '); // Fallback to key if name not found
}


/**
 * Generates an axe RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory] - The category ID for this item (e.g., "AXES").
 * @param {string} [options.itemSubTypeId] - Specific axe sub-type ID (e.g., "AXE_BATTLE").
 * @param {string} [options.rarityId] - Specific rarity ID (e.g., "RARE").
 * @param {string} [options.materialId] - Specific material ID for the axe head (e.g., "STEEL").
 * @returns {object|null} The generated axe item object, or null on error.
 */
export function generateAxeRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(AXE_SUB_TYPES));
        const subType = AXE_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Axe SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for axe.");
            return { ...RARITIES.COMMON, name: "Fallback Common Axe", description: "Error determining rarity." };
        }

        // 3. Determine Materials for Head and Haft
        const applicableHeadMaterials = subType.materials || Object.keys(SHARED_MATERIALS);
        const headMaterialKey = options.materialId && applicableHeadMaterials.includes(options.materialId) ? options.materialId : getRandomElement(applicableHeadMaterials);
        const headBaseMaterialProps = SHARED_MATERIALS[headMaterialKey] || {};
        const headAxeSpecificMaterialProps = AXE_MATERIALS[headMaterialKey] || {};
        const headMaterial = {
            ...headBaseMaterialProps,
            ...headAxeSpecificMaterialProps,
            id: headMaterialKey,
            name: headBaseMaterialProps.name || headMaterialKey,
            paletteKey: headBaseMaterialProps.paletteKey,
            statModifiers: { ...(headBaseMaterialProps.statModifiers || {}), ...(headAxeSpecificMaterialProps.statModifiers || {}) }
        };
        if (!headMaterial.paletteKey) {
            console.error(`Error: Axe Head Material or paletteKey not found for '${headMaterialKey}'.`);
            return null;
        }

        const haftMaterialKey = getRandomElement(AXE_HAFT_MATERIALS);
        const haftMaterial = SHARED_MATERIALS[haftMaterialKey] || SHARED_MATERIALS["WOOD"];

        // 4. Generate Pixel Art
        let artGenerationResult = { imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", itemData: {} };
        if (typeof generateAxePixelArt === 'function') {
            artGenerationResult = generateAxePixelArt({
                subType: subType.pixelArtSubType,
                material: headMaterial.paletteKey,
                haftMaterial: haftMaterial.paletteKey,
                complexity: rarity.artComplexityHint
            });
        } else {
            console.warn(`Pixel art generator function 'generateAxePixelArt' not found. Using placeholder.`);
        }

        // 5. Calculate Base RPG Stats & Requirements
        let currentMinStrMod = subType.minStrMod !== undefined ? subType.minStrMod : -2;
        if (headMaterial.statModifiers && typeof headMaterial.statModifiers.strReqMod === 'number') {
            currentMinStrMod += headMaterial.statModifiers.strReqMod;
        }

        const baseStats = {
            damage: subType.baseDamage || "1d6",
            acBonus: 0,
            minStrMod: currentMinStrMod,
        };
        if (subType.damageAttribute) baseStats.damageAttribute = subType.damageAttribute;

        if (headMaterial.statModifiers) {
            if (typeof headMaterial.statModifiers.damage === 'number') {
                baseStats.damageMaterialMod = (baseStats.damageMaterialMod || 0) + headMaterial.statModifiers.damage;
            }
            if (typeof headMaterial.statModifiers.damageFlatBonus === 'number') {
                baseStats.damageFlatBonus = (baseStats.damageFlatBonus || 0) + headMaterial.statModifiers.damageFlatBonus;
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
            const pool = isPrefix ? (AXE_AFFIXES.PREFIXES.MAJOR || []) : (AXE_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "AXES", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (AXE_AFFIXES.PREFIXES.MINOR || []) : (AXE_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "AXES", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }

        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            console.warn(`RARE axe initially got no affixes. Forcing one minor affix.`);
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (AXE_AFFIXES.PREFIXES.MINOR || []) : (AXE_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "AXES", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) {
                magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
            } else {
                const isPrefixMajor = Math.random() < 0.5;
                const poolMajor = isPrefixMajor ? (AXE_AFFIXES.PREFIXES.MAJOR || []) : (AXE_AFFIXES.SUFFIXES.MAJOR || []);
                const affixMajor = selectAffixFromPool(poolMajor, options.itemCategory || "AXES", subType.id, rarity.id, usedAffixNames, "MAJOR");
                if (affixMajor) {
                     magicalProperties.push({ ...affixMajor, isPrefix: isPrefixMajor, tier: "MAJOR" });
                } else {
                    console.warn("RARE axe could not be enchanted even with fallback.");
                }
            }
        }

        magicalProperties.forEach(prop => {
            if (prop.effect && prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "STR") {
                baseStats.minStrMod += prop.effect.value;
            }
        });

        // 7. Generate Name
        let itemName = "";
        const prefixAffix = magicalProperties.find(p => p.isPrefix);
        const suffixAffix = magicalProperties.find(p => !p.isPrefix && (!prefixAffix || p.name !== prefixAffix.name));
        const nameTemplatePool = AXE_NAME_TEMPLATES || SHARED_NAME_TEMPLATES.GENERIC;
        let nameTemplate = getRandomElement(nameTemplatePool);
        const getAxeNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";
        let prefixWord = getAxeNamePart(AXE_NAME_PARTS.PREFIX_WORDS);
        let suffixWord = getAxeNamePart(AXE_NAME_PARTS.SUFFIX_WORDS);

        if (nameTemplate === "{prefix_word}{suffix_word}") {
            itemName = prefixWord + suffixWord;
        } else if (nameTemplate === "{adjective} {prefix_word} {subTypeName_root_alt}") {
            let root = subType.name.replace(/Axe/i, '').trim();
            if (!root || root.toLowerCase() === subType.name.toLowerCase()) root = "Axe";
            const adj = getAxeNamePart(AXE_NAME_PARTS.ADJECTIVES);
            itemName = `${adj} ${prefixWord}${prefixWord && root ? " " : ""}${root}`;
        } else {
            itemName = nameTemplate
                .replace("{prefix}", prefixAffix ? prefixAffix.name : getAxeNamePart(AXE_NAME_PARTS.ADJECTIVES))
                .replace("{material}", headMaterial.name)
                .replace("{subTypeName}", subType.name)
                .replace("{suffix}", suffixAffix ? suffixAffix.name : "")
                .replace("{adjective}", getAxeNamePart(AXE_NAME_PARTS.ADJECTIVES))
                .replace("{noun_abstract}", getAxeNamePart(AXE_NAME_PARTS.NOUNS_ABSTRACT));
        }
        itemName = itemName.replace(/\s{2,}/g, ' ').trim();
        if (!prefixAffix && !suffixAffix && magicalProperties.length > 0) {
            const firstProp = magicalProperties[0];
            itemName = `${firstProp.name} ${headMaterial.name} ${subType.name}`;
        } else if (magicalProperties.length === 0) {
             if(Math.random() < 0.3 && AXE_NAME_PARTS.ADJECTIVES.length > 0) itemName = `The ${getAxeNamePart(AXE_NAME_PARTS.ADJECTIVES)} ${headMaterial.name} ${subType.name}`;
             else itemName = `${headMaterial.name} ${subType.name}`;
        }
        itemName = itemName.replace(/undefined|null/gi, '').replace(/\s{2,}/g, ' ').trim();

        // 8. Generate Description
        const headMaterialNameFormatted = formatMaterialNameForDesc(headMaterial.id);
        const initialHaftMaterialNameFormatted = formatMaterialNameForDesc(haftMaterial.id);

        let description = `${getArticle(rarity.name)} ${rarity.name.toLowerCase()} ${subType.name.toLowerCase()} with ${getArticle(headMaterialNameFormatted)} ${headMaterialNameFormatted} head`;
        if (haftMaterial.id.toLowerCase() !== headMaterial.id.toLowerCase()) {
            description += ` and ${getArticle(initialHaftMaterialNameFormatted)} ${initialHaftMaterialNameFormatted} haft.`;
        } else {
            description += ".";
        }

        if (magicalProperties.length > 0) {
            description += ` It is imbued with magical properties.`;
        }

        const artHaftMaterialKeyFromArt = artGenerationResult.itemData?.shaft?.material;
        const artPommelShapeKey = artGenerationResult.itemData?.shaft?.pommelShape;

        if (artHaftMaterialKeyFromArt) {
            let artActualHaftMaterialNameToDisplay = formatMaterialNameForDesc(artHaftMaterialKeyFromArt);
            if (artHaftMaterialKeyFromArt.toUpperCase() === "ENCHANTED" && haftMaterial.id.toUpperCase() === "ENCHANTED_METAL") {
                artActualHaftMaterialNameToDisplay = initialHaftMaterialNameFormatted;
            }
            if (artActualHaftMaterialNameToDisplay && artActualHaftMaterialNameToDisplay !== initialHaftMaterialNameFormatted) {
                 description += ` The haft also appears to incorporate ${artActualHaftMaterialNameToDisplay}.`;
            }
        }

        if(artPommelShapeKey && artPommelShapeKey !== 'none') {
            const formattedPommelShape = artPommelShapeKey.replace(/_/g, ' ');
            if (formattedPommelShape.toLowerCase().endsWith('pommel')) {
                description += ` It is finished with ${getArticle(formattedPommelShape)} ${formattedPommelShape}.`;
            } else {
                description += ` It is finished with ${getArticle(formattedPommelShape)} ${formattedPommelShape} pommel.`;
            }
        }

        if (subType.id === "AXE_GREAT") {
            description += " This formidable axe requires two hands to wield effectively.";
        } else if (subType.id === "AXE_HAND" && magicalProperties.some(p => p.id === "THROWABLE_20_60")) {
            description += " It is well-balanced for throwing.";
        }

        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_WEAPON;
        goldValue *= (headMaterial.valueMod || 1.0);
        goldValue *= (SHARED_MATERIALS[haftMaterial.id]?.valueMod || 1.0) * 0.5;
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || 15) * (prop.effect.valueMod || 0.1);
        });
        if (baseStats.minStrMod > 0) goldValue *= (1 + baseStats.minStrMod * 0.06);
        else if (baseStats.minStrMod < 0) goldValue *= (1 + baseStats.minStrMod * 0.03);
        goldValue = Math.max(1, Math.round(goldValue));

        const finalItem = {
            id: `axe_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: options.itemCategory || "AXES",
            subType: subType.id,
            equipSlot: subType.equipSlot,
            canBeOffHand: subType.canBeOffHand || false,
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${headMaterial.name} ${subType.name}`,
            rarity: rarity.id,
            material: headMaterial.id,
            materials: {
                head: headMaterial.id,
                haft: haftMaterial.id,
            },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            isTwoHanded: subType.twoHanded || false,
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Axe: ${finalItem.name} (Rarity: ${finalItem.rarity}, Head: ${headMaterial.name}, Haft: ${haftMaterial.name})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateAxeRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/axes/axeGenerator.js (Corrected RarityMax Logic) loaded.");
