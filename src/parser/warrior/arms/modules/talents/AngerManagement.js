import React from 'react';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatDuration } from 'common/format';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import StatisticListBoxItem from 'interface/others/StatisticListBoxItem';
import Events from 'parser/core/Events';

/**
 * Every 20 Rage you spend reduces the remaining cooldown on Colossus Smash and Bladestorm by 1 sec.
 */

const RAGE_NEEDED_FOR_A_PROC = 20;
const CDR_PER_PROC = 1000; // ms

class AngerManagement extends Analyzer {
  get tooltip() {
    return this.cooldownsAffected.map(id => (
      <>{SPELLS[id].name}: {formatDuration(this.effectiveReduction[id] / 1000)} reduction ({formatDuration(this.wastedReduction[id] / 1000)} wasted)<br /></>
    ));
  }

  static dependencies = {
    spellUsable: SpellUsable,
  };
  cooldownsAffected = [
    this.selectedCombatant.hasTalent(SPELLS.WARBREAKER_TALENT.id) ? SPELLS.WARBREAKER_TALENT.id : SPELLS.COLOSSUS_SMASH.id,
    SPELLS.BLADESTORM.id,
  ];
  totalRageSpend = 0;
  wastedReduction = {};
  effectiveReduction = {};

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.ANGER_MANAGEMENT_TALENT.id);
    this.cooldownsAffected.forEach(e => {
      this.wastedReduction[e] = 0;
      this.effectiveReduction[e] = 0;
    });

    this.addEventListener(Events.cast.by(SELECTED_PLAYER), this._onCast);
  }

  _onCast(event) {
    if (!event.classResources) {
      return;
    }
    const rage = event.classResources.find(e => e.type === RESOURCE_TYPES.RAGE.id);
    if (!rage || !rage.cost) {
      return;
    }

    const rageSpend = rage.cost / 10;
    const reduction = rageSpend / RAGE_NEEDED_FOR_A_PROC * CDR_PER_PROC;
    this.cooldownsAffected.forEach(e => {
      if (!this.spellUsable.isOnCooldown(e)) {
        this.wastedReduction[e] += reduction;
      } else {
        const effectiveReduction = this.spellUsable.reduceCooldown(e, reduction);
        this.effectiveReduction[e] += effectiveReduction;
        this.wastedReduction[e] += reduction - effectiveReduction;
      }
    });
    this.totalRageSpend += rageSpend;
  }

  subStatistic() {
    return (
      <StatisticListBoxItem
        title={<><SpellLink id={SPELLS.ANGER_MANAGEMENT_TALENT.id} /> CDR</>}
        value={`${formatDuration((this.effectiveReduction[SPELLS.BLADESTORM.id] + this.wastedReduction[SPELLS.BLADESTORM.id]) / 1000)} min`}
        valueTooltip={this.tooltip}
      />
    );
  }
}

export default AngerManagement;
