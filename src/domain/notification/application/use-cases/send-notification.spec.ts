import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';

import { SendNotificationUseCase } from './send-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase; // system under test

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  test('should be able to create an notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Título da Nova pergunta',
      content: 'Conteúdo da nova pergunta',
    });

    expect(result.isRight()).toBe(true);

    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    );

    expect(result.value?.notification.title).toEqual('Título da Nova pergunta');
    expect(result.value?.notification.content).toEqual(
      'Conteúdo da nova pergunta',
    );
  });
});
