import SPELLS from 'common/SPELLS';

import CoreHaste from 'parser/shared/modules/Haste';

class Haste extends CoreHaste {
  static HASTE_BUFFS = {
    ...CoreHaste.HASTE_BUFFS,
    // Ignorrior specific
    [SPELLS.INTO_THE_FRAY_BUFF.id]: { // from Into the Fray (3% per stack for each enemy nearby)
      hastePerStack: 0.03,
    },
  };
}

export default Haste;
