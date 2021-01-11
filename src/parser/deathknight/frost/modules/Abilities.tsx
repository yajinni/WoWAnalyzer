import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

import CoreAbilities from 'parser/core/modules/Abilities';
import { SpellbookAbility } from 'parser/core/modules/Ability';
import COVENANTS from 'game/shadowlands/COVENANTS';

class Abilities extends CoreAbilities {
  spellbook(): SpellbookAbility[] {
    const combatant = this.selectedCombatant;
    return [
      // COOLDOWNS
      {
        spell: SPELLS.PILLAR_OF_FROST,
        buffSpellId: SPELLS.PILLAR_OF_FROST.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: null,
        cooldown: 60,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.85,
          extraSuggestion: 'You should aim to use this off CD.',
        },
        timelineSortIndex: 0,
      },
      {
        spell: SPELLS.EMPOWER_RUNE_WEAPON,
        buffSpellId: SPELLS.EMPOWER_RUNE_WEAPON.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: null,
        cooldown: 120,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.80,
          extraSuggestion: <>You should use this with every <SpellLink id={SPELLS.BREATH_OF_SINDRAGOSA_TALENT.id} /> if it is talented. Otherwise use it with <SpellLink id={SPELLS.PILLAR_OF_FROST.id} />.</>,
        },
        timelineSortIndex: 1,
      },
      {
        spell: SPELLS.HORN_OF_WINTER_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: {
          base: 1500,
        },
        cooldown: 45,
        enabled: combatant.hasTalent(SPELLS.HORN_OF_WINTER_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
        },
      },
      {
        spell: SPELLS.BREATH_OF_SINDRAGOSA_TALENT,
        buffSpellId: SPELLS.BREATH_OF_SINDRAGOSA_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: null,
        cooldown: 120,
        enabled: combatant.hasTalent(SPELLS.BREATH_OF_SINDRAGOSA_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
          extraSuggestion: 'You should only save this if there is a mechanic you will need to deal with in the next 30 seconds or if you need to save it for a particular phase',
        },
        timelineSortIndex: 2,
      },
      {
        spell: SPELLS.FROSTWYRMS_FURY,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: {
          base: 1500,
        },
        cooldown: 180,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
          extraSuggestion: <>Although you normally want to use this off CD, you can save it to line it up with <SpellLink id={SPELLS.PILLAR_OF_FROST.id} icon />.  You can also hold it if you know there will be an opportunity to hit more than one enemy in the next 30 seconds.</>,
        },
      },
      {
        spell: SPELLS.HYPOTHERMIC_PRESENCE_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: null,
        cooldown: 45,
        enabled: combatant.hasTalent(SPELLS.HYPOTHERMIC_PRESENCE_TALENT.id),
      },
      {
        spell: SPELLS.RAISE_DEAD_BLOOD_FROST,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: null,
        cooldown: 120,
      },
      // ROTATIONAL
      {
        spell: SPELLS.OBLITERATE_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.REMORSELESS_WINTER,
        buffSpellId: SPELLS.REMORSELESS_WINTER.id,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
        cooldown: 20,
        castEfficiency: {
          suggestion: false,
          recommendedEfficiency: 0.90,
        },
      },
      {
        spell: SPELLS.HOWLING_BLAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FROST_STRIKE_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FROSTSCYTHE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.FROSTSCYTHE_TALENT.id),
      },
      {
        spell: SPELLS.GLACIAL_ADVANCE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 6 / (1 + haste),
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.GLACIAL_ADVANCE_TALENT.id),
      },
      {
        spell: SPELLS.SACRIFICIAL_PACT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        gcd: {
          base: 1500,
        },
      },

      // DEFENSIVE
      {
        spell: SPELLS.ANTI_MAGIC_SHELL,
        buffSpellId: SPELLS.ANTI_MAGIC_SHELL.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: null,
        cooldown: 60,
        isDefensive: true,
      },
      {
        spell: SPELLS.ICEBOUND_FORTITUDE,
        buffSpellId: SPELLS.ICEBOUND_FORTITUDE.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: null,
        cooldown: 180,
        isDefensive: true,
      },
      {
        spell: SPELLS.DEATH_STRIKE,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: {
          base: 1500,
        },
        isDefensive: true,
      },
      {
        spell: SPELLS.DEATH_PACT_TALENT,
        buffSpellId: SPELLS.DEATH_PACT_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: null,
        cooldown: 120,
        isDefensive: true,
        enabled: combatant.hasTalent(SPELLS.DEATH_PACT_TALENT.id),
      },
      {
        spell: SPELLS.ANTI_MAGIC_ZONE,
        buffSpellId: SPELLS.ANTI_MAGIC_ZONE_BUFF.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: null,
        cooldown: 120,
        isDefensive: true,
      },
      {
        spell: SPELLS.LICHBORNE,
        buffSpellId: SPELLS.LICHBORNE.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: null,
        cooldown: 120,
        isDefensive: true,
      },
      // UTILITY
      {
        spell: SPELLS.DEATH_GRIP,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          static: 500,
        },
        cooldown: 25,
      },
      {
        spell: SPELLS.CHAINS_OF_ICE,
        category: combatant.hasTalent(SPELLS.COLD_HEART_TALENT.id) ? Abilities.SPELL_CATEGORIES.ROTATIONAL : Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.DEATHS_ADVANCE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: null,
        cooldown: 45,
      },
      {
        spell: SPELLS.DARK_COMMAND,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: null,
        cooldown: 8,
      },
      {
        spell: SPELLS.RAISE_ALLY,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 600,
      },
      {
        spell: SPELLS.MIND_FREEZE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: null,
        cooldown: 15,
      },
      {
        spell: SPELLS.PATH_OF_FROST,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.ASPHYXIATE_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 45,
      },
      {
        spell: SPELLS.CONTROL_UNDEAD,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.BLINDING_SLEET_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 60,
        enabled: combatant.hasTalent(SPELLS.BLINDING_SLEET_TALENT.id),
      },
      {
        spell: SPELLS.WRAITH_WALK_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 60,
        enabled: combatant.hasTalent(SPELLS.WRAITH_WALK_TALENT.id),
      },
      {
        spell: SPELLS.DEATH_AND_DECAY,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 30,
      },
      {
        spell: SPELLS.DEATH_COIL,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        }
      },
      // RUNES
      {
        spell: SPELLS.RUNE_1,
        category: Abilities.SPELL_CATEGORIES.HIDDEN,
        cooldown: haste => 10 / (1 + haste),
        charges: 2,
      },

      {
        spell: SPELLS.RUNE_2,
        category: Abilities.SPELL_CATEGORIES.HIDDEN,
        cooldown: haste => 10 / (1 + haste),
        charges: 2,
      },

      {
        spell: SPELLS.RUNE_3,
        category: Abilities.SPELL_CATEGORIES.HIDDEN,
        cooldown: haste => 10 / (1 + haste),
        charges: 2,
      },
      // covenants
      {
        spell: SPELLS.SWARMING_MIST,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,     
        cooldown: 60,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
        },
        enabled: combatant.hasCovenant(COVENANTS.VENTHYR.id),
      },
      {
        spell: SPELLS.DOOR_OF_SHADOWS,
        category: Abilities.SPELL_CATEGORIES.UTILITY,     
        cooldown: 60,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasCovenant(COVENANTS.VENTHYR.id),
      },
      {
        spell: SPELLS.ABOMINATION_LIMB,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,     
        cooldown: 120,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
        },
        enabled: combatant.hasCovenant(COVENANTS.NECROLORD.id),
      },
      {
        spell: SPELLS.FLESHCRAFT,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,     
        cooldown: 120,
        enabled: combatant.hasCovenant(COVENANTS.NECROLORD.id),
      },
      {
        spell: SPELLS.SHACKLE_THE_UNWORTHY,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,     
        cooldown: 60,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
        },
        enabled: combatant.hasCovenant(COVENANTS.KYRIAN.id),
      },
      {
        spell: SPELLS.DEATHS_DUE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,     
        cooldown: 30,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
        },
        enabled: combatant.hasCovenant(COVENANTS.NIGHT_FAE.id),
      },
      {
        spell: SPELLS.SOULSHAPE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,     
        cooldown: 30,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasCovenant(COVENANTS.NIGHT_FAE.id),
      },
    ];
  }
}

export default Abilities;
