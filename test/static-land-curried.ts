import { _, _0, _1 } from '../src/hkts';
import * as maybe from '../src/maybe';
import { pipe } from '../src/pipe';
import { bifunctor, monad } from '../src/static-land-curried';

/** Utilities */
const addOne = (n: number) => n + 1;

/** Tests */
it('array', () => {
  const { map, join } = monad<_[]>({
    of: x => [x],
    chain: f => xs => xs.map(f).reduce((xs, ys) => xs.concat(ys), []),
  });

  const result = map(addOne)(join([[42]]));
  expect(result).toEqual([43]);
});

it('maybe', () => {
  const { map, join, some } = maybe;
  const result = map(addOne)(join(some(some(42))));
  expect(result).toEqual(some(43));
});

it('pipe', () => {
  const { map, chain, none, getOrElse, some } = maybe;
  const result = pipe(
    some(1),
    map(addOne),
    chain(n => (n % 2 === 0 ? none : some(100))),
    getOrElse(() => 18)
  );
  expect(result).toEqual(18);
});

it('list', () => {
  type List<A> = { tag: 'nil' } | { tag: 'cons'; head: A; tail: List<A> };
  const nil: List<never> = { tag: 'nil' };
  const cons = <A>(head: A, tail: List<A> = nil): List<A> => ({
    tag: 'cons',
    head,
    tail,
  });
  const concat = <A>(xs: List<A>, ys: List<A>): List<A> =>
    xs.tag === 'nil' ? ys : cons(xs.head, concat(xs.tail, ys));
  const chainList = <A, B>(f: (x: A) => List<B>) => (xs: List<A>): List<B> =>
    xs.tag === 'nil' ? nil : concat(f(xs.head), chainList(f)(xs.tail));

  const { map, join } = monad<List<_>>({
    of: x => cons(x, nil),
    chain: chainList,
  });

  const result = map(addOne)(join(cons(cons(42))));
  expect(result).toEqual(cons(43));
});

describe('either', () => {
  type Either<A, B> = { tag: 'left'; left: A } | { tag: 'right'; right: B };
  const left = <A>(left: A): Either<A, never> => ({ tag: 'left', left });
  const right = <B>(right: B): Either<never, B> => ({ tag: 'right', right });

  it('bifunctor', () => {
    const { bimap, first, second } = bifunctor<Either<_0, _1>>({
      bimap: (f, g) => either =>
        either.tag === 'left' ? left(f(either.left)) : right(g(either.right)),
    });

    const l = (x: number): boolean => !(x % 2);
    const r = (y: boolean): string => String(y);

    const input1: Either<number, boolean> = left(2);
    const result1 = bimap(l, r)(input1);
    expect(result1).toEqual(left(true));

    const input2: Either<number, boolean> = right(true);
    const result2 = bimap(l, r)(input2);
    expect(result2).toEqual(right('true'));

    const { map: mapFirst } = first(result2);
    const { map: mapSecond } = second(result2);

    const not = (b: boolean) => !b;
    const stringLength = (s: string) => s.length;

    expect(mapFirst(not)(result2)).toEqual(right('true'));
    expect(mapSecond(stringLength)(result2)).toEqual(right(4));
  });

  it('monad', () => {
    const RightMonad = <L>() =>
      monad<Either<L, _>>({
        of: right,
        chain: f => either =>
          either.tag === 'left' ? either : f(either.right),
      });

    const either = right(42);
    const result = RightMonad().map(addOne)(either);
    expect(result).toEqual(right(43));
  });
});
