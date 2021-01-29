import React from 'react';

import { Panel } from 'interface';
import Analyzer from 'parser/core/Analyzer';
import { EventType } from 'parser/core/Events';
import Combatants from 'parser/shared/modules/Combatants';
import { Trans } from '@lingui/macro';

import LowHealthHealingComponent from './Component';

class LowHealthHealing extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  tab() {
    return {
      title: 'Triage',
      url: 'triage',
      render: () => (
        <Panel
          title={<Trans id="shared.lowHealthHealing.tab.title">Triage healing</Trans>}
          explanation={<Trans id="shared.lowHealthHealing.tab.explanation">This shows all instances of healing people below a certain health threshold.</Trans>}
          pad={false}
        >
          <LowHealthHealingComponent
            healEvents={this.owner.eventHistory.filter(event => event.type === EventType.Heal && (this.owner.byPlayer(event) || this.owner.byPlayerPet(event)))}
            fightStart={this.owner.fight.start_time - this.owner.fight.offset_time}
            combatants={this.combatants}
          />
        </Panel>
      ),
    };
  }
}

export default LowHealthHealing;
