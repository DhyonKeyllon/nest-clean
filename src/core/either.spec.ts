import { Either, left, right } from './either';

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (!shouldSuccess) return left('error');

  return right('success');
}

test('success result', () => {
  const result = doSomething(true);

  expect(result.isRight()).toBe(true);
  expect(result.isLeft()).toBe(false);
});

test('error result', () => {
  const result = doSomething(false);

  expect(result.isLeft()).toBe(true);
  expect(result.isRight()).toBe(false);
});
