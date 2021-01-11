import SPELLS from 'common/SPELLS';
import PETS from 'common/PETS';
import { Options } from 'parser/core/Analyzer';

import Pet from '../core/Pet';

class Shadowfiend extends Pet {
  _pet = PETS.SHADOWFIEND;

  constructor(options: Options) {
    super(options);
    this.active = !this.selectedCombatant.hasTalent(SPELLS.MINDBENDER_TALENT_SHADOW.id);
  }
}

export default Shadowfiend;
