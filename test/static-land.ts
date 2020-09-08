import * as assert from "assert";
import { _ } from "../src/hkts";
import * as M from "../src/maybe";
import * as S from "../src/static-land";

declare function H<T>(): T;

const addOne = (n: number): number => n + 1;

it("createApplicative", () => {
  const { map } = S.createApplicative<M.Maybe<_>>({
    ap: (tfab) => (ta) =>
      M.isSome(tfab) && M.isSome(ta) ? M.some(tfab.value(ta.value)) : M.none,
    of: M.some,
  });

  assert.deepStrictEqual(map(addOne)(M.some(1)), M.some(2));
  assert.deepStrictEqual(map(addOne)(M.none), M.none);
});

it("createChain", () => {
  const { ap } = S.createChain<M.Maybe<_>>({
    map: M.map,
    chain: M.chain,
  });

  assert.deepStrictEqual(ap(M.some(addOne))(M.some(1)), M.some(2));
  assert.deepStrictEqual(ap(M.some(addOne))(M.none), M.none);
  assert.deepStrictEqual(ap(M.none)(M.some(1)), M.none);
  assert.deepStrictEqual(ap(M.none)(M.none), M.none);
});

it("createMonad", () => {
  const { join, map } = S.createMonad<M.Maybe<_>>({
    of: M.some,
    chain: M.chain,
  });

  assert.deepStrictEqual(join(M.some(M.some(1))), M.some(1));
  assert.deepStrictEqual(join(M.some(M.none)), M.none);
  assert.deepStrictEqual(join(M.none), M.none);

  assert.deepStrictEqual(map(addOne)(M.some(1)), M.some(2));
  assert.deepStrictEqual(map(addOne)(M.none), M.none);
});
