import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import Events, { ApplyBuffEvent, GlobalCooldownEvent, RefreshBuffEvent, RemoveBuffEvent } from 'parser/core/Events';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import { t } from '@lingui/macro';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import Statistic from 'interface/statistics/Statistic';

import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';

const LAG_BUFFER_MS = 100;
const BUFF_DURATION_MS = 10000;

class KillingMachineEfficiency extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
  };

  protected abilityTracker!: AbilityTracker;

  kmProcs: number = 0;
  lastGCDTime: number = 0;
  lastGCDDuration: number = 0;
  lastProcTime: number = 0;
  refreshedKMProcs = 0;
  expiredKMProcs = 0;

  constructor(options: Options) {
    super(options);

    this.addEventListener(Events.GlobalCooldown, this.globalCooldown);
    this.addEventListener(Events.applybuff.by(SELECTED_PLAYER).spell(SPELLS.KILLING_MACHINE), this.onApplyBuff);
    this.addEventListener(Events.removebuff.by(SELECTED_PLAYER).spell(SPELLS.KILLING_MACHINE), this.onRemoveBuff);
    this.addEventListener(Events.refreshbuff.by(SELECTED_PLAYER).spell(SPELLS.KILLING_MACHINE), this.onRefreshBuff);
  }

  onApplyBuff(event: ApplyBuffEvent) {
    this.kmProcs += 1;
    this.lastProcTime = event.timestamp;
  }

  onRemoveBuff(event: RemoveBuffEvent) {
    const durationHeld = event.timestamp - this.lastProcTime;
    if (durationHeld > (BUFF_DURATION_MS)) {
      this.expiredKMProcs += 1;
    }
  }

  onRefreshBuff(event: RefreshBuffEvent) {
    const timeSinceGCD = event.timestamp - this.lastGCDTime;
    if (timeSinceGCD < this.lastGCDDuration + LAG_BUFFER_MS) {
      return;
    }
    this.refreshedKMProcs += 1;
  }

  globalCooldown(event: GlobalCooldownEvent) {
    this.lastGCDTime = event.timestamp;
    this.lastGCDDuration = event.duration;
  }

  get totalWastedProcs() {
    return this.refreshedKMProcs + this.expiredKMProcs;
  }

  get wastedProcRate() {
    return this.totalWastedProcs / this.kmProcs;
  }

  get totalProcs() {
    return this.kmProcs + this.refreshedKMProcs;
  }

  get efficiency() {
    return 1 - this.wastedProcRate;
  }

  get suggestionThresholds() {
    return {
      actual: this.efficiency,
      isLessThan: {
        minor: .95,
        average: .90,
        major: .85,
      },
      style: ThresholdStyle.PERCENTAGE,
      suffix: 'Average',
    };
  }

  suggestions(when: When) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<React.Fragment> You wasted <SpellLink id={SPELLS.KILLING_MACHINE.id} /> procs. You should be casting <SpellLink id={SPELLS.OBLITERATE_CAST.id} /> or <SpellLink id={SPELLS.FROSTSCYTHE_TALENT.id} /> within 1 or 2 GCDs of gaining a Killing Machine proc to avoid wasting it. See one of the guides on the About tab for more information on when another ability takes precedence over spending Killing Machine</React.Fragment>)
        .icon(SPELLS.KILLING_MACHINE.icon)
        .actual(t({
      id: "deathknight.frost.suggestions.killingMachine.wasted",
      message: `${formatPercentage(this.wastedProcRate)}% of Killing Machine procs were either refreshed and lost or expired without being used`
    }))
        .recommended(`<${formatPercentage(1 - recommended)}% is recommended`));
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(5)}
        size="flexible"
        tooltip={(
          <>
            You wasted {this.totalWastedProcs} out of {this.totalProcs} Killing Machine procs ({formatPercentage(this.wastedProcRate)}%). <br />
            {this.expiredKMProcs} procs expired without being used and {this.refreshedKMProcs} procs were overwritten by new procs.
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.KILLING_MACHINE}>
          <>
            {formatPercentage(this.efficiency)} % <small>efficiency</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default KillingMachineEfficiency;
