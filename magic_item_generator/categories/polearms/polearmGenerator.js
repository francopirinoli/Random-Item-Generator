/**
 * magic_item_generator/categories/polearms/polearmGenerator.js
 * Contains the logic to generate a complete Polearm RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    POLEARM_SUB_TYPES, POLEARM_MATERIALS, POLEARM_AFFIXES,
    POLEARM_NAME_PARTS, POLEARM_NAME_TEMPLATES,
    POLEARM_HAFT_MATERIALS, POLEARM_GRIP_MATERIALS // Assuming grip materials might be used by pixel art
} from './polearmDefinitions.js';

// --- IMPORT PIXEL ART GENERATOR ---
// Ensure generatePolearm is exported from your item_api.js
import { generatePolearm as generatePolearmPixelArt } from '../../../pixel_art_generator/item_api.js';


/**
 * Helper function to select a random affix from a given pool.
 * (Consider moving to a shared utility file)
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
 * (Consider moving to a shared utility file)
 */
function getArticle(word) {
    if (!word) return "a";
    const firstLetter = word.trim()[0].toLowerCase();
    return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? "an" : "a";
}

/**
 * Helper function to format material names for descriptions.
 * (Consider moving to a shared utility file)
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
 * Generates a polearm RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory] - The category ID for this item (e.g., "POLEARMS").
 * @param {string} [options.itemSubTypeId] - Specific polearm sub-type ID (e.g., "SPEAR").
 * @param {string} [options.rarityId] - Specific rarity ID (e.g., "RARE").
 * @param {string} [options.materialId] - Specific material ID for the polearm head (e.g., "STEEL").
 * @returns {object|null} The generated polearm item object, or null on error.
 */
export function generatePolearmRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(POLEARM_SUB_TYPES));
        const subType = POLEARM_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Polearm SubType '${subTypeKey}' not found.`);
            return null;
        }

        let actualPixelArtSubType = subType.pixelArtSubType;
        // For SPEAR, randomly pick one of its visual variations for the pixel art
        if (subType.id === "SPEAR") {
            const spearVisualVariations = ["spear_point", "leaf_spear", "barbed_spear"];
            actualPixelArtSubType = getRandomElement(spearVisualVariations);
        }


        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for polearm.");
            return { ...RARITIES.COMMON, name: "Fallback Common Spear", description: "Error determining rarity." };
        }

        // 3. Determine Materials for Head and Haft
        const applicableHeadMaterials = subType.materials || Object.keys(SHARED_MATERIALS);
        const headMaterialKey = options.materialId && applicableHeadMaterials.includes(options.materialId) ? options.materialId : getRandomElement(applicableHeadMaterials);
        const headBaseMaterialProps = SHARED_MATERIALS[headMaterialKey] || {};
        const headPolearmSpecificMaterialProps = POLEARM_MATERIALS[headMaterialKey] || {};
        const headMaterial = {
            ...headBaseMaterialProps,
            ...headPolearmSpecificMaterialProps,
            id: headMaterialKey,
            name: headBaseMaterialProps.name || headMaterialKey,
            paletteKey: headBaseMaterialProps.paletteKey,
            statModifiers: { ...(headBaseMaterialProps.statModifiers || {}), ...(headPolearmSpecificMaterialProps.statModifiers || {}) }
        };
        if (!headMaterial.paletteKey) {
            console.error(`Error: Polearm Head Material or paletteKey not found for '${headMaterialKey}'. Using STEEL as fallback.`);
            const fallbackMat = SHARED_MATERIALS["STEEL"];
            Object.assign(headMaterial, { id: "STEEL", name: fallbackMat.name, paletteKey: fallbackMat.paletteKey, statModifiers: fallbackMat.statModifiers });
        }

        const haftMaterialKey = getRandomElement(POLEARM_HAFT_MATERIALS);
        const haftMaterial = SHARED_MATERIALS[haftMaterialKey] || SHARED_MATERIALS["WOOD"];

        // 4. Generate Pixel Art
        let artGenerationResult = { imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", itemData: {} };
        if (typeof generatePolearmPixelArt === 'function') {
            artGenerationResult = generatePolearmPixelArt({
                subType: actualPixelArtSubType, // Use the potentially varied spear subtype
                material: headMaterial.paletteKey,
                haftMaterial: haftMaterial.paletteKey,
                complexity: rarity.artComplexityHint
            });
        } else {
            console.warn(`Pixel art generator function 'generatePolearmPixelArt' not found. Using placeholder.`);
        }

        // 5. Calculate Base RPG Stats & Requirements
        let currentMinStrMod = subType.minStrMod !== undefined ? subType.minStrMod : 0;
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
            const pool = isPrefix ? (POLEARM_AFFIXES.PREFIXES.MAJOR || []) : (POLEARM_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "POLEARMS", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (POLEARM_AFFIXES.PREFIXES.MINOR || []) : (POLEARM_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "POLEARMS", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }

        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            console.warn(`RARE polearm initially got no affixes. Forcing one minor affix.`);
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (POLEARM_AFFIXES.PREFIXES.MINOR || []) : (POLEARM_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "POLEARMS", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) {
                magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
            } else {
                const isPrefixMajor = Math.random() < 0.5;
                const poolMajor = isPrefixMajor ? (POLEARM_AFFIXES.PREFIXES.MAJOR || []) : (POLEARM_AFFIXES.SUFFIXES.MAJOR || []);
                const affixMajor = selectAffixFromPool(poolMajor, options.itemCategory || "POLEARMS", subType.id, rarity.id, usedAffixNames, "MAJOR");
                if (affixMajor) {
                     magicalProperties.push({ ...affixMajor, isPrefix: isPrefixMajor, tier: "MAJOR" });
                } else {
                    console.warn("RARE polearm could not be enchanted even with fallback.");
                }
            }
        }

        magicalProperties.forEach(prop => {
            if (prop.effect && prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "STR") {
                baseStats.minStrMod += prop.effect.value;
            }
            // TODO: Apply other polearm-specific affix effects to baseStats
        });

        // 7. Generate Name
        let itemName = "";
        const prefixAffix = magicalProperties.find(p => p.isPrefix);
        const suffixAffix = magicalProperties.find(p => !p.isPrefix && (!prefixAffix || p.name !== prefixAffix.name));
        const nameTemplatePool = POLEARM_NAME_TEMPLATES || SHARED_NAME_TEMPLATES.GENERIC;
        let nameTemplate = getRandomElement(nameTemplatePool);
        const getPolearmNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";
        let prefixWord = getPolearmNamePart(POLEARM_NAME_PARTS.PREFIX_WORDS);
        let suffixWord = getPolearmNamePart(POLEARM_NAME_PARTS.SUFFIX_WORDS);

        if (nameTemplate === "{prefix_word}{suffix_word}") {
            itemName = prefixWord + suffixWord;
        } else if (nameTemplate === "{adjective} {prefix_word} {subTypeName_root_alt}") {
            let root = subType.name.replace(/Spear|Trident|Poleaxe|Glaive/i, '').trim();
            if (!root || root.toLowerCase() === subType.name.toLowerCase()) root = subType.name.split(" ").pop() || "Polearm";
            const adj = getPolearmNamePart(POLEARM_NAME_PARTS.ADJECTIVES);
            itemName = `${adj} ${prefixWord}${prefixWord && root ? " " : ""}${root}`;
        } else {
            itemName = nameTemplate
                .replace("{prefix}", prefixAffix ? prefixAffix.name : getPolearmNamePart(POLEARM_NAME_PARTS.ADJECTIVES))
                .replace("{material}", headMaterial.name)
                .replace("{subTypeName}", subType.name)
                .replace("{suffix}", suffixAffix ? suffixAffix.name : "")
                .replace("{adjective}", getPolearmNamePart(POLEARM_NAME_PARTS.ADJECTIVES))
                .replace("{noun_abstract}", getPolearmNamePart(POLEARM_NAME_PARTS.NOUNS_ABSTRACT));
        }
        itemName = itemName.replace(/\s{2,}/g, ' ').trim();
        if (!prefixAffix && !suffixAffix && magicalProperties.length > 0) {
            const firstProp = magicalProperties[0];
            itemName = `${firstProp.name} ${headMaterial.name} ${subType.name}`;
        } else if (magicalProperties.length === 0) {
             if(Math.random() < 0.3 && POLEARM_NAME_PARTS.ADJECTIVES.length > 0) itemName = `The ${getPolearmNamePart(POLEARM_NAME_PARTS.ADJECTIVES)} ${headMaterial.name} ${subType.name}`;
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
            description += ` crafted primarily from ${headMaterialNameFormatted}.`;
        }

        if (magicalProperties.length > 0) {
            description += ` It is imbued with magical properties.`;
        }

        // Add details from artGenerationResult if available
        const artHaftMaterialKeyFromArt = artGenerationResult.itemData?.shaft?.material;
        const artButtCapMaterialKey = artGenerationResult.itemData?.shaft?.buttCapMaterial; // Assuming pixel art returns this

        if (artHaftMaterialKeyFromArt) {
            let artActualHaftMaterialNameToDisplay = formatMaterialNameForDesc(artHaftMaterialKeyFromArt);
            if (artHaftMaterialKeyFromArt.toUpperCase() === "ENCHANTED" && haftMaterial.id.toUpperCase() === "ENCHANTED_METAL") {
                artActualHaftMaterialNameToDisplay = initialHaftMaterialNameFormatted;
            }
            if (artActualHaftMaterialNameToDisplay && artActualHaftMaterialNameToDisplay !== initialHaftMaterialNameFormatted) {
                 description += ` The haft also appears to incorporate ${artActualHaftMaterialNameToDisplay}.`;
            }
        }
        if (artGenerationResult.itemData?.shaft?.hasButtCap && artButtCapMaterialKey) {
            const buttCapName = formatMaterialNameForDesc(artButtCapMaterialKey);
            description += ` It is finished with ${getArticle(buttCapName)} ${buttCapName} butt cap.`;
        }


        if (subType.twoHanded) {
            description += " This long weapon requires two hands to wield effectively, offering superior reach.";
        } else if (subType.id === "SPEAR" || subType.id === "TRIDENT") {
            description += " It can be wielded with one or two hands.";
        }


        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_WEAPON;
        goldValue *= (headMaterial.valueMod || 1.0);
        goldValue *= (SHARED_MATERIALS[haftMaterial.id]?.valueMod || 1.0) * 0.7; // Haft material significant for polearms
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || 20) * (prop.effect.valueMod || 0.1); // Polearms base value for affixes
        });
        if (baseStats.minStrMod > 0) goldValue *= (1 + baseStats.minStrMod * 0.05);
        else if (baseStats.minStrMod < 0) goldValue *= (1 + baseStats.minStrMod * 0.02);
        goldValue = Math.max(1, Math.round(goldValue));

        const finalItem = {
            id: `polearm_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: options.itemCategory || "POLEARMS",
            subType: subType.id,
            equipSlot: subType.equipSlot,
            canBeOffHand: subType.canBeOffHand || false,
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${headMaterial.name} ${subType.name}`,
            rarity: rarity.id,
            material: headMaterial.id, // Primary material is the head's
            materials: {
                head: headMaterial.id,
                haft: haftMaterial.id,
            },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            isTwoHanded: subType.twoHanded || false, // Polearms are often two-handed or versatile
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Polearm: ${finalItem.name} (Rarity: ${finalItem.rarity}, Head: ${headMaterial.name}, Haft: ${haftMaterial.name})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generatePolearmRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/polearms/polearmGenerator.js loaded.");
