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
export const { ap, map, chain, join, of } = SL.createMonad2<Either<_0, _1>>({
  of: (a) => right(a),
  map: (fab, ta) => (isRight(ta) ? right(fab(ta.right)) : ta),
  join: (tta) => (isRight(tta) ? tta.right : tta),
});

/**
 * Foldable
 */
export const { reduce }: SL.Foldable2<Either<_0, _1>> = {
  reduce: (faba, a, tb) => (isRight(tb) ? faba(a, tb.right) : a),
};

/**
 * Traversable
 */
export const { traverse }: Pick<SL.Traversable2<Either<_0, _1>>, "traverse"> = {
  traverse: (F, faub, ta) =>
    isLeft(ta) ? F.of(left(ta.left)) : F.map(right, faub(ta.right)),
};

/**
 * Either
 */
export const either: SL.Monad2<Either<_0, _1>> &
  SL.Foldable2<Either<_0, _1>> &
  SL.Traversable2<Either<_0, _1>> = {
  map,
  ap,
  of,
  chain,
  join,
  traverse,
  reduce,
};
