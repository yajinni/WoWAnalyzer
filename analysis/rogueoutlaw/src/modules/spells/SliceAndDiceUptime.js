import React from 'react';
import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';
import Statistic from 'parser/ui/Statistic';
import { formatPercentage } from 'common/format';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import { SpellLink } from 'interface';

class SliceAndDiceUptime extends Analyzer {
  get percentUptime() {
    return (
      this.selectedCombatant.getBuffUptime(SPELLS.SLICE_AND_DICE.id) / this.owner.fightDuration
    );
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(100)}
        size="flexible"
      >
        <div className="pad">
          <label><SpellLink id={SPELLS.SLICE_AND_DICE.id} /> Uptime</label>
          <div className="value">{formatPercentage(this.percentUptime)}%</div>
        </div>
      </Statistic>
    );
  }
}

export default SliceAndDiceUptime;
