/**
 * magic_item_generator/categories/armor/armorGenerator.js
 * Contains the logic to generate a complete Armor RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    ARMOR_SUB_TYPES, ARMOR_MATERIALS, ARMOR_AFFIXES,
    ARMOR_NAME_PARTS, ARMOR_NAME_TEMPLATES
} from './armorDefinitions.js';

import { generateArmor as generateArmorPixelArt, generateRobe as generateRobePixelArt } from '../../../pixel_art_generator/item_api.js';


/**
 * Helper function to select a random affix from a given pool.
 * @param {Array} pool - The array of affix objects to choose from.
 * @param {string} itemCategory - The category of the item (e.g., "ARMOR").
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
 * Generates an armor RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory="ARMOR"] - The category ID for this item.
 * @param {string} [options.itemSubTypeId] - Specific armor sub-type ID (e.g., "ROBE", "FULL_PLATE_ARMOR").
 * @param {string} [options.rarityId] - Specific rarity ID (e.g., "RARE").
 * @param {string} [options.materialId] - Specific material ID (e.g., "STEEL", "CLOTH").
 * @returns {object|null} The generated armor item object, or null on error.
 */
export function generateArmorRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(ARMOR_SUB_TYPES));
        const subType = ARMOR_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Armor SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for armor.");
            return { ...RARITIES.COMMON, name: "Fallback Common Armor", description: "Error determining rarity." };
        }

        // 3. Determine Material
        const applicableMaterials = subType.materials || Object.keys(SHARED_MATERIALS);
        let materialKey = options.materialId && applicableMaterials.includes(options.materialId.toUpperCase())
            ? options.materialId.toUpperCase()
            : getRandomElement(applicableMaterials);

        if (!materialKey || !SHARED_MATERIALS[materialKey]) {
            console.warn(`Material key ${materialKey} not found or not in SHARED_MATERIALS. Defaulting for ${subType.id}`);
            materialKey = applicableMaterials[0] || "CLOTH";
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

        let chosenPixelArtSubType = subType.pixelArtSubType;
        if (Array.isArray(subType.pixelArtSubType)) {
            chosenPixelArtSubType = getRandomElement(subType.pixelArtSubType);
        }

        const pixelArtOptions = {
            subType: chosenPixelArtSubType,
            material: material.paletteKey,
            complexity: rarity.artComplexityHint
        };
         if (subType.pixelArtGeneratorKey === "generateRobe" && artGenerationResult.itemData) {
             pixelArtOptions.robeBodyStyle = artGenerationResult.itemData.robeBodyStyle || getRandomElement(['a_line', 'flowing']);
             pixelArtOptions.sleeveType = artGenerationResult.itemData.sleeveType || getRandomElement(['straight', 'flared']);
             pixelArtOptions.hasHood = artGenerationResult.itemData.hasHood !== undefined ? artGenerationResult.itemData.hasHood : Math.random() < 0.5;
             pixelArtOptions.hoodUp = artGenerationResult.itemData.hoodUp !== undefined ? artGenerationResult.itemData.hoodUp : Math.random() < 0.5;
        }


        if (subType.pixelArtGeneratorKey === "generateRobe" && typeof generateRobePixelArt === 'function') {
            artGenerationResult = generateRobePixelArt(pixelArtOptions);
        } else if (subType.pixelArtGeneratorKey === "generateArmor" && typeof generateArmorPixelArt === 'function') {
            artGenerationResult = generateArmorPixelArt(pixelArtOptions);
        } else {
            console.warn(`Pixel art generator function '${subType.pixelArtGeneratorKey}' not found or not specified for ${subType.id}. Using placeholder art.`);
        }


        // 5. Calculate Base RPG Stats & Requirements
        let currentMinStrMod = subType.minStrMod !== undefined ? subType.minStrMod : -3;
        if (material.statModifiers && typeof material.statModifiers.strReqMod === 'number') {
            currentMinStrMod += material.statModifiers.strReqMod;
        }
        
        let currentMinConMod = subType.minConMod !== undefined ? subType.minConMod : -3;
        if (material.statModifiers && typeof material.statModifiers.conReqMod === 'number') {
            currentMinConMod += material.statModifiers.conReqMod;
        }

        const baseStats = {
            acBonus: subType.baseAcBonus || 0,
            minStrMod: currentMinStrMod,
        };
        if (subType.minConMod !== undefined) {
            baseStats.minConMod = currentMinConMod;
        }
        if (subType.baseMpBonus !== undefined) {
            baseStats.baseMpBonus = subType.baseMpBonus;
        }


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
            const pool = isPrefix ? (ARMOR_AFFIXES.PREFIXES.MAJOR || []) : (ARMOR_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, "ARMOR", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (ARMOR_AFFIXES.PREFIXES.MINOR || []) : (ARMOR_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "ARMOR", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }

        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            console.warn(`RARE armor (${subType.name}) initially got no affixes. Forcing one minor affix.`);
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (ARMOR_AFFIXES.PREFIXES.MINOR || []) : (ARMOR_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, "ARMOR", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) {
                magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
            } else {
                 const isPrefixMajor = Math.random() < 0.5;
                const poolMajor = isPrefixMajor ? (ARMOR_AFFIXES.PREFIXES.MAJOR || []) : (ARMOR_AFFIXES.SUFFIXES.MAJOR || []);
                const affixMajor = selectAffixFromPool(poolMajor, "ARMOR", subType.id, rarity.id, usedAffixNames, "MAJOR");
                if (affixMajor) {
                     magicalProperties.push({ ...affixMajor, isPrefix: isPrefixMajor, tier: "MAJOR" });
                } else {
                    console.warn(`RARE armor (${subType.name}) could not be enchanted even with fallback.`);
                }
            }
        }

        magicalProperties.forEach(prop => {
            if (prop.effect) {
                if (prop.effect.type === "ac_boost") {
                    baseStats.acBonus += prop.effect.value;
                } else if (prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "STR") {
                    baseStats.minStrMod += prop.effect.value;
                } else if (prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "CON") {
                    if (baseStats.minConMod === undefined) baseStats.minConMod = 0;
                    baseStats.minConMod += prop.effect.value;
                } else if (prop.effect.type === "mp_boost") {
                    baseStats.baseMpBonus = (baseStats.baseMpBonus || 0) + prop.effect.value;
                }
            }
        });
        baseStats.minStrMod = Math.max(-3, baseStats.minStrMod);
        if (baseStats.minConMod !== undefined) {
            baseStats.minConMod = Math.max(-3, baseStats.minConMod);
        }

        // 7. Generate Name
        let itemName = "";
        const prefixAffixObj = magicalProperties.find(p => p.isPrefix);
        const suffixAffixObj = magicalProperties.find(p => !p.isPrefix && (!prefixAffixObj || p.name !== prefixAffixObj.name));
        
        const prefixNameStr = prefixAffixObj ? prefixAffixObj.name : "";
        const suffixNameStr = suffixAffixObj ? suffixAffixObj.name : "";

        const materialName = material.name;
        const subTypeName = subType.name;
        const materialLower = materialName.toLowerCase();
        const subTypeLower = subTypeName.toLowerCase();
        const getNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";


        if (subType.id === "LEATHER_ARMOR" || subType.id === "STUDDED_LEATHER_ARMOR") {
            itemName = subTypeName; // Start with "Leather Armor" or "Studded Leather Armor"
            let materialPrefix = "";

            if (materialLower !== "leather" && materialLower.includes("leather")) {
                // Extract "Dark" from "Dark Leather", "Red" from "Red Leather"
                materialPrefix = materialName.replace(/leather/gi, '').trim();
            }
            
            // Prepend material prefix if it's not empty and not already the start of subTypeName
            // (e.g. material "Studded Leather", subType "Studded Leather Armor" - don't prepend "Studded")
            if (materialPrefix && !subTypeLower.startsWith(materialPrefix.toLowerCase())) {
                itemName = `${materialPrefix} ${itemName}`;
            }

            // Add adjective for non-magical common/uncommon items
            if (!prefixNameStr && !suffixNameStr && (rarity.id === "COMMON" || rarity.id === "UNCOMMON")) {
                let randomAdj = getNamePart(ARMOR_NAME_PARTS.ADJECTIVES);
                if (randomAdj) {
                    const randomAdjLower = randomAdj.toLowerCase();
                    // Check against current item name (which includes material prefix and subType)
                    // and also against "studded" if it's studded leather
                    let isAdjRedundant = itemName.toLowerCase().includes(randomAdjLower);
                    if (subType.id === "STUDDED_LEATHER_ARMOR" && randomAdjLower === "studded") {
                        isAdjRedundant = true;
                    }
                    if (materialPrefix && materialPrefix.toLowerCase().includes(randomAdjLower)) {
                        isAdjRedundant = true;
                    }
                    if (!isAdjRedundant) {
                        itemName = `${randomAdj} ${itemName}`;
                    }
                }
            }
            // Prepend prefix affix if it exists and is not redundant
            if (prefixNameStr && !itemName.toLowerCase().includes(prefixNameStr.toLowerCase())) {
                 if (!(prefixNameStr.toLowerCase() === "studded" && subType.id === "STUDDED_LEATHER_ARMOR")) {
                    itemName = `${prefixNameStr} ${itemName}`;
                 }
            }
            // Append suffix affix if it exists
            if (suffixNameStr && !itemName.toLowerCase().includes(suffixNameStr.toLowerCase())) {
                itemName = `${itemName} ${suffixNameStr}`;
            }

        } else { // General handling for other armor types
            let nameParts = [];
            let adjectiveUsedAsPrefix = false;
            let currentAdjective = getNamePart(ARMOR_NAME_PARTS.ADJECTIVES) || "";
            let effectivePrefix = prefixNameStr;

            if (prefixNameStr) {
                if (subTypeLower.includes(prefixNameStr.toLowerCase()) || materialLower.includes(prefixNameStr.toLowerCase())) {
                    effectivePrefix = ""; 
                }
            }
            
            if (!effectivePrefix && currentAdjective) {
                 if (!subTypeLower.includes(currentAdjective.toLowerCase()) && !materialLower.includes(currentAdjective.toLowerCase())) {
                    effectivePrefix = currentAdjective;
                    adjectiveUsedAsPrefix = true;
                 } else {
                    currentAdjective = ""; 
                 }
            }

            if (effectivePrefix) nameParts.push(effectivePrefix);

            if (!subTypeLower.includes(materialLower) && (effectivePrefix === "" || !effectivePrefix.toLowerCase().includes(materialLower))) {
                nameParts.push(materialName);
            }
            
            nameParts.push(subTypeName);

            if (suffixNameStr && !subTypeLower.includes(suffixNameStr.toLowerCase()) && (effectivePrefix === "" || !effectivePrefix.toLowerCase().includes(suffixNameStr.toLowerCase())) && !materialLower.includes(suffixNameStr.toLowerCase())) {
                nameParts.push(suffixNameStr);
            }
            
            itemName = nameParts.join(" ");

            if (nameParts.length <= 1 && (prefixNameStr || suffixNameStr)) {
                itemName = `${prefixNameStr} ${materialName} ${subTypeName} ${suffixNameStr}`;
            } else if (nameParts.length === 0) {
                 itemName = `${materialName} ${subTypeName}`;
            }
        }
        
        itemName = itemName.replace(/\s+/g, ' ').trim();
        if (itemName) {
            itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
        }
        if (!itemName || itemName.length < 3) {
            itemName = `${prefixNameStr} ${material.name} ${subType.name} ${suffixNameStr}`.replace(/\s+/g, ' ').trim();
            if (itemName) itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
            if (!itemName) itemName = `${material.name} ${subType.name}`; // Absolute fallback
        }


        // 8. Generate Dynamic Description
        let description = `${getArticle(rarity.name)} ${rarity.name.toLowerCase()} ${subType.name.toLowerCase()} crafted from ${material.name.toLowerCase()}.`;

        if (artGenerationResult.itemData) {
            if (subType.pixelArtGeneratorKey === "generateRobe") {
                const robeData = artGenerationResult.itemData;
                if (robeData.robeBodyStyle) {
                    description += ` It has a ${robeData.robeBodyStyle.replace(/_/g, ' ')} cut`;
                }
                if (robeData.sleeveType && robeData.sleeveLength) {
                    description += `, with ${robeData.sleeveLength.replace(/_/g, ' ')} ${robeData.sleeveType.replace(/_/g, ' ')} sleeves.`;
                } else if (robeData.sleeveLength) {
                    description += `, with ${robeData.sleeveLength.replace(/_/g, ' ')} sleeves.`;
                } else {
                    description += `.`;
                }
                if (robeData.hasHood) {
                    description += robeData.hoodUp ? " The hood is currently up, perhaps obscuring the wearer's features." : " A hood rests neatly upon the shoulders.";
                }
                if (robeData.hasBelt && robeData.beltMaterial && robeData.beltStyle) {
                    const beltMatName = SHARED_MATERIALS[robeData.beltMaterial.toUpperCase()]?.name || robeData.beltMaterial;
                    description += ` It's cinched with ${getArticle(robeData.beltStyle)} ${beltMatName.toLowerCase()} ${robeData.beltStyle.replace(/_/g, ' ')}.`;
                }
                 if (robeData.hasTrim && robeData.trimMaterial && robeData.trimStyle) {
                    const trimMatName = SHARED_MATERIALS[robeData.trimMaterial.toUpperCase()]?.name || robeData.trimMaterial;
                    description += ` Edged with ${trimMatName.toLowerCase()} ${robeData.trimStyle.replace(/_/g, ' ')}.`;
                }
                 if (robeData.hasSymbol && robeData.symbolMaterial && robeData.symbolShape) {
                    const symbolMatName = SHARED_MATERIALS[robeData.symbolMaterial.toUpperCase()]?.name || robeData.symbolMaterial;
                    description += ` A ${symbolMatName.toLowerCase()} ${robeData.symbolShape.replace(/_symbol|_/g,' ')} is emblazoned upon it.`;
                }


            } else { // For non-robe armors (generateArmor)
                if (artGenerationResult.itemData.style) {
                    const artStyle = artGenerationResult.itemData.style.replace(/_/g, ' ');
                    const definedArtStyle = Array.isArray(subType.pixelArtSubType) ? chosenPixelArtSubType : subType.pixelArtSubType;
                    if (artStyle !== definedArtStyle.replace(/_/g, ' ')) {
                         description += ` It exhibits a distinct ${artStyle} style.`;
                    }
                }
                if (artGenerationResult.itemData.pauldrons && artGenerationResult.itemData.pauldrons.style && artGenerationResult.itemData.pauldrons.style !== 'none') {
                    description += ` Features ${artGenerationResult.itemData.pauldrons.style.replace(/_/g, ' ')} pauldrons.`;
                }
                if (artGenerationResult.itemData?.torso?.decoration?.type && artGenerationResult.itemData.torso.decoration.type !== 'none') {
                    let decorDesc = artGenerationResult.itemData.torso.decoration.type.replace(/_/g, ' ');
                    if (artGenerationResult.itemData.torso.decoration.material) {
                         const decorMatName = SHARED_MATERIALS[artGenerationResult.itemData.torso.decoration.material.toUpperCase()]?.name || artGenerationResult.itemData.torso.decoration.material;
                        decorDesc = `${decorMatName} ${decorDesc}`;
                    }
                    description += ` Adorned with ${decorDesc}.`;
                }
            }
        }


        if (magicalProperties.length > 0) {
            description += ` This armor hums with magical energies.`;
        } else if (subType.id !== "ROBE") {
            description += ` It offers reliable protection for its type.`;
        }


        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_ARMOR;
        goldValue *= (material.valueMod || 1.0);
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_ARMOR) * (prop.effect.valueMod || 0.1);
        });
        if (baseStats.minStrMod > 0) goldValue *= (1 + baseStats.minStrMod * 0.04);
        if (baseStats.minConMod !== undefined && baseStats.minConMod > 0) goldValue *= (1 + baseStats.minConMod * 0.03);
        else if (baseStats.minStrMod < -1) goldValue *= (1 + baseStats.minStrMod * 0.02);
        goldValue = Math.max(1, Math.round(goldValue));


        const finalItem = {
            id: `armor_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: "ARMOR",
            subType: subType.id,
            equipSlot: subType.equipSlot,
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${material.name} ${subType.name}`,
            rarity: rarity.id,
            material: material.id,
            materials: {
                primary: material.id,
            },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Armor: ${finalItem.name} (Rarity: ${finalItem.rarity}, Material: ${material.name}, PixelArt SubType: ${chosenPixelArtSubType})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateArmorRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/armor/armorGenerator.js (Improved Naming Logic v6) loaded.");
