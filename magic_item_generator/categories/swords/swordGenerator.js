/**
 * magic_item_generator/categories/swords/swordGenerator.js
 * Contains the logic to generate a complete Sword RPG item object.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    GENERIC_AFFIXES, ITEM_BASE_GOLD_VALUES,
    NAME_TEMPLATES as SHARED_NAME_TEMPLATES, NAME_PARTS as SHARED_NAME_PARTS,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    SWORD_SUB_TYPES, SWORD_MATERIALS, SWORD_AFFIXES,
    SWORD_NAME_PARTS, SWORD_NAME_TEMPLATES,
    SWORD_HILT_MATERIALS, SWORD_GRIP_MATERIALS, SWORD_POMMEL_MATERIALS // Import new material lists
} from './swordDefinitions.js';

// --- IMPORT PIXEL ART GENERATOR ---
import { generateSword as generateSwordPixelArt } from '../../../pixel_art_generator/item_api.js';


/**
 * Helper function to select a random affix from a given pool,
 * considering rarity and ensuring it hasn't been used yet.
 * @param {Array} pool - The array of affix objects to choose from.
 * @param {string} itemCategory - The category of the item (e.g., "SWORDS").
 * @param {string} itemSubTypeId - The sub-type ID of the item.
 * @param {string} currentRarityId - The rarity ID of the item.
 * @param {Set} usedAffixNamesSet - A Set of affix names already used on this item.
 * @param {string} affixTier - "MAJOR" or "MINOR", to adjust rarity filtering.
 * @returns {object|null} A copy of the chosen affix object or null.
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
        return { ...chosenAffixData }; // Return a copy
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
 * Generates a sword RPG item.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.itemCategory] - The category ID for this item (e.g., "SWORDS").
 * @param {string} [options.itemSubTypeId] - Specific sword sub-type ID (e.g., "SWORD_LONG").
 * @param {string} [options.rarityId] - Specific rarity ID (e.g., "RARE").
 * @param {string} [options.materialId] - Specific material ID for the blade (e.g., "STEEL").
 * @returns {object|null} The generated sword item object, or null on error.
 */
export function generateSwordRPGItem(options = {}) {
    try {
        // 1. Determine Sub-Type
        const subTypeKey = options.itemSubTypeId || getRandomElement(Object.keys(SWORD_SUB_TYPES));
        const subType = SWORD_SUB_TYPES[subTypeKey];
        if (!subType) {
            console.error(`Error: Sword SubType '${subTypeKey}' not found.`);
            return null;
        }

        // 2. Determine Rarity
        const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
        if (!rarity) {
            console.error("Error: Could not determine rarity for sword.");
            return { ...RARITIES.COMMON, name: "Fallback Common Sword", description: "Error determining rarity." };
        }

        // 3. Determine Materials for Blade, Hilt, Grip, Pommel
        const applicableBladeMaterials = subType.materials || Object.keys(SHARED_MATERIALS);
        const bladeMaterialKey = options.materialId && applicableBladeMaterials.includes(options.materialId) ? options.materialId : getRandomElement(applicableBladeMaterials);
        const bladeBaseMaterialProps = SHARED_MATERIALS[bladeMaterialKey] || {};
        const bladeSwordSpecificMaterialProps = SWORD_MATERIALS[bladeMaterialKey] || {};
        const bladeMaterial = {
            ...bladeBaseMaterialProps,
            ...bladeSwordSpecificMaterialProps,
            id: bladeMaterialKey,
            name: bladeBaseMaterialProps.name || bladeMaterialKey,
            paletteKey: bladeBaseMaterialProps.paletteKey,
            statModifiers: { ...(bladeBaseMaterialProps.statModifiers || {}), ...(bladeSwordSpecificMaterialProps.statModifiers || {}) }
        };
        if (!bladeMaterial.paletteKey) {
            console.error(`Error: Blade Material or paletteKey not found for '${bladeMaterialKey}'.`);
            return null;
        }

        const hiltMaterialKey = getRandomElement(SWORD_HILT_MATERIALS);
        const hiltMaterial = SHARED_MATERIALS[hiltMaterialKey] || SHARED_MATERIALS["STEEL"]; // Fallback to steel

        const gripMaterialKey = getRandomElement(SWORD_GRIP_MATERIALS);
        const gripMaterial = SHARED_MATERIALS[gripMaterialKey] || SHARED_MATERIALS["LEATHER"]; // Fallback to leather

        // Pommel often matches hilt, or blade, or a gem
        let pommelMaterialKey;
        const pommelRoll = Math.random();
        if (pommelRoll < 0.4) {
            pommelMaterialKey = hiltMaterialKey;
        } else if (pommelRoll < 0.7) {
            pommelMaterialKey = bladeMaterialKey;
        } else {
            pommelMaterialKey = getRandomElement(SWORD_POMMEL_MATERIALS);
        }
        const pommelMaterial = SHARED_MATERIALS[pommelMaterialKey] || hiltMaterial; // Fallback to hilt material


        // 4. Generate Pixel Art
        let artGenerationResult = { imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", itemData: {} };
        if (typeof generateSwordPixelArt === 'function') {
            artGenerationResult = generateSwordPixelArt({
                subType: subType.pixelArtSubType,
                material: bladeMaterial.paletteKey, // Blade material
                hiltMaterial: hiltMaterial.paletteKey,
                gripMaterial: gripMaterial.paletteKey,
                pommelMaterial: pommelMaterial.paletteKey,
                complexity: rarity.artComplexityHint
            });
        } else {
            console.warn(`Pixel art generator function 'generateSwordPixelArt' not found. Using placeholder.`);
        }

        // 5. Calculate Base RPG Stats & Requirements (based on blade material)
        let currentMinStrMod = subType.minStrMod !== undefined ? subType.minStrMod : -3;
        if (bladeMaterial.statModifiers && typeof bladeMaterial.statModifiers.strReqMod === 'number') {
            currentMinStrMod += bladeMaterial.statModifiers.strReqMod;
        }

        const baseStats = {
            damage: subType.baseDamage || "1d6",
            acBonus: 0,
            minStrMod: currentMinStrMod,
        };
        if (subType.damageAttribute) baseStats.damageAttribute = subType.damageAttribute;

        if (bladeMaterial.statModifiers) {
            if (typeof bladeMaterial.statModifiers.damage === 'number') {
                baseStats.damageMaterialMod = (baseStats.damageMaterialMod || 0) + bladeMaterial.statModifiers.damage;
            }
            if (typeof bladeMaterial.statModifiers.damageFlatBonus === 'number') {
                baseStats.damageFlatBonus = (baseStats.damageFlatBonus || 0) + bladeMaterial.statModifiers.damageFlatBonus;
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

        // Fallback logic to ensure RARE items always get at least one enchantment
        let initialAffixesCount = 0;

        // Attempt to fill Major Affixes first
        for (let i = 0; i < majorAffixSlots; i++) {
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (SWORD_AFFIXES.PREFIXES.MAJOR || []) : (SWORD_AFFIXES.SUFFIXES.MAJOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "SWORDS", subType.id, rarity.id, usedAffixNames, "MAJOR");
            if (affix) {
                magicalProperties.push({ ...affix, isPrefix, tier: "MAJOR" });
                initialAffixesCount++;
            }
        }
        // Attempt to fill Minor Affixes
        for (let i = 0; i < minorAffixSlots; i++) {
            const preferPrefix = !magicalProperties.some(p => p.isPrefix && p.tier === "MINOR");
            const preferSuffix = !magicalProperties.some(p => !p.isPrefix && p.tier === "MINOR");
            let isPrefix;
            if (preferPrefix && !preferSuffix) isPrefix = true;
            else if (!preferPrefix && preferSuffix) isPrefix = false;
            else isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (SWORD_AFFIXES.PREFIXES.MINOR || []) : (SWORD_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "SWORDS", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) {
                magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
                initialAffixesCount++;
            }
        }

        // If a RARE item ended up with no affixes, try to force one.
        if (rarity.id === "RARE" && magicalProperties.length === 0) {
            console.warn(`RARE sword initially got no affixes. Forcing one minor affix.`);
            const isPrefix = Math.random() < 0.5;
            const pool = isPrefix ? (SWORD_AFFIXES.PREFIXES.MINOR || []) : (SWORD_AFFIXES.SUFFIXES.MINOR || []);
            const affix = selectAffixFromPool(pool, options.itemCategory || "SWORDS", subType.id, rarity.id, usedAffixNames, "MINOR");
            if (affix) {
                magicalProperties.push({ ...affix, isPrefix, tier: "MINOR" });
            } else {
                // Last resort: try a major if minor also failed for RARE
                const isPrefixMajor = Math.random() < 0.5;
                const poolMajor = isPrefixMajor ? (SWORD_AFFIXES.PREFIXES.MAJOR || []) : (SWORD_AFFIXES.SUFFIXES.MAJOR || []);
                const affixMajor = selectAffixFromPool(poolMajor, options.itemCategory || "SWORDS", subType.id, rarity.id, usedAffixNames, "MAJOR");
                if (affixMajor) {
                     magicalProperties.push({ ...affixMajor, isPrefix: isPrefixMajor, tier: "MAJOR" });
                } else {
                    console.warn("RARE sword could not be enchanted even with fallback.");
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
        const nameTemplatePool = SWORD_NAME_TEMPLATES || SHARED_NAME_TEMPLATES.GENERIC;
        let nameTemplate = getRandomElement(nameTemplatePool);
        const getSwordNamePart = (partTypeArray) => getRandomElement(partTypeArray) || "";
        let prefixWord = getSwordNamePart(SWORD_NAME_PARTS.PREFIX_WORDS);
        let suffixWord = getSwordNamePart(SWORD_NAME_PARTS.SUFFIX_WORDS);

        if (nameTemplate === "{prefix_word}{suffix_word}") {
            itemName = prefixWord + suffixWord;
        } else if (nameTemplate === "{adjective} {prefix_word}{subTypeName_root_alt}") {
            let root = subType.name.replace(/Sword|Dagger|Rapier|Katana/i, 'blade').trim();
            if (root.toLowerCase() === subType.name.toLowerCase() || !root) root = "Blade";
            const adj = getSwordNamePart(SWORD_NAME_PARTS.ADJECTIVES);
            itemName = `${adj} ${prefixWord}${prefixWord && root ? " " : ""}${root}`;
        } else {
            itemName = nameTemplate
                .replace("{prefix}", prefixAffix ? prefixAffix.name : getSwordNamePart(SWORD_NAME_PARTS.ADJECTIVES))
                .replace("{material}", bladeMaterial.name) // Name uses blade material
                .replace("{subTypeName}", subType.name)
                .replace("{suffix}", suffixAffix ? suffixAffix.name : "")
                .replace("{adjective}", getSwordNamePart(SWORD_NAME_PARTS.ADJECTIVES))
                .replace("{noun_abstract}", getSwordNamePart(SWORD_NAME_PARTS.NOUNS_ABSTRACT));
        }
        itemName = itemName.replace(/\s{2,}/g, ' ').trim();
        if (!prefixAffix && !suffixAffix && magicalProperties.length > 0) {
            const firstProp = magicalProperties[0];
            itemName = `${firstProp.name} ${bladeMaterial.name} ${subType.name}`;
        } else if (magicalProperties.length === 0) {
             if(Math.random() < 0.3 && SWORD_NAME_PARTS.ADJECTIVES.length > 0) itemName = `The ${getSwordNamePart(SWORD_NAME_PARTS.ADJECTIVES)} ${bladeMaterial.name} ${subType.name}`;
             else itemName = `${bladeMaterial.name} ${subType.name}`;
        }
        itemName = itemName.replace(/undefined|null/gi, '').replace(/\s{2,}/g, ' ').trim();

        // 8. Generate Description
        let description = `A ${rarity.name.toLowerCase()} ${subType.name.toLowerCase()} with a blade of ${bladeMaterial.name.toLowerCase()}.`;
        if (magicalProperties.length > 0) {
            description += ` It is imbued with magical properties.`;
        }

        // Helper function to format material names
        const formatMaterialNameForDesc = (materialKey) => {
            if (!materialKey) return null;
            const materialObj = SHARED_MATERIALS[materialKey.toUpperCase()];
            if (materialObj && materialObj.name) {
                return materialObj.name.toLowerCase().replace(/_/g, ' ');
            }
            return materialKey.toLowerCase().replace(/_/g, ' '); // Fallback to key if name not found
        };

        // Add details from artGeneratorData (which reflects actual generated art materials)
        const artHiltMaterialKey = artGenerationResult.itemData?.hilt?.hiltMaterial;
        const artGripMaterialKey = artGenerationResult.itemData?.hilt?.gripMaterial;
        const artPommelMaterialKey = artGenerationResult.itemData?.pommel?.material;
        const artCrossguardStyle = artGenerationResult.itemData?.hilt?.crossguardStyle;

        const artHiltMaterialName = formatMaterialNameForDesc(artHiltMaterialKey);
        const artGripMaterialName = formatMaterialNameForDesc(artGripMaterialKey);
        const artPommelMaterialName = formatMaterialNameForDesc(artPommelMaterialKey);


        let hiltDescParts = [];
        if (artHiltMaterialName && artHiltMaterialName !== bladeMaterial.name.toLowerCase()) {
            hiltDescParts.push(`${getArticle(artHiltMaterialName)} ${artHiltMaterialName} hilt`);
        }
        if (artGripMaterialName) {
            if (artHiltMaterialName === artGripMaterialName && hiltDescParts.some(part => part.includes(artHiltMaterialName))) {
                 if (!hiltDescParts.some(part => part.includes("grip"))) { // only add if grip not mentioned
                    hiltDescParts.push(`a matching grip`);
                 }
            } else {
                hiltDescParts.push(`${getArticle(artGripMaterialName)} ${artGripMaterialName} grip`);
            }
        }
        if (artCrossguardStyle) {
             let crossguardDescription;
             const styleLower = artCrossguardStyle.toLowerCase();
             if (styleLower === 'v_guard') {
                 crossguardDescription = 'a V-shaped guard';
             } else if (styleLower === 'crescent_guard') {
                 crossguardDescription = 'a crescent-shaped guard';
             } else {
                 const formattedStyle = artCrossguardStyle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                 crossguardDescription = `${getArticle(formattedStyle)} ${formattedStyle} guard`;
             }
             hiltDescParts.push(crossguardDescription);
        }
         if (artPommelMaterialName && artPommelMaterialName !== (artHiltMaterialName || bladeMaterial.name.toLowerCase())) {
            hiltDescParts.push(`${getArticle(artPommelMaterialName)} ${artPommelMaterialName} pommel`);
        }

        if (hiltDescParts.length > 0) {
            description += ` It features ${hiltDescParts.join(", ")}.`;
        }


        if (baseStats.damageAttribute === "DEX" || baseStats.damageAttribute === "STR_OR_DEX") {
            description += " It feels light and rewards agile strikes."
        }
        if (subType.id === "SWORD_GREATSWORD") {
            description += " This is a weighty two-handed weapon."
        }

        // 9. Calculate Gold Value
        let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_WEAPON;
        goldValue *= (bladeMaterial.valueMod || 1.0); // Value based on blade material
        goldValue *= rarity.valueMultiplier;
        magicalProperties.forEach(prop => {
            goldValue += (subType.baseValue || 20) * (prop.effect.valueMod || 0.1);
        });
        if (baseStats.minStrMod > 0) goldValue *= (1 + baseStats.minStrMod * 0.05);
        else if (baseStats.minStrMod < 0) goldValue *= (1 + baseStats.minStrMod * 0.02);
        goldValue = Math.max(1, Math.round(goldValue));

        const finalItem = {
            id: `sword_${Date.now()}_${getRandomInt(1000, 9999)}`,
            name: itemName,
            type: options.itemCategory || "SWORDS",
            subType: subType.id,
            equipSlot: subType.equipSlot,
            canBeOffHand: subType.canBeOffHand || false,
            pixelArtDataUrl: artGenerationResult.imageDataUrl,
            visualTheme: artGenerationResult.itemData.visualTheme || `${bladeMaterial.name} ${subType.name}`,
            rarity: rarity.id,
            material: bladeMaterial.id, // Primary material is the blade's
            materials: { // Store all component materials
                blade: bladeMaterial.id,
                hilt: hiltMaterial.id,
                grip: gripMaterial.id,
                pommel: pommelMaterial.id,
            },
            baseStats: baseStats,
            magicalProperties: magicalProperties.map(p => ({ name: p.name, description: p.description || p.name, effect: p.effect, tier: p.tier })),
            value: goldValue,
            description: description,
            isTwoHanded: subType.twoHanded || false,
            artGeneratorData: artGenerationResult.itemData,
        };

        console.log(`Generated Sword: ${finalItem.name} (Rarity: ${finalItem.rarity}, Blade: ${bladeMaterial.name}, Hilt: ${hiltMaterial.name}, Grip: ${gripMaterial.name}, Pommel: ${pommelMaterial.name})`);
        return finalItem;

    } catch (error) {
        console.error("Error in generateSwordRPGItem:", error);
        return null;
    }
}

console.log("magic_item_generator/categories/swords/swordGenerator.js (Corrected RarityMax Logic) loaded.");
