import SPELLS from 'common/SPELLS';

import EventsNormalizer from 'parser/core/EventsNormalizer';
import { AnyEvent, EventType } from 'parser/core/Events';

class Enrage extends EventsNormalizer {
  /**
   * The applybuff from enrage is logged after the cast of Bloodthirst if it procs
   * This ensures the enrage buff comes before the cast of Bloodthirst so the haste effect of Enrage updates the GCD correctly
   * @param {Array} events
   * @returns {Array}
   **/

  normalize(events: AnyEvent[]) {
    const fixedEvents: AnyEvent[] = [];
    events.forEach((event, eventIndex) => {
      fixedEvents.push(event);

      if (event.type === EventType.ApplyBuff && event.ability.guid === SPELLS.ENRAGE.id) {
        const castTimestamp = event.timestamp;

        for (let previousEventIndex = eventIndex; previousEventIndex >= 0; previousEventIndex -= 1) {
          const previousEvent = fixedEvents[previousEventIndex];
          if ((castTimestamp - previousEvent.timestamp) > 50) {
            break;
          }
          if (previousEvent.type === EventType.Cast && previousEvent.ability.guid === SPELLS.BLOODTHIRST.id && previousEvent.sourceID === event.sourceID) {
            fixedEvents.splice(previousEventIndex, 1);
            fixedEvents.push(previousEvent);
            previousEvent.__modified = true;
            break;
          }
        }
      }
    });

    return fixedEvents;
  }
}

export default Enrage;
