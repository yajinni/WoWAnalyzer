import React from 'react';
import { formatPercentage } from 'common/format';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import Statistic from 'interface/statistics/Statistic';
import SpellLink from 'common/SpellLink';
import SpellIcon from 'common/SpellIcon';
import BoringValue from 'interface/statistics/components/BoringValueText';
import { ThresholdStyle, When } from 'parser/core/ParseResults';

import { t } from '@lingui/macro';

import SPELLS from 'common/SPELLS';
import Analyzer, { Options } from 'parser/core/Analyzer';

import Mastery from '../core/Mastery';

class Cultivation extends Analyzer {
  static dependencies = {
    mastery: Mastery,
  };

  protected mastery!: Mastery;

  constructor(options: Options) {
    super(options);
    const hasCultivation = this.selectedCombatant.hasTalent(SPELLS.CULTIVATION_TALENT.id);
    this.active = hasCultivation;
  }

  get directPercent() {
    return this.owner.getPercentageOfTotalHealingDone(this.mastery.getDirectHealing(SPELLS.CULTIVATION.id));
  }

  get masteryPercent() {
    return this.owner.getPercentageOfTotalHealingDone(this.mastery.getMasteryHealing(SPELLS.CULTIVATION.id));
  }

  get totalPercent() {
    return this.directPercent + this.masteryPercent;
  }

  get suggestionThresholds() {
    return {
      actual: this.totalPercent,
      isLessThan: {
        minor: 0.06,
        average: 0.045,
        major: 0.03,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  suggestions(when: When) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<>Your healing from <SpellLink id={SPELLS.CULTIVATION.id} /> could be improved. You may have too many healers or doing easy
        content, thus having low cultivation proc rate. You may considering selecting another talent.</>)
        .icon(SPELLS.CULTIVATION.icon)
        .actual(t({
      id: "druid.restoration.suggestions.cultivation.notOptimal",
      message: `${formatPercentage(this.totalPercent)}% healing`
    }))
        .recommended(`>${formatPercentage(recommended)}% is recommended`));
  }
  
  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(11)}
        size="flexible"
        tooltip={(
          <>
            This is the sum of the direct healing from Cultivation and the healing enabled by Cultivation's extra mastery stack.
            <ul>
              <li>Direct: <strong>{formatPercentage(this.directPercent)}%</strong></li>
              <li>Mastery: <strong>{formatPercentage(this.masteryPercent)}%</strong></li>
            </ul>
          </>
        )}
      >
        <BoringValue label={<><SpellIcon id={SPELLS.CULTIVATION.id} /> Cultivation healing </>}>
          <>
            {formatPercentage(this.totalPercent)} %
          </>
        </BoringValue>
      </Statistic>
    );
  }
}

export default Cultivation;
