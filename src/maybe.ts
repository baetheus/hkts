import { _ } from './hkts';
import { Alternative, Foldable, monad, Monad, Show, Traversable } from './static-land';
import { identity } from './utilities';

/**
 * Tags
 */
export const TagNone = 'None';
export const TagSome = 'Some';

/**
 * Types
 */
export type None = { tag: typeof TagNone };
export type Some<V> = { tag: typeof TagSome; value: V };
export type Maybe<A> = None | Some<A>;

/**
 * Constructors
 */
export const none: Maybe<never> = { tag: TagNone };
export const some = <A>(value: A): Maybe<A> => ({ tag: TagSome, value });
export const constNone = () => none;

/**
 * Type Guards
 */
export const isNone = <A>(m: Maybe<A>): m is None => m.tag === TagNone;
export const isSome = <A>(m: Maybe<A>): m is Some<A> => m.tag === TagSome;

/**
 * Utilities
 */
export const fold = <A, B>(cs: {
  [TagNone]: () => B;
  [TagSome]: (a: A) => B;
}) => (m: Maybe<A>): B => {
  switch (m.tag) {
    case TagSome:
      return cs[TagSome](m.value);
    case TagNone:
      return cs[TagNone]();
  }
};

export const getOrElse = <B>(onNone: () => B) =>
  fold<B, B>({ [TagSome]: identity, [TagNone]: onNone });

/**
 * Show
 */
export const getShow = <A>({ show }: Show<A>): Show<Maybe<A>> => ({
  show: ma => (isNone(ma) ? TagNone : `${TagSome}(${show(ma.value)})`),
});

/**
 * Monad
 */
export const { ap, map, chain, join, of } = monad<Maybe<_>>({
  of: some,
  chain: famb => fold({ [TagSome]: famb, [TagNone]: constNone }),
});

/**
 * Alternative
 */
export const { zero, alt }: Alternative<Maybe<_>> = {
  map,
  ap,
  of,
  zero: constNone,
  alt: a => b => (isSome(a) ? a : b),
};

/**
 * Traversable
 *
 */
export const { traverse }: Traversable<Maybe<_>> = {
  traverse: <F>(F: Applicative<F>) => <A>(ma: Maybe<A>) => <B>(
    f: (a: A) => $<F, [B]>
  ): $<F, [Maybe<B>]> => (isNone(ma) ? F.of(none) : F.map(f(ma.value))(some)),
};

/**
 * Foldable
 * (fa, b, f) => (isNone(fa) ? b : f(b, fa.value)),
 */
export const { reduce }: Foldable<Maybe<_>> = {
  reduce: fa => b => f => (isSome(fa) ? f(b)(fa.value) : b),
};

/**
 * Maybe
 */
export const maybe: Alternative<Maybe<_>> &
  Monad<Maybe<_>> &
  Foldable<Maybe<_>> &
  Traversable<Maybe<_>> = {
  map,
  ap,
  of,
  zero,
  alt,
  chain,
  join,
  traverse,
  reduce,
};
