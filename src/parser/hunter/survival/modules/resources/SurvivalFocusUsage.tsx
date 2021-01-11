import SharedHunterFocusUsage from 'parser/hunter/shared/modules/resources/FocusUsage';
import { LIST_OF_FOCUS_SPENDERS_SV } from 'parser/hunter/survival/constants';
import SPELLS from 'common/SPELLS';
import Spell from 'common/SPELLS/Spell';
import { Ability } from 'parser/core/Events';

class SurvivalFocusUsage extends SharedHunterFocusUsage {

  static listOfResourceSpenders: Spell[] = [
    ...LIST_OF_FOCUS_SPENDERS_SV,
  ];

  static spellsThatShouldShowAsOtherSpells: { [key: number]: Ability } = {
    [SPELLS.MONGOOSE_BITE_TALENT_AOTE.id]: SPELLS.MONGOOSE_BITE_TALENT,
    [SPELLS.RAPTOR_STRIKE_AOTE.id]: SPELLS.RAPTOR_STRIKE,
  };
}

export default SurvivalFocusUsage;
