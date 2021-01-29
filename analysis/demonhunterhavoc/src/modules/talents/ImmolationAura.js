import React from 'react';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import TalentStatisticBox from 'parser/ui/TalentStatisticBox';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import Events from 'parser/core/Events';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import { formatThousands, formatPercentage } from 'common/format';
import { t } from '@lingui/macro';

/**
 * Example Report: https://www.warcraftlogs.com/reports/KGJgZPxanBX82LzV/#fight=4&source=20
 */

const IMMOLATION_AURA = [SPELLS.IMMOLATION_AURA_INITIAL_HIT_DAMAGE, SPELLS.IMMOLATION_AURA_BUFF_DAMAGE];

class ImmolationAura extends Analyzer {

  get furyPerMin() {
    return ((this.furyGain - this.furyWaste) / (this.owner.fightDuration / 60000)).toFixed(2);
  }

  get suggestionThresholds() {
    return {
      actual: this.furyWaste / this.furyGain,
      isGreaterThan: {
        minor: 0.03,
        average: 0.07,
        major: 0.1,
      },
      style: 'percentage',
    };
  }

  furyGain = 0;
  furyWaste = 0;
  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.BURNING_HATRED_TALENT.id);
    if (!this.active) {
      return;
    }
    this.addEventListener(Events.energize.by(SELECTED_PLAYER).spell(IMMOLATION_AURA), this.onEnergizeEvent);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(IMMOLATION_AURA), this.onDamageEvent);
  }

  onEnergizeEvent(event) {
    this.furyGain += event.resourceChange;
    this.furyWaste += event.waste;
  }

  onDamageEvent(event) {
    this.damage += event.amount;
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<> Avoid casting <SpellLink id={SPELLS.IMMOLATION_AURA.id} /> when close to max Fury.</>)
        .icon(SPELLS.IMMOLATION_AURA.icon)
        .actual(t({
      id: "demonhunter.havoc.suggestions.immolationAura.furyWasted",
      message: `${formatPercentage(actual)}% Fury wasted`
    }))
        .recommended(`${formatPercentage(recommended)}% is recommended.`));
  }

  statistic() {
    const effectiveFuryGain = this.furyGain - this.furyWaste;
    return (
      <TalentStatisticBox
        talent={SPELLS.IMMOLATION_AURA.id}
        position={STATISTIC_ORDER.OPTIONAL(6)}
        value={(
          <>
            {this.furyPerMin} <small>Fury per min </small><br />
            {this.owner.formatItemDamageDone(this.damage)}
          </>
        )}
        tooltip={(
          <>
            {formatThousands(this.damage)} Total damage<br />
            {effectiveFuryGain} Effective Fury gained<br />
            {this.furyGain} Total Fury gained<br />
            {this.furyWaste} Fury wasted
          </>
        )}
      />
    );
  }
}

export default ImmolationAura;
