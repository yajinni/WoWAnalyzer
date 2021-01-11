import React from 'react';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import Enemies from 'parser/shared/modules/Enemies';

import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';
import { formatPercentage } from 'common/format';
import SpellLink from 'common/SpellLink';
import { t } from '@lingui/macro';

class VoidReaverDebuff extends Analyzer {
  get uptime() {
    return this.enemies.getBuffUptime(SPELLS.VOID_REAVER_DEBUFF.id) / this.owner.fightDuration;
  }

  get uptimeSuggestionThresholds() {
    return {
      actual: this.uptime,
      isLessThan: {
        minor: 0.90,
        average: 0.80,
        major: .70,
      },
      style: 'percentage',
    };
  }

//WCL: https://www.warcraftlogs.com/reports/LaMfJFHk2dY98gTj/#fight=20&type=auras&spells=debuffs&hostility=1&ability=268178
  static dependencies = {
    enemies: Enemies,
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.VOID_REAVER_TALENT.id);
  }

  suggestions(when) {
    when(this.uptimeSuggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<>Your <SpellLink id={SPELLS.VOID_REAVER_DEBUFF.id} /> uptime can be improved.</>)
        .icon(SPELLS.VOID_REAVER_TALENT.icon)
        .actual(t({
      id: "demonhunter.vengeance.suggestions.voidReaver.uptime",
      message: `${formatPercentage(actual)}% Void Reaver uptime`
    }))
        .recommended(`>${formatPercentage(recommended)}% is recommended`));
  }

  statistic() {
    return (
      <TalentStatisticBox
        talent={SPELLS.VOID_REAVER_TALENT.id}
        position={STATISTIC_ORDER.CORE(5)}
        value={`${formatPercentage(this.uptime)} %`}
        label="Void Reaver uptime"
      />
    );
  }
}

export default VoidReaverDebuff;
