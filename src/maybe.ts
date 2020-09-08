import { identity } from "./fns";
import { $, _ } from "./hkts";
import {
  Alternative,
  Applicative,
  createMonad,
  Foldable,
  Monad,
  Show,
  Traversable,
} from "./static-land";

/**
 * Types
 */
export type None = { tag: "None" };
export type Some<V> = { tag: "Some"; value: V };
export type Maybe<A> = None | Some<A>;

/**
 * Constructors
 */
export const none: None = { tag: "None" };
export const some = <A>(value: A): Maybe<A> => ({ tag: "Some", value });
export const constNone = () => none;

/**
 * Type Guards
 */
export const isNone = <A>(m: Maybe<A>): m is None => m.tag === "None";
export const isSome = <A>(m: Maybe<A>): m is Some<A> => m.tag === "Some";

/**
 * Utilities
 */
export const fold = <A, B>(
  onSome: (a: A) => B,
  onNone: () => B,
  ta: Maybe<A>
): B => {
  switch (ta.tag) {
    case "None":
      return onNone();
    case "Some":
      return onSome(ta.value);
  }
};

export const getOrElse = <B>(onNone: () => B, ta: Maybe<B>): B =>
  fold(identity, onNone, ta);

/**
 * Show
 */
export const getShow = <A>({ show }: Show<A>): Show<Maybe<A>> => ({
  show: (ma) => (isNone(ma) ? "None" : `${"Some"}(${show(ma.value)})`),
});

/**
 * Monad
 */
export const { ap, map, chain, join, of } = createMonad<Maybe<_>>({
  of: some,
  chain: <A, B>(famb: (a: A) => Maybe<B>, ta: Maybe<A>): Maybe<B> =>
    fold(famb, constNone, ta),
});

/**
 * Alternative
 */
export const { zero, alt }: Pick<Alternative<Maybe<_>>, "zero" | "alt"> = {
  zero: constNone,
  alt: (a, b) => (isSome(a) ? a : b),
};

/**
 * Foldable
 */
export const { reduce }: Foldable<Maybe<_>> = {
  reduce: <A, B>(faba: (a: A, b: B) => A, a: A, tb: Maybe<B>): A =>
    isSome(tb) ? faba(a, tb.value) : a,
};

/**
 * Traversable
 */
export const { traverse }: Pick<Traversable<Maybe<_>>, "traverse"> = {
  traverse: <U, A, B>(
    F: Applicative<U>,
    faub: (x: A) => $<U, [B]>,
    ta: Maybe<A>
  ): $<U, [Maybe<B>]> =>
    isNone(ta) ? F.of(none) : F.map(some, faub(ta.value)),
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
