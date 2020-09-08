/**
 * Types
 */
export type Left<L> = { tag: "Left"; left: L };
export type Right<R> = { tag: "Right"; right: R };
export type Either<L, R> = Left<L> | Right<R>;

/**
 * Constructors
 */
export const left = <L>(left: L): Either<L, never> => ({ tag: "Left", left });
export const right = <R>(right: R): Either<never, R> => ({
  tag: "Right",
  right,
});

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
