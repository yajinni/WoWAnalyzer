import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import ResourceTracker from 'parser/shared/modules/resources/resourcetracker/ResourceTracker';
import SPELLS from 'common/SPELLS';

class ChiTracker extends ResourceTracker {
  maxResource = 5;

  constructor(...args) {
    super(...args);
    this.resource = RESOURCE_TYPES.CHI;

    if (this.selectedCombatant.hasTalent(SPELLS.ASCENSION_TALENT.id)) {
      this.maxResource = 6;
    }
  }

  getReducedCost(event) {
    if (!this.getResource(event).cost) {
      return 0;
    }
    let cost = this.getResource(event).cost;
    const spellId = event.ability.guid;

    // Blackout Kick costs 3 chi when learned, but is reduced in cost during levelling
    if (spellId === SPELLS.BLACKOUT_KICK.id) {
        cost = 1;
    }
    return cost;
  }
}

export default ChiTracker;
