import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

// simulate a custom domain event (like a created, updated, deleted, etc)
class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.occurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

// simulate a custom aggregate (like a answer, question, user, etc)
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe('DomainEvents', () => {
  it('should be able to dispatch and listen to domain events', () => {
    // spy to check if the event was dispatched
    const callbackSpy = vi.fn();

    // subscribe registered (listening created event name)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // create aggregate, but not saving in the db repository
    const aggregate = CustomAggregate.create();

    // check if the event was added to the aggregate, but not dispatched
    expect(aggregate.domainEvents).toHaveLength(1);

    // saving the event in the db repository and dispatching it
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // the subscriber listens to the event and the callback is called
    expect(callbackSpy).toHaveBeenCalled();

    // the event is removed from the aggregate after being dispatched
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
