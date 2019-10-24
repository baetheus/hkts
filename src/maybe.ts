import { _ } from './hkts';
import { identity, monad, Show } from './static-land-curried';

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
export const fold = <A, B>(onSome: (a: A) => B, onNone: () => B) => (
  m: Maybe<A>
): B => {
  switch (m.tag) {
    case TagSome:
      return onSome(m.value);
    case TagNone:
      return onNone();
  }
};

export const getOrElse = <B>(b: () => B) => fold<B, B>(identity, b);

/**
 * Show
 */
export const getShow = <A>(S: Show<A>): Show<Maybe<A>> => ({
  show: ma => (isNone(ma) ? TagNone : `${TagSome}(${S.show(ma.value)})`),
});

/**
 * Monad
 */
export const { ap, map, chain, join, of } = monad<Maybe<_>>({
  of: some,
  chain: f => fold(f, constNone),
});
