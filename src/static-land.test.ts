import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import * as E from "./either.ts";
import { identity } from "./fns.ts";
import { _ } from "./hkts.ts";
import * as M from "./maybe.ts";
import * as S from "./static-land.ts";

const addOne = (n: number): number => n + 1;

Deno.test("createApplicative", () => {
  const { map } = S.createApplicative<M.Maybe<_>>({
    ap: (tfab, ta) =>
      M.isSome(tfab) && M.isSome(ta) ? M.some(tfab.value(ta.value)) : M.none,
    of: M.some,
  });

  assertEquals(map(addOne, M.some(1)), M.some(2));
  assertEquals(map(addOne, M.none), M.none);
});

Deno.test("createChain", () => {
  const { ap } = S.createChain<M.Maybe<_>>({
    map: M.map,
    chain: M.chain,
  });

  assertEquals(ap(M.some(addOne), M.some(1)), M.some(2));
  assertEquals(ap(M.some(addOne), M.none), M.none);
  assertEquals(ap(M.none, M.some(1)), M.none);
  assertEquals(ap(M.none, M.none), M.none);
});

Deno.test("createMonad", () => {
  const { join, map } = S.createMonad<M.Maybe<_>>({
    of: M.some,
    map: M.map,
    join: M.join,
  });

  assertEquals(join(M.some(M.some(1))), M.some(1));
  assertEquals(join(M.some(M.none)), M.none);
  assertEquals(join(M.none), M.none);

  assertEquals(map(addOne, M.some(1)), M.some(2));
  assertEquals(map(addOne, M.none), M.none);
});

Deno.test("rightMonad", () => {
  // For some reason can't parameterize over a fixed type.
  const rightMonad = S.createMonad<E.Either<string, _>>({
    of: E.right,
    map: (fab, ta) => (E.isLeft(ta) ? ta : E.right(fab(ta.right))),
    join: (tta) => E.fold(E.left, identity, tta),
  });

  const either = E.right(42);
  const result = rightMonad.map((n) => n + 1, either);

  assertEquals(result, E.right(43));
});
