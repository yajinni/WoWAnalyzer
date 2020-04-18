import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import { BLOODSEEKER_ATTACK_SPEED_GAIN } from 'parser/hunter/survival/constants';
import { formatPercentage } from 'common/format';
import ItemDamageDone from 'interface/ItemDamageDone';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';

/**
 * Kill Command causes the target to bleed for X damage over 8 sec.
 * You and your pet gain 10% attack speed for every bleeding enemy within 12 yds.
 *
 * Example log: https://www.warcraftlogs.com/reports/WBkTFfP6G4VcxjLz#fight=1&type=auras&source=8&ability=260249
 */

const MS_BUFFER = 100;

class Bloodseeker extends Analyzer {

  averageStacks = 0;
  kcCastTimestamp = null;
  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.BLOODSEEKER_TALENT.id);
  }

  on_byPlayerPet_damage(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.KILL_COMMAND_DAMAGE_SV.id) {
      return;
    }
    if (event.timestamp > (this.kcCastTimestamp + MS_BUFFER)) {
      this.damage += event.amount + (event.absorbed || 0);
    }
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.KILL_COMMAND_CAST_SV.id) {
      return;
    }
    this.kcCastTimestamp = event.timestamp;
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.BLOODSEEKER_BUFF.id) / this.owner.fightDuration;
  }

  get averageAttackSpeedGain() {
    this.averageStacks = this.selectedCombatant.getStackWeightedBuffUptime(SPELLS.BLOODSEEKER_BUFF.id) / this.owner.fightDuration;
    return this.averageStacks * BLOODSEEKER_ATTACK_SPEED_GAIN;
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(2)}
        size="flexible"
        tooltip={(
          <>
            You had {formatPercentage(this.uptime)}% uptime on the buff, with an average of {(this.averageStacks).toFixed(2)} stacks.
          </>
        )}
        category={'TALENTS'}
      >
        <BoringSpellValueText spell={SPELLS.BLOODSEEKER_TALENT}>
          <>
            <ItemDamageDone amount={this.damage} /> <br />
            {formatPercentage(this.averageAttackSpeedGain)}% <small>atk speed gain</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }

}

export default Bloodseeker;
