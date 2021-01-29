import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';
import TalentStatisticBox from 'parser/ui/TalentStatisticBox';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

class Voracious extends Analyzer {

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.VORACIOUS_TALENT.id);
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.VORACIOUS.id) / this.owner.fightDuration;
  }

  get uptimeSuggestionThresholds() {
    return {
      actual: this.uptime,
      isLessThan: {
        minor: 0.95,
        average: 0.9,
        major: .8,
      },
      style: 'percentage',
    };
  }

  statistic() {
    return (

      <TalentStatisticBox
        talent={SPELLS.VORACIOUS_TALENT.id}
        position={STATISTIC_ORDER.OPTIONAL(6)}
        value={`${formatPercentage(this.uptime)} %`}
        label="Voracious uptime"
      />
    );
  }
}

export default Voracious;
