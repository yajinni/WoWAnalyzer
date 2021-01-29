import SPELLS from 'common/SPELLS';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import HealingDone from 'parser/shared/modules/throughput/HealingDone';

import Events from 'parser/core/Events';

import Mastery from './Mastery';

const BASE_MANA = 20000;
const REJUV_COST = 0.105; // % of base mana

/*
 * Backend module for calculating things about Rejuvenation, to be used by other modules.
 */
class Rejuvenation extends Analyzer {
  /*
   * The total healing attributable to Rejuvenation
   */
  get totalRejuvHealing() {
    return this.mastery.getMultiMasteryHealing([SPELLS.REJUVENATION.id, SPELLS.REJUVENATION_GERMINATION.id]);
  }

  /*
   * The average healing caused per cast of Rejuvenation
   */
  get avgRejuvHealing() {
    return this.totalRejuvHealing / this.totalRejuvsCast;
  }

  static dependencies = {
    healingDone: HealingDone,
    mastery: Mastery,
  };
  totalRejuvsCast = 0;

  constructor(options) {
    super(options);
    this.addEventListener(Events.heal.by(SELECTED_PLAYER), this.onHeal);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.REJUVENATION), this.onCast);
    this.addEventListener(Events.applybuff.by(SELECTED_PLAYER), this.onApplyBuff);
    this.addEventListener(Events.fightend, this.onFightend);
  }

  onHeal(event) {
    // TODO
  }

  onCast(event) {
    this.totalRejuvsCast += 1;
  }

  onApplyBuff(event) {
    // TODO check for applications too?
  }

  onFightend() {
    // TODO debug prints
  }

  /*
   * The expected healing done by using the given amount of mana to fill with Rejuv casts
   */
  getRejuvFillHealing(mana) {
    return mana / (BASE_MANA / REJUV_COST) * this.avgRejuvHealing;
  }

}

export default Rejuvenation;
