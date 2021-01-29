import React from 'react';
import { Trans } from '@lingui/macro';

import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import CoreAbilities from 'parser/core/modules/Abilities';
import { SpellbookAbility } from 'parser/core/modules/Ability';
import ISSUE_IMPORTANCE from 'parser/core/ISSUE_IMPORTANCE';

import { TrackedPaladinAbility } from '../core/PaladinAbilityTracker';

class Abilities extends CoreAbilities {
  spellbook(): Array<SpellbookAbility<TrackedPaladinAbility>> {
    const combatant = this.selectedCombatant;
    const hasSanctifiedWrath = combatant.hasTalent(SPELLS.SANCTIFIED_WRATH_TALENT_HOLY.id);
    return [
      {
        spell: [SPELLS.HOLY_SHOCK_CAST, SPELLS.HOLY_SHOCK_HEAL],
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => {
          const swCdr = hasSanctifiedWrath && combatant.hasBuff(SPELLS.AVENGING_WRATH.id) ? 0.5 : 0;
          return (7.5 / (1 + haste)) * (1 - swCdr);
        },
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          extraSuggestion: (
            <Trans id="paladin.holy.modules.abilities.castHolyShockRegularly">Casting Holy Shock regularly is very important for performing well.</Trans>
          ),
        },
        timelineSortIndex: 0,
        isDefensive: true,
      },
      {
        spell: SPELLS.LIGHT_OF_DAWN_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 1,
      },
      {
        spell: [SPELLS.JUDGMENT_CAST_HOLY, SPELLS.JUDGMENT_CAST],
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => {
          const cdr = combatant.hasBuff(SPELLS.AVENGING_CRUSADER_TALENT.id) ? 0.3 : 0;
          return (12 / (1 + haste)) * (1 - cdr);
        },
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: combatant.hasTalent(SPELLS.JUDGMENT_OF_LIGHT_TALENT.id),
          extraSuggestion: (
            <Trans id="paladin.holy.modules.abilities.judgmentOfLightTalent">
              You should cast it whenever <SpellLink id={SPELLS.JUDGMENT_OF_LIGHT_TALENT.id} /> has
              dropped, which is usually on cooldown without delay. Alternatively you can ignore the
              debuff and just cast it whenever Judgment is available; there's nothing wrong with
              ignoring unimportant things to focus on important things.
            </Trans>
          ),
          recommendedEfficiency: 0.85, // this rarely overheals, so keeping this on cooldown is pretty much always best
        },
        timelineSortIndex: 20,
      },
      {
        spell: SPELLS.BESTOW_FAITH_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 12,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.7,
          extraSuggestion: (
            <Trans id="paladin.holy.modules.abilities.bestowFaithTalent">
              If you can't or don't want to cast it more consider using{' '}
              <SpellLink id={SPELLS.LIGHTS_HAMMER_TALENT.id} /> or{' '}
              <SpellLink id={SPELLS.CRUSADERS_MIGHT_TALENT.id} /> instead.
            </Trans>
          ),
        },
        timelineSortIndex: 3,
        enabled: combatant.hasTalent(SPELLS.BESTOW_FAITH_TALENT.id),
      },
      {
        spell: SPELLS.LIGHTS_HAMMER_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 60,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 3,
        enabled: combatant.hasTalent(SPELLS.LIGHTS_HAMMER_TALENT.id),
      },
      {
        spell: SPELLS.BEACON_OF_VIRTUE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 15,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 25,
        enabled: combatant.hasTalent(SPELLS.BEACON_OF_VIRTUE_TALENT.id),
      },
      {
        spell: SPELLS.CRUSADER_STRIKE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => {
          const cdr = combatant.hasBuff(SPELLS.AVENGING_CRUSADER_TALENT.id) ? 0.3 : 0;
          return (6 / (1 + haste)) * (1 - cdr);
        },
        charges: 2,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          extraSuggestion: (
            <Trans id="paladin.holy.modules.abilities.crusadersMightTalent">
              When you are using <SpellLink id={SPELLS.CRUSADERS_MIGHT_TALENT.id} /> it is important
              to use <SpellLink id={SPELLS.CRUSADER_STRIKE.id} /> often enough to benefit from the
              talent. Use a different talent if you are unable to.
            </Trans>
          ),
          recommendedEfficiency: 0.35,
        },
        timelineSortIndex: 50,
        enabled: combatant.hasTalent(SPELLS.CRUSADERS_MIGHT_TALENT.id),
      },
      {
        spell: SPELLS.HOLY_PRISM_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 20,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 4,
        enabled: combatant.hasTalent(SPELLS.HOLY_PRISM_TALENT.id),
        isDefensive: true,
      },
      {
        spell: SPELLS.RULE_OF_LAW_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 30,
        gcd: undefined,
        charges: 2,
        timelineSortIndex: 11,
        enabled: combatant.hasTalent(SPELLS.RULE_OF_LAW_TALENT.id),
      },
      {
        spell: SPELLS.DIVINE_PROTECTION,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 60 * (1 - (combatant.hasTalent(SPELLS.UNBREAKABLE_SPIRIT_TALENT.id) ? 0.3 : 0)),
        gcd: undefined,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.6,
          importance: ISSUE_IMPORTANCE.MINOR,
        },
        timelineSortIndex: 45,
        isDefensive: true,
      },
      {
        spell: SPELLS.DIVINE_SHIELD,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown:
          5 * 60 * (1 - (combatant.hasTalent(SPELLS.UNBREAKABLE_SPIRIT_TALENT.id) ? 0.3 : 0)),
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 46,
        isDefensive: true,
      },
      {
        spell: SPELLS.HOLY_AVENGER_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        castEfficiency: {
          suggestion: true,
        },
        enabled: combatant.hasTalent(SPELLS.HOLY_AVENGER_TALENT.id),
        timelineSortIndex: 33,
      },
      {
        spell: SPELLS.AVENGING_WRATH,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        castEfficiency: {
          suggestion: true,
        },
        timelineSortIndex: 32,
        enabled: !combatant.hasTalent(SPELLS.AVENGING_CRUSADER_TALENT.id),
      },
      {
        spell: SPELLS.AVENGING_CRUSADER_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        castEfficiency: {
          suggestion: true,
        },
        timelineSortIndex: 32,
        enabled: combatant.hasTalent(SPELLS.AVENGING_CRUSADER_TALENT.id),
      },
      {
        spell: SPELLS.AURA_MASTERY,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.6,
        },
        timelineSortIndex: 34,
      },
      {
        spell: SPELLS.BLESSING_OF_SACRIFICE,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        gcd: undefined,
        timelineSortIndex: 101,
      },
      {
        spell: SPELLS.LAY_ON_HANDS,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 600 * (1 - (combatant.hasTalent(SPELLS.UNBREAKABLE_SPIRIT_TALENT.id) ? 0.3 : 0)),
        gcd: undefined,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.1,
        },
        timelineSortIndex: 101,
        isDefensive: true,
      },
      {
        spell: SPELLS.LIGHT_OF_THE_MARTYR,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 19,
      },
      {
        spell: SPELLS.FLASH_OF_LIGHT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        channel: haste => 1.5 / (1 + haste),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          name: `Filler ${SPELLS.FLASH_OF_LIGHT.name}`,
          casts: castCount => castCount.casts - (castCount.healingIolHits || 0),
        },
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.FLASH_OF_LIGHT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        channel: haste => 1.5 / (1 + haste),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          name: `${SPELLS.INFUSION_OF_LIGHT.name} ${SPELLS.FLASH_OF_LIGHT.name}`,
          casts: castCount => castCount.healingIolHits || 0,
        },
        timelineSortIndex: 10,
      },
      {
        spell: SPELLS.HOLY_LIGHT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          name: `Filler ${SPELLS.HOLY_LIGHT.name}`,
          casts: castCount => castCount.casts - (castCount.healingIolHits || 0),
        },
        timelineSortIndex: 2,
      },
      {
        spell: SPELLS.HOLY_LIGHT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          name: `${SPELLS.INFUSION_OF_LIGHT.name} ${SPELLS.HOLY_LIGHT.name}`,
          casts: castCount => castCount.healingIolHits || 0,
        },
        timelineSortIndex: 2,
      },
      {
        spell: SPELLS.WORD_OF_GLORY,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 2,
      },
      {
        spell: SPELLS.DIVINE_STEED,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        charges: combatant.hasTalent(SPELLS.CAVALIER_TALENT.id) ? 2 : 1,
        cooldown: 45,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 44,
        isDefensive: true,
      },
      {
        spell: SPELLS.CLEANSE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 100,
        isDefensive: true,
      },
      {
        spell: SPELLS.BLESSING_OF_FREEDOM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 25,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 102,
        isDefensive: true,
      },
      {
        spell: SPELLS.BLESSING_OF_PROTECTION,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 5 * 60,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 103,
        isDefensive: true,
      },
      {
        spell: SPELLS.BEACON_OF_LIGHT_CAST_AND_BUFF,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 110,
        enabled: combatant.hasTalent(SPELLS.DIVINE_PURPOSE_TALENT.id),
      },
      {
        // The primary beacon cast is registered as BEACON_OF_LIGHT_CAST_AND_BUFF
        spell: [SPELLS.BEACON_OF_FAITH_TALENT, SPELLS.BEACON_OF_LIGHT_CAST_AND_BUFF],
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 110,
        enabled: combatant.hasTalent(SPELLS.BEACON_OF_FAITH_TALENT.id),
      },
      {
        spell: SPELLS.CRUSADER_STRIKE,
        category: Abilities.SPELL_CATEGORIES.HEALER_DAMAGING_SPELL,
        cooldown: haste => {
          const cdr = combatant.hasBuff(SPELLS.AVENGING_CRUSADER_TALENT.id) ? 0.3 : 0;
          return (6 / (1 + haste)) * (1 - cdr);
        },
        charges: 2,
        timelineSortIndex: 50,
        enabled: !combatant.hasTalent(SPELLS.CRUSADERS_MIGHT_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CONSECRATION_CAST,
        category: Abilities.SPELL_CATEGORIES.HEALER_DAMAGING_SPELL,
        cooldown: haste => 4.5 / (1 + haste),
        timelineSortIndex: 51,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.BLINDING_LIGHT_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 90,
        timelineSortIndex: 104,
        enabled: combatant.hasTalent(SPELLS.BLINDING_LIGHT_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HAMMER_OF_JUSTICE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 60,
        timelineSortIndex: 105,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HAND_OF_RECKONING,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
        gcd: undefined,
        timelineSortIndex: 106,
      },
      {
        spell: SPELLS.SERAPHIM_TALENT,
        buffSpellId: SPELLS.SERAPHIM_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.SEMI_DEFENSIVE,
        cooldown: 45,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.SERAPHIM_TALENT.id),
        castEfficiency: {
          suggestion: true,
        },
      },
    ];
  }
}

export default Abilities;
