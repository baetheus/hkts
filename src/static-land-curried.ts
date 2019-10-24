import { $, _ } from './hkts';

/**
 * Types
 */
export interface Setoid<T> {
  equals: (x: T, y: T) => boolean;
}

export interface Ord<T> extends Setoid<T> {
  lte: (x: T, y: T) => boolean;
}

export interface Semigroup<T> {
  concat: (x: T, y: T) => T;
}

export interface Monoid<T> extends Semigroup<T> {
  empty: () => T;
}

export interface Group<T> extends Monoid<T> {
  invert: (x: T) => T;
}

export interface Semigroupoid<T> {
  compose: <I, J, K>(tij: $<T, [I, J]>) => (tjk: $<T, [J, K]>) => $<T, [I, K]>;
}

export interface Category<T> extends Semigroupoid<T> {
  id: <I, J>() => $<T, [I, J]>;
}

export interface Filterable<T> {
  filter: <A>(pred: (x: A) => boolean) => (ta: $<T, [A]>) => $<T, [A]>;
}

export interface Functor<T> {
  map: <A, B>(f: (x: A) => B) => (t: $<T, [A]>) => $<T, [B]>;
}

export interface Bifunctor<T> {
  bimap: <A, B, C, D>(f: (x: A) => B, g: (x: C) => D) => (t: $<T, [A, C]>) => $<T, [B, D]>;
  first: <A, B>(t: $<T, [A, B]>) => Functor<$<T, [_, B]>>;
  second: <A, B>(t: $<T, [A, B]>) => Functor<$<T, [A, _]>>;
}

export interface Contravariant<T> {
  contramap: <A, B>(f: (x: A) => B) => (t: $<T, [B]>) => $<T, [A]>;
}

export interface Profunctor<T> {
  promap: <A, B, C, D>(f: (x: A) => B, g: (x: C) => D) => (t: $<T, [B, C]>) => $<T, [A, D]>;
}

export interface Apply<T> extends Functor<T> {
  ap: <A, B>(tf: $<T, [(x: A) => B]>) => (ta: $<T, [A]>) => $<T, [B]>;
}

export interface Applicative<T> extends Apply<T> {
  of: <A>(x: A) => $<T, [A]>;
}

export interface Alt<T> extends Functor<T> {
  alt: <A>(x: $<T, [A]>) => (y: $<T, [A]>) => $<T, [A]>;
}

export interface Plus<T> extends Alt<T> {
  zero: <A>() => $<T, [A]>;
}

export interface Alternative<T> extends Applicative<T>, Plus<T> {}

export interface Chain<T> extends Apply<T> {
  chain: <A, B>(f: (x: A) => $<T, [B]>) => (t: $<T, [A]>) => $<T, [B]>;
}

export interface Monad<T> extends Applicative<T>, Chain<T> {
  join: <A>(tt: $<T, [$<T, [A]>]>) => $<T, [A]>;
}

export interface Foldable<T> {
  reduce: <A, B>(f: (x: A, y: B) => A, x: A) => (u: $<T, [B]>) => A;
}

export interface Extend<T> extends Functor<T> {
  extend: <A, B>(f: (t: $<T, [A]>) => B) => (t: $<T, [A]>) => $<T, [B]>;
}

export interface Comonad<T> extends Extend<T> {
  extract: <a>(t: $<T, [a]>) => a;
}

export interface Traversable<T> extends Functor<T>, Foldable<T> {
  traverse: <U, A, B>(
    a: Applicative<U>,
    f: (x: A) => $<U, [B]>,
  ) => (t: $<T, [A]>) => $<U, [$<T, [B]>]>;
}

/**
 * Utilities
 */
export const identity = <A>(a: A): A => a;
export const flip = <A, B, C>(f: (a: A) => (b: B) => C) => (b: B) => (a: A): C => f(a)(b);
export const compose = <A, B>(fab: (a: A) => B) => <C>(fbc: (b: B) => C) => (a: A): C =>
  fbc(fab(a));

/**
 * Implementation
 */
export const functor = <T>(spec: Functor<T>) => spec;

export const bifunctor = <T>({ bimap }: Pick<Bifunctor<T>, 'bimap'>): Bifunctor<T> => ({
  bimap,
  first: _ => ({
    map: f => bimap(f, identity),
  }),
  second: _ => ({
    map: f => bimap(identity, f),
  }),
});

export const applicative = <T>({ of, ap }: Pick<Applicative<T>, 'ap' | 'of'>): Applicative<T> => ({
  of,
  ap,
  map: compose(of)(ap),
});

export const chain = <T>({
  chain,
  map,
}: Pick<Chain<T>, 'chain'> & Pick<Functor<T>, 'map'>): Chain<T> => ({
  map,
  chain,
  ap: mfab => ma => chain(flip(map)(ma))(mfab),
});

export const monad = <T>({
  of,
  chain: _chain,
}: Pick<Applicative<T>, 'of'> & Pick<Chain<T>, 'chain'>): Monad<T> => ({
  of,
  join: _chain(identity),
  ...chain({
    chain: _chain,
    map: fab => _chain(compose(fab)(of)),
  }),
});
