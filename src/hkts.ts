declare const index: unique symbol;

/**
 * Placeholder representing an indexed type variable.
 */
export interface _<N extends number = 0> {
  [index]: N;
}
export type _0 = _<0>;
export type _1 = _<1>;
export type _2 = _<2>;
export type _3 = _<3>;
export type _4 = _<4>;
export type _5 = _<5>;
export type _6 = _<6>;
export type _7 = _<7>;
export type _8 = _<8>;
export type _9 = _<9>;

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
export type $<T, S extends any[]> = (
  T extends Fixed<infer U> ? U :
  T extends _<infer N> ? S[N] :
  T extends any[] ? { [K in keyof T]: $<T[K], S> } :
  T extends (...x: infer I) => infer O ? (...x: $<I, S>) => $<O, S> :
  T extends object ? { [K in keyof T]: $<T[K], S> } :
  T extends undefined | null | boolean | string | number ? T :
  T
);
