import { useEffect } from 'react';
import { ActorRef, EventObject } from 'xstate';

export const useActorEventEffect = <Event extends EventObject>(
  actor: ActorRef<Event>,
  eventType: Event['type'],
  callback: (event: Event) => void
) => {
  useEffect(() => {
    const subs = actor.subscribe(({ event }) => {
      if (event.type === eventType) {
        callback(event);
      }
    });

    return () => subs.unsubscribe();
  }, [actor, callback, eventType]);
};
