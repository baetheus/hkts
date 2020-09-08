import { identity } from "./fns";
import { $ } from "./hkts";

/**
 * Alt
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#alt
 */
export interface Alt<T> extends Functor<T> {
  alt: <A>(ta: $<T, [A]>, tb: $<T, [A]>) => $<T, [A]>;
}

/**
 * Alternative
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#alternative
 */
export interface Alternative<T> extends Applicative<T>, Plus<T> {}

/**
 * Applicative
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#applicative
 */
export interface Applicative<T> extends Apply<T> {
  of: <A>(a: A) => $<T, [A]>;
}

/**
 * Apply
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#apply
 */
export interface Apply<T> extends Functor<T> {
  ap: <A, B>(tfab: $<T, [(a: A) => B]>, ta: $<T, [A]>) => $<T, [B]>;
}

/**
 * Bifunctor
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#bifunctor
 */
export interface Bifunctor<T> {
  bimap: <A, B, C, D>(
    fab: (a: A) => B,
    fcd: (c: C) => D,
    tac: $<T, [A, C]>
  ) => $<T, [B, D]>;
}

/**
 * Category
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#category
 */
export interface Category<T> extends Semigroupoid<T> {
  id: <I, J>() => $<T, [I, J]>;
}

/**
 * Chain
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#chain
 */
export interface Chain<T> extends Apply<T> {
  chain: <A, B>(fatb: (a: A) => $<T, [B]>, ta: $<T, [A]>) => $<T, [B]>;
}

/**
 * ChainRec
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#chainrec
 *
 * @todo Confirm type
 */
export interface ChainRec<T> extends Chain<T> {
  chainRec: <A, B, C>(
    f: (next: (a: A) => C, done: (b: B) => C, a: A) => $<T, [C]>,
    a: A
  ) => $<T, [B]>;
}

/**
 * Comonad
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#comonad
 */
export interface Comonad<T> extends Extend<T> {
  extract: <a>(ta: $<T, [a]>) => a;
}

/**
 * Contravariant
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#contravariant
 */
export interface Contravariant<T> {
  contramap: <A, B>(fab: (a: A) => B, tb: $<T, [B]>) => $<T, [A]>;
}

/**
 * Extend
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#extend
 */
export interface Extend<T> extends Functor<T> {
  extend: <A, B>(ftab: (t: $<T, [A]>) => B, ta: $<T, [A]>) => $<T, [B]>;
}

/**
 * Filterable
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#filterable
 */
export interface Filterable<T> {
  filter: <A>(predicate: (x: A) => boolean, ta: $<T, [A]>) => $<T, [A]>;
}

/**
 * Foldable
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#foldable
 */
export interface Foldable<T> {
  reduce: <A, B>(faba: (a: A, b: B) => A, a: A, tb: $<T, [B]>) => A;
}

/**
 * Functor
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#functor
 */
export interface Functor<T> {
  map: <A, B>(fab: (a: A) => B, ta: $<T, [A]>) => $<T, [B]>;
}

/**
 * Group
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#group
 */
export interface Group<T> extends Monoid<T> {
  invert: (x: T) => T;
}

/**
 * Monad
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#monad
 */
export interface Monad<T> extends Applicative<T>, Chain<T> {
  join: <A>(tta: $<T, [$<T, [A]>]>) => $<T, [A]>;
}

/**
 * Monoid
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#monoid
 */
export interface Monoid<T> extends Semigroup<T> {
  empty: () => T;
}

/**
 * Ord
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#ord
 */
export interface Ord<T> extends Setoid<T> {
  lte: (a: T, b: T) => boolean;
}

/**
 * Plus
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#plus
 */
export interface Plus<T> extends Alt<T> {
  zero: <A>() => $<T, [A]>;
}

/**
 * Profunctor
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#profunctor
 */
export interface Profunctor<T> {
  promap: <A, B, C, D>(
    fab: (x: A) => B,
    fcd: (x: C) => D,
    tbc: $<T, [B, C]>
  ) => $<T, [A, D]>;
}

/**
 * Semigroup
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#semigroup
 */
export interface Semigroup<T> {
  concat: (a: T, b: T) => T;
}

/**
 * Semigroupoid
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#semigroupoid
 */
export interface Semigroupoid<T> {
  compose: <I, J, K>(tij: $<T, [I, J]>, tjk: $<T, [J, K]>) => $<T, [I, K]>;
}

/**
 * Setoid
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#setoid
 */
export interface Setoid<T> {
  equals: (a: T, b: T) => boolean;
}

/**
 * Show
 * Take a type and prints a string for it.
 */
export interface Show<T> {
  show: (t: T) => string;
}

/**
 * Traversable
 * https://github.com/fantasyland/static-land/blob/master/docs/spec.md#traversable
 */
export interface Traversable<T> extends Functor<T>, Foldable<T> {
  traverse: <U, A, B>(
    A: Applicative<U>,
    faUb: (a: A) => $<U, [B]>,
    Ta: $<T, [A]>
  ) => $<U, [$<T, [B]>]>;
}

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
  chain,
}: Pick<Applicative<T>, "of"> & Pick<Chain<T>, "chain">): Monad<T> => ({
  of,
  join: (tta) => chain(identity, tta),
  ...createChain({
    chain,
    map: (fab, ta) => chain((a) => of(fab(a)), ta),
  }),
});
