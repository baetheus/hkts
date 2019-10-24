import { _ } from './hkts';
import { identity, monad } from './static-land-curried';

/**
 * Types
 */
export type None = { tag: 'None' };
export type Some<V> = { tag: 'Some'; value: V };
export type Maybe<A> = None | Some<A>;

/**
 * Constructors
 */
export const none: Maybe<never> = { tag: 'None' };
export const some = <A>(value: A): Maybe<A> => ({ tag: 'Some', value });
export const constNone = () => none;

/**
 * Type Guards
 */
export const isNone = <A>(m: Maybe<A>): m is None => m.tag === 'None';
export const isSome = <A>(m: Maybe<A>): m is Some<A> => m.tag === 'Some';

/**
 * Utilities
 */
export const fold = <A, B>(onSome: (a: A) => B, onNone: () => B) => (
  m: Maybe<A>
): B => {
  switch (m.tag) {
    case 'Some':
      return onSome(m.value);
    case 'None':
      return onNone();
  }
};

/**
 * Monad
 */
export const { ap, map, chain, join, of } = monad<Maybe<_>>({
  of: some,
  chain: f => fold(f, constNone),
});

export const getOrElse = <B>(b: () => B) => fold<B, B>(identity, b);
