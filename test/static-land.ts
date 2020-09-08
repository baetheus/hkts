import * as assert from "assert";
import * as E from "../src/either";
import { identity } from "../src/fns";
import { _ } from "../src/hkts";
import * as M from "../src/maybe";
import * as S from "../src/static-land";

const addOne = (n: number): number => n + 1;

it("createApplicative", () => {
  const { map } = S.createApplicative<M.Maybe<_>>({
    ap: (tfab, ta) =>
      M.isSome(tfab) && M.isSome(ta) ? M.some(tfab.value(ta.value)) : M.none,
    of: M.some,
  });

  assert.deepStrictEqual(map(addOne, M.some(1)), M.some(2));
  assert.deepStrictEqual(map(addOne, M.none), M.none);
});

it("createChain", () => {
  const { ap } = S.createChain<M.Maybe<_>>({
    map: M.map,
    chain: M.chain,
  });

  assert.deepStrictEqual(ap(M.some(addOne), M.some(1)), M.some(2));
  assert.deepStrictEqual(ap(M.some(addOne), M.none), M.none);
  assert.deepStrictEqual(ap(M.none, M.some(1)), M.none);
  assert.deepStrictEqual(ap(M.none, M.none), M.none);
});

it("createMonad", () => {
  const { join, map } = S.createMonad<M.Maybe<_>>({
    of: M.some,
    map: M.map,
    join: M.join,
  });

  assert.deepStrictEqual(join(M.some(M.some(1))), M.some(1));
  assert.deepStrictEqual(join(M.some(M.none)), M.none);
  assert.deepStrictEqual(join(M.none), M.none);

  assert.deepStrictEqual(map(addOne, M.some(1)), M.some(2));
  assert.deepStrictEqual(map(addOne, M.none), M.none);
});

it("rightMonad", () => {
  // For some reason can't parameterize over a fixed type.
  const rightMonad = S.createMonad<E.Either<string, _>>({
    of: E.right,
    map: (fab, ta) => (E.isLeft(ta) ? ta : E.right(fab(ta.right))),
    join: (tta) => E.fold(E.left, identity, tta),
  });

  const either = E.right(42);
  const result = rightMonad.map((n) => n + 1, either);
  expect(result).toEqual(E.right(43));
});
