import EventsNormalizer from 'parser/core/EventsNormalizer';

import SPELLS from 'common/SPELLS';
import { EventType } from 'parser/core/Events';

const MAX_DELAY = 50;

// Occasionally HoT heal has same timestamp but happens after the removebuff event, which causes issues when attempting to attribute the heal.
// This normalizes the heal to always be before the removebuff
class HotRemovalNormalizer extends EventsNormalizer {

  // This ordering issue only happens for the HoTs that tick on removebuff
  instantTickHotIds = [
    SPELLS.RENEWING_MIST_HEAL.id,
    SPELLS.ESSENCE_FONT_BUFF.id,
  ];

  normalize(events) {
    const fixedEvents = [];
    events.forEach((event, eventIndex) => {
      fixedEvents.push(event);

      if (event.type === EventType.Heal && this.instantTickHotIds.includes(event.ability.guid)) {
        const spellId = event.ability.guid;
        const castTimestamp = event.timestamp;
        if (!event.targetID) {
          return;
        }
        // Loop through the event history in reverse to detect if there was a removebuff from same spell on same target
        for (let previousEventIndex = eventIndex; previousEventIndex >= 0; previousEventIndex -= 1) {
          const previousEvent = fixedEvents[previousEventIndex];
          if ((castTimestamp - previousEvent.timestamp) > MAX_DELAY) {
            break;
          }

          if (previousEvent.type === EventType.RemoveBuff && previousEvent.ability.guid === spellId && previousEvent.targetID === event.targetID) {
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
export default HotRemovalNormalizer;
