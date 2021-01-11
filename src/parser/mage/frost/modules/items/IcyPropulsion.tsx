import React from 'react';
import SPELLS from 'common/SPELLS';
import Analyzer, { Options } from 'parser/core/Analyzer';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import Events, { DamageEvent } from 'parser/core/Events';
import Statistic from 'interface/statistics/Statistic';
import UptimeIcon from 'interface/icons/Uptime';
import ConduitSpellText from 'interface/statistics/components/ConduitSpellText';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import HIT_TYPES from 'game/HIT_TYPES';
import { SELECTED_PLAYER } from 'parser/core/EventFilter';
import { formatNumber } from 'common/format';

const COOLDOWN_REDUCTION_MS = [0, 750, 830, 900, 980, 1005, 1130, 1200, 1280, 1350, 1430, 1500, 1580, 1650, 1730, 1800];

class IcyPropulsion extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
    abilityTracker: AbilityTracker,
  };
  protected spellUsable!: SpellUsable;
  protected abilityTracker!: AbilityTracker;

  conduitRank = 0;
  cooldownReduction = 0;

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.hasConduitBySpellID(SPELLS.ICY_PROPULSION.id);
    this.conduitRank = this.selectedCombatant.conduitRankBySpellID(SPELLS.ICY_PROPULSION.id);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER), this.onDamage);
  }

  onDamage(event: DamageEvent) {
    if (!this.selectedCombatant.hasBuff(SPELLS.ICY_VEINS.id) || event.hitType !== HIT_TYPES.CRIT || !this.spellUsable.isOnCooldown(SPELLS.ICY_VEINS.id)) {
      return;
    }

    this.cooldownReduction += this.spellUsable.reduceCooldown(SPELLS.ICY_VEINS.id,COOLDOWN_REDUCTION_MS[this.conduitRank]);

  }

  get reductionSeconds() {
    return this.cooldownReduction / 1000;
  }

  get reductionPerIcyVeins() {
    return this.reductionSeconds / this.abilityTracker.getAbility(SPELLS.ICY_VEINS.id).casts;
  }

  statistic() {
    return (
      <Statistic
        category={STATISTIC_CATEGORY.COVENANTS}
        size="flexible"
        tooltip={<>Icy Propulsion reduced the cooldown on Icy Veins by a total of {this.reductionSeconds} ({this.reductionPerIcyVeins} Per Icy Veins on average).</>}
      >
        <ConduitSpellText spell={SPELLS.ICY_PROPULSION} rank={this.conduitRank}>
          <UptimeIcon /> {`${formatNumber(this.reductionSeconds)}s`} <small>Icy Veins CDR</small>
        </ConduitSpellText>
      </Statistic>
    );
  }


}

export default IcyPropulsion;
