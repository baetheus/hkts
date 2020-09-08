import { $, _ } from "./hkts";
import { Maybe, maybe, some } from "./maybe";
import { Apply } from "./static-land";

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

// export const sequenceT = <F>(
//   F: Apply<F>,
//   r: Record<string, $<F, [any]>>
// ): $<
//   F,
//   [{ [K in keyof typeof r]: typeof r[K] extends $<F, [infer A]> ? A : never }]
// > => {
//   const keys = Object.keys(r);
//   const len = keys.length;
//   const f = getRecordConstructor(keys);
//   let fr = F.map(r[keys[0]], f);
//   for (let i = 1; i < len; i++) {
//     fr = F.ap(fr, r[keys[i]]);
//   }
//   return fr;
// };

export const sequenceT = <T>({ ap, map }: Apply<T>) => <
  M extends $<T, any[]>[]
>(
  ...args: M
): $<T, { [K in keyof M]: M[K] extends $<T, infer A> ? A : never }> => {
  const len = args.length;
  const f = getTupleConstructor(len);
  let fas = map(f, args[0]);
  for (let i = 1; i < len; i++) {
    fas = ap(fas, args[i]);
  }
  return fas;
};

const sequenceMaybe = sequenceT(maybe as Apply<Maybe<_>>);

const out = sequenceMaybe(some(1), some({ foo: "bar" }), some("hello"));
console.log(out);
