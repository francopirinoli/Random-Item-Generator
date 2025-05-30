/**
 * magic_item_generator/categories/footwear/footwearGenerator.js
 * Contains the logic to generate a complete Footwear RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    FOOTWEAR_SUB_TYPES, FOOTWEAR_MATERIALS, FOOTWEAR_AFFIXES,
    FOOTWEAR_NAME_PARTS, FOOTWEAR_NAME_TEMPLATES
} from './footwearDefinitions.js';

// --- IMPORT PIXEL ART GENERATOR ---
// The pixel art generator for all footwear is generateBoots from boots_generator.js (via item_api.js)
import { generateBoots as generateFootwearPixelArt } from '../../../pixel_art_generator/item_api.js';


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
        const subTypeMatch = !a.subTypes || a.subTypes.includes(itemSubTypeId); // Will usually be BOOTS_GENERIC
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
 * Generates a footwear RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory="FOOTWEAR"] - The category ID.
 * @param {string} [options.itemSubTypeId] - Specific footwear sub-type ID (likely "BOOTS_GENERIC").
 * @param {string} [options.rarityId] - Specific rarity ID.
 * @param {string} [options.materialId] - Specific material ID.
 * @returns {object|null} The generated footwear item object, or null on error.
 */
export function generateFootwearRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type (likely always BOOTS_GENERIC for now)
        const subTypeKey = options.itemSubTypeId || "BOOTS_GENERIC"; // Default to BOOTS_GENERIC
        const subType = FOOTWEAR_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Footwear SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for footwear.");
            return { ...RARITIES.COMMON, name: "Fallback Common Boots", description: "Error determining rarity." };
        }

        // 3. Determine Material
        const applicableMaterials = subType.materials || Object.keys(SHARED_MATERIALS);
        let materialKey = options.materialId && applicableMaterials.includes(options.materialId.toUpperCase())
            ? options.materialId.toUpperCase()
            : getRandomElement(applicableMaterials);

        if (!materialKey || !SHARED_MATERIALS[materialKey]) {
            console.warn(`Material key ${materialKey} not found or not in SHARED_MATERIALS. Defaulting for ${subType.id}`);
            materialKey = applicableMaterials[0] || "LEATHER"; 
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

        // boots_generator.js internally randomizes style (ankle, calf, knee_high), toe, heel, etc.
        // We primarily pass the main material. Other materials can be passed if needed.
        const pixelArtOptions = {
            material: material.paletteKey, // Main material for the boots
            // soleMaterial: (SHARED_MATERIALS[artGenerationResult.itemData?.soleMaterial?.toUpperCase()] || {}).paletteKey,
            // cuffMaterial: (SHARED_MATERIALS[artGenerationResult.itemData?.cuffMaterial?.toUpperCase()] || {}).paletteKey,
            complexity: rarity.artComplexityHint
        };

        if (typeof generateFootwearPixelArt === 'function') {
            artGenerationResult = generateFootwearPixelArt(pixelArtOptions);
        } else {
            console.warn(`Pixel art generator function 'generateFootwearPixelArt' not found. Using placeholder art.`);
        }

        // 5. Calculate Base RPG Stats & Requirements
        const baseStats = {
            acBonus: subType.baseAcBonus || 0,
            minStrMod: subType.minStrMod !== undefined ? subType.minStrMod : -3,
            minConMod: subType.minConMod !== undefined ? subType.minConMod : -3,
        };
        
        // Apply random attribute bonus if defined in subType
        if (subType.randomAttributeBonus && subType.randomAttributeBonus.attributes && subType.randomAttributeBonus.attributes.length > 0) {
            const randomAttr = getRandomElement(subType.randomAttributeBonus.attributes);
            const bonusValue = subType.randomAttributeBonus.value || 1;
            const attrKey = randomAttr.toLowerCase();
            baseStats[attrKey] = (baseStats[attrKey] || 0) + bonusValue;
            console.log(`Applied random base bonus: +${bonusValue} ${attrKey.toUpperCase()} to ${subType.id}`);
        }

        if (material.statModifiers) {
            if (typeof material.statModifiers.acBonus === 'number') baseStats.acBonus += material.statModifiers.acBonus;
            if (typeof material.statModifiers.strReqMod === 'number') baseStats.minStrMod += material.statModifiers.strReqMod;
            if (typeof material.statModifiers.conReqMod === 'number') baseStats.minConMod += material.statModifiers.conReqMod;
            // Add other material stat mods like movement speed if applicable
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
            const pool = isPrefix ? (FOOTWEAR_AFFIXES.PREFIXES.MAJOR || []) : (FOOTWEAR_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, "FOOTWEAR", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (FOOTWEAR_AFFIXES.PREFIXES.MINOR || []) : (FOOTWEAR_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "FOOTWEAR", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }
        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (FOOTWEAR_AFFIXES.PREFIXES.MINOR || []) : (FOOTWEAR_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "FOOTWEAR", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }

        // Apply affix effects to baseStats
        magicalProperties.forEach(prop => {
            if (prop.effect) {
                if (prop.effect.type === "ac_boost") baseStats.acBonus += prop.effect.value;
                else if (prop.effect.type === "hp_boost") baseStats.hp = (baseStats.hp || 0) + prop.effect.value;
                else if (prop.effect.type === "attribute_boost") {
                    const attrKey = prop.effect.attribute.toLowerCase();
                    baseStats[attrKey] = (baseStats[attrKey] || 0) + prop.effect.value;
                } else if (prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "STR") baseStats.minStrMod += prop.effect.value;
                else if (prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "CON") baseStats.minConMod += prop.effect.value;
                // Movement speed and other special effects are usually not directly altering baseStats here, but listed in magicalProperties
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

        let baseName = subType.name; // e.g., "Boots"
        if (!subType.name.toLowerCase().includes(material.name.toLowerCase())) {
            baseName = `${material.name} ${subType.name}`;
        }
        
        if (prefixNameStr) itemName = `${prefixNameStr} ${baseName}`;
        else itemName = baseName;
        if (suffixNameStr) itemName = `${itemName} ${suffixNameStr}`;

        if (!prefixNameStr && !suffixNameStr && magicalProperties.length === 0 && (rarity.id === "COMMON" || rarity.id === "UNCOMMON")) {
            const randomAdj = getRandomElement(FOOTWEAR_NAME_PARTS.ADJECTIVES);
            if (randomAdj && !itemName.toLowerCase().includes(randomAdj.toLowerCase())) {
                itemName = `${randomAdj} ${itemName}`;
            }
        }
        itemName = itemName.replace(/\s+/g, ' ').trim();
        if (itemName) itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
        if (!itemName) itemName = `${material.name} ${subType.name}`;


        // 8. Generate Dynamic Description
        let description = `${getArticle(rarity.name)} pair of ${rarity.name.toLowerCase()} ${material.name.toLowerCase()} boots.`;
        
        if (artGenerationResult.itemData) {
            const artData = artGenerationResult.itemData;
            description += ` These are ${artData.style ? artData.style.replace('_', '-') : 'standard'} boots`;
            if (artData.toeShape) description += ` with a ${artData.toeShape} toe`;
            if (artData.heelStyle && artData.heelStyle !== 'none') description += `, and ${getArticle(artData.heelStyle)} ${artData.heelStyle.replace('_', ' ')} heel`;
            description += ".";
            if (artData.hasCuff && artData.cuffMaterial) {
                description += ` They feature a ${SHARED_MATERIALS[artData.cuffMaterial.toUpperCase()]?.name.toLowerCase() || artData.cuffMaterial} cuff.`;
            }
            if (artData.hasBuckles && artData.numBuckles > 0 && artData.buckleMaterial) {
                description += ` ${artData.numBuckles} ${SHARED_MATERIALS[artData.buckleMaterial.toUpperCase()]?.name.toLowerCase() || artData.buckleMaterial} buckle${artData.numBuckles > 1 ? 's' : ''} adorn the side.`;
            }
        }

        if (magicalProperties.length > 0) {
            description += ` They feel unusually light and are imbued with enchantments.`;
        } else {
            description += ` They look sturdy and reliable for travel.`;
        }

        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_FOOTWEAR;
        goldValue *= (material.valueMod || 1.0);
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_FOOTWEAR) * (prop.effect.valueMod || 0.1);
        });
        if (baseStats.minStrMod > 0) goldValue *= (1 + baseStats.minStrMod * 0.01); // STR req less impactful for boots
        if (baseStats.minConMod > 0) goldValue *= (1 + baseStats.minConMod * 0.01);
        goldValue = Math.max(1, Math.round(goldValue));


        const finalItem = {
            id: `footwear_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: "FOOTWEAR",
            subType: subType.id,
            equipSlot: subType.equipSlot,
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${material.name} ${subType.name}`,
            rarity: rarity.id,
            material: material.id,
            materials: { 
                primary: material.id,
                sole: artGenerationResult.itemData?.soleMaterial?.toUpperCase() || null,
                cuff: artGenerationResult.itemData?.cuffMaterial?.toUpperCase() || null,
                buckle: artGenerationResult.itemData?.buckleMaterial?.toUpperCase() || null,
            },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Footwear: ${finalItem.name} (Rarity: ${finalItem.rarity}, Material: ${material.name})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateFootwearRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/footwear/footwearGenerator.js loaded.");
