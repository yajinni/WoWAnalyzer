import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import { formatNumber, formatPercentage } from 'common/format';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import GlobalCooldown
  from 'parser/hunter/beastmastery/modules/core/GlobalCooldown';
import SpellLink from 'common/SpellLink';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import BoringSpellValueText
  from 'interface/statistics/components/BoringSpellValueText';
import { CastEvent } from '../../../../core/Events';

/**
 * Cobra Shot reduces the cooldown of Bestial Wrath by 1 sec.
 *
 * Example log:
 * https://www.warcraftlogs.com/reports/gdwaDBYN4jbJCAKv#fight=1&type=damage-done
 */

const COOLDOWN_REDUCTION_MS = 1000;

class VenomousBite extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
    globalCooldown: GlobalCooldown,
  };

  protected spellUsable!: SpellUsable;
  protected globalCooldown!: GlobalCooldown;

  effectiveBWReductionMs = 0;
  wastedBWReductionMs = 0;
  wastedCasts = 0;
  casts = 0;

  constructor(options: any) {
    super(options);
    this.active
      = this.selectedCombatant.hasTalent(SPELLS.VENOMOUS_BITE_TALENT.id);
  }

  on_byPlayer_cast(event: CastEvent) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.COBRA_SHOT.id) {
      return;
    }
    this.casts += 1;
    if (!this.spellUsable.isOnCooldown(SPELLS.BESTIAL_WRATH.id)) {
      this.wastedCasts += 1;
      this.wastedBWReductionMs += COOLDOWN_REDUCTION_MS;
      return;
    }
    const globalCooldown = this.globalCooldown.getGlobalCooldownDuration(spellId);
    const bestialWrathCooldownRemaining = this.spellUsable.cooldownRemaining(
      SPELLS.BESTIAL_WRATH.id);
    if (bestialWrathCooldownRemaining <
      COOLDOWN_REDUCTION_MS +
      globalCooldown) {
      const effectiveReductionMs = bestialWrathCooldownRemaining -
        globalCooldown;
      this.effectiveBWReductionMs
        += this.spellUsable.reduceCooldown(
        SPELLS.BESTIAL_WRATH.id,
        effectiveReductionMs,
      );
      this.wastedBWReductionMs += COOLDOWN_REDUCTION_MS - effectiveReductionMs;
      return;
    }
    this.effectiveBWReductionMs
      += this.spellUsable.reduceCooldown(
      SPELLS.BESTIAL_WRATH.id,
      COOLDOWN_REDUCTION_MS,
    );
  }

  get totalPossibleCDR() {
    return this.casts * COOLDOWN_REDUCTION_MS;
  }

  get wastedCDR() {
    return (
      this.wastedBWReductionMs / 1000
    ).toFixed(2);
  }

  get cdrEfficiencyCobraShotThreshold() {
    return {
      actual: this.effectiveBWReductionMs / this.totalPossibleCDR,
      isLessThan: {
        minor: 1,
        average: 0.95,
        major: 0.9,
      },
      style: 'percentage',
    };
  }

  get wastedCobraShotsThreshold() {
    return {
      actual: this.wastedCasts,
      isGreaterThan: {
        minor: 0,
        average: 0,
        major: 2,
      },
      style: 'number',
    };
  }

  suggestions(when: any) {
    when(this.cdrEfficiencyCobraShotThreshold).addSuggestion((
      suggest: any,
      actual: any,
      recommended: any,
    ) => {
      return suggest(<>When talented into <SpellLink id={SPELLS.VENOMOUS_BITE_TALENT.id} />, it's very important to utilise the cooldown reduction of <SpellLink id={SPELLS.BESTIAL_WRATH.id} /> provided by <SpellLink id={SPELLS.COBRA_SHOT.id} /> effectively. If the cooldown of <SpellLink id={SPELLS.BESTIAL_WRATH.id} /> is lower than your GCD + 1s, you'll only want to be casting <SpellLink id={SPELLS.COBRA_SHOT.id} />, if you'd be focus capping otherwise.</>)
        .icon(SPELLS.VENOMOUS_BITE_TALENT.icon)
        .actual(`You had ${formatPercentage(actual)}% effective cooldown reduction of Bestial Wrath`)
        .recommended(`${formatPercentage(recommended)}% is recommended`);
    });
    when(this.wastedCobraShotsThreshold).addSuggestion((
      suggest: any,
      actual: any,
    ) => {
      return suggest(<>You should never cast <SpellLink id={SPELLS.COBRA_SHOT.id} /> when <SpellLink id={SPELLS.BESTIAL_WRATH.id} /> is off cooldown when talented into <SpellLink id={SPELLS.VENOMOUS_BITE_TALENT.id} />.</>)
        .icon(SPELLS.VENOMOUS_BITE_TALENT.icon)
        .actual(`You cast ${actual} Cobra Shots when Bestial Wrath wasn't on cooldown`)
        .recommended(`0 casts  is recommended`);
    });
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(13)}
        size="flexible"
        category={'TALENTS'}
        tooltip={(
          <>
            {this.wastedCasts >
            0 &&
            <>You had {this.wastedCasts} {this.wastedCasts > 1
              ? `casts`
              : `cast`} of Cobra Shot when Bestial Wrath wasn't on cooldown. <br /></>}
            {this.wastedBWReductionMs >
            0 &&
            `You wasted ${this.wastedCDR} seconds of potential cooldown reduction by casting Cobra Shot while Bestial Wrath had less than 1 + GCD seconds remaining on its CD.`}
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.VENOMOUS_BITE_TALENT}>
          <>
            {formatNumber(this.effectiveBWReductionMs /
              1000)}s / {this.totalPossibleCDR / 1000}s
            <br />
            {formatPercentage(this.effectiveBWReductionMs /
              this.totalPossibleCDR)}%
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default VenomousBite;
