/**
 * magic_item_generator/categories/consumables/consumableGenerator.js
 * Contains the logic to generate Consumable RPG item objects, starting with Potions.
 */

import {
    RARITIES, EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS,
    ITEM_BASE_GOLD_VALUES,
    getWeightedRandomRarity, getRandomElement, getRandomInt
} from '../../sharedDefinitions.js';

import {
    CONSUMABLE_SUB_TYPES, POTION_EFFECT_TYPES,
    POTION_NAME_PARTS, POTION_NAME_TEMPLATES
} from './potionDefinitions.js';

import { generatePotion } from '../../../pixel_art_generator/item_api.js';

/**
 * Helper function to determine if "a" or "an" should be used.
 * @param {string} word - The word to check.
 * @returns {string} "an" if word starts with a vowel, "a" otherwise.
 */
function getArticle(word) {
    if (!word) return "a";
    const firstLetter = word.trim().toLowerCase()[0];
    return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? "an" : "a";
}

/**
 * Formats the potion effect into a human-readable string.
 * @param {object} effect - The effect object from potionDefinitions.
 * @param {string} duration - The duration string.
 * @returns {string} A human-readable description of the effect.
 */
function formatPotionEffectForDisplay(effect, duration) {
    if (!effect) return "No discernible effect.";

    let text = "";
    const formattedDuration = duration ? duration.replace(/_/g, ' ') : 'N/A';
    const valuePrefix = (val) => (val > 0 ? '+' : '');

    switch (effect.type) {
        case "heal":
            text = `Restores ${effect.dice}${effect.healingBonusStat ? '+' + effect.healingBonusStat.toUpperCase() : ''} HP.`;
            break;
        case "heal_full":
            text = `Restores HP to maximum.`;
            break;
        case "mp_recovery":
            text = `Recovers ${effect.amount} MP.`;
            break;
        case "attack_roll_boost":
            text = `Grants ${valuePrefix(effect.value)}${effect.value} to Attack Rolls for ${formattedDuration}.`;
            break;
        case "attribute_boost":
            text = `Grants ${valuePrefix(effect.value)}${effect.value} to ${effect.attribute.toUpperCase()} for ${formattedDuration}.`;
            break;
        case "resistance":
            text = `Grants Resistance to ${effect.damageType.replace(/_/g, ' ')} for ${formattedDuration}.`;
            break;
        case "immunity":
            text = `Grants Immunity to ${effect.damageType.replace(/_/g, ' ')} for ${formattedDuration}.`;
            break;
        case "ac_boost":
            text = `Grants ${valuePrefix(effect.value)}${effect.value} AC for ${formattedDuration}.`;
            break;
        case "invisibility":
            let detailText = "";
            if (effect.effect_detail === "ends_on_action") detailText = " (ends if you attack or cast a spell)";
            else if (effect.effect_detail === "persists_through_action") detailText = " (persists through first hostile action)";
            text = `Grants Invisibility for ${formattedDuration}${detailText}.`;
            break;
        case "damage_penalty":
            text = `Target suffers ${effect.value} to Damage Rolls for ${formattedDuration}.`;
            break;
        case "attack_roll_penalty":
            text = `Target suffers ${effect.value} to Attack Rolls for ${formattedDuration}.`;
            break;
        case "ac_penalty":
            text = `Target suffers ${effect.value} AC for ${formattedDuration}.`;
            break;
        case "lose_action":
            text = `Target loses their next action.`;
            break;
        case "elemental_vulnerability":
            text = `Target becomes vulnerable to ${effect.damageType ? effect.damageType.replace(/_/g, ' ') : 'a random element'} for ${formattedDuration}.`;
            break;
        case "vulnerability_physical":
             text = `Target becomes vulnerable to physical damage (bludgeoning, piercing, slashing) for ${formattedDuration}.`;
            break;
        case "vulnerability_all":
             text = `Target becomes vulnerable to ALL damage types for ${formattedDuration}.`;
            break;
        case "temp_hp":
            text = `Grants ${effect.tempHP} temporary HP for ${formattedDuration}.`;
            break;
        case "extra_action":
            text = `Grants an additional action each turn for ${formattedDuration}.`;
            break;

        default:
            text = `Effect: ${effect.type.replace(/_/g, ' ')}`;
            if (effect.value) text += ` ${valuePrefix(effect.value)}${effect.value}`;
            if (effect.attribute) text += ` ${effect.attribute.toUpperCase()}`;
            text += ` (Duration: ${formattedDuration})`;
    }
    return text;
}


/**
 * Generates a potion RPG item.
 * @param {object} [options={}] - Optional parameters.
 */
export function generateConsumableRPGItem(options = {}) {
    if (options.itemSubTypeId && options.itemSubTypeId !== "POTION") {
        console.warn(`Consumable generator currently only supports POTION sub-type. Requested: ${options.itemSubTypeId}`);
        return null;
    }

    const subType = CONSUMABLE_SUB_TYPES.POTION;
    const effectTypeKey = options.potionEffectTypeKey || getRandomElement(Object.keys(POTION_EFFECT_TYPES));
    const effectTypeDetails = POTION_EFFECT_TYPES[effectTypeKey];

    if (!effectTypeDetails) {
        console.error(`Error: Potion effect type '${effectTypeKey}' not found.`);
        return null;
    }

    const rarity = options.rarityId ? RARITIES[options.rarityId] : getWeightedRandomRarity();
    if (!rarity) {
        console.error("Error: Could not determine rarity for potion.");
        return null;
    }

    let selectedTier = effectTypeDetails.tiers.find(t => t.rarity === rarity.id);
    if (!selectedTier) {
        console.warn(`No specific tier for rarity ${rarity.id} in effect ${effectTypeKey}. Falling back.`);
        selectedTier = effectTypeDetails.tiers.find(t => t.rarity === "COMMON") || effectTypeDetails.tiers[0];
        if (!selectedTier) {
            console.error(`Error: No tiers defined for potion effect type '${effectTypeKey}'.`);
            return null;
        }
    }

    const material = SHARED_MATERIALS.GLASS;
    if (!material || !material.paletteKey) {
        console.error(`Error: GLASS material or paletteKey not found.`);
        return null;
    }

    let liquidColorHint = "default_blue";
    if (effectTypeKey === "HEALING") liquidColorHint = "red";
    else if (effectTypeKey === "MANA_RECOVERY") liquidColorHint = "blue";
    else if (effectTypeKey.includes("STRENGTH") || effectTypeKey.includes("MIGHT")) liquidColorHint = "orange";
    else if (effectTypeKey.includes("DEXTERITY") || effectTypeKey.includes("AGILITY")) liquidColorHint = "yellow";
    else if (effectTypeKey.includes("CONSTITUTION") || effectTypeKey.includes("ENDURANCE")) liquidColorHint = "brown";
    else if (effectTypeKey.includes("INTELLIGENCE") || effectTypeKey.includes("INTELLECT")) liquidColorHint = "purple";
    else if (effectTypeKey.includes("WISDOM")) liquidColorHint = "cyan";
    else if (effectTypeKey.includes("CHARISMA")) liquidColorHint = "pink";
    else if (effectTypeKey.includes("FIRE")) liquidColorHint = "bright_red";
    else if (effectTypeKey.includes("COLD")) liquidColorHint = "light_blue";
    else if (effectTypeKey.includes("LIGHTNING")) liquidColorHint = "electric_yellow";
    else if (effectTypeKey.includes("ACID")) liquidColorHint = "green_slime";
    else if (effectTypeKey.includes("POISON") || effectTypeKey.includes("VENOM")) liquidColorHint = "dark_green";
    else if (effectTypeKey.includes("NECROTIC") || effectTypeKey.includes("SHADOW")) liquidColorHint = "black_swirl";
    else if (effectTypeKey.includes("RADIANT") || effectTypeKey.includes("LIGHT")) liquidColorHint = "golden_glow";
    else if (effectTypeKey.includes("INVISIBILITY")) liquidColorHint = "clear_swirl";


    let artGenerationResult = {
        imageDataUrl: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        itemData: { flaskShape: "unknown_flask", liquidColorName: liquidColorHint, stopperType: "unknown_stopper", liquidColorName2: null, liquidMixStyle: null }
    };

    const pixelArtOptions = {
        subType: subType.pixelArtSubType,
        material: material.paletteKey, 
        liquidColor: liquidColorHint,    
        complexity: rarity.artComplexityHint
    };

    if (typeof generatePotion === 'function') {
        artGenerationResult = generatePotion(pixelArtOptions);
    } else {
        console.warn(`Pixel art generator function 'generatePotion' not found. Using placeholder art.`);
    }
    const artData = artGenerationResult.itemData || {};

    let itemName = "";
    const tierName = selectedTier.tierName || "";
    let namePrefix = effectTypeDetails.namePrefix || "Potion of";
    let nameSuffix = effectTypeDetails.nameSuffix || effectTypeKey.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    if (tierName) {
        itemName = `${tierName} ${namePrefix} ${nameSuffix}`;
    } else {
        itemName = `${namePrefix} ${nameSuffix}`;
    }
    itemName = itemName.replace(/\s+/g, ' ').trim();

    if (!itemName || itemName.length < 3 || itemName.toLowerCase().includes("undefined")) {
        itemName = `${rarity.name} Potion of ${effectTypeKey.toLowerCase().replace(/_/g, ' ')}`;
    }
    if (itemName) itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

    // Generate Enhanced Description using artGeneratorData
    let description = "";
    const flaskDesc = artData.flaskShape ? artData.flaskShape.replace(/_/g, ' ') : "glass vial";
    const primaryLiquidNameForDesc = (artData.liquidColorName || liquidColorHint).toLowerCase().replace(/_/g, ' ');
    const stopperDesc = artData.stopperType && artData.stopperType !== 'none' ? `sealed with a ${artData.stopperType.replace(/_/g, ' ')}` : "stoppered";

    description = `This is ${getArticle(primaryLiquidNameForDesc)} ${primaryLiquidNameForDesc} liquid`;
    if (artData.liquidColorName2 && artData.liquidMixStyle === 'layered') {
        const secondaryLiquidNameForDesc = artData.liquidColorName2.toLowerCase().replace(/_/g, ' ');
        description += ` and ${secondaryLiquidNameForDesc} liquid, appearing layered,`;
    }
    description += ` contained within ${getArticle(flaskDesc)} ${flaskDesc} ${stopperDesc}.`;

    if (artData.hasLabel) {
        description += " It bears a simple, handwritten label.";
    }
    description += ` ${effectTypeDetails.descriptionBase || `It is said to have a ${effectTypeKey.toLowerCase().replace(/_/g, ' ')} effect.`}`;

    const formattedEffectDescription = formatPotionEffectForDisplay(selectedTier.effect, selectedTier.duration);

    let goldValue = subType.baseValue || ITEM_BASE_GOLD_VALUES.DEFAULT_CONSUMABLE;
    goldValue += (selectedTier.valueMod || 1.0) * 5;
    goldValue *= rarity.valueMultiplier;
    goldValue = Math.max(1, Math.round(goldValue));

    // Prepare liquid display string for item.materials.liquidColor
    const primaryLiquidForCard = (artData.liquidColorName || liquidColorHint).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let liquidDisplayStringForCard = primaryLiquidForCard;
    if (artData.liquidColorName2 && artData.liquidMixStyle === 'layered') {
        const secondaryLiquidForCard = artData.liquidColorName2.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        liquidDisplayStringForCard += `, ${secondaryLiquidForCard}`;
    }

    const finalItem = {
        id: `potion_${Date.now()}_${getRandomInt(1000, 9999)}`,
        name: itemName,
        type: "CONSUMABLE",
        subType: subType.id,
        equipSlot: subType.equipSlot,
        pixelArtDataUrl: artGenerationResult.imageDataUrl,
        visualTheme: artData.visualTheme || `${(artData.liquidColorName || liquidColorHint).replace(/_/g, ' ')} Potion`,
        rarity: rarity.id,
        material: material.id, 
        materials: {
            container: material.id,
            liquidColor: liquidDisplayStringForCard, // This will be "Color1" or "Color1, Color2"
            // Store raw colors separately if needed for other game logic, prefixed to avoid name clashes
            _rawLiquidColor1: artData.liquidColorName || liquidColorHint,
            _rawLiquidColor2: artData.liquidColorName2 || null,
            _liquidMixStyle: artData.liquidMixStyle || null, // Store for reference
            ...(artGenerationResult.itemData?.materials || {})
        },
        effect: selectedTier.effect,
        duration: selectedTier.duration,
        formattedEffectDescription: formattedEffectDescription,
        value: goldValue,
        description: description,
        stackable: subType.stackable !== undefined ? subType.stackable : true,
        artGeneratorData: artData,
    };

    console.log(`Generated Potion: ${finalItem.name} (Rarity: ${finalItem.rarity}, Effect: ${effectTypeKey})`);
    return finalItem;
}

console.log("magic_item_generator/categories/consumables/consumableGenerator.js (v8 - Refined Liquid Display String) loaded.");
