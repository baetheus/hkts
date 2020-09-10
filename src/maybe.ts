import { compose, identity } from "./fns.ts";
import { $, _ } from "./hkts.ts";
import * as SL from "./static-land.ts";

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
export const getShow = <A>({ show }: SL.Show<A>): SL.Show<Maybe<A>> => ({
  show: (ma) => (isNone(ma) ? "None" : `${"Some"}(${show(ma.value)})`),
});

/**
 * Monad
 */
export const { ap, map, chain, join, of } = SL.createMonad<Maybe<_>>({
  of: some,
  map: (fab, ta) => fold(compose(fab)(some), constNone, ta),
  join: (tta) => (isNone(tta) ? tta : tta.value),
});

/**
 * Alternative
 */
export const { zero, alt }: SL.Alternative<Maybe<_>> = {
  zero: constNone,
  alt: (a, b) => (isSome(a) ? a : b),
  ap,
  map,
  of,
};

/**
 * Foldable
 */
export const { reduce }: SL.Foldable<Maybe<_>> = {
  reduce: <A, B>(faba: (a: A, b: B) => A, a: A, tb: Maybe<B>): A =>
    isSome(tb) ? faba(a, tb.value) : a,
};

/**
 * Traversable
 */
export const { traverse }: SL.Traversable<Maybe<_>> = {
  traverse: <U, A, B>(
    F: SL.Applicative<U>,
    faub: (x: A) => $<U, [B]>,
    ta: Maybe<A>
  ): $<U, [Maybe<B>]> =>
    isNone(ta) ? F.of(none) : F.map(some, faub(ta.value)),
  map,
  reduce,
};

/**
 * Maybe
 */
export const maybe: SL.Monad<Maybe<_>> &
  SL.Alternative<Maybe<_>> &
  SL.Foldable<Maybe<_>> &
  SL.Traversable<Maybe<_>> = {
  ap,
  map,
  chain,
  join,
  of,
  zero,
  alt,
  reduce,
  traverse,
};
