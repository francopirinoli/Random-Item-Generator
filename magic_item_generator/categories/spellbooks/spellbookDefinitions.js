/**
 * magic_item_generator/categories/spellbooks/spellbookDefinitions.js
 * Contains all data definitions specific to SPELLBOOK type items.
 */

import { EQUIP_SLOTS, MATERIALS as SHARED_MATERIALS } from '../../sharedDefinitions.js';

// --- SPELLBOOK CATEGORY & SUB-TYPES ---
export const SPELLBOOK_SUB_TYPES = {
    SPELLBOOK_GENERIC: {
        id: "SPELLBOOK_GENERIC", name: "Spellbook",
        equipSlot: null,
        pixelArtGeneratorKey: "generateBook",
        pixelArtSubType: "spellbook",
        baseValue: 100,
        materials: ["PAPER", "PARCHMENT", "LEATHER", "DARK_LEATHER", "ENCHANTED_SILK", "WOOD", "BONE", "OBSIDIAN"],
    }
};

// --- MATERIALS specific to or with different properties for Spellbooks ---
export const SPELLBOOK_MATERIALS = {};

// --- SPELL DEFINITIONS ---
export const SPELLS = {
    MINOR: [
        // --- Minor Damage Spells (INT Mod 0-2, MP Cost 1-4, Scales with INT) ---
        {
            id: "FORCE_DART", name: "Force Dart",
            description: "Deals 1d6+INT force damage to a single target in any row. This attack cannot miss.",
            minIntMod: 0, mpCost: 2, tier: "MINOR",
            effectType: "damage", school: "evocation", damageType: "force", damageDice: "1d6", damageBonusStat: "INT", range: "single_target_any_row", autoHit: true, castingStat: "INT"
        },
        {
            id: "JOLT_STRIKE", name: "Jolt Strike", // Renamed from Jolt
            description: "A shock deals 1d8 lightning damage to a front row enemy.",
            minIntMod: 0, mpCost: 1, tier: "MINOR",
            effectType: "damage", school: "evocation", damageType: "lightning", damageDice: "1d8", range: "single_target_front_row", attackType: "spell_attack", castingStat: "INT"
        },
        {
            id: "FLAME_LICK", name: "Flame Lick",
            description: "Lash out with a tongue of fire, dealing 1d8+INT fire damage to a front row enemy.",
            minIntMod: 1, mpCost: 2, tier: "MINOR",
            effectType: "damage", school: "evocation", damageType: "fire", damageDice: "1d8", damageBonusStat: "INT", range: "single_target_front_row", attackType: "spell_attack", castingStat: "INT"
        },
        {
            id: "ICE_SHARD", name: "Ice Shard",
            description: "Hurl a shard of ice, dealing 1d6+INT cold damage to any enemy.",
            minIntMod: 1, mpCost: 2, tier: "MINOR",
            effectType: "damage", school: "evocation", damageType: "cold", damageDice: "1d6", damageBonusStat: "INT", range: "single_target_any_row", attackType: "spell_attack", castingStat: "INT"
        },
        {
            id: "ACID_DROP", name: "Acid Drop",
            description: "A globule of acid deals 2d4 acid damage to one enemy.",
            minIntMod: 1, mpCost: 2, tier: "MINOR",
            effectType: "damage", school: "conjuration", damageType: "acid", damageDice: "2d4", range: "single_target_any_row", attackType: "spell_attack", castingStat: "INT"
        },
        {
            id: "VENOM_SPIT", name: "Venom Spit",
            description: "Spit venom at a front row enemy, dealing 1d4 poison damage. CON save or target's damage output is reduced by 1 for 1 turn.",
            minIntMod: 2, mpCost: 3, tier: "MINOR",
            effectType: "damage_debuff", school: "necromancy", damageType: "poison", damageDice: "1d4", saveAttribute: "CON", range: "single_target_front_row", debuff: "damage_penalty", debuffValue: -1, duration: "1_turn", castingStat: "INT"
        },
        {
            id: "NECROTIC_RAY_MINOR", name: "Minor Necrotic Ray",
            description: "A faint ray of necrotic energy deals 1d8+INT necrotic damage to one enemy.",
            minIntMod: 1, mpCost: 3, tier: "MINOR",
            effectType: "damage", school: "necromancy", damageType: "necrotic", damageDice: "1d8", damageBonusStat: "INT", range: "single_target_any_row", attackType: "spell_attack", castingStat: "INT"
        },
        {
            id: "RADIANT_FLARE_MINOR", name: "Minor Radiant Flare",
            description: "A burst of light deals 1d6+INT radiant damage to one enemy.",
            minIntMod: 1, mpCost: 3, tier: "MINOR",
            effectType: "damage", school: "evocation", damageType: "radiant", damageDice: "1d6", damageBonusStat: "INT", range: "single_target_any_row", castingStat: "INT"
        },
        {
            id: "THUNDERCLAP_MINOR", name: "Minor Thunderclap",
            description: "A small boom deals 1d6 thunder damage to a front row enemy. CON save or their next attack roll is -1.",
            minIntMod: 0, mpCost: 2, tier: "MINOR",
            effectType: "damage_debuff", school: "evocation", damageType: "thunder", damageDice: "1d6", saveAttribute: "CON", debuff: "attack_roll_penalty", debuffValue: -1, duration:"1_attack", range:"single_target_front_row", castingStat:"INT"
        },

        // --- Minor Buff Spells (INT Mod 0-2, MP Cost 1-4, Scales with WIS) ---
        {
            id: "MINOR_SHIELD_ALLY", name: "Minor Shield Ally",
            description: "An invisible barrier protects one ally, granting +2 AC for 3 turns.",
            minIntMod: 2, mpCost: 3, tier: "MINOR",
            effectType: "buff_defense", school: "abjuration", acBonus: 2, duration: "3_turns", target: "single_ally_any_row", castingStat: "WIS"
        },
        {
            id: "BARKSKIN_ALLY", name: "Barkskin Ally",
            description: "Target ally's skin becomes bark-like. Their AC becomes 13 for 3 turns if it isn't higher.",
            minIntMod: 2, mpCost: 4, tier: "MINOR", // AC formula simplified
            effectType: "buff_defense", school: "transmutation", duration: "3_turns", target: "single_ally_any_row", acSet: 13, castingStat: "WIS"
        },
        {
            id: "RESISTANCE_ELEMENTAL_MINOR", name: "Minor Elemental Resistance",
            description: "Choose Fire, Cold, or Lightning. Target ally gains resistance to that element for 3 turns.",
            minIntMod: 1, mpCost: 3, tier: "MINOR",
            effectType: "buff_resistance", school: "abjuration", duration: "3_turns", target: "single_ally_any_row", castingStat: "WIS"
        },
        {
            id: "ENHANCE_WEAPON_MINOR", name: "Minor Enhance Weapon",
            description: "Target ally's weapon deals an extra 1d4 damage of a random element (Fire, Cold, or Lightning) for 3 turns.",
            minIntMod: 2, mpCost: 4, tier: "MINOR",
            effectType: "buff_weapon_damage_elemental", school: "transmutation", duration: "3_turns", bonusDamageDice: "1d4", castingStat: "WIS", target: "ally_weapon"
        },
        {
            id: "GUIDANCE_MINOR", name: "Minor Guidance",
            description: "Target ally gains +1 to their next attack roll.",
            minIntMod: 1, mpCost: 2, tier: "MINOR",
            effectType: "buff_attack", school: "divination", duration: "1_attack", target: "single_ally_any_row", attackBonus: 1, castingStat: "WIS"
        },
        {
            id: "INSPIRE_MINOR", name: "Minor Inspire",
            description: "Target ally gains +1 to damage rolls for 3 turns.",
            minIntMod: 1, mpCost: 3, tier: "MINOR",
            effectType: "buff_damage", school: "enchantment", duration: "3_turns", target: "single_ally_any_row", damageBonus: 1, castingStat: "WIS"
        },
        {
            id: "FORTIFY_MINOR", name: "Minor Fortify",
            description: "Target ally gains 5 temporary HP for the entire combat.",
            minIntMod: 0, mpCost: 2, tier: "MINOR",
            effectType: "buff_temp_hp", school: "abjuration", tempHP: 5, duration: "entire_combat", target: "single_ally_any_row", castingStat: "WIS"
        },

        // --- Minor Healing Spells (INT Mod 0-2, MP Cost 1-4, Scales with WIS) ---
        {
            id: "HEALING_WORD_MINOR", name: "Minor Healing Word", // Renamed
            description: "An ally you can see regains 1d8+WIS hit points.",
            minIntMod: 1, mpCost: 3, tier: "MINOR",
            effectType: "healing", school: "evocation", healingDice: "1d8", healingBonusStat: "WIS", range: "single_ally_any_row", castingStat: "WIS"
        },
        {
            id: "SOOTHING_LIGHT_MINOR", name: "Minor Soothing Light", // Renamed
            description: "Heals 2d4+WIS HP to an ally in any row.",
            minIntMod: 2, mpCost: 4, tier: "MINOR",
            effectType: "healing", school: "conjuration", healingDice: "2d4", healingBonusStat: "WIS", range: "single_ally_any_row", castingStat: "WIS"
        },

        // --- Minor Debuff/Control Spells (INT Mod 0-2, MP Cost 1-4, Scales with INT) ---
        {
            id: "ENFEEBLE_MINOR", name: "Minor Enfeeble",
            description: "Target enemy (WIS save) deals -1 damage with weapon attacks for 2 turns.", // Duration increased
            minIntMod: 1, mpCost: 2, tier: "MINOR",
            effectType: "debuff_damage", school: "necromancy", saveAttribute: "WIS", range: "single_target_any_row", duration: "2_turns", damagePenalty: -1, castingStat: "INT"
        },
        {
            id: "TRIP_ENEMY", name: "Trip Enemy", // Replaced Slippery Ground
            description: "Target front row enemy must make a DEX save or lose their next action.",
            minIntMod: 1, mpCost: 3, tier: "MINOR",
            effectType: "control_lose_action", school: "transmutation", saveAttribute: "DEX", target: "single_target_front_row", castingStat: "INT"
        },
        {
            id: "CURSE_OF_VULNERABILITY_ELEMENTAL", name: "Elemental Vulnerability Curse", // Renamed
            description: "Target enemy (WIS save) becomes vulnerable (takes double damage) to one random element (Fire, Cold, or Lightning) for 2 turns.",
            minIntMod: 2, mpCost: 4, tier: "MINOR",
            effectType: "debuff_elemental_vulnerability", school: "necromancy", saveAttribute: "WIS", duration: "2_turns", target: "single_target_any_row", castingStat: "INT"
        },
        {
            id: "DISTRACT_ENEMY", name: "Distract Enemy", // Replaced Disarming Trip
            description: "Target enemy (WIS save) has their next attack roll reduced by -2.",
            minIntMod: 0, mpCost: 1, tier: "MINOR",
            effectType: "debuff_attack_roll", school: "illusion", saveAttribute: "WIS", range: "single_target_any_row", debuffValue: -2, duration:"1_attack", castingStat: "INT"
        },
        {
            id: "RAY_OF_WEAKNESS_MINOR", name: "Minor Ray of Weakness", // Replaced Ray of Sickness
            description: "Ranged spell attack. On hit, target enemy takes 1d6 necrotic damage and their damage output is reduced by 1 for 1 turn (CON save negates damage reduction).",
            minIntMod: 1, mpCost: 3, tier: "MINOR",
            effectType: "damage_debuff", school: "necromancy", damageType: "necrotic", damageDice: "1d6", saveAttribute: "CON", range: "single_target_any_row", attackType: "ranged_spell", debuff: "damage_penalty", debuffValue: -1, duration: "1_turn", castingStat: "INT"
        },
        {
            id: "LOWER_DEFENSE_MINOR", name: "Minor Lower Defense",
            description: "Target enemy (CON save) has its AC reduced by 1 for 2 turns.",
            minIntMod: 2, mpCost: 3, tier: "MINOR",
            effectType: "debuff_ac", school: "transmutation", saveAttribute: "CON", duration: "2_turns", target: "single_target_any_row", acPenalty: -1, castingStat: "INT"
        },
    ],
    MAJOR: [
        // --- Major Damage Spells (INT Mod 3-5, MP Cost 5-10, Scales with INT) ---
        {
            id: "FIREBALL", name: "Fireball",
            description: "A fiery explosion engulfs all enemies. Each creature must make a DEX save, taking 6d6 fire damage on a failed save, or half on success.",
            minIntMod: 5, mpCost: 10, tier: "MAJOR",
            effectType: "damage_area_all", school: "evocation", damageType: "fire", damageDice: "6d6", saveAttribute: "DEX", range: "all_enemies", castingStat: "INT"
        },
        {
            id: "FLAME_STRIKE_COLUMN", name: "Flame Strike (Column)",
            description: "A vertical column of divine fire roars down. All enemies in a chosen column take 4d8 fire damage (DEX save for half).",
            minIntMod: 4, mpCost: 7, tier: "MAJOR",
            effectType: "damage_column", school: "evocation", damageType: "fire", damageDice: "4d8", saveAttribute: "DEX", range: "enemy_column", castingStat: "INT"
        },
        {
            id: "LIGHTNING_STORM_ROW", name: "Lightning Storm (Row)",
            description: "A storm of lightning strikes an enemy row. Each creature must make a DEX save, taking 5d6 lightning damage on a failed save, or half on success.",
            minIntMod: 4, mpCost: 8, tier: "MAJOR",
            effectType: "damage_area_row", school: "evocation", damageType: "lightning", damageDice: "5d6", saveAttribute: "DEX", range: "enemy_row", castingStat: "INT"
        },
        {
            id: "ICE_SPEAR_COLUMN", name: "Ice Spear (Column)",
            description: "A spear of magical ice pierces through an enemy column. Each creature takes 4d10 cold damage (CON save for half).",
            minIntMod: 4, mpCost: 7, tier: "MAJOR",
            effectType: "damage_column", school: "evocation", damageType: "cold", damageDice: "4d10", saveAttribute: "CON", range: "enemy_column", castingStat: "INT"
        },
        {
            id: "SHADOW_BLAST_ALL", name: "Shadow Blast (All Enemies)",
            description: "A wave of necrotic energy washes over all enemies, dealing 3d8 necrotic damage. WIS save for half damage.",
            minIntMod: 5, mpCost: 9, tier: "MAJOR",
            effectType: "damage_area_all", school: "necromancy", damageType: "necrotic", damageDice: "3d8", saveAttribute: "WIS", range: "all_enemies", castingStat: "INT"
        },
        {
            id: "METEOR_SINGLE", name: "Single Meteor", // Renamed
            description: "Call down a small meteor on a target enemy, dealing 6d6 bludgeoning and 2d6 fire damage (DEX save for half).",
            minIntMod: 5, mpCost: 10, tier: "MAJOR",
            effectType: "damage_single_area_splash_implied", school: "conjuration", damageType: "bludgeoning_fire", damageDice: "6d6_bludg_2d6_fire", saveAttribute: "DEX", range: "single_target_any_row", castingStat: "INT"
        },
        {
            id: "ACID_RAIN_ROW", name: "Acid Rain (Row)",
            description: "Acidic rain pours down on an enemy row, dealing 3d8 acid damage (DEX save for half) and reducing AC by 1 for 2 turns.",
            minIntMod: 4, mpCost: 8, tier: "MAJOR",
            effectType: "damage_area_row_debuff", school: "conjuration", damageType: "acid", damageDice: "3d8", saveAttribute: "DEX", debuff: "ac_penalty", debuffValue: -1, duration: "2_turns", range: "enemy_row", castingStat: "INT"
        },
        {
            id: "PSYCHIC_SCREAM_ROW", name: "Psychic Scream (Row)", // Changed target from all
            description: "Unleash a mental scream. All enemies in a chosen row take 3d6 psychic damage and must make a WIS save or lose their next action.",
            minIntMod: 5, mpCost: 9, tier: "MAJOR", // Adjusted cost
            effectType: "damage_area_row_control", school: "enchantment", damageType: "psychic", damageDice: "3d6", saveAttribute: "WIS", effect: "lose_action", range: "enemy_row", castingStat: "INT"
        },
        {
            id: "FORCE_BLAST_COLUMN", name: "Force Blast (Column)",
            description: "A blast of pure force strikes an enemy column dealing 4d8 force damage (INT save for half).",
            minIntMod: 4, mpCost: 8, tier: "MAJOR",
            effectType: "damage_column", school: "evocation", damageType: "force", damageDice: "4d8", saveAttribute: "INT", range: "enemy_column", castingStat: "INT"
        },
        {
            id: "RADIANT_BEAM_SINGLE", name: "Radiant Beam (Single)",
            description: "A beam of holy light strikes a target for 5d8 radiant damage (DEX save for half).",
            minIntMod: 5, mpCost: 9, tier: "MAJOR",
            effectType: "damage_single", school: "evocation", damageType: "radiant", damageDice: "5d8", saveAttribute: "DEX", range: "single_target_any_row", castingStat: "INT"
        },


        // --- Major Healing Spells (INT Mod 3-5, MP Cost 5-10, Scales with WIS) ---
        {
            id: "MAJOR_HEAL_TARGET", name: "Major Heal Target",
            description: "A creature you select regains 4d8+WIS hit points.",
            minIntMod: 4, mpCost: 8, tier: "MAJOR",
            effectType: "healing", school: "evocation", healingDice: "4d8", healingBonusStat: "WIS", range: "single_ally_any_row", castingStat: "WIS"
        },
        {
            id: "MASS_HEALING_WORD_ROW", name: "Mass Healing Word (Row)",
            description: "All allies in a chosen row regain 2d8+WIS hit points each.",
            minIntMod: 4, mpCost: 9, tier: "MAJOR",
            effectType: "healing_area_allies_row", school: "evocation", healingDice: "2d8", healingBonusStat: "WIS", range: "ally_row", castingStat: "WIS"
        },
        {
            id: "REGENERATION_MINOR", name: "Minor Regeneration",
            description: "Target ally regains 1d6 HP at the start of their turn for 3 turns.",
            minIntMod: 5, mpCost: 10, tier: "MAJOR",
            effectType: "healing_over_time", school: "transmutation", healingDice: "1d6", duration: "3_turns", target: "single_ally_any_row", castingStat: "WIS"
        },
        {
            id: "HEALING_CIRCLE_ALLIES", name: "Healing Circle (All Allies)", // Replaced Restorative Field
            description: "All allies regain 3d4+WIS HP.",
            minIntMod: 5, mpCost: 10, tier: "MAJOR",
            effectType: "healing_area_allies_all", school: "conjuration", healingDice: "3d4", healingBonusStat: "WIS", range: "all_allies", castingStat: "WIS"
        },

        // --- Major Buff Spells (INT Mod 3-5, MP Cost 5-10, Scales with WIS) ---
        {
            id: "SHIELD_OF_FAITH_ALLY", name: "Shield of Faith (Ally)",
            description: "Protect one ally. For 5 turns, they gain +3 AC.", // Duration changed
            minIntMod: 3, mpCost: 6, tier: "MAJOR",
            effectType: "buff_defense", school: "abjuration", acBonus: 3, duration: "5_turns", target: "single_ally_any_row", castingStat: "WIS"
        },
        {
            id: "GREATER_INVISIBILITY_SELF", name: "Greater Invisibility (Self)",
            description: "You become invisible for 3 turns. Invisibility ends if you attack or cast an offensive spell.", // Simplified
            minIntMod: 5, mpCost: 9, tier: "MAJOR",
            effectType: "utility_stealth_superior", school: "illusion", duration: "3_turns", target: "self", castingStat: "WIS"
        },
        {
            id: "HASTE_ALLY", name: "Haste (Ally)",
            description: "Target ally gains an additional action on each of their turns and +1 AC for 3 turns.", // Simplified Haste
            minIntMod: 5, mpCost: 10, tier: "MAJOR",
            effectType: "buff_multi_ally", school: "transmutation", duration: "3_turns", target: "single_ally_any_row", acBonus: 1, effect: "extra_action", castingStat: "WIS"
        },
        {
            id: "STONESKIN_ALLY", name: "Stoneskin (Ally)",
            description: "Target ally gains resistance to nonmagical bludgeoning, piercing, and slashing damage for 5 turns.", // Duration changed
            minIntMod: 4, mpCost: 8, tier: "MAJOR",
            effectType: "buff_resistance", school: "abjuration", damageTypesResisted: ["bludgeoning_nonmagical", "piercing_nonmagical", "slashing_nonmagical"], duration: "5_turns", target: "single_ally_any_row", castingStat: "WIS"
        },
        {
            id: "BLESS_MAJOR_ROW", name: "Major Bless (Row)",
            description: "All allies in a chosen row gain +2 to attack rolls and +1 to damage rolls for 3 turns.",
            minIntMod: 4, mpCost: 7, tier: "MAJOR",
            effectType: "buff_multi_area", school: "divination", duration: "3_turns", target: "ally_row", attackBonus: 2, damageBonus: 1, castingStat: "WIS"
        },
        {
            id: "ELEMENTAL_PROTECTION_ALLIES", name: "Elemental Protection (Allies)",
            description: "All allies gain resistance to one chosen element (Fire, Cold, or Lightning) for 5 turns.", // Duration changed
            minIntMod: 5, mpCost: 10, tier: "MAJOR",
            effectType: "buff_resistance_area", school: "abjuration", duration: "5_turns", target: "all_allies", castingStat: "WIS"
        },
        {
            id: "HEROIC_AURA_ROW", name: "Heroic Aura (Row)", // Changed target
            description: "All allies in a chosen row gain 5 temporary HP and +1 to attack rolls for 5 turns.", // Duration changed
            minIntMod: 4, mpCost: 8, tier: "MAJOR",
            effectType: "buff_hp_attack_area", school: "enchantment", duration: "5_turns", target: "ally_row", tempHP: 5, attackBonus: 1, castingStat: "WIS"
        },

        // --- Major Debuff/Control Spells (INT Mod 3-5, MP Cost 5-10, Scales with INT) ---
        {
            id: "BANISHMENT_MINOR", name: "Minor Banishment",
            description: "Attempt to send one enemy to a harmless demiplane for 2 turns (CHA save negates). If successful, target is removed from combat.",
            minIntMod: 5, mpCost: 9, tier: "MAJOR",
            effectType: "control_remove_target", school: "abjuration", saveAttribute: "CHA", duration: "2_turns", range: "single_target_any_row", castingStat: "INT"
        },
        {
            id: "CURSE_OF_FRAGILITY", name: "Curse of Fragility",
            description: "Target enemy (WIS save) becomes vulnerable (takes double damage) to all physical damage (bludgeoning, piercing, slashing) for 2 turns.",
            minIntMod: 4, mpCost: 7, tier: "MAJOR",
            effectType: "debuff_vulnerability_physical", school: "necromancy", saveAttribute: "WIS", duration: "2_turns", range: "single_target_any_row", castingStat: "INT"
        },
        {
            id: "MIND_FOG_ROW", name: "Mind Fog (Row)",
            description: "Target enemy row (WIS save). Affected enemies have their attack rolls reduced by 2 for 2 turns.",
            minIntMod: 5, mpCost: 9, tier: "MAJOR",
            effectType: "debuff_area_attack_penalty", school: "enchantment", saveAttribute: "WIS", duration: "2_turns", range: "enemy_row", debuffValue: -2, castingStat: "INT"
        },
        {
            id: "WEAKENING_RAY", name: "Weakening Ray", // Replaced Phantasmal Killer
            description: "Make a ranged spell attack against one enemy. On a hit, the target deals half damage with weapon attacks for 2 turns (CON save at end of its turns to end early).",
            minIntMod: 5, mpCost: 8, tier: "MAJOR",
            effectType: "debuff_damage_halved", school: "necromancy", saveAttribute: "CON", duration: "2_turns", range: "single_target_any_row", attackType: "ranged_spell", castingStat: "INT"
        },
        {
            id: "WAVE_OF_WEARINESS", name: "Wave of Weariness",
            description: "All enemies (CON save) suffer -2 to their attack rolls for 2 turns.",
            minIntMod: 3, mpCost: 6, tier: "MAJOR",
            effectType: "debuff_area_attack_penalty", school: "enchantment", saveAttribute: "CON", duration: "2_turns", range: "all_enemies", debuffValue: -2, castingStat: "INT"
        },
        {
            id: "COMMAND_LOSE_TURN", name: "Command: Lose Turn", // Simplified Command Grovel
            description: "Target enemy (WIS save) loses its next action.",
            minIntMod: 3, mpCost: 5, tier: "MAJOR",
            effectType: "control_lose_action", school: "enchantment", saveAttribute: "WIS", range: "single_target_any_row", castingStat: "INT"
        },
        {
            id: "CURSE_OF_VULNERABILITY_MAJOR", name: "Major Curse of Vulnerability",
            description: "Target enemy (WIS save) becomes vulnerable to ALL damage types for 1 turn.",
            minIntMod: 5, mpCost: 10, tier: "MAJOR",
            effectType: "debuff_vulnerability_all", school: "necromancy", saveAttribute: "WIS", duration: "1_turn", range: "single_target_any_row", castingStat: "INT"
        },
        {
            id: "BLINDING_FLASH_ROW", name: "Blinding Flash (Row)",
            description: "All enemies in a chosen row must make a CON save or have their attack rolls reduced by 3 for 1 turn.", // Changed from Blinded
            minIntMod: 4, mpCost: 7, tier: "MAJOR",
            effectType: "debuff_area_attack_penalty", school: "evocation", saveAttribute: "CON", duration: "1_turn", range: "enemy_row", debuffValue: -3, castingStat: "INT"
        }
    ]
};

// --- AFFIXES specific to SPELLBOOKS ---
export const SPELLBOOK_AFFIXES = {
    PREFIXES: {
        MINOR: [],
        MAJOR: []
    },
    SUFFIXES: {
        MINOR: [],
        MAJOR: []
    }
};

// --- SPELLBOOK-SPECIFIC NAME PARTS & TEMPLATES ---
export const SPELLBOOK_NAME_PARTS = {
    ADJECTIVES: ["Worn", "Ancient", "Dusty", "Forbidden", "Leather-Bound", "Simple", "Ornate", "Mysterious", "Heavy", "Slim", "Enchanted", "Sealed", "Whispering", "Beginner's", "Adept's", "Master's"],
    NOUNS_TITLE: ["Tome", "Grimoire", "Libram", "Codex", "Manual", "Primer", "Lexicon", "Scrolls", "Writings", "Secrets", "Lessons", "Incantations", "Cantrips", "Spells", "Compendium", "Journal"],
    NOUNS_SUBJECT: ["Shadows", "Light", "the Elements", "Arcane Arts", "Forbidden Knowledge", "Illusions", "Summoning", "Protection", "Destruction", "the Mind", "the Stars", "Ancient Lore", "Evocation", "Transmutation", "Divination", "Necromancy", "Enchantment", "Abjuration", "Conjuration"],
    PREFIX_WORDS: ["Book", "Tome", "Codex", "Scroll", "Grimoire", "Volume", "Text"],
    SUFFIX_WORDS: ["of Spells", "of Incantations", "of Secrets", "of Power", "of Knowledge", "of the Arcane", "of Mysteries"]
};

export const SPELLBOOK_NAME_TEMPLATES = [
    "{adjective} {NOUNS_TITLE}",
    "{NOUNS_TITLE} of {NOUNS_SUBJECT}",
    "The {adjective} {NOUNS_TITLE} of {NOUNS_SUBJECT}",
    "{PREFIX_WORDS} {SUFFIX_WORDS}",
    "{material} {NOUNS_TITLE}"
];

console.log("magic_item_generator/categories/spellbooks/spellbookDefinitions.js (v6 - Further Spell Simplification & Targeting) loaded.");
