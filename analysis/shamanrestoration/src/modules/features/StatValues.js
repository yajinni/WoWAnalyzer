import { Trans } from '@lingui/macro';
import React from 'react';

import SPELLS from 'common/SPELLS';
import BaseHealerStatValues from 'parser/shared/modules/features/BaseHealerStatValues';
import STAT from 'parser/shared/modules/features/STAT';
import StatTracker from 'parser/shared/modules/StatTracker';
import HealingValue from 'parser/shared/modules/HealingValue';
import CritEffectBonus from 'parser/shared/modules/helpers/CritEffectBonus';

import Events from 'parser/core/Events';

import SPELL_INFO from './StatValuesSpellInfo';
import MasteryEffectiveness from './MasteryEffectiveness';

/**
 * Restoration Shaman Stat Values
 */

const BUFFER_MS = 100;

class StatValues extends BaseHealerStatValues {
  static dependencies = {
    statTracker: StatTracker,
    critEffectBonus: CritEffectBonus,
    masteryEffectiveness: MasteryEffectiveness,
  };

  spellInfo = SPELL_INFO;
  qeLive = true;

  constructor(options) {
    super(options);
    this.addEventListener(Events.feedheal, this.onFeedHeal);
  }

  onFeedHeal(event) {
    const spellInfo = this._getSpellInfo(event);
    const healVal = new HealingValue(event.feed, 0, 0);
    const targetHealthPercentage = (event.hitPoints - event.amount) / event.maxHitPoints; // hitPoints contains HP *after* the heal
    this._handleHeal(spellInfo, event, healVal, targetHealthPercentage);
  }

  _getCritChance(event) {
    const spellId = event.ability.guid;
    const critChanceBreakdown = super._getCritChance(event);

    const hasTidalWaves = this.selectedCombatant.hasBuff(SPELLS.TIDAL_WAVES_BUFF.id, event.timestamp, 0, BUFFER_MS);
    if (spellId === SPELLS.HEALING_SURGE.id && hasTidalWaves) {
      critChanceBreakdown.baseCritChance += 0.4;
    }

    return critChanceBreakdown;
  }

  _hasteHpm(event, healVal) {
    if (healVal.overheal) {
      return 0;
    }
    if (event.ability.guid === SPELLS.RIPTIDE.id && !event.tick) {
      return 0;
    }
    return super._hasteHpm(event, healVal);
  }

  _mastery(event, healVal) {
    if (healVal.overheal) {
      // If a spell overheals, it could not have healed for more. Seeing as Mastery only adds HP on top of the existing heal we can skip it as increasing the power of this heal would only be more overhealing.
      return 0;
    }
    if (event.masteryEffectiveness === undefined) {
      console.error('This spell does not have a known masteryEffectiveness:', event.ability.guid, event.ability.name);
      return 0;
    }

    const masteryEffectiveness = event.masteryEffectiveness;
    const healIncreaseFromOneMastery = this.statTracker.statMultiplier.mastery / this.statTracker.ratingNeededForNextPercentage(this.statTracker.currentMasteryRating, this.statTracker.statBaselineRatingPerPercent[STAT.MASTERY], this.selectedCombatant.spec.masteryCoefficient) * masteryEffectiveness;
    const baseHeal = healVal.effective / (1 + this.statTracker.currentMasteryPercentage * masteryEffectiveness);

    return baseHeal * healIncreaseFromOneMastery;
  }

  _prepareResults() {
    return [
      STAT.INTELLECT,
      {
        stat: STAT.CRITICAL_STRIKE,
        tooltip: <Trans id="shaman.restoration.statValues.crit">Weight does not include Resurgence mana gain.</Trans>,
      },
      {
        stat: STAT.HASTE_HPCT,
        tooltip: (
          <Trans id="shaman.restoration.statValues.hpct">
            HPCT stands for "Healing per Cast Time". This is the max value that Haste would be worth if you would cast everything you are already casting (that scales with Haste) faster. Mana and overhealing are not accounted for in any way.<br /><br />

            The real value of Haste (HPCT) will be between 0 and the shown value. It depends on various things, such as if you have the mana left to spend, if the gained casts would overheal, and how well you are at casting spells end-to-end. If you are going OOM before the end of the fight you might instead want to drop some Haste or cast fewer bad heals. If you had mana left-over, Haste could help you convert that into healing. If your Haste usage is optimal Haste will then be worth the shown max value.<br /><br />

            Haste can also help you safe lives during intense damage phases. If you notice you're GCD capped when people are dying, Haste might help you land more heals. This may contribute more towards actually getting the kill.
          </Trans>
        ),
      },
      STAT.HASTE_HPM,
      STAT.MASTERY,
      STAT.VERSATILITY,
      STAT.VERSATILITY_DR,
      STAT.LEECH,
    ];
  }
}

export default StatValues;
