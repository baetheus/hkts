import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import * as E from "./either.ts";

Deno.test({
  name: "Either subtypes instantiate",
  fn(): void {
    assertEquals(E.right(1), { tag: "Right", right: 1 });
    assertEquals(E.left(1), { tag: "Left", left: 1 });
  },
});
