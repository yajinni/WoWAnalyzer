import SPELLS from 'common/SPELLS';

import EventsNormalizer from 'parser/core/EventsNormalizer';
import { EventType } from 'parser/core/Events';

class PyroclasmBuff extends EventsNormalizer {
  /**
   * @param {Array} events
   * @returns {Array}
   */
  //Ensures that the  ApplyBuff, RefreshBuff, and RemoveBuff events are not occuring before the pyroblast events... so the buff doesnt get applied, removed, or refreshed before the pyroblast actually casts
  normalize(events: any) {
    const fixedEvents: any = [];
    events.forEach((event: any, eventIndex: any) => {
      fixedEvents.push(event);

      if (event.type === EventType.Cast && event.ability.guid === SPELLS.PYROBLAST.id) {
        const castTimestamp = event.timestamp;

        for (let previousEventIndex = eventIndex; previousEventIndex >= 0; previousEventIndex -= 1) {
          const previousEvent = fixedEvents[previousEventIndex];
          if ((castTimestamp - previousEvent.timestamp) > 50) {
            break;
          }
          if ((previousEvent.type === EventType.RemoveBuff || previousEvent.type === EventType.ApplyBuff || previousEvent.type === EventType.RefreshBuff || previousEvent.type === EventType.ApplyBuffStack || previousEvent.type === EventType.RemoveBuffStack) && previousEvent.ability.guid === SPELLS.PYROCLASM_BUFF.id && previousEvent.sourceID === event.sourceID) {
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

export default PyroclasmBuff;
