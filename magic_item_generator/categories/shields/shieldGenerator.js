/**
 * magic_item_generator/categories/shields/shieldGenerator.js
 * Contains the logic to generate a complete Shield RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    SHIELD_SUB_TYPES, SHIELD_MATERIALS, SHIELD_AFFIXES,
    SHIELD_NAME_PARTS, SHIELD_NAME_TEMPLATES
} from './shieldDefinitions.js';

// --- IMPORT PIXEL ART GENERATOR ---
import { generateShield as generateShieldPixelArt } from '../../../pixel_art_generator/item_api.js';


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
 * Generates a shield RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory="SHIELD"] - The category ID for this item.
 * @param {string} [options.itemSubTypeId] - Specific shield sub-type ID (e.g., "BUCKLER", "TOWER_SHIELD").
 * @param {string} [options.rarityId] - Specific rarity ID (e.g., "RARE").
 * @param {string} [options.materialId] - Specific material ID (e.g., "WOOD", "STEEL").
 * @returns {object|null} The generated shield item object, or null on error.
 */
export function generateShieldRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(SHIELD_SUB_TYPES));
        const subType = SHIELD_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Shield SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for shield.");
            return { ...RARITIES.COMMON, name: "Fallback Common Shield", description: "Error determining rarity." };
        }

        // 3. Determine Material
        const applicableMaterials = subType.materials || Object.keys(SHARED_MATERIALS);
        let materialKey = options.materialId && applicableMaterials.includes(options.materialId.toUpperCase())
            ? options.materialId.toUpperCase()
            : getRandomElement(applicableMaterials);

        if (!materialKey || !SHARED_MATERIALS[materialKey]) {
            console.warn(`Material key ${materialKey} not found or not in SHARED_MATERIALS. Defaulting for ${subType.id}`);
            materialKey = applicableMaterials[0] || "WOOD"; // Fallback to first applicable or wood
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
            subType: subType.pixelArtSubType, // e.g., "round", "kite", "tower"
            material: material.paletteKey,    // e.g., "WOOD", "STEEL"
            complexity: rarity.artComplexityHint,
            // Pass other shield-specific visual options if the pixel art generator supports them
            // e.g., towerStyle, heaterTopBorderStyle, decorationType, gemPresence
        };
        // Example of passing more specific details if your shield_generator.js uses them:
        if (subType.pixelArtSubType === 'tower' && artGenerationResult.itemData?.towerStyle) {
            pixelArtOptions.towerStyle = artGenerationResult.itemData.towerStyle;
        }
        if (subType.pixelArtSubType === 'heater' && artGenerationResult.itemData?.heaterTopBorderStyle) {
            pixelArtOptions.heaterTopBorderStyle = artGenerationResult.itemData.heaterTopBorderStyle;
        }


        if (typeof generateShieldPixelArt === 'function') {
            artGenerationResult = generateShieldPixelArt(pixelArtOptions);
        } else {
            console.warn(`Pixel art generator function 'generateShieldPixelArt' not found. Using placeholder art.`);
        }


        // 5. Calculate Base RPG Stats & Requirements
        let currentMinStrMod = subType.minStrMod !== undefined ? subType.minStrMod : 0;
        let currentMinConMod = subType.minConMod !== undefined ? subType.minConMod : 0;

        if (material.statModifiers) {
            if (typeof material.statModifiers.strReqMod === 'number') {
                currentMinStrMod += material.statModifiers.strReqMod;
            }
            if (typeof material.statModifiers.conReqMod === 'number') { // Assuming materials can affect CON req
                currentMinConMod += material.statModifiers.conReqMod;
            }
        }

        const baseStats = {
            acBonus: subType.baseAcBonus || 0,
            minStrMod: currentMinStrMod,
            minConMod: currentMinConMod,
            // Shields typically don't have weight as an RPG stat in simple systems, but could be added
        };

        if (material.statModifiers && typeof material.statModifiers.acBonus === 'number') {
            baseStats.acBonus += material.statModifiers.acBonus;
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
            const pool = isPrefix ? (SHIELD_AFFIXES.PREFIXES.MAJOR || []) : (SHIELD_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, "SHIELD", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (SHIELD_AFFIXES.PREFIXES.MINOR || []) : (SHIELD_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "SHIELD", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }
         if (rarity.id === "RARE" && magicalProperties.length === 0) { // Ensure RARE shields get at least one affix
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (SHIELD_AFFIXES.PREFIXES.MINOR || []) : (SHIELD_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "SHIELD", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }


        // Apply affix effects to baseStats
        magicalProperties.forEach(prop => {
            if (prop.effect) {
                if (prop.effect.type === "ac_boost") {
                    baseStats.acBonus += prop.effect.value;
                } else if (prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "STR") {
                    baseStats.minStrMod += prop.effect.value;
                } else if (prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "CON") {
                    baseStats.minConMod += prop.effect.value;
                }
                // Other effects (HP, saves, resistances) are primarily listed in magicalProperties
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
        const getNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";

        let baseName = subType.name; // e.g., "Buckler", "Tower Shield"
        if (!subType.name.toLowerCase().includes(material.name.toLowerCase())) {
            baseName = `${material.name} ${subType.name}`;
        }

        if (prefixNameStr) {
            itemName = `${prefixNameStr} ${baseName}`;
        } else {
            itemName = baseName;
        }
        if (suffixNameStr) {
            itemName = `${itemName} ${suffixNameStr}`;
        }

        // If no affixes, try a descriptive adjective for common/uncommon
        if (!prefixNameStr && !suffixNameStr && (rarity.id === "COMMON" || rarity.id === "UNCOMMON")) {
            const randomAdj = getNamePart(SHIELD_NAME_PARTS.ADJECTIVES);
            if (randomAdj && !itemName.toLowerCase().includes(randomAdj.toLowerCase())) {
                itemName = `${randomAdj} ${itemName}`;
            }
        }
        
        itemName = itemName.replace(/\s+/g, ' ').trim();
        if (itemName) itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
        if (!itemName) itemName = `${material.name} ${subType.name}`; // Absolute fallback


        // 8. Generate Dynamic Description
        let description = `${getArticle(rarity.name)} ${rarity.name.toLowerCase()} ${subType.name.toLowerCase()} made of ${material.name.toLowerCase()}.`;
        
        if (artGenerationResult.itemData) {
            const artData = artGenerationResult.itemData;
            if (artData.shape && artData.shape !== subType.pixelArtSubType) { // If pixel art chose a different shape variant
                description += ` It has ${getArticle(artData.shape)} ${artData.shape.replace(/_/g, ' ')} form.`;
            }
            if (artData.towerStyle && subType.pixelArtSubType === 'tower') {
                description += ` The tower shield is of a ${artData.towerStyle.replace(/_/g, ' ')} design.`;
            }
            if (artData.heaterTopBorderStyle && subType.pixelArtSubType === 'heater') {
                description += ` Its top edge is fashioned in a ${artData.heaterTopBorderStyle.replace(/_/g, ' ')} style.`;
            }
            if (artData.decoration && artData.decoration.type && artData.decoration.type !== 'none') {
                let decorMaterialName = artData.decoration.material || "unknown material";
                if (artData.decoration.colors && artData.decoration.colors.name) {
                    decorMaterialName = artData.decoration.colors.name;
                }
                description += ` It is adorned with ${getArticle(decorMaterialName)} ${decorMaterialName.toLowerCase()} ${artData.decoration.type.replace(/_/g, ' ')}.`;
                if (artData.decoration.hasGem && artData.decoration.gemColor) {
                    description += ` A ${artData.decoration.gemColor} gem is set into the decoration.`;
                }
            }
        }

        if (magicalProperties.length > 0) {
            description += ` This shield radiates a protective aura.`;
        } else {
            description += ` It provides reliable defense.`;
        }


        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_SHIELD;
        goldValue *= (material.valueMod || 1.0);
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_SHIELD) * (prop.effect.valueMod || 0.1);
        });
        if (baseStats.minStrMod > 0) goldValue *= (1 + baseStats.minStrMod * 0.03);
        if (baseStats.minConMod > 0) goldValue *= (1 + baseStats.minConMod * 0.03);
        goldValue = Math.max(1, Math.round(goldValue));


        const finalItem = {
            id: `shield_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: "SHIELD", // Main category
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

        console.log(`Generated Shield: ${finalItem.name} (Rarity: ${finalItem.rarity}, Material: ${material.name})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateShieldRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/shields/shieldGenerator.js loaded.");
