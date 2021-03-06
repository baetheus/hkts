import { $ } from "./hkts.ts";

/**
 * Alt
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#alt
 */
export type Alt<T> = Functor<T> & {
  alt: <A>(ta: $<T, [A]>, tb: $<T, [A]>) => $<T, [A]>;
};
export type Alt2<T> = Functor2<T> & {
  alt: <E, A>(ta: $<T, [E, A]>, tb: $<T, [E, A]>) => $<T, [E, A]>;
};

/**
 * Alternative
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#alternative
 */
export type Alternative<T> = Applicative<T> & Plus<T>;
export type Alternative2<T> = Applicative2<T> & Plus2<T>;

/**
 * Applicative
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#applicative
 */
export type Applicative<T> = Apply<T> & {
  of: <A>(a: A) => $<T, [A]>;
};
export type Applicative2<T> = Apply2<T> & {
  of: <E, A>(a: A) => $<T, [E, A]>;
};

/**
 * Apply
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#apply
 */
export type Apply<T> = Functor<T> & {
  ap: <A, B>(tfab: $<T, [(a: A) => B]>, ta: $<T, [A]>) => $<T, [B]>;
};
export type Apply2<T> = Functor2<T> & {
  ap: <E, A, B>(tfab: $<T, [E, (a: A) => B]>, ta: $<T, [E, A]>) => $<T, [E, B]>;
};

/**
 * Bifunctor
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#bifunctor
 */
export type Bifunctor<T> = {
  bimap: <A, B, C, D>(
    fab: (a: A) => B,
    fcd: (c: C) => D,
    tac: $<T, [A, C]>
  ) => $<T, [B, D]>;
};

/**
 * Category
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#category
 */
export type Category<T> = Semigroupoid<T> & {
  id: <I, J>() => $<T, [I, J]>;
};

/**
 * Chain
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#chain
 */
export type Chain<T> = Apply<T> & {
  chain: <A, B>(fatb: (a: A) => $<T, [B]>, ta: $<T, [A]>) => $<T, [B]>;
};
export type Chain2<T> = Apply2<T> & {
  chain: <E, A, B>(
    fatb: (a: A) => $<T, [E, B]>,
    ta: $<T, [E, A]>
  ) => $<T, [E, B]>;
};

/**
 * ChainRec
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#chainrec
 *
 * @todo Confirm type
 */
export type ChainRec<T> = Chain<T> & {
  chainRec: <A, B, C>(
    f: (next: (a: A) => C, done: (b: B) => C, a: A) => $<T, [C]>,
    a: A
  ) => $<T, [B]>;
};
export type ChainRec2<T> = Chain2<T> & {
  chainRec: <E, A, B, C>(
    f: (next: (a: A) => C, done: (b: B) => C, a: A) => $<T, [E, C]>,
    a: A
  ) => $<T, [E, B]>;
};

/**
 * Comonad
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#comonad
 */
export type Comonad<T> = Extend<T> & {
  extract: <A>(ta: $<T, [A]>) => A;
};
export type Comonad2<T> = Extend2<T> & {
  extract: <E, A>(ta: $<T, [E, A]>) => A;
};

/**
 * Contravariant
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#contravariant
 */
export type Contravariant<T> = {
  contramap: <A, B>(fab: (a: A) => B, tb: $<T, [B]>) => $<T, [A]>;
};
export type Contravariant2<T> = {
  contramap: <E, A, B>(fab: (a: A) => B, tb: $<T, [E, B]>) => $<T, [E, A]>;
};

/**
 * Extend
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#extend
 */
export type Extend<T> = Functor<T> & {
  extend: <A, B>(ftab: (t: $<T, [A]>) => B, ta: $<T, [A]>) => $<T, [B]>;
};
export type Extend2<T> = Functor2<T> & {
  extend: <E, A, B>(
    ftab: (t: $<T, [E, A]>) => B,
    ta: $<T, [E, A]>
  ) => $<T, [E, B]>;
};

/**
 * Filterable
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#filterable
 */
export type Filterable<T> = {
  filter: <A>(predicate: (x: A) => boolean, ta: $<T, [A]>) => $<T, [A]>;
};
export type Filterable2<T> = {
  filter: <E, A>(
    predicate: (x: A) => boolean,
    ta: $<T, [E, A]>
  ) => $<T, [E, A]>;
};

/**
 * Foldable
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#foldable
 */
export type Foldable<T> = {
  reduce: <A, B>(faba: (a: A, b: B) => A, a: A, tb: $<T, [B]>) => A;
};
export type Foldable2<T> = {
  reduce: <E, A, B>(faba: (a: A, b: B) => A, a: A, tb: $<T, [E, B]>) => A;
};

/**
 * Functor
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#functor
 */
export type Functor<T> = {
  map: <A, B>(fab: (a: A) => B, ta: $<T, [A]>) => $<T, [B]>;
};
export type Functor2<T> = {
  map: <E, A, B>(fab: (a: A) => B, ta: $<T, [E, A]>) => $<T, [E, B]>;
};

/**
 * Group
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#group
 */
export type Group<T> = Monoid<T> & {
  invert: (x: T) => T;
};

/**
 * Monad
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#monad
 */
export type Monad<T> = Applicative<T> &
  Chain<T> & {
    join: <A>(tta: $<T, [$<T, [A]>]>) => $<T, [A]>;
  };
export type Monad2<T> = Applicative2<T> &
  Chain2<T> & {
    join: <E, A>(tta: $<T, [E, $<T, [E, A]>]>) => $<T, [E, A]>;
  };

/**
 * Monoid
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#monoid
 */
export type Monoid<T> = Semigroup<T> & {
  empty: () => T;
};

/**
 * Ord
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#ord
 */
export type Ord<T> = Setoid<T> & {
  lte: (a: T, b: T) => boolean;
};

/**
 * Plus
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#plus
 */
export type Plus<T> = Alt<T> & {
  zero: <A>() => $<T, [A]>;
};
export type Plus2<T> = Alt2<T> & {
  zero: <E, A>() => $<T, [E, A]>;
};

/**
 * Profunctor
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#profunctor
 */
export type Profunctor<T> = {
  promap: <A, B, C, D>(
    fab: (x: A) => B,
    fcd: (x: C) => D,
    tbc: $<T, [B, C]>
  ) => $<T, [A, D]>;
};

/**
 * Semigroup
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#semigroup
 */
export type Semigroup<T> = {
  concat: (a: T, b: T) => T;
};

/**
 * Semigroupoid
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#semigroupoid
 */
export type Semigroupoid<T> = {
  compose: <I, J, K>(tij: $<T, [I, J]>, tjk: $<T, [J, K]>) => $<T, [I, K]>;
};

/**
 * Setoid
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#setoid
 */
export type Setoid<T> = {
  equals: (a: T, b: T) => boolean;
};

/**
 * Show
 * Take a type and prints a string for it.
 */
export type Show<T> = {
  show: (t: T) => string;
};

/**
 * Traversable
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#traversable
 */
export type Traversable<T> = Functor<T> &
  Foldable<T> & {
    traverse: <U, A, B>(
      A: Applicative<U>,
      faUb: (a: A) => $<U, [B]>,
      Ta: $<T, [A]>
    ) => $<U, [$<T, [B]>]>;
  };
export type Traversable2<T> = Functor2<T> &
  Foldable2<T> & {
    traverse: <U, E, A, B>(
      A: Applicative<U>,
      faUb: (a: A) => $<U, [B]>,
      Ta: $<T, [E, A]>
    ) => $<U, [$<T, [E, B]>]>;
  };

/**
 * Implementations
 */

/**
 * Derives map from ap and of.
 */
export const createApplicative = <T>({
  ap,
  of,
}: Pick<Applicative<T>, "ap" | "of">): Applicative<T> => ({
  ap,
  of,
  map: (fab, ta) => ap(of(fab), ta),
});

/**
 * Derives ap from map and chain.
 */
export const createChain = <T>({
  chain,
  map,
}: Pick<Chain<T>, "chain"> & Functor<T>): Chain<T> => ({
  chain,
  map,
  ap: (tfab, ta) => chain((fab) => map(fab, ta), tfab),
});

/**
 * Derives join and map from of and chain.
 */
export const createMonad = <T>({
  of,
  map,
  join,
}: Pick<Monad<T>, "of" | "join" | "map">): Monad<T> => ({
  of,
  map,
  join,
  ap: (tfab, ta) => join(map((a) => map((fab) => fab(a), tfab), ta)),
  chain: (fatb, ta) => join(map(fatb, ta)),
});
export const createMonad2 = <T>({
  of,
  map,
  join,
}: Pick<Monad2<T>, "of" | "join" | "map">): Monad2<T> => ({
  of,
  map,
  join,
  ap: (tfab, ta) => join(map((a) => map((fab) => fab(a), tfab), ta)),
  chain: (fatb, ta) => join(map(fatb, ta)),
});
