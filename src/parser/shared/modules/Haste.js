import SPELLS from 'common/SPELLS/index';
import { formatMilliseconds, formatPercentage } from 'common/format';
import Analyzer from 'parser/core/Analyzer';
import EventEmitter from 'parser/core/modules/EventEmitter';
import StatTracker from 'parser/shared/modules/StatTracker';
import BLOODLUST_BUFFS from 'game/BLOODLUST_BUFFS';
import EventFilter from 'parser/core/EventFilter';
import { EventType } from 'parser/core/Events';

const debug = false;

class Haste extends Analyzer {
  static dependencies = {
    eventEmitter: EventEmitter,
    statTracker: StatTracker,
  };

  /* eslint-disable no-useless-computed-key */
  static HASTE_BUFFS = {

    // HASTE RATING BUFFS ARE HANDLED BY THE STATTRACKER MODULE

    ...BLOODLUST_BUFFS,
    [SPELLS.HOLY_AVENGER_TALENT.id]: 0.3,
    [SPELLS.BERSERKING.id]: 0.1,
    [SPELLS.ICY_VEINS.id]: 0.3,
    [SPELLS.IN_FOR_THE_KILL_TALENT_BUFF.id]: 0.1,
    [SPELLS.BONE_SHIELD.id]: 0.1, // Blood BK haste buff from maintaining boneshield
    [SPELLS.METAMORPHOSIS_HAVOC_BUFF.id]: 0.25,
    [SPELLS.HAVOC_T21_4PC_BUFF.id]: 0.25,
    [SPELLS.DIRE_BEAST_BUFF.id]: 0.05,
    [SPELLS.DARK_SOUL_MISERY_TALENT.id]: 0.3,
    [SPELLS.REVERSE_ENTROPY_BUFF.id]: 0.15,
    [SPELLS.ENRAGE.id]: 0.25, // Fury Warrior
    [SPELLS.FROTHING_BERSERKER.id]: 0.05, // Fury Warrior
    [SPELLS.QUICK_THINKER_BUFF.id]: 0.15,
    [SPELLS.EMPOWER_RUNE_WEAPON.id]: 0.15, // Frost DK
    [SPELLS.EVER_RISING_TIDE_CHARGING_BUFF.id]: 0.1, // Essence
    [SPELLS.GUARDIAN_OF_AZEROTH_HASTE_BUFF.id]: {
      hastePerStack: 0.02,
    },

    // Boss abilities:
    [SPELLS.OPULENCE_AMETHYST_OF_THE_SHADOW_KING.id]: 0.5, // Amethyst of the Shadow King by Opulence (BoD - BFA)
  };

  get changehaste() {
    return new EventFilter(EventType.ChangeHaste);
  }

  current = null;
  constructor(...args) {
    super(...args);
    this.current = this.statTracker.currentHastePercentage;
    debug && console.log(`Haste: Starting haste: ${formatPercentage(this.current)}%`);
    this._triggerChangeHaste(null, null, this.current);
  }
  on_toPlayer_applybuff(event) {
    this._applyActiveBuff(event);
  }
  on_toPlayer_changebuffstack(event) {
    this._changeBuffStack(event);
  }
  on_toPlayer_removebuff(event) {
    this._removeActiveBuff(event);
  }
  on_toPlayer_applydebuff(event) {
    this._applyActiveBuff(event);
  }
  on_toPlayer_changedebuffstack(event) {
    this._changeBuffStack(event);
  }
  on_toPlayer_removedebuff(event) {
    this._removeActiveBuff(event);
  }

  on_toPlayer_changestats(event) { // fabbed event from StatTracker
    if (!event.delta.haste) {
      return;
    }

    // Calculating the Haste percentage difference form a rating change is hard because all rating (from gear + buffs) is additive while Haste percentage buffs are both multiplicative and additive (see the applyHaste function).
    // 1. Calculate the total Haste percentage without any rating (since the total percentage from the total rating multiplies like any other Haste buff)
    const remainingHasteBuffs = this.constructor.removeHaste(this.current, this.statTracker.hastePercentage(event.before.haste, true));
    // 2. Calculate the new total Haste percentage with the new rating and the old total buff percentage
    const newHastePercentage = this.constructor.addHaste(this.statTracker.hastePercentage(event.after.haste, true), remainingHasteBuffs);

    this._setHaste(event, newHastePercentage);

    if (debug) {
      const spellName = event.trigger.ability ? event.trigger.ability.name : 'unknown';
      console.log(`Haste: Current haste: ${formatPercentage(this.current)}% (haste RATING changed by ${event.delta.haste} from ${spellName})`);
    }
  }

  _applyActiveBuff(event) {
    const spellId = event.ability.guid;
    const hasteGain = this._getBaseHasteGain(spellId);

    if (hasteGain) {
      this._applyHasteGain(event, hasteGain);

      debug && console.log(formatMilliseconds(this.owner.fightDuration), 'Haste:', 'Current haste:', `${formatPercentage(this.current)}%`, `(gained ${formatPercentage(hasteGain)}% from ${event.ability.name})`);
    } else {
      debug && console.warn(formatMilliseconds(this.owner.fightDuration), 'Haste: Applied not recognized buff:', event.ability.name);
    }
  }
  _removeActiveBuff(event) {
    const spellId = event.ability.guid;
    const haste = this._getBaseHasteGain(spellId);

    if (haste) {
      this._applyHasteLoss(event, haste);

      debug && console.log(`Haste: Current haste: ${formatPercentage(this.current)}% (lost ${formatPercentage(haste)}% from ${SPELLS[spellId] ? SPELLS[spellId].name : spellId})`);
    } else {
      debug && console.warn(formatMilliseconds(this.owner.fightDuration), 'Haste: Removed not recognized buff:', event.ability.name);
    }
  }
  /**
   * Gets the base Haste gain for the provided spell.
   */
  _getBaseHasteGain(spellId) {
    const hasteBuff = this.constructor.HASTE_BUFFS[spellId] || undefined;

    if (typeof hasteBuff === 'number') {
      // A regular number is a static Haste percentage
      return hasteBuff;
    } else if (typeof hasteBuff === 'object') {
      // An object can provide more info
      if (hasteBuff.haste) {
        return this._getHasteValue(hasteBuff.haste, hasteBuff);
      }
    }
    return null;
  }

  _changeBuffStack(event) {
    const spellId = event.ability.guid;
    const haste = this._getHastePerStackGain(spellId);

    if (haste) {
      // Haste stacks are additive, so at 5 stacks with 3% per you'd be at 15%, 6 stacks = 18%. This means the only right way to add a Haste stack is to reset to Haste without the old total and then add the new total Haste again.
      // 1. Calculate the total Haste percentage without the buff
      const baseHaste = this.constructor.removeHaste(this.current, event.oldStacks * haste);
      // 2. Calculate the new total Haste percentage with the Haste from the new amount of stacks
      const newHastePercentage = this.constructor.addHaste(baseHaste, event.newStacks * haste);

      this._setHaste(event, newHastePercentage);

      debug && console.log(`Haste: Current haste: ${formatPercentage(this.current)}% (gained ${formatPercentage(haste * event.stacksGained)}% from ${SPELLS[spellId] ? SPELLS[spellId].name : spellId})`);
    }
  }
  _getHastePerStackGain(spellId) {
    const hasteBuff = this.constructor.HASTE_BUFFS[spellId] || undefined;

    if (typeof hasteBuff === 'number') {
      // hasteBuff being a number is shorthand for static haste only
    } else if (typeof hasteBuff === 'object') {
      if (hasteBuff.hastePerStack) {
        return this._getHasteValue(hasteBuff.hastePerStack, hasteBuff);
      }
    }
    return null;
  }
  /**
   * Get the actual Haste value from a prop allowing various formats.
   */
  _getHasteValue(value, hasteBuff) {
    const { itemId } = hasteBuff;
    if (typeof value === 'function') {
      const selectedCombatant = this.selectedCombatant;
      let itemDetails;
      if (itemId) {
        itemDetails = selectedCombatant.getItem(itemId);
        if (!itemDetails) {
          console.error('Failed to retrieve item information for item with ID:', itemId);
        }
      }
      return value(selectedCombatant, itemDetails);
    }
    return value;
  }

  _applyHasteGain(event, haste) {
    this._setHaste(event, this.constructor.addHaste(this.current, haste));
  }
  _applyHasteLoss(event, haste) {
    this._setHaste(event, this.constructor.removeHaste(this.current, haste));
  }
  _setHaste(event, haste) {
    if (isNaN(haste)) {
      throw new Error('Attempted to set an invalid Haste value. Something broke.');
    }
    const oldHaste = this.current;
    this.current = haste;

    this._triggerChangeHaste(event, oldHaste, this.current);
  }
  _triggerChangeHaste(event, oldHaste, newHaste) {
    const fabricatedEvent = {
      type: EventType.ChangeHaste,
      sourceID: event ? event.sourceID : this.owner.playerId,
      targetID: this.owner.playerId,
      oldHaste,
      newHaste,
    };
    debug && console.log(EventType.ChangeHaste, fabricatedEvent);
    this.eventEmitter.fabricateEvent(fabricatedEvent, event);
  }

  static addHaste(baseHaste, hasteGain) {
    return baseHaste * (1 + hasteGain) + hasteGain;
  }
  static removeHaste(baseHaste, hasteLoss) {
    return (baseHaste - hasteLoss) / (1 + hasteLoss);
  }
}

export default Haste;
