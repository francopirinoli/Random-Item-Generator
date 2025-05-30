/**
 * magic_item_generator/categories/staves/staffGenerator.js
 * Contains the logic to generate a complete Staff, Wand, or Scepter RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    STAFF_SUB_TYPES, STAFF_MATERIALS, STAFF_AFFIXES,
    STAFF_NAME_PARTS, STAFF_NAME_TEMPLATES,
    STAFF_SHAFT_MATERIALS, STAFF_GRIP_MATERIALS, STAFF_TOPPER_GEM_MATERIALS, STAFF_TOPPER_METAL_MATERIALS
} from './staffDefinitions.js';

// --- IMPORT PIXEL ART GENERATOR ---
// Ensure generateStaff is exported from your item_api.js
import { generateStaff as generateStaffPixelArt } from '../../../pixel_art_generator/item_api.js';


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
 * Generates a staff, wand, or scepter RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory] - The category ID for this item (e.g., "STAVES").
 * @param {string} [options.itemSubTypeId] - Specific sub-type ID (e.g., "STAFF").
 * @param {string} [options.rarityId] - Specific rarity ID (e.g., "RARE").
 * @param {string} [options.materialId] - Specific material ID for the shaft (e.g., "WOOD").
 * @returns {object|null} The generated item object, or null on error.
 */
export function generateStaffRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type (Staff, Wand, Scepter)
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(STAFF_SUB_TYPES));
        const subType = STAFF_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Staff/Wand/Scepter SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for staff/wand/scepter.");
            return { ...RARITIES.COMMON, name: "Fallback Common Wand", description: "Error determining rarity." };
        }

        // 3. Determine Materials
        // Shaft Material
        const applicableShaftMaterials = subType.materials || STAFF_SHAFT_MATERIALS;
        const shaftMaterialKey = options.materialId && applicableShaftMaterials.includes(options.materialId) ? options.materialId : getRandomElement(applicableShaftMaterials);
        const shaftBaseMaterialProps = SHARED_MATERIALS[shaftMaterialKey] || SHARED_MATERIALS["WOOD"];
        const shaftStaffSpecificMaterialProps = STAFF_MATERIALS[shaftMaterialKey] || {};
        const shaftMaterial = {
            ...shaftBaseMaterialProps,
            ...shaftStaffSpecificMaterialProps,
            id: shaftMaterialKey,
            name: shaftBaseMaterialProps.name || shaftMaterialKey,
            paletteKey: shaftBaseMaterialProps.paletteKey,
            statModifiers: { ...(shaftBaseMaterialProps.statModifiers || {}), ...(shaftStaffSpecificMaterialProps.statModifiers || {}) }
        };
        if (!shaftMaterial.paletteKey) {
            console.error(`Error: Shaft Material or paletteKey not found for '${shaftMaterialKey}'. Using WOOD.`);
            const fallbackMat = SHARED_MATERIALS["WOOD"];
            Object.assign(shaftMaterial, { id: "WOOD", name: fallbackMat.name, paletteKey: fallbackMat.paletteKey, statModifiers: fallbackMat.statModifiers });
        }

        // Topper Material (Conceptual for RPG, actual visual from pixel art generator's itemData)
        // The pixel art generator for staves internally decides topper shape and materials.
        // We'll store a conceptual topper material for description and potential game logic.
        let conceptualTopperMaterialKey = null;
        let conceptualTopperType = "decorative"; // 'decorative', 'gem', 'crystal'

        if (Math.random() < 0.6) { // 60% chance of a distinct topper material
            if (Math.random() < 0.5) { // Gem or Crystal
                conceptualTopperMaterialKey = getRandomElement(STAFF_TOPPER_GEM_MATERIALS);
                conceptualTopperType = getRandomElement(['gem', 'crystal']);
            } else { // Metal or special wood/bone
                conceptualTopperMaterialKey = getRandomElement(STAFF_TOPPER_METAL_MATERIALS.concat(["IVORY", "OBSIDIAN", "BONE"]));
                conceptualTopperType = "finial_or_symbol";
            }
        } else { // Topper is same material as shaft or a simple extension
            conceptualTopperMaterialKey = shaftMaterialKey;
            conceptualTopperType = "integrated";
        }
        const conceptualTopperMaterial = SHARED_MATERIALS[conceptualTopperMaterialKey] || shaftMaterial;


        // 4. Generate Pixel Art
        // The pixel art generator for staves handles topper shape and its specific material internally.
        // We pass the shaft material and the subType (wand, scepter, staff).
        let artGenerationResult = { imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", itemData: {} };
        if (typeof generateStaffPixelArt === 'function') {
            artGenerationResult = generateStaffPixelArt({
                subType: subType.pixelArtSubType, // "wand", "scepter", or "staff"
                material: shaftMaterial.paletteKey, // Palette key for the shaft
                // Topper material/gem is decided by the pixel art generator, we'll use its output.
                complexity: rarity.artComplexityHint
            });
        } else {
            console.warn(`Pixel art generator function 'generateStaffPixelArt' not found. Using placeholder.`);
        }

        // 5. Calculate Base RPG Stats & Requirements
        // Staves/Wands/Scepters usually have minimal physical damage and rely on INT/WIS.
        let currentMinIntMod = subType.minIntMod !== undefined ? subType.minIntMod : 0;
        // No strReqMod from shaft material for staves, usually.

        const baseStats = {
            damage: subType.baseDamage || "1d4", // Melee damage if used as a weapon
            // Magical damage will come from affixes or spellcasting properties
            acBonus: 0,
            minIntMod: currentMinIntMod, // Or minWisMod depending on design
            // minStrMod: -3 // Staves are generally light
        };
        if (subType.damageAttribute) baseStats.damageAttribute = subType.damageAttribute; // INT or WIS

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
            const pool = isPrefix ? (STAFF_AFFIXES.PREFIXES.MAJOR || []) : (STAFF_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "STAVES", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
        }
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (STAFF_AFFIXES.PREFIXES.MINOR || []) : (STAFF_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "STAVES", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }
        
        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            // Fallback for RARE items
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (STAFF_AFFIXES.PREFIXES.MINOR || []) : (STAFF_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "STAVES", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
        }


        magicalProperties.forEach(prop => {
            if (prop.effect && prop.effect.type === "attribute_requirement_mod" && prop.effect.attribute === "INT") {
                baseStats.minIntMod = (baseStats.minIntMod || 0) + prop.effect.value;
            }
            // Other effects (like mp_boost, spell_attack_boost) will be interpreted by the game engine
        });

        // 7. Generate Name
        let itemName = "";
        const prefixAffix = magicalProperties.find(p => p.isPrefix);
        const suffixAffix = magicalProperties.find(p => !p.isPrefix && (!prefixAffix || p.name !== prefixAffix.name));
        const nameTemplatePool = STAFF_NAME_TEMPLATES || SHARED_NAME_TEMPLATES.GENERIC;
        let nameTemplate = getRandomElement(nameTemplatePool);
        const getStaffNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";
        let prefixWord = getStaffNamePart(STAFF_NAME_PARTS.PREFIX_WORDS);
        let suffixWord = getStaffNamePart(STAFF_NAME_PARTS.SUFFIX_WORDS);

        if (nameTemplate === "{prefix_word}{suffix_word}") {
            itemName = prefixWord + suffixWord;
        } else if (nameTemplate === "{adjective} {prefix_word} {subTypeName_root_alt}") {
            let root = subType.name; // Staff, Wand, Scepter
            const adj = getStaffNamePart(STAFF_NAME_PARTS.ADJECTIVES);
            itemName = `${adj} ${prefixWord}${prefixWord && root ? " " : ""}${root}`;
        } else {
            itemName = nameTemplate
                .replace("{prefix}", prefixAffix ? prefixAffix.name : getStaffNamePart(STAFF_NAME_PARTS.ADJECTIVES))
                .replace("{material}", shaftMaterial.name) // Name uses shaft material
                .replace("{subTypeName}", subType.name)
                .replace("{suffix}", suffixAffix ? suffixAffix.name : "")
                .replace("{adjective}", getStaffNamePart(STAFF_NAME_PARTS.ADJECTIVES))
                .replace("{noun_abstract}", getStaffNamePart(STAFF_NAME_PARTS.NOUNS_ABSTRACT));
        }
        itemName = itemName.replace(/\s{2,}/g, ' ').trim();
        if (!prefixAffix && !suffixAffix && magicalProperties.length > 0) {
            const firstProp = magicalProperties[0];
            itemName = `${firstProp.name} ${shaftMaterial.name} ${subType.name}`;
        } else if (magicalProperties.length === 0) {
             if(Math.random() < 0.3 && STAFF_NAME_PARTS.ADJECTIVES.length > 0) itemName = `The ${getStaffNamePart(STAFF_NAME_PARTS.ADJECTIVES)} ${shaftMaterial.name} ${subType.name}`;
             else itemName = `${shaftMaterial.name} ${subType.name}`;
        }
        itemName = itemName.replace(/undefined|null/gi, '').replace(/\s{2,}/g, ' ').trim();

        // 8. Generate Description
        const shaftMaterialNameFormatted = formatMaterialNameForDesc(shaftMaterial.id);
        let description = `${getArticle(rarity.name)} ${rarity.name.toLowerCase()} ${subType.name.toLowerCase()} crafted from ${shaftMaterialNameFormatted}.`;

        // Topper description based on pixel art generator's output
        const artTopperShape = artGenerationResult.itemData?.topper?.shape;
        const artTopperMaterialKey = artGenerationResult.itemData?.topper?.material;
        const artGemMaterialKey = artGenerationResult.itemData?.topper?.gemMaterial;

        if (artTopperShape && artTopperShape !== 'none') {
            let topperDesc = ` It is topped with ${getArticle(artTopperShape)} ${artTopperShape.replace(/_/g, ' ')}`;
            if (artTopperMaterialKey && artTopperMaterialKey !== shaftMaterial.id.toLowerCase()) {
                topperDesc += ` of ${formatMaterialNameForDesc(artTopperMaterialKey)}`;
            }
            if (artGemMaterialKey) {
                topperDesc += ` featuring ${getArticle(artGemMaterialKey)} ${formatMaterialNameForDesc(artGemMaterialKey)} gem`;
            }
            description += topperDesc + ".";
        }


        if (magicalProperties.length > 0) {
            description += ` It hums with arcane power.`;
        }
        if (baseStats.damageAttribute === "INT") {
            description += " It channels intellectual energies.";
        } else if (baseStats.damageAttribute === "WIS") {
            description += " It resonates with intuitive magic.";
        }


        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_WEAPON; // Staves are still weapons
        goldValue *= (shaftMaterial.valueMod || 1.0);
        // Topper material value is implicitly part of artGenerationResult, or add a conceptual bonus
        if (conceptualTopperMaterial && conceptualTopperMaterial.valueMod) {
            goldValue += (subType.baseValue * 0.2) * (conceptualTopperMaterial.valueMod -1); // Topper adds some value
        }
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || 30) * (prop.effect.valueMod || 0.1); // Base value for affix mod
        });
        if (baseStats.minIntMod > 0) goldValue *= (1 + baseStats.minIntMod * 0.08); // INT req increases value
        goldValue = Math.max(1, Math.round(goldValue));

        const finalItem = {
            id: `staff_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: options.itemCategory || "STAVES",
            subType: subType.id,
            equipSlot: subType.equipSlot,
            canBeOffHand: subType.canBeOffHand || false,
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${shaftMaterial.name} ${subType.name}`,
            rarity: rarity.id,
            material: shaftMaterial.id, // Primary material is the shaft's
            materials: { // Store conceptual materials
                shaft: shaftMaterial.id,
                topper: artGenerationResult.itemData?.topper?.material || conceptualTopperMaterialKey,
                gem: artGenerationResult.itemData?.topper?.gemMaterial, // From pixel art if available
            },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            isTwoHanded: subType.twoHanded || false,
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Staff/Wand/Scepter: ${finalItem.name} (Rarity: ${finalItem.rarity}, Shaft: ${shaftMaterial.name})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateStaffRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/staves/staffGenerator.js loaded.");
