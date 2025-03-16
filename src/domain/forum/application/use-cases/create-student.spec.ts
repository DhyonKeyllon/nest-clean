import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-create-student-repository';

import { CreateStudentUseCase } from './create-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: CreateStudentUseCase; // system under test

describe('Create Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    fakeHasher = new FakeHasher();
    sut = new CreateStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });

  test('should be able to create an student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  test('should hash student password upon creation', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });
});
