import React from 'react';

import SPELLS from 'common/SPELLS';

import Analyzer from 'parser/core/Analyzer';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import { RAPTOR_MONGOOSE_VARIANTS } from 'parser/hunter/survival/constants';
import Statistic from 'interface/statistics/Statistic';
import DonutChart from 'interface/statistics/components/DonutChart';

/**
 * Tracks the focus usage of all 3 hunter specs and creates a piechart with the breakdown.
 *
 * Example log: https://www.warcraftlogs.com/reports/Pp17Crv6gThLYmdf#fight=8&type=damage-done&source=76
 */

const LIST_OF_FOCUS_SPENDERS = [
  //bm specific
  SPELLS.COBRA_SHOT.id,
  SPELLS.MULTISHOT_BM.id,
  SPELLS.KILL_COMMAND_CAST_BM.id,
  SPELLS.DIRE_BEAST_TALENT.id,
  //mm specific
  SPELLS.AIMED_SHOT.id,
  SPELLS.ARCANE_SHOT.id,
  SPELLS.SERPENT_STING_TALENT.id,
  SPELLS.MULTISHOT_MM.id,
  SPELLS.BURSTING_SHOT.id,
  SPELLS.PIERCING_SHOT_TALENT.id,
  SPELLS.EXPLOSIVE_SHOT_TALENT.id,
  //sv specific
  SPELLS.RAPTOR_STRIKE.id,
  SPELLS.BUTCHERY_TALENT.id,
  SPELLS.CARVE.id,
  SPELLS.MONGOOSE_BITE_TALENT.id,
  SPELLS.WING_CLIP.id,
  SPELLS.CHAKRAMS_TALENT.id,
  SPELLS.SERPENT_STING_SV.id,
  //shared
  SPELLS.REVIVE_PET.id,
  SPELLS.A_MURDER_OF_CROWS_TALENT.id,
  SPELLS.BARRAGE_TALENT.id,
];

class FocusUsage extends Analyzer {
  focusSpenderCasts = {
    //BEAST MASTERY
    [SPELLS.COBRA_SHOT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.COBRA_SHOT.name,
      color: '#ecd1b6',
    },
    [SPELLS.MULTISHOT_BM.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.MULTISHOT_BM.name,
      color: '#c1ec9c',
    },
    [SPELLS.KILL_COMMAND_CAST_BM.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.KILL_COMMAND_CAST_BM.name,
      color: '#abff3d',
    },
    [SPELLS.DIRE_BEAST_TALENT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.DIRE_BEAST_TALENT.name,
      color: '#ff7d0a',
    },
    //MARKSMANSHIP
    [SPELLS.AIMED_SHOT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.AIMED_SHOT.name,
      color: '#84ec81',
    },
    [SPELLS.ARCANE_SHOT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.ARCANE_SHOT.name,
      color: '#ff7d0a',
    },
    [SPELLS.SERPENT_STING_TALENT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.SERPENT_STING_TALENT.name,
      color: '#ecd1b6',
    },
    [SPELLS.PIERCING_SHOT_TALENT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.PIERCING_SHOT_TALENT.name,
      color: '#d440ec',
    },
    [SPELLS.MULTISHOT_MM.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.MULTISHOT_MM.name,
      color: '#4ce4ec',
    },
    [SPELLS.EXPLOSIVE_SHOT_TALENT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.EXPLOSIVE_SHOT_TALENT.name,
      color: '#ecda4c',
    },
    [SPELLS.BURSTING_SHOT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.BURSTING_SHOT.name,
      color: '#2a2a2a',
    },
    //SURVIVAL
    [SPELLS.RAPTOR_STRIKE.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.RAPTOR_STRIKE.name,
      color: '#4ce4ec',
    },
    [SPELLS.BUTCHERY_TALENT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.BUTCHERY_TALENT.name,
      color: '#8b4507',
    },
    [SPELLS.CARVE.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.CARVE.name,
      color: '#8b4507',
    },
    [SPELLS.WING_CLIP.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.WING_CLIP.name,
      color: '#ecda4c',
    },
    [SPELLS.SERPENT_STING_SV.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.SERPENT_STING_SV.name,
      color: '#ecd1b6',
    },
    [SPELLS.MONGOOSE_BITE_TALENT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.MONGOOSE_BITE_TALENT.name,
      color: '#00ec62',
    },
    [SPELLS.CHAKRAMS_TALENT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.CHAKRAMS_TALENT.name,
      color: '#ecda4c',
    },
    //SHARED
    [SPELLS.REVIVE_PET.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.REVIVE_PET.name,
      color: '#ec0003',
    },
    [SPELLS.A_MURDER_OF_CROWS_TALENT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.A_MURDER_OF_CROWS_TALENT.name,
      color: '#8b8dec',
    },
    [SPELLS.BARRAGE_TALENT.id]: {
      casts: 0,
      focusUsed: 0,
      name: SPELLS.BARRAGE_TALENT.name,
      color: '#ec5c58',
    },
  };
  lastVolleyHit = 0;

  on_byPlayer_cast(event) {
    let spellId = event.ability.guid;
    if (!LIST_OF_FOCUS_SPENDERS.includes(spellId) && !RAPTOR_MONGOOSE_VARIANTS.includes(spellId)) {
      return;
    }
    //shouldn't really happen unless something messed up in the log where the cast event doesn't have any class resource information so we skip those.
    if (!event.classResources) {
      return;
    }

    //Aspect of the Eagle changes the spellID of the spells, so we readjust to the original versions of the spell for the purpose of the chart
    if (spellId === SPELLS.MONGOOSE_BITE_TALENT_AOTE.id) {
      spellId = SPELLS.MONGOOSE_BITE_TALENT.id;
    } else if (spellId === SPELLS.RAPTOR_STRIKE_AOTE.id) {
      spellId = SPELLS.RAPTOR_STRIKE.id;
    }

    this.focusSpenderCasts[spellId].casts += 1;
    this.focusSpenderCasts[spellId].focusUsed += event.classResources[0].cost || 0;
  }

  get focusUsageChart() {
    const items = [];
    const makeTooltip = (spell) => (
      <>
        {spell.casts} casts <br />
        {Math.round(spell.focusUsed)} Focus used
      </>
    );

    LIST_OF_FOCUS_SPENDERS.forEach(id => {
      if (this.focusSpenderCasts[id].casts > 0 && this.focusSpenderCasts[id].focusUsed > 0) {
        items.push({
          color: this.focusSpenderCasts[id].color,
          label: this.focusSpenderCasts[id].name,
          spellId: id,
          value: Math.round(this.focusSpenderCasts[id].focusUsed),
          valueTooltip: makeTooltip(this.focusSpenderCasts[id]),
        });
      }
    });
    return (
      <DonutChart
        items={items}
      />
    );
  }

  statistic() {
    return (
      <Statistic position={STATISTIC_ORDER.CORE(13)}>
        <div className="pad">
          <label>Focus usage</label>
          {this.focusUsageChart}
        </div>
      </Statistic>
    );
  }
}

export default FocusUsage;
