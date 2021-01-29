import React from 'react';

import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';

import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';

import Statistic from 'parser/ui/Statistic';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

import { t } from '@lingui/macro';

const debug = false;

const BUFF_DURATION = 10000;
// haven't yet found out if it's exactly 10 second delay between application and removal of the buff (or is it few ms earlier), might need to tweak with that to be accurate
const REMOVEBUFF_TOLERANCE = 20;

class Backdraft extends Analyzer {
  get suggestionThresholds() {
    const wastedStacksPerMinute = this.wastedStacks / this.owner.fightDuration * 1000 * 60;
    return {
      actual: wastedStacksPerMinute,
      isGreaterThan: {
        minor: 1,
        average: 1.5,
        major: 2,
      },
      style: 'number',
    };
  }

  _maxStacks = 2;
  _stacksPerApplication = 1;
  _currentStacks = 0;
  _expectedBuffEnd = 0;
  wastedStacks = 0;

  constructor(...args) {
    super(...args);
    this._maxStacks = this.selectedCombatant.hasTalent(SPELLS.FLASHOVER_TALENT.id) ? 4 : 2;
    this._stacksPerApplication = this.selectedCombatant.hasTalent(SPELLS.FLASHOVER_TALENT.id) ? 2 : 1;

    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.CONFLAGRATE), this.onConflagrateCast);
    this.addEventListener(Events.removebuffstack.by(SELECTED_PLAYER).spell(SPELLS.BACKDRAFT), this.onBackdraftRemoveStack);
    this.addEventListener(Events.removebuff.by(SELECTED_PLAYER).spell(SPELLS.BACKDRAFT), this.onBackdraftRemove);
  }

  onConflagrateCast(event) {
    this._currentStacks += this._stacksPerApplication;
    if (this._currentStacks > this._maxStacks) {
      debug && console.log('backdraft stack waste at ', event.timestamp);
      this.wastedStacks += this._currentStacks - this._maxStacks;
      this._currentStacks = this._maxStacks;
    }
    this._expectedBuffEnd = event.timestamp + BUFF_DURATION;
  }

  onBackdraftRemoveStack() {
    this._currentStacks -= 1;
  }

  onBackdraftRemove(event) {
    if (event.timestamp >= this._expectedBuffEnd - REMOVEBUFF_TOLERANCE) {
      // if the buff expired when it "should", we wasted some stacks
      debug && console.log('backdraft stack waste at ', event.timestamp);
      this.wastedStacks += this._currentStacks;
    }
    this._currentStacks = 0;
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<>You should use your <SpellLink id={SPELLS.BACKDRAFT.id} /> stacks more. You have wasted {this.wastedStacks} stacks this fight.</>)
        .icon(SPELLS.BACKDRAFT.icon)
        .actual(t({
      id: "warlock.destruction.suggestions.backdraft.wastedPerMinute",
      message: `${actual.toFixed(2)} wasted Backdraft stacks per minute`
    }))
        .recommended(`< ${recommended} is recommended`));
  }

  statistic() {
    return (
      <Statistic
        size="small"
        position={STATISTIC_ORDER.CORE(4)}
      >
        <BoringSpellValueText spell={SPELLS.BACKDRAFT}>
          {this.wastedStacks} <small>Wasted procs</small>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default Backdraft;
