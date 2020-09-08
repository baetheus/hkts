import { compose, flip, identity } from "./fns";
import { $ } from "./hkts";

/**
 * Static Land Interfaces
 */
export interface Alt<T> extends Functor<T> {
  alt: <A>(ta: $<T, [A]>) => (tb: $<T, [A]>) => $<T, [A]>;
}

export interface Alternative<T> extends Applicative<T>, Plus<T> {}

export interface Applicative<T> extends Apply<T> {
  of: <A>(a: A) => $<T, [A]>;
}

export interface Apply<T> extends Functor<T> {
  ap: <A, B>(tfab: $<T, [(a: A) => B]>) => (ta: $<T, [A]>) => $<T, [B]>;
}

export interface Bifunctor<T> {
  bimap: <A, B, C, D>(
    fab: (a: A) => B
  ) => (fcd: (c: C) => D) => (tac: $<T, [A, C]>) => $<T, [B, D]>;
}

export interface Category<T> extends Semigroupoid<T> {
  id: <I, J>() => $<T, [I, J]>;
}

export interface Chain<T> extends Apply<T> {
  chain: <A, B>(fatb: (a: A) => $<T, [B]>) => (ta: $<T, [A]>) => $<T, [B]>;
}

export interface Comonad<T> extends Extend<T> {
  extract: <a>(ta: $<T, [a]>) => a;
}

export interface Contravariant<T> {
  contramap: <A, B>(fab: (a: A) => B) => (tb: $<T, [B]>) => $<T, [A]>;
}

export interface Extend<T> extends Functor<T> {
  extend: <A, B>(ftab: (t: $<T, [A]>) => B) => (ta: $<T, [A]>) => $<T, [B]>;
}

export interface Filterable<T> {
  filter: <A>(predicate: (x: A) => boolean) => (ta: $<T, [A]>) => $<T, [A]>;
}

export interface Foldable<T> {
  reduce: <A, B>(faba: (a: A, b: B) => A) => (a: A) => (tb: $<T, [B]>) => A;
}

export interface Functor<T> {
  map: <A, B>(fab: (a: A) => B) => (ta: $<T, [A]>) => $<T, [B]>;
}

export interface Group<T> extends Monoid<T> {
  invert: (x: T) => T;
}

export interface Monad<T> extends Applicative<T>, Chain<T> {
  join: <A>(tta: $<T, [$<T, [A]>]>) => $<T, [A]>;
}

export interface Monoid<T> extends Semigroup<T> {
  empty: () => T;
}

export interface Ord<T> extends Setoid<T> {
  lte: (a: T, b: T) => boolean;
}

export interface Plus<T> extends Alt<T> {
  zero: <A>() => $<T, [A]>;
}

export interface Profunctor<T> {
  promap: <A, B, C, D>(
    fab: (x: A) => B
  ) => (fcd: (x: C) => D) => (tbc: $<T, [B, C]>) => $<T, [A, D]>;
}

export interface Semigroup<T> {
  concat: (a: T) => (b: T) => T;
}

export interface Semigroupoid<T> {
  compose: <I, J, K>(tij: $<T, [I, J]>) => (tjk: $<T, [J, K]>) => $<T, [I, K]>;
}

export interface Setoid<T> {
  equals: (a: T, b: T) => boolean;
}

export interface Show<T> {
  show: (t: T) => string;
}

export interface Traversable<T> extends Functor<T>, Foldable<T> {
  traverse: <U, A, B>(
    au: Applicative<U>
  ) => (faub: (x: A) => $<U, [B]>) => (ta: $<T, [A]>) => $<U, [$<T, [B]>]>;
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
  map: (f) => ap(of(f)),
});

/**
 * Derives ap from map and chain.
 */
export const createChain = <T>({
  chain,
  map,
}: Pick<Chain<T>, "chain" | "map">): Chain<T> => ({
  chain,
  map,
  ap: flip((ta) => chain(flip(map)(ta))),
});

/**
 * Derives join and map from of and chain.
 */
export const createMonad = <T>({
  of,
  chain,
}: Pick<Monad<T>, "of" | "chain">): Monad<T> => ({
  of,
  join: chain(identity),
  ...createChain({
    chain,
    map: (fab) => chain(compose(fab)(of)),
  }),
});
