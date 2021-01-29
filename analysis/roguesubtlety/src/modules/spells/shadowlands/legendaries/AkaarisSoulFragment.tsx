import React from 'react';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Abilities from 'parser/core/modules/Abilities';
import SPELLS from 'common/SPELLS';
import Events, { DamageEvent } from 'parser/core/Events';
import { formatNumber } from 'common/format';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import ItemDamageDone from 'parser/ui/ItemDamageDone';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';

class AkaarisSoulFragment extends Analyzer {
  static dependencies = {
    abilities: Abilities,
  };

  damage: number = 0;
  protected abilities!: Abilities;

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.hasLegendaryByBonusID(SPELLS.AKAARIS_SOUL_FRAGMENT.bonusID);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.AKAARIS_SOUL_FRAGMENT_SHADOWSTRIKE), this.onDamage);
  }

  onDamage(event: DamageEvent) {
    this.damage += event.amount + (event.absorbed || 0);
  }

  statistic() {
    return (
      <Statistic
        size="flexible"
        category={STATISTIC_CATEGORY.ITEMS}
        tooltip={(
          <>
            Akaari's Soul Fragment contributed {formatNumber(this.damage)} total damage done with a secondary Shadowstrike.
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.AKAARIS_SOUL_FRAGMENT}>
          <>
            <ItemDamageDone amount={this.damage} />
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default AkaarisSoulFragment;
