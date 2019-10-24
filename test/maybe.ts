import * as assert from 'assert';

import {
  ap,
  chain,
  constNone,
  fold,
  getOrElse,
  isNone,
  isSome,
  join,
  map,
  none,
  of,
  some,
  TagNone,
  TagSome,
} from '../src/maybe';
import { compose } from '../src/utilities';

const addOne = (n: number) => n + 1;

const someAddOne = some(addOne);
const someNumber = some(2);

describe('maybe', () => {
  it('ap', () => {
    assert.deepStrictEqual(ap(someAddOne)(someNumber), some(3));
    assert.deepStrictEqual(ap(someAddOne)(none), none);
  });

  it('chain', () => {
    const addOneChain = compose(addOne)(of);
    assert.deepStrictEqual(chain(addOneChain)(someNumber), some(3));
    assert.deepStrictEqual(chain(addOneChain)(none), none);
  });

  it('fold', () => {
    const Some = addOne;
    const None = () => 100;
    assert.deepStrictEqual(fold({ Some, None })(someNumber), 3);
    assert.deepStrictEqual(fold({ Some, None })(none), 100);
  });

  it('getOrElse', () => {
    assert.deepStrictEqual(getOrElse(() => 100)(someNumber), 2);
    assert.deepStrictEqual(getOrElse(() => 100)(none), 100);
  });

  it('some', () => {
    assert.deepStrictEqual(some(3), { tag: TagSome, value: 3 });
  });

  it('none', () => {
    assert.deepStrictEqual(none, { tag: TagNone });
  });

  it('constNone', () => {
    assert.deepStrictEqual(constNone(), none);
  });

  it('isSome', () => {
    assert.deepStrictEqual(isSome(someNumber), true);
    assert.deepStrictEqual(isSome(none), false);
  });

  it('isNone', () => {
    assert.deepStrictEqual(isNone(someNumber), false);
    assert.deepStrictEqual(isNone(none), true);
  });

  it('join', () => {
    assert.deepStrictEqual(join(some(some(3))), some(3));
    assert.deepStrictEqual(join(some(none)), none);
    assert.deepStrictEqual(join(none), none);
  });

  it('map', () => {
    assert.deepStrictEqual(map(addOne)(someNumber), some(3));
    assert.deepStrictEqual(map(addOne)(none), none);
  });
});
