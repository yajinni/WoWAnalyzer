import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import { t } from '@lingui/macro';

import HitCountAoE from '../core/HitCountAoE';

/**
 * Even with its DoT, thrash shouldn't be used against a single target
 */
class ThrashHitCount extends HitCountAoE {
  get hitNoneThresholds() {
    return {
      actual: this.hitZeroPerMinute,
      isGreaterThan: {
        minor: 0,
        average: 0.2,
        major: 0.5,
      },
      style: 'number',
    };
  }

  get hitJustOneThresholds() {
    return {
      actual: this.hitJustOnePerMinute,
      isGreaterThan: {
        minor: 0,
        average: 0.5,
        major: 3.0,
      },
      style: 'number',
    };
  }

  static spell = SPELLS.THRASH_FERAL;

  statistic() {
    return this.generateStatistic(STATISTIC_ORDER.OPTIONAL(11));
  }

  suggestions(when) {
    when(this.hitNoneThresholds).addSuggestion((suggest, actual, recommended) => suggest(
      <>
        You are using <SpellLink id={SPELLS.THRASH_FERAL.id} /> out of range of any targets. Try to get familiar with the range of your area of effect abilities so you can avoid wasting energy when they'll not hit anything.
      </>,
    )
      .icon(SPELLS.THRASH_FERAL.icon)
      .actual(t({
      id: "druid.feral.suggestions.thrash.hitcount.outOfRange",
      message: `${actual.toFixed(1)} uses per minute that hit nothing.`
    }))
      .recommended(`${recommended} is recommended`));
  }
}

export default ThrashHitCount;
