/**
 * magic_item_generator/categories/blunt/bluntGenerator.js
 * Contains the logic to generate a complete Blunt Weapon RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    BLUNT_SUB_TYPES, BLUNT_MATERIALS, BLUNT_AFFIXES,
    BLUNT_NAME_PARTS, BLUNT_NAME_TEMPLATES,
    BLUNT_HAFT_MATERIALS, BLUNT_GRIP_MATERIALS
} from './bluntDefinitions.js';

// --- IMPORT PIXEL ART GENERATOR ---
// Ensure generateBluntWeapon is exported from your item_api.js
import { generateBluntWeapon as generateBluntWeaponPixelArt } from '../../../pixel_art_generator/item_api.js';


/**
 * Helper function to select a random affix from a given pool.
 * (This is identical to the one in sword/axe generators; consider moving to a shared utility)
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
 * (Identical to sword/axe generators; consider moving to shared utility)
 */
function getArticle(word) {
    if (!word) return "a";
    const firstLetter = word.trim()[0].toLowerCase();
    return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? "an" : "a";
}

/**
 * Helper function to format material names for descriptions.
 * (Identical to sword/axe generators; consider moving to shared utility)
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
 * Generates a blunt weapon RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory] - The category ID for this item (e.g., "BLUNT_WEAPONS").
 * @param {string} [options.itemSubTypeId] - Specific blunt weapon sub-type ID (e.g., "MACE_STANDARD").
 * @param {string} [options.rarityId] - Specific rarity ID (e.g., "RARE").
 * @param {string} [options.materialId] - Specific material ID for the weapon head (e.g., "STEEL").
 * @returns {object|null} The generated blunt weapon item object, or null on error.
 */
export function generateBluntWeaponRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(BLUNT_SUB_TYPES));
        const subType = BLUNT_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Blunt Weapon SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for blunt weapon.");
            return { ...RARITIES.COMMON, name: "Fallback Common Club", description: "Error determining rarity." };
        }

        // 3. Determine Materials for Head and Haft
        const applicableHeadMaterials = subType.materials || Object.keys(SHARED_MATERIALS);
        const headMaterialKey = options.materialId && applicableHeadMaterials.includes(options.materialId) ? options.materialId : getRandomElement(applicableHeadMaterials);
        const headBaseMaterialProps = SHARED_MATERIALS[headMaterialKey] || {};
        const headBluntSpecificMaterialProps = BLUNT_MATERIALS[headMaterialKey] || {};
        const headMaterial = {
            ...headBaseMaterialProps,
            ...headBluntSpecificMaterialProps,
            id: headMaterialKey,
            name: headBaseMaterialProps.name || headMaterialKey,
            paletteKey: headBaseMaterialProps.paletteKey,
            statModifiers: { ...(headBaseMaterialProps.statModifiers || {}), ...(headBluntSpecificMaterialProps.statModifiers || {}) }
        };
        if (!headMaterial.paletteKey) {
            console.error(`Error: Blunt Weapon Head Material or paletteKey not found for '${headMaterialKey}'. Using STEEL as fallback.`);
            const fallbackMat = SHARED_MATERIALS["STEEL"];
            Object.assign(headMaterial, { id: "STEEL", name: fallbackMat.name, paletteKey: fallbackMat.paletteKey, statModifiers: fallbackMat.statModifiers });
        }

        const haftMaterialKey = getRandomElement(BLUNT_HAFT_MATERIALS);
        const haftMaterial = SHARED_MATERIALS[haftMaterialKey] || SHARED_MATERIALS["WOOD"];

        // Grip material might be determined by pixel art generator's `shaftStyle`
        // For now, we'll let the pixel art generator handle grip visuals based on its internal logic.
        // The RPG item will store the primary haft material.

        // 4. Generate Pixel Art
        let artGenerationResult = { imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", itemData: {} };
        if (typeof generateBluntWeaponPixelArt === 'function') {
            artGenerationResult = generateBluntWeaponPixelArt({
                subType: subType.pixelArtSubType, // e.g., "club", "mace", "hammer"
                material: headMaterial.paletteKey, // For the weapon head
                haftMaterial: haftMaterial.paletteKey, // For the haft/handle
                complexity: rarity.artComplexityHint
            });
        } else {
            console.warn(`Pixel art generator function 'generateBluntWeaponPixelArt' not found. Using placeholder.`);
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
            const pool = isPrefix ? (BLUNT_AFFIXES.PREFIXES.MAJOR || []) : (BLUNT_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "BLUNT_WEAPONS", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (BLUNT_AFFIXES.PREFIXES.MINOR || []) : (BLUNT_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "BLUNT_WEAPONS", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }

        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            console.warn(`RARE blunt weapon initially got no affixes. Forcing one minor affix.`);
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (BLUNT_AFFIXES.PREFIXES.MINOR || []) : (BLUNT_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "BLUNT_WEAPONS", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) {
                magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
            } else {
                const isPrefixMajor = Math.random() < 0.5;
                const poolMajor = isPrefixMajor ? (BLUNT_AFFIXES.PREFIXES.MAJOR || []) : (BLUNT_AFFIXES.SUFFIXES.MAJOR || []);
                const affixMajor = selectAffixFromPool(poolMajor, options.itemCategory || "BLUNT_WEAPONS", subType.id, rarity.id, usedAffixNames, "MAJOR");
                if (affixMajor) {
                     magicalProperties.push({ ...affixMajor, isPrefix: isPrefixMajor, tier: "MAJOR" });
                } else {
                    console.warn("RARE blunt weapon could not be enchanted even with fallback.");
                }
            }
        }

        magicalProperties.forEach(prop => {
            if (prop.effect && prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "STR") {
                baseStats.minStrMod += prop.effect.value;
            }
            // TODO: Apply other blunt-specific affix effects to baseStats
        });

        // 7. Generate Name
        let itemName = "";
        const prefixAffix = magicalProperties.find(p => p.isPrefix);
        const suffixAffix = magicalProperties.find(p => !p.isPrefix && (!prefixAffix || p.name !== prefixAffix.name));
        const nameTemplatePool = BLUNT_NAME_TEMPLATES || SHARED_NAME_TEMPLATES.GENERIC;
        let nameTemplate = getRandomElement(nameTemplatePool);
        const getBluntNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";
        let prefixWord = getBluntNamePart(BLUNT_NAME_PARTS.PREFIX_WORDS);
        let suffixWord = getBluntNamePart(BLUNT_NAME_PARTS.SUFFIX_WORDS);

        if (nameTemplate === "{prefix_word}{suffix_word}") {
            itemName = prefixWord + suffixWord;
        } else if (nameTemplate === "{adjective} {prefix_word} {subTypeName_root_alt}") {
            let root = subType.name.replace(/Warhammer|Morningstar|Mace|Club/i, '').trim();
            if (!root || root.toLowerCase() === subType.name.toLowerCase()) root = subType.name.split(" ").pop(); // "Hammer", "Star", "Mace", "Club"
            if (!root) root = "Weapon";
            const adj = getBluntNamePart(BLUNT_NAME_PARTS.ADJECTIVES);
            itemName = `${adj} ${prefixWord}${prefixWord && root ? " " : ""}${root}`;
        } else {
            itemName = nameTemplate
                .replace("{prefix}", prefixAffix ? prefixAffix.name : getBluntNamePart(BLUNT_NAME_PARTS.ADJECTIVES))
                .replace("{material}", headMaterial.name) // Name uses head material
                .replace("{subTypeName}", subType.name)
                .replace("{suffix}", suffixAffix ? suffixAffix.name : "")
                .replace("{adjective}", getBluntNamePart(BLUNT_NAME_PARTS.ADJECTIVES))
                .replace("{noun_abstract}", getBluntNamePart(BLUNT_NAME_PARTS.NOUNS_ABSTRACT));
        }
        itemName = itemName.replace(/\s{2,}/g, ' ').trim();
        if (!prefixAffix && !suffixAffix && magicalProperties.length > 0) {
            const firstProp = magicalProperties[0];
            itemName = `${firstProp.name} ${headMaterial.name} ${subType.name}`;
        } else if (magicalProperties.length === 0) {
             if(Math.random() < 0.3 && BLUNT_NAME_PARTS.ADJECTIVES.length > 0) itemName = `The ${getBluntNamePart(BLUNT_NAME_PARTS.ADJECTIVES)} ${headMaterial.name} ${subType.name}`;
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
        const artPommelShapeKey = artGenerationResult.itemData?.shaft?.pommelShape; // Assuming pixel art generator returns this
        const artShaftStyle = artGenerationResult.itemData?.shaft?.style; // Assuming pixel art generator returns this

        if (artHaftMaterialKeyFromArt) {
            let artActualHaftMaterialNameToDisplay = formatMaterialNameForDesc(artHaftMaterialKeyFromArt);
            if (artHaftMaterialKeyFromArt.toUpperCase() === "ENCHANTED" && haftMaterial.id.toUpperCase() === "ENCHANTED_METAL") {
                artActualHaftMaterialNameToDisplay = initialHaftMaterialNameFormatted;
            }
            if (artActualHaftMaterialNameToDisplay && artActualHaftMaterialNameToDisplay !== initialHaftMaterialNameFormatted) {
                 description += ` The haft also appears to incorporate ${artActualHaftMaterialNameToDisplay}.`;
            }
        }
        if (artShaftStyle && artShaftStyle !== 'plain' && !description.toLowerCase().includes(artShaftStyle.replace('_', ' '))) {
            description += ` The haft features a ${artShaftStyle.replace(/_/g, ' ')}.`;
        }

        if(artPommelShapeKey && artPommelShapeKey !== 'none') {
            const formattedPommelShape = artPommelShapeKey.replace(/_/g, ' ');
            if (formattedPommelShape.toLowerCase().includes('pommel')) {
                description += ` It is finished with ${getArticle(formattedPommelShape)} ${formattedPommelShape}.`;
            } else {
                description += ` It is finished with ${getArticle(formattedPommelShape)} ${formattedPommelShape} pommel.`;
            }
        }

        if (subType.twoHanded) {
            description += " This weapon requires two hands to wield effectively.";
        }


        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_WEAPON;
        goldValue *= (headMaterial.valueMod || 1.0);
        goldValue *= (SHARED_MATERIALS[haftMaterial.id]?.valueMod || 1.0) * 0.5; // Haft material less impactful
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || 15) * (prop.effect.valueMod || 0.1);
        });
        if (baseStats.minStrMod > 0) goldValue *= (1 + baseStats.minStrMod * 0.06);
        else if (baseStats.minStrMod < 0) goldValue *= (1 + baseStats.minStrMod * 0.03);
        goldValue = Math.max(1, Math.round(goldValue));

        const finalItem = {
            id: `blunt_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: options.itemCategory || "BLUNT_WEAPONS",
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
                // grip: gripMaterialKey, // If you decide to explicitly track grip material
            },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            isTwoHanded: subType.twoHanded || false,
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Blunt Weapon: ${finalItem.name} (Rarity: ${finalItem.rarity}, Head: ${headMaterial.name}, Haft: ${haftMaterial.name})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateBluntWeaponRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/blunt/bluntGenerator.js loaded.");
