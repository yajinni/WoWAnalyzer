import SPELLS from 'common/SPELLS';
import CoreAbilities from 'parser/core/modules/Abilities';
import { SpellbookAbility } from 'parser/core/modules/Ability';
import COVENANTS from 'game/shadowlands/COVENANTS';

class Abilities extends CoreAbilities {
  spellbook(): SpellbookAbility[] {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: [SPELLS.PENANCE_CAST, SPELLS.PENANCE],
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 9,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.POWER_WORD_RADIANCE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 20,
        charges: 2,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.EVANGELISM_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 90,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.EVANGELISM_TALENT.id),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.POWER_WORD_SHIELD,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        isDefensive: true,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SCHISM_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 24,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.SCHISM_TALENT.id),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.POWER_WORD_SOLACE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 15 / (1 + haste),
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.POWER_WORD_SOLACE_TALENT.id),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.DIVINE_STAR_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 15,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.DIVINE_STAR_TALENT.id),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.HALO_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 40,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.HALO_TALENT.id),
        castEfficiency: {
          suggestion: true,
        },
      },

      {
        spell: SPELLS.MINDBENDER_TALENT_SHARED,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 60,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.MINDBENDER_TALENT_SHARED.id),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.SHADOWFIEND,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        gcd: {
          base: 1500,
        },
        enabled: !combatant.hasTalent(SPELLS.MINDBENDER_TALENT_SHARED.id),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.RAPTURE,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 90,
        gcd: {
          base: 1500,
        },
        enabled: !combatant.hasTalent(SPELLS.SPIRIT_SHELL_TALENT.id),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.PAIN_SUPPRESSION,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 3 * 60,
      },
      {
        spell: SPELLS.DESPERATE_PRAYER,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 90,
      },
      {
        spell: SPELLS.POWER_WORD_BARRIER_CAST,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 3 * 60,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SHADOW_WORD_PAIN,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        enabled: !combatant.hasTalent(SPELLS.PURGE_THE_WICKED_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.PURGE_THE_WICKED_TALENT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        enabled: combatant.hasTalent(SPELLS.PURGE_THE_WICKED_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SMITE,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
      },

      {
        spell: SPELLS.ANGELIC_FEATHER_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 20,
        charges: 3,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.ANGELIC_FEATHER_TALENT.id),
      },
      {
        spell: SPELLS.SHINING_FORCE_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 45,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.SHINING_FORCE_TALENT.id),
      },
      {
        spell: SPELLS.FADE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
      },
      {
        spell: SPELLS.LEAP_OF_FAITH,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 150,
      },
      {
        spell: SPELLS.MIND_CONTROL,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: combatant.hasTalent(SPELLS.DOMINANT_MIND_TALENT.id) ? 120 : 0,
      },
      {
        spell: SPELLS.MASS_DISPEL,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 15,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.DISPEL_MAGIC,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.PURIFY,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SHACKLE_UNDEAD,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.PSYCHIC_SCREAM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 60 - (combatant.hasTalent(SPELLS.PSYCHIC_VOICE_TALENT.id) ? 30 : 0),
      },
      {
        spell: SPELLS.SHADOW_MEND,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SHADOW_COVENANT_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 12,
        castEfficiency: {
          suggestion: true,
        },
        enabled: combatant.hasTalent(SPELLS.SHADOW_COVENANT_TALENT.id),
      },
      {
        spell: SPELLS.LEVITATE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.MIND_BLAST,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.MIND_SEAR,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.MIND_SOOTHE,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.POWER_INFUSION,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SHADOW_WORD_DEATH,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FLESHCRAFT,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 120,
        enabled: combatant.hasCovenant(COVENANTS.NECROLORD.id),
      },
      {
        spell: SPELLS.UNHOLY_NOVA,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 60,
        enabled: combatant.hasCovenant(COVENANTS.NECROLORD.id),
      },
    ];
  }
}

export default Abilities;
