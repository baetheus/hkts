import { $, _, _0, _1 } from "./hkts.ts";
import { Apply, Apply2 } from "./static-land.ts";

function tuple<T extends ReadonlyArray<any>>(...t: T): T {
  return t;
}

function curried(f: Function, n: number, acc: ReadonlyArray<unknown>) {
  return function (x: unknown) {
    const combined = Array(acc.length + 1);
    for (let i = 0; i < acc.length; i++) {
      combined[i] = acc[i];
    }
    combined[acc.length] = x;
    return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
  };
}

const tupleConstructors: Record<number, (a: unknown) => any> = {
  1: (a) => [a],
  2: (a) => (b: any) => [a, b],
  3: (a) => (b: any) => (c: any) => [a, b, c],
  4: (a) => (b: any) => (c: any) => (d: any) => [a, b, c, d],
  5: (a) => (b: any) => (c: any) => (d: any) => (e: any) => [a, b, c, d, e],
};

function getTupleConstructor(len: number): (a: unknown) => any {
  if (!tupleConstructors.hasOwnProperty(len)) {
    tupleConstructors[len] = curried(tuple, len - 1, []);
  }
  return tupleConstructors[len];
}

export function sequenceTuple<T>({ map, ap }: Apply<T>) {
  return <A, M extends $<T, [any]>[]>(
    head: $<T, [A]>,
    ...tail: M
  ): $<
    T,
    [[A, ...{ [K in keyof M]: M[K] extends $<T, [infer U]> ? U : never }]]
  > => {
    const len = tail.length;
    const f = getTupleConstructor(len);
    let fas = map(f, head);
    for (let i = 1; i < len; i++) {
      fas = ap(fas, tail[i]);
    }
    return fas;
  };
}

export function sequenceTuple2<T>({ map, ap }: Apply2<T>) {
  return <E, R, M extends $<T, [E, any]>[]>(
    head: $<T, [E, R]>,
    ...tail: M
  ): $<
    T,
    [E, [R, ...{ [K in keyof M]: M[K] extends $<T, [E, infer A]> ? A : never }]]
  > => {
    const len = tail.length;
    const f = getTupleConstructor(len);
    let fas = map(f, head);
    for (let i = 0; i < len; i++) {
      fas = ap(fas, tail[i]);
    }
    return fas;
  };
}

import { maybe, some, Maybe } from "./maybe.ts";

const sequenceMaybe = sequenceTuple(maybe as Apply<Maybe<_>>);
const testMaybe = sequenceMaybe(some(1), some(2));

import { either, right, Either, Right, left } from "./either.ts";

const sequenceEither = sequenceTuple2(either as Apply2<Either<_0, _1>>);
const testEither = sequenceEither(left("sting"), right("string"), right(1));
