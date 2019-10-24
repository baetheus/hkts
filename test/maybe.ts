import * as assert from 'assert';

import { ap, chain, constNone, fold, getOrElse, isNone, isSome, join, map, none, of, some } from '../src/maybe';
import { compose } from '../src/static-land-curried';

const addOne = (n: number) => n + 1;

const someAddOne = some(addOne);
const someNumber = some(2);
const aNone = none;

describe('maybe', () => {
  it('ap', () => {
    assert.deepStrictEqual(ap(someAddOne)(someNumber), some(3));
    assert.deepStrictEqual(ap(someAddOne)(aNone), none);
  });

  it('chain', () => {
    const addOneChain = compose(addOne)(of);
    assert.deepStrictEqual(chain(addOneChain)(someNumber), some(3));
    assert.deepStrictEqual(chain(addOneChain)(aNone), none);
  });

  it('fold', () => {
    const onSome = addOne;
    const onNone = () => 100;
    assert.deepStrictEqual(fold(onSome, onNone)(someNumber), 3);
    assert.deepStrictEqual(fold(onSome, onNone)(aNone), 100);
  });

  it('getOrElse', () => {
    assert.deepStrictEqual(getOrElse(() => 100)(someNumber), 2);
    assert.deepStrictEqual(getOrElse(() => 100)(aNone), 100);
  });

  it('some', () => {
    assert.deepStrictEqual(some(3), { tag: 'Some', value: 3 });
  });

  it('none', () => {
    assert.deepStrictEqual(none, { tag: 'None' });
  });

  it('constNone', () => {
    assert.deepStrictEqual(constNone(), none);
  });

  it('isSome', () => {
    assert.deepStrictEqual(isSome(someNumber), true);
    assert.deepStrictEqual(isSome(aNone), false);
  });

  it('isNone', () => {
    assert.deepStrictEqual(isNone(someNumber), false);
    assert.deepStrictEqual(isNone(aNone), true);
  });

  it('join', () => {
    assert.deepStrictEqual(join(some(some(3))), some(3));
    assert.deepStrictEqual(join(some(none)), none);
    assert.deepStrictEqual(join(none), none);
  });

  it('map', () => {
    assert.deepStrictEqual(map(addOne)(someNumber), some(3));
    assert.deepStrictEqual(map(addOne)(aNone), none);
  });
});
