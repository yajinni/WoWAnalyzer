import React from 'react';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';

import Combatants from 'parser/shared/modules/Combatants';
import { formatNumber } from 'common/format';
import MAGIC_SCHOOLS from 'game/MAGIC_SCHOOLS';
import RACES from 'game/RACES';
import { SpellIcon } from 'interface';
import SPELLS from 'common/SPELLS';
import StatisticBox from 'parser/ui/StatisticBox';
import Events from 'parser/core/Events';

/**
 * Removes all poison, disease, curse, magic, and bleed effects and reduces all physical damage taken by 10% for 8 sec.
 *
 * Example log: https://www.warcraftlogs.com/reports/gYCR2kZaJHVbjfxP/#fight=52&source=16&type=damage-taken
 */

const STONEFORM_DAMAGE_REDUCTION = 0.1;
const FALLING_DAMAGE_ABILITY_ID = 3;

class Stoneform extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  damageReduced = 0;
  physicalDamageTaken = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.race === RACES.Dwarf;
    this.addEventListener(Events.damage.to(SELECTED_PLAYER), this.onDamageTaken);
  }

  get drps() {
    return this.damageReduced / this.owner.fightDuration * 1000;
  }

  onDamageTaken(event) {
    const spellId = event.ability.guid;

    if (event.ability.type !== MAGIC_SCHOOLS.ids.PHYSICAL) {
      return;
    }

    if (spellId === FALLING_DAMAGE_ABILITY_ID) { // Falling damage is the same type as physical but ignores DRs.
      return;
    }

    const damageTaken = event.amount + (event.absorbed || 0);
    const isStoneformActive = this.selectedCombatant.hasBuff(SPELLS.STONEFORM_BUFF.id, event.timestamp, this.owner.playerId);

    if (isStoneformActive) {
      this.physicalDamageTaken += damageTaken;
      this.damageReduced += damageTaken / (1 - STONEFORM_DAMAGE_REDUCTION) * STONEFORM_DAMAGE_REDUCTION;
    }
  }

  statistic() {
    return(
      <StatisticBox
        icon={<SpellIcon id={SPELLS.STONEFORM_BUFF.id} />}
        value={`≈${formatNumber(this.drps)} DRPS`}
        label="Stoneform damage reduced"
        tooltip={(
          <>
            You took a total of {formatNumber(this.physicalDamageTaken)} physical damage while Stoneform was active. <br />
            Stoneform reduced a total of {formatNumber(this.damageReduced)} physical damage taken.
          </>
        )}
      />
    );

  }

}

export default Stoneform;
