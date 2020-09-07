import { $ } from "./hkts";

/**
 * Static Land Interfaces
 */
export interface Alt<T> extends Functor<T> {
  alt: <A>(x: $<T, [A]>, y: $<T, [A]>) => $<T, [A]>;
}

export interface Alternative<T> extends Applicative<T>, Plus<T> {}

export interface Applicative<T> extends Apply<T> {
  of: <A>(x: A) => $<T, [A]>;
}

export interface Apply<T> extends Functor<T> {
  ap: <A, B>(tf: $<T, [(x: A) => B]>, ta: $<T, [A]>) => $<T, [B]>;
}

export interface Bifunctor<T> {
  bimap: <A, B, C, D>(
    f: (x: A) => B,
    g: (x: C) => D,
    t: $<T, [A, C]>
  ) => $<T, [B, D]>;
}

export interface Category<T> extends Semigroupoid<T> {
  id: <I, J>() => $<T, [I, J]>;
}

export interface Chain<T> extends Apply<T> {
  chain: <A, B>(f: (x: A) => $<T, [B]>, t: $<T, [A]>) => $<T, [B]>;
}

export interface Comonad<T> extends Extend<T> {
  extract: <a>(t: $<T, [a]>) => a;
}

export interface Contravariant<T> {
  contramap: <A, B>(f: (x: A) => B, t: $<T, [B]>) => $<T, [A]>;
}

export interface Extend<T> extends Functor<T> {
  extend: <A, B>(f: (t: $<T, [A]>) => B, t: $<T, [A]>) => $<T, [B]>;
}

export interface Filterable<T> {
  filter: <A>(pred: (x: A) => boolean, ta: $<T, [A]>) => $<T, [A]>;
}

export interface Foldable<T> {
  reduce: <A, B>(f: (x: A, y: B) => A, x: A, u: $<T, [B]>) => A;
}
export interface Functor<T> {
  map: <A, B>(f: (x: A) => B, t: $<T, [A]>) => $<T, [B]>;
}

export interface Group<T> extends Monoid<T> {
  invert: (x: T) => T;
}

export interface Monad<T> extends Applicative<T>, Chain<T> {
  join: <A>(tt: $<T, [$<T, [A]>]>) => $<T, [A]>;
}

export interface Monoid<T> extends Semigroup<T> {
  empty: () => T;
}

export interface Ord<T> extends Setoid<T> {
  lte: (x: T, y: T) => boolean;
}

export interface Plus<T> extends Alt<T> {
  zero: <A>() => $<T, [A]>;
}

export interface Profunctor<T> {
  promap: <A, B, C, D>(
    f: (x: A) => B,
    g: (x: C) => D,
    t: $<T, [B, C]>
  ) => $<T, [A, D]>;
}

export interface Semigroup<T> {
  concat: (x: T, y: T) => T;
}

export interface Semigroupoid<T> {
  compose: <I, J, K>(tij: $<T, [I, J]>, tjk: $<T, [J, K]>) => $<T, [I, K]>;
}

export interface Setoid<T> {
  equals: (x: T, y: T) => boolean;
}

export interface Traversable<T> extends Functor<T>, Foldable<T> {
  traverse: <U, A, B>(
    a: Applicative<U>,
    f: (x: A) => $<U, [B]>,
    t: $<T, [A]>
  ) => $<U, [$<T, [B]>]>;
}

/**
 * Implementations
 */

export const applicative = <T>(
  spec: Pick<Applicative<T>, "ap" | "of">
): Applicative<T> & Functor<T> => ({
  ...spec,
  map: (f, u) => spec.ap(spec.of(f), u),
});

export const chain = <T>(spec: Pick<Chain<T>, "chain" | "map">): Chain<T> => ({
  ...spec,
  ap: (uf, ux) => spec.chain((f) => spec.map(f, ux), uf),
});

export const functor = <T>(spec: Functor<T>) => spec;

export const monad = <T>({
  of,
  chain: _chain,
}: Pick<Monad<T>, "of" | "chain">): Monad<T> => ({
  of,
  join: (tt) => _chain((t) => t, tt),
  ...chain({
    chain: _chain,
    map: (f, t) => _chain((x) => of(f(x)), t),
  }),
});
