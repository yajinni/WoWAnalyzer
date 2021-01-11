import { ApplyBuffEvent, ApplyBuffStackEvent, ApplyDebuffEvent, ApplyDebuffStackEvent, EventType, RemoveBuffEvent, RemoveBuffStackEvent, RemoveDebuffEvent, RemoveDebuffStackEvent } from 'parser/core/Events';

/**
 * Returns the current stacks on a given event
 * @param event
 */
export function currentStacks(event: RemoveBuffEvent | RemoveDebuffEvent | ApplyBuffEvent | ApplyDebuffEvent | ApplyBuffStackEvent | RemoveBuffStackEvent | ApplyDebuffStackEvent | RemoveDebuffStackEvent) {
  switch (event.type) {
    case EventType.RemoveBuff:
    case EventType.RemoveDebuff:
      return 0;
    case EventType.ApplyBuff:
    case EventType.ApplyDebuff:
      return 1;
    case EventType.ApplyBuffStack:
    case EventType.RemoveBuffStack:
    case EventType.ApplyDebuffStack:
    case EventType.RemoveDebuffStack:
      return event.stack;
  }
  throw new Error("Invalid event type for currentStacks");
}
