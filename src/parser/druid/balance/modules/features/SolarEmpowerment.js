import { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import SPELLS from 'common/SPELLS';

import Empowerment from './Empowerment';

class SolarEmpowerment extends Empowerment {
  empowermentBuff = SPELLS.SOLAR_EMP_BUFF;
  statisticOrder = STATISTIC_ORDER.CORE(6);

  constructor(...args) {
    super(...args);
    this.empoweredSpell = SPELLS.SOLAR_WRATH_MOONKIN;
    this.empowermentPrefix = 'Solar';
    this.spellGenerateAmount = 8;
    this.icon = 'ability_druid_eclipseorange';
  }
}

export default SolarEmpowerment;
