import * as assert from 'assert';

import { map, some } from '../src/maybe';
import { pipe } from '../src/pipe';

const addOne = (n: number) => n + 1;
const addOneMap = map(addOne);

describe('pipe', () => {
  it('pipe1', () => {
    const result = pipe(some(1));
    assert.deepStrictEqual(result, some(1));
  });

  it('pipe2', () => {
    const result = pipe(
      some(1),
      addOneMap
    );
    assert.deepStrictEqual(result, some(2));
  });

  it('pipe3', () => {
    const result = pipe(
      some(1),
      addOneMap,
      addOneMap
    );
    assert.deepStrictEqual(result, some(3));
  });

  it('pipe4', () => {
    const result = pipe(
      some(1),
      addOneMap,
      addOneMap,
      addOneMap
    );
    assert.deepStrictEqual(result, some(4));
  });

  it('pipe5', () => {
    const result = pipe(
      some(1),
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap
    );
    assert.deepStrictEqual(result, some(5));
  });

  it('pipe6', () => {
    const result = pipe(
      some(1),
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap
    );
    assert.deepStrictEqual(result, some(6));
  });

  it('pipe7', () => {
    const result = pipe(
      some(1),
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap
    );
    assert.deepStrictEqual(result, some(7));
  });

  it('pipe8', () => {
    const result = pipe(
      some(1),
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap
    );
    assert.deepStrictEqual(result, some(8));
  });

  it('pipe9', () => {
    const result = pipe(
      some(1),
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap
    );
    assert.deepStrictEqual(result, some(9));
  });

  it('pipe10', () => {
    const result = pipe(
      some(1),
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap,
      addOneMap
    );
    assert.deepStrictEqual(result, some(10));
  });
});
