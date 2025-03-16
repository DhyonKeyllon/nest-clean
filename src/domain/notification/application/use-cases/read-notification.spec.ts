import { makeNotification } from 'test/factories/make-notification';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

import { ReadNotificationUseCase } from './read-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase; // system under test

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  test('should be able to create an notification', async () => {
    const notification = makeNotification();

    inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  test('should not be able to read a notification from another user', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-1'),
      },
      new UniqueEntityID('notification-1'),
    );

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
