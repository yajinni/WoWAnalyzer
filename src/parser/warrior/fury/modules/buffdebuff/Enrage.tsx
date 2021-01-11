import React from 'react';

import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';

import StatTracker from 'parser/shared/modules/StatTracker';
import Events, { DamageEvent } from 'parser/core/Events';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatNumber, formatPercentage, formatThousands } from 'common/format';
import Statistic from 'interface/statistics/Statistic';
import UptimeIcon from 'interface/icons/Uptime';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';
import { t } from '@lingui/macro';

class Enrage extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };
  totalDamage: number = 0;
  damage: number = 0;
  protected statTracker!: StatTracker;

  constructor(options: Options) {
    super(options);

    this.addEventListener(Events.damage.by(SELECTED_PLAYER), this.onPlayerDamage);
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.ENRAGE.id) / this.owner.fightDuration;
  }

  get dpsIncrease() {
    return this.damage / (this.owner.fightDuration / 1000);
  }

  get damageTotalPercent() {
    return this.owner.getPercentageOfTotalDamageDone(this.damage);
  }

  get suggestionThresholds() {
    return {
      actual: this.uptime,
      isLessThan: {
        minor: 0.7,
        average: 0.65,
        major: 0.6,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  onPlayerDamage(event: DamageEvent) {
    if (this.selectedCombatant.hasBuff(SPELLS.ENRAGE.id)) {
      this.damage += calculateEffectiveDamage(event, this.statTracker.currentMasteryPercentage);
      this.totalDamage += event.amount;
    }
  }

  suggestions(when: When) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<>Your <SpellLink id={SPELLS.ENRAGE.id} /> uptime can be improved.</>)
        .icon(SPELLS.ENRAGE.icon)
        .actual(t({
      id: "warrior.fury.suggestions.enrage.uptime",
      message: `${formatPercentage(actual)}% Enrage uptime`
    }))
        .recommended(`>${formatPercentage(recommended)}% is recommended`));
  }

  statistic() {
    return (
      <Statistic
        size="flexible"
        tooltip={<>You did <strong>{formatThousands(this.damage)} ({formatPercentage(this.damageTotalPercent)}%)</strong> damage while enraged, contributing <strong>{formatNumber(this.dpsIncrease)}</strong> DPS.</>}
      >
        <BoringSpellValueText spell={SPELLS.ENRAGE}>
          <>
            <UptimeIcon /> {formatPercentage(this.uptime)}% <small>uptime</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default Enrage;
