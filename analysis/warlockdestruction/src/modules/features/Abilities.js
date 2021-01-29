import CoreAbilities from 'parser/core/modules/Abilities';

import SPELLS from 'common/SPELLS';
import ISSUE_IMPORTANCE from 'parser/core/ISSUE_IMPORTANCE';

const FEL_CELERITY_REDUCTION_SEC = {
  1: 48,
  2: 51,
  3: 54,
  4: 57,
  5: 60,
  6: 63,
  7: 66,
  8: 69,
  9: 72,
  10: 75,
  11: 78,
  12: 81,
  13: 84,
  14: 87,
  15: 90,
};

class Abilities extends CoreAbilities {
  spellbook() {
    const combatant = this.selectedCombatant;
    return [
      // Rotational spells
      {
        spell: SPELLS.CHAOS_BOLT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CHANNEL_DEMONFIRE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 25 / (1 + haste),
        enabled: combatant.hasTalent(SPELLS.CHANNEL_DEMONFIRE_TALENT.id),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
        },
      },
      {
        spell: SPELLS.CONFLAGRATE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 13 / (1 + haste),
        charges: 2,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
        },
      },
      {
        spell: SPELLS.CORRUPTION_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
        buffSpellId: SPELLS.CORRUPTION_DEBUFF.id,
      },
      {
        spell: SPELLS.SOUL_FIRE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        enabled: combatant.hasTalent(SPELLS.SOUL_FIRE_TALENT.id),
        cooldown: 45, // TODO: further shortened via spending soul shards
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
        },
      },
      {
        spell: SPELLS.SHADOWBURN_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 12 / (1 + haste),
        charges: 2,
        enabled: combatant.hasTalent(SPELLS.SHADOWBURN_TALENT.id),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
        },
        buffSpellId: SPELLS.SHADOWBURN_TALENT.id,
      },
      {
        spell: SPELLS.IMMOLATE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
        buffSpellId: SPELLS.IMMOLATE_DEBUFF.id,
      },
      {
        spell: SPELLS.INCINERATE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HAVOC,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 30,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: false,
        },
        buffSpellId: SPELLS.HAVOC.id,
      },
      {
        spell: SPELLS.RAIN_OF_FIRE_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CATACLYSM_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        cooldown: 30,
        enabled: combatant.hasTalent(SPELLS.CATACLYSM_TALENT.id),
        castEfficiency: {
          suggestion: false,
        },
      },

      // Cooldowns
      {
        spell: SPELLS.SUMMON_INFERNAL,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.DARK_SOUL_INSTABILITY_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.DARK_SOUL_INSTABILITY_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
        },
        buffSpellId: SPELLS.DARK_SOUL_INSTABILITY_TALENT.id,
      },

      // Defensive
      {
        spell: SPELLS.UNENDING_RESOLVE,
        buffSpellId: SPELLS.UNENDING_RESOLVE.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 180,
        gcd: null,
        castEfficiency: {
          suggestion: true,
          importance: ISSUE_IMPORTANCE.MINOR,
          recommendedEfficiency: 0.33,
          averageIssueEfficiency: 0.20,
          majorIssueEfficiency: 0.10,
        },
      },
      {
        spell: SPELLS.DARK_PACT_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 60,
        gcd: null,
        enabled: combatant.hasTalent(SPELLS.DARK_PACT_TALENT.id),
        castEfficiency: {
          suggestion: true,
          importance: ISSUE_IMPORTANCE.MINOR,
          recommendedEfficiency: 0.33,
          averageIssueEfficiency: 0.20,
          majorIssueEfficiency: 0.10,
        },
        buffSpellId: SPELLS.DARK_PACT_TALENT.id,
      },

      // Utility
      {
        spell: SPELLS.BURNING_RUSH_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        enabled: combatant.hasTalent(SPELLS.BURNING_RUSH_TALENT.id),
        gcd: {
          base: 1500,
        },
        buffSpellId: SPELLS.BURNING_RUSH_TALENT.id,
      },
      {
        spell: SPELLS.DRAIN_LIFE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.MORTAL_COIL_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 45,
        enabled: combatant.hasTalent(SPELLS.MORTAL_COIL_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.DEMONIC_CIRCLE_SUMMON,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 10,
        castEfficiency: {
          suggestion: false,
        },
      },
      {
        spell: SPELLS.DEMONIC_CIRCLE_TELEPORT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: false,
        },
      },
      {
        spell: SPELLS.SOULSTONE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.DEMONIC_GATEWAY_CAST,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 10,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.GRIMOIRE_OF_SACRIFICE_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
        enabled: combatant.hasTalent(SPELLS.GRIMOIRE_OF_SACRIFICE_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.BANISH,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CREATE_HEALTHSTONE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CREATE_SOULWELL,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 120,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SUBJUGATE_DEMON,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.EYE_OF_KILROGG,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FEAR_CAST,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CURSE_OF_TONGUES,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CURSE_OF_WEAKNESS,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CURSE_OF_EXHAUSTION,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HEALTH_FUNNEL_CAST,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: [
          SPELLS.SUMMON_IMP,
          SPELLS.SUMMON_VOIDWALKER,
          SPELLS.SUMMON_SUCCUBUS,
          SPELLS.SUMMON_FELHUNTER,
        ],
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SHADOWFURY,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: combatant.hasTalent(SPELLS.DARKFURY_TALENT.id) ? 45 : 60,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FEL_DOMINATION,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: combatant.hasConduitBySpellID(SPELLS.FEL_CELERITY.id) ? 180 - FEL_CELERITY_REDUCTION_SEC[combatant.conduitRankBySpellID(SPELLS.FEL_CELERITY.id)] : 180,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.UNENDING_BREATH,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HOWL_OF_TERROR_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        enabled: combatant.hasTalent(SPELLS.HOWL_OF_TERROR_TALENT.id),
        cooldown: 40,
        gcd: {
          base: 1500,
        },
      },
    ];
  }
}

export default Abilities;
