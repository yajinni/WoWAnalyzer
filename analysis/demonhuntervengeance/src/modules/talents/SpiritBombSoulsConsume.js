import React from 'react';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';

import { formatPercentage } from 'common/format';
import { t } from '@lingui/macro';
import Events from 'parser/core/Events';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';

const MS_BUFFER = 100;

class SpiritBombSoulsConsume extends Analyzer {

  get totalGoodCasts() {
    return this.soulsConsumedByAmount[4] + this.soulsConsumedByAmount[5];
  }

  get totalCasts() {
    return Object.values(this.soulsConsumedByAmount).reduce((total, casts) => total + casts, 0);
  }

  get percentGoodCasts() {
    return this.totalGoodCasts / this.totalCasts;
  }

  get suggestionThresholdsEfficiency() {
    return {
      actual: this.percentGoodCasts,
      isLessThan: {
        minor: 0.90,
        average: 0.85,
        major: .80,
      },
      style: 'percentage',
    };
  }

  castTimestamp = 0;
  castSoulsConsumed = 0;
  cast = 0;
  soulsConsumedByAmount = Array.from({ length: 6 }, x => 0);

  /* Feed The Demon talent is taken in defensive builds. In those cases you want to generate and consume souls as quickly
   as possible. So how you consume your souls down matter. If you dont take that talent your taking a more balanced
   build meaning you want to consume souls in a way that boosts your dps. That means feeding the souls into spirit
   bomb as efficiently as possible (cast at 4+ souls) for a dps boost and have soul cleave absorb souls as little as
   possible since it provides no extra dps.
*/
  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.SPIRIT_BOMB_TALENT.id) && !this.selectedCombatant.hasTalent(SPELLS.FEED_THE_DEMON_TALENT.id);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.SPIRIT_BOMB_TALENT), this.onCast);
    this.addEventListener(Events.changebuffstack.by(SELECTED_PLAYER).spell(SPELLS.SOUL_FRAGMENT_STACK), this.onChangeBuffStack);
    this.addEventListener(Events.fightend, this.onFightend);
  }

  onCast(event) {
    if (this.cast > 0) {
      this.countHits();
    }
    this.castTimestamp = event.timestamp;
    this.cast += 1;
  }

  onChangeBuffStack(event) {
    if (event.oldStacks < event.newStacks) {
      return;
    }
    if (event.timestamp - this.castTimestamp < MS_BUFFER) {
      const soulsConsumed = event.oldStacks - event.newStacks;
      this.castSoulsConsumed += soulsConsumed;
    }
  }

  countHits() {
    if (!this.soulsConsumedByAmount[this.castSoulsConsumed]) {
      this.soulsConsumedByAmount[this.castSoulsConsumed] = 1;
      this.castSoulsConsumed = 0;
      return;
    }
    this.soulsConsumedByAmount[this.castSoulsConsumed] += 1;
    this.castSoulsConsumed = 0;
  }

  onFightend() {
    this.countHits();
  }

  suggestions(when) {
    when(this.suggestionThresholdsEfficiency)
      .addSuggestion((suggest, actual, recommended) => suggest(<>Try to cast <SpellLink id={SPELLS.SPIRIT_BOMB_TALENT.id} /> at 4 or 5 souls.</>)
        .icon(SPELLS.SPIRIT_BOMB_TALENT.icon)
        .actual(t({
      id: "demonhunter.vengeance.suggestions.spiritBomb.soulsConsumed",
      message: `${formatPercentage(this.percentGoodCasts)}% of casts at 4+ souls.`
    }))
        .recommended(`>${formatPercentage(recommended)}% is recommended`));
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(6)}
        category={STATISTIC_CATEGORY.TALENTS}
        size="flexible"
        dropdown={(
          <>
            <table className="table table-condensed">
              <thead>
                <tr>
                  <th>Stacks</th>
                  <th>Casts</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(this.soulsConsumedByAmount).map((castAmount, stackAmount) => (
                  <tr key={stackAmount}>
                    <th>{stackAmount}</th>
                    <td>{castAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.SPIRIT_BOMB_TALENT}>
          <>
            {formatPercentage(this.percentGoodCasts)}% <small>good casts</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }

}

export default SpiritBombSoulsConsume;
