declare const index: unique symbol;

/**
 * Placeholder representing an indexed type variable.
 */
export interface _<N extends number = 0> {
  [index]: N;
}

declare const fixed: unique symbol;

/**
 * Marks a type to be ignored by the application operator `$`. This is used to protect
 * bound type parameters.
 */
export interface Fixed<T> {
  [fixed]: T;
}

/**
 * Substitution Type
 */
// prettier-ignore
export type $<T, S extends unknown[]> = (
  T extends _<infer N> ? S[N] :
  T extends Fixed<infer U> ? U :
  T extends object ? { [K in keyof T]: $<T[K], S> } :
  T extends unknown[] ? { [K in keyof T]: $<T[K], S> } :
  T extends undefined | null | boolean | string | number ? T :
  T extends (...x: infer I) => infer O ? (...x: $<I, S>) => $<O, S> :
  T
);
