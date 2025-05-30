/**
 * magic_item_generator/categories/headwear/headwearGenerator.js
 * Contains the logic to generate a complete Headwear RPG item object (Helmets and Hats).
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    HEADWEAR_SUB_TYPES, HEADWEAR_MATERIALS, HEADWEAR_AFFIXES,
    HEADWEAR_NAME_PARTS, HEADWEAR_NAME_TEMPLATES
} from './headwearDefinitions.js';

// --- IMPORT PIXEL ART GENERATOR ---
import { generateHat as generateHeadwearPixelArt } from '../../../pixel_art_generator/item_api.js';


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
 */
function getArticle(word) {
    if (!word) return "a";
    const firstLetter = word.trim()[0].toLowerCase();
    return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? "an" : "a";
}

/**
 * Generates a headwear RPG item (helmet or hat).
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory="HEADWEAR"] - The category ID.
 * @param {string} [options.itemSubTypeId] - Specific headwear sub-type ID.
 * @param {string} [options.rarityId] - Specific rarity ID.
 * @param {string} [options.materialId] - Specific material ID.
 * @returns {object|null} The generated headwear item object, or null on error.
 */
export function generateHeadwearRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(HEADWEAR_SUB_TYPES));
        const subType = HEADWEAR_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Headwear SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for headwear.");
            return { ...RARITIES.COMMON, name: "Fallback Common Hat", description: "Error determining rarity." };
        }

        // 3. Determine Material
        const applicableMaterials = subType.materials || Object.keys(SHARED_MATERIALS);
        let materialKey = options.materialId && applicableMaterials.includes(options.materialId.toUpperCase())
            ? options.materialId.toUpperCase()
            : getRandomElement(applicableMaterials);

        if (!materialKey || !SHARED_MATERIALS[materialKey]) {
            console.warn(`Material key ${materialKey} not found or not in SHARED_MATERIALS. Defaulting for ${subType.id}`);
            materialKey = applicableMaterials[0] || (subType.mainTypeForArt === "helmet" ? "IRON" : "CLOTH");
        }
        const material = SHARED_MATERIALS[materialKey];
        if (!material || !material.paletteKey) {
            console.error(`Error: Material or paletteKey not found for '${materialKey}'. SubType: ${subType.id}`);
            return null;
        }

        // 4. Generate Pixel Art
        let artGenerationResult = {
            imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            itemData: {}
        };

        const pixelArtOptions = {
            subType: subType.pixelArtSubType, 
            mainType: subType.mainTypeForArt, 
            material: material.paletteKey,
            complexity: rarity.artComplexityHint
        };

        if (typeof generateHeadwearPixelArt === 'function') {
            artGenerationResult = generateHeadwearPixelArt(pixelArtOptions);
        } else {
            console.warn(`Pixel art generator function 'generateHeadwearPixelArt' not found. Using placeholder art.`);
        }

        // 5. Calculate Base RPG Stats & Requirements
        const baseStats = {
            acBonus: subType.baseAcBonus || 0,
            minStrMod: subType.minStrMod !== undefined ? subType.minStrMod : -3,
            minConMod: subType.minConMod !== undefined ? subType.minConMod : -3,
        };
        
        // Apply baseStatsBonuses from definitions (e.g., +1 INT for Wizard Hat)
        if (subType.baseStatsBonuses && Array.isArray(subType.baseStatsBonuses)) {
            subType.baseStatsBonuses.forEach(bonus => {
                if (bonus.type === "attribute_boost") {
                    const attrKey = bonus.attribute.toLowerCase();
                    baseStats[attrKey] = (baseStats[attrKey] || 0) + bonus.value;
                }
                // Add other types of base bonuses here if needed (e.g., mp_boost for certain hats if defined)
            });
        }
        // Note: Robe's baseMpBonus is handled in armorGenerator.js, not here.

        if (material.statModifiers) {
            if (typeof material.statModifiers.acBonus === 'number') baseStats.acBonus += material.statModifiers.acBonus;
            if (typeof material.statModifiers.strReqMod === 'number') baseStats.minStrMod += material.statModifiers.strReqMod;
            if (typeof material.statModifiers.conReqMod === 'number') baseStats.minConMod += material.statModifiers.conReqMod;
        }
        baseStats.minStrMod = Math.max(-3, baseStats.minStrMod);
        baseStats.minConMod = Math.max(-3, baseStats.minConMod);

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
            const pool = isPrefix ? (HEADWEAR_AFFIXES.PREFIXES.MAJOR || []) : (HEADWEAR_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, "HEADWEAR", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (HEADWEAR_AFFIXES.PREFIXES.MINOR || []) : (HEADWEAR_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "HEADWEAR", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }
        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (HEADWEAR_AFFIXES.PREFIXES.MINOR || []) : (HEADWEAR_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "HEADWEAR", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }

        // Apply affix effects to baseStats
        magicalProperties.forEach(prop => {
            if (prop.effect) {
                if (prop.effect.type === "ac_boost") baseStats.acBonus += prop.effect.value;
                else if (prop.effect.type === "hp_boost") baseStats.hp = (baseStats.hp || 0) + prop.effect.value;
                else if (prop.effect.type === "mp_boost") baseStats.baseMpBonus = (baseStats.baseMpBonus || 0) + prop.effect.value;
                else if (prop.effect.type === "attribute_boost") {
                    const attrKey = prop.effect.attribute.toLowerCase();
                    baseStats[attrKey] = (baseStats[attrKey] || 0) + prop.effect.value;
                } else if (prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "STR") baseStats.minStrMod += prop.effect.value;
                else if (prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "CON") baseStats.minConMod += prop.effect.value;
            }
        });
        baseStats.minStrMod = Math.max(-3, baseStats.minStrMod);
        baseStats.minConMod = Math.max(-3, baseStats.minConMod);


        // 7. Generate Name
        let itemName = "";
        const prefixAffixObj = magicalProperties.find(p => p.isPrefix);
        const suffixAffixObj = magicalProperties.find(p => !p.isPrefix && (!prefixAffixObj || p.name !== prefixAffixObj.name));
        const prefixNameStr = prefixAffixObj ? prefixAffixObj.name : "";
        const suffixNameStr = suffixAffixObj ? suffixAffixObj.name : "";

        let baseName = subType.name;
        if (!subType.name.toLowerCase().includes(material.name.toLowerCase()) && 
            !(subType.mainTypeForArt === "hat" && material.name.toLowerCase() === "cloth")) { 
            baseName = `${material.name} ${subType.name}`;
        }
        
        if (prefixNameStr) itemName = `${prefixNameStr} ${baseName}`;
        else itemName = baseName;
        if (suffixNameStr) itemName = `${itemName} ${suffixNameStr}`;

        if (!prefixNameStr && !suffixNameStr && (rarity.id === "COMMON" || rarity.id === "UNCOMMON")) {
            const randomAdj = getRandomElement(HEADWEAR_NAME_PARTS.ADJECTIVES);
            if (randomAdj && !itemName.toLowerCase().includes(randomAdj.toLowerCase())) {
                itemName = `${randomAdj} ${itemName}`;
            }
        }
        itemName = itemName.replace(/\s+/g, ' ').trim();
        if (itemName) itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
        if (!itemName) itemName = `${material.name} ${subType.name}`;


        // 8. Generate Dynamic Description
        let description = `${getArticle(rarity.name)} ${rarity.name.toLowerCase()} ${subType.name.toLowerCase()} made of ${material.name.toLowerCase()}.`;
        
        if (artGenerationResult.itemData) {
            const artData = artGenerationResult.itemData; 
            if (artData.hatType && artData.hatType !== subType.pixelArtSubType) {
                description += ` It has the distinct style of a ${artData.hatType.replace(/_/g, ' ')}.`;
            }
            if (artData.crownShape) {
                 description += ` The crown is ${artData.crownShape.replace(/_/g, ' ')}.`;
            }
            if (artData.brimShape && artData.brimShape !== 'none') {
                description += ` It features a ${artData.brimShape.replace(/_/g, ' ')} brim.`;
            }
            if (artData.visorType && artData.visorType !== 'none') {
                description += ` A ${artData.visorType.replace(/_/g, ' ')} protects the eyes.`;
            }
            if (artData.cheekGuardType && artData.cheekGuardType !== 'none') {
                description += ` ${artData.cheekGuardType.replace(/_/g, ' ')} guard the sides of the face.`;
            }
            if (artData.decorationType && artData.decorationType !== 'none' && artData.decorationMaterial) {
                 const decorMatName = SHARED_MATERIALS[artData.decorationMaterial.toUpperCase()]?.name || artData.decorationMaterial;
                description += ` It's adorned with a ${decorMatName.toLowerCase()} ${artData.decorationType.replace(/_/g, ' ')}.`;
            }
        }

        if (magicalProperties.length > 0) {
            description += ` This headwear is imbued with subtle enchantments.`;
        } else {
            description += ` It offers standard utility for its kind.`;
        }

        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_HEADWEAR;
        goldValue *= (material.valueMod || 1.0);
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_HEADWEAR) * (prop.effect.valueMod || 0.1);
        });
        if (baseStats.minStrMod > 0) goldValue *= (1 + baseStats.minStrMod * 0.02);
        if (baseStats.minConMod > 0) goldValue *= (1 + baseStats.minConMod * 0.02);
        goldValue = Math.max(1, Math.round(goldValue));


        const finalItem = {
            id: `headwear_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: "HEADWEAR",
            subType: subType.id,
            equipSlot: subType.equipSlot,
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${material.name} ${subType.name}`,
            rarity: rarity.id,
            material: material.id,
            materials: { primary: material.id },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Headwear: ${finalItem.name} (Rarity: ${finalItem.rarity}, Material: ${material.name})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateHeadwearRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/headwear/headwearGenerator.js (Corrected baseStatsBonuses loop) loaded.");
