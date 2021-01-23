import SPELLS from 'common/SPELLS';

import FilteredDamageTracker from '../../../shared/casttracker/FilteredDamageTracker';

class DanceDamageTracker extends FilteredDamageTracker {
  shouldProcessEvent(event: any) {
    return this.selectedCombatant.hasBuff(SPELLS.SHADOW_DANCE_BUFF.id);
  }
}

export default DanceDamageTracker;
