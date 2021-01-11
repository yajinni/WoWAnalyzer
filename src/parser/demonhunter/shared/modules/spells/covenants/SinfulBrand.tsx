import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import Events, { DamageEvent } from 'parser/core/Events';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import React from 'react';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import ItemDamageDone from 'interface/ItemDamageDone';
import COVENANTS from 'game/shadowlands/COVENANTS';
import { formatThousands } from 'common/format';


/**
 * Venthyr - Sinful Brand
 */
class SinfulBrand extends Analyzer {

  damage = 0;

  constructor(options: Options) {
    super(options);

    this.active = this.selectedCombatant.hasCovenant(COVENANTS.VENTHYR.id);

    if (!this.active) {
      return;
    }

    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.SINFUL_BRAND), this.onDamage);
  }

  onDamage(event: DamageEvent) {
    this.damage += event.amount + (event.absorbed || 0);
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE()}
        size="flexible"
        category={STATISTIC_CATEGORY.COVENANTS}
        tooltip={(
          <>
            {formatThousands(this.damage)} Total damage
          </>
        )}
      >
      <BoringSpellValueText spell={SPELLS.SINFUL_BRAND}>
        <ItemDamageDone amount={this.damage} />
      </BoringSpellValueText>
    </Statistic>
    );
  }

}

export default SinfulBrand;
