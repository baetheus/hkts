import { _0, _1 } from "./hkts.ts";
import * as SL from "./static-land.ts";

/**
 * Types
 */
export type Left<L> = { tag: "Left"; left: L };
export type Right<R> = { tag: "Right"; right: R };
export type Either<L, R> = Left<L> | Right<R>;

/**
 * Constructors
 */
export const left = <L>(left: L): Left<L> => ({ tag: "Left", left });
export const right = <R>(right: R): Right<R> => ({ tag: "Right", right });

/**
 * Type Guards
 */
export const isLeft = <L, R>(m: Either<L, R>): m is Left<L> => m.tag === "Left";
export const isRight = <L, R>(m: Either<L, R>): m is Right<R> =>
  m.tag === "Right";

/**
 * Utilities
 */
export const fold = <L, R, B>(
  onLeft: (left: L) => B,
  onRight: (right: R) => B,
  ma: Either<L, R>
): B => {
  switch (ma.tag) {
    case "Left":
      return onLeft(ma.left);
    case "Right":
      return onRight(ma.right);
  }
};

/**
 * Monad
 */
// export const { ap, map, chain, join, of } = SL.createMonad<Either<_1, _0>>({
//   of: <A>(a: A) => right(a),
//   map: (fab, ta) => (isRight(ta) ? right(fab(ta.right)) : ta),
//   join: (tta) => (isRight(tta) ? tta.right : tta),
// });

/**
 * Foldable
 */
// export const { reduce }: SL.Foldable<Either<[_1, _0]>> = {
//   reduce: <A, B>(
//     faba: (a: A, b: B) => A,
//     a: A,
//     tb: Either<[_1, B]>
//   ): A => (isRight(tb) ? faba(a, tb.right) : a),
// };

/**
 * Traversable
 */
// export const { traverse }: Pick<SL.Traversable<Either<[_1, _0]>>, "traverse"> = {
//   traverse: <U, A, B>(
//     F: SL.Applicative<U>,
//     faub: (x: A) => $<U, [B]>,
//     ta: Maybe<A>
//   ): $<U, [Maybe<B>]> =>
//     isNone(ta) ? F.of(none) : F.map(some, faub(ta.value)),
// };

/**
 * Maybe
 */
// export const maybe: SL.Monad<Either<[_1, _0]>> = {
//   map,
//   ap,
//   of,
//   zero,
//   alt,
//   chain,
//   join,
//   traverse,
//   reduce,
// };
