import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';

import SPELLS from 'common/SPELLS';
import { formatThousands } from 'common/format';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import Statistic from 'interface/statistics/Statistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import ItemDamageDone from 'interface/ItemDamageDone';

import DemoPets from '../pets/DemoPets';
import PETS from '../pets/PETS';

class GrimoireFelguard extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    demoPets: DemoPets,
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.GRIMOIRE_FELGUARD_TALENT.id);
  }

  statistic() {
    const damage = this.demoPets.getPetDamage(PETS.GRIMOIRE_FELGUARD.guid);
    return (
      <Statistic
        category={STATISTIC_CATEGORY.TALENTS}
        size="flexible"
        tooltip={`${formatThousands(damage)} damage`}
      >
        <BoringSpellValueText spell={SPELLS.GRIMOIRE_FELGUARD_TALENT}>
          <ItemDamageDone amount={damage} />
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default GrimoireFelguard;
