/**
 * Utilities
 */
export const identity = <A>(a: A): A => a;
export const flip = <A, B, C>(f: (a: A) => (b: B) => C) => (b: B) => (
  a: A
): C => f(a)(b);
export const compose = <A, B>(fab: (a: A) => B) => <C>(fbc: (b: B) => C) => (
  a: A
): C => fbc(fab(a));
export const constant = <A>(a: A) => () => a;
