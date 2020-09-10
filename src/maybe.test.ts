import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { compose } from "./fns.ts";
import * as M from "./maybe.ts";

const addOne = (n: number) => n + 1;
const someAddOne = M.some(addOne);
const someNumber = M.some(2);
const someOtherNumber = M.some(3);
const onSome = addOne;
const onNone = () => 100;

Deno.test("ap", () => {
  assertEquals(M.ap(someAddOne, someNumber), M.some(3));
  assertEquals(M.ap(someAddOne, M.none), M.none);
});

Deno.test("chain", () => {
  const addOneChain = compose(addOne)(M.of);
  assertEquals(M.chain(addOneChain, someNumber), M.some(3));
  assertEquals(M.chain(addOneChain, M.none), M.none);
});

Deno.test("fold", () => {
  assertEquals(M.fold(onSome, onNone, someNumber), 3);
  assertEquals(M.fold(onSome, onNone, M.none), 100);
});

Deno.test("getOrElse", () => {
  assertEquals(M.getOrElse(onNone, someNumber), 2);
  assertEquals(M.getOrElse(onNone, M.none), 100);
});

Deno.test("some", () => {
  assertEquals(M.some(3), { tag: "Some", value: 3 });
});

Deno.test("none", () => {
  assertEquals(M.none, { tag: "None" });
});

Deno.test("constNone", () => {
  assertEquals(M.constNone(), M.none);
});

Deno.test("isSome", () => {
  assertEquals(M.isSome(someNumber), true);
  assertEquals(M.isSome(M.none), false);
});

Deno.test("isNone", () => {
  assertEquals(M.isNone(someNumber), false);
  assertEquals(M.isNone(M.none), true);
});

Deno.test("join", () => {
  assertEquals(M.join(M.some(M.some(3))), M.some(3));
  assertEquals(M.join(M.some(M.none)), M.none);
  assertEquals(M.join(M.none), M.none);
});

Deno.test("map", () => {
  assertEquals(M.map(addOne, someNumber), M.some(3));
  assertEquals(M.map(addOne, M.none), M.none);
});

Deno.test("show", () => {
  const { show } = M.getShow({ show: (n: number) => n.toString() });

  assertEquals(show(someNumber), "Some(2)");
  assertEquals(show(M.none), "None");
});

Deno.test("alt", () => {
  assertEquals(M.alt(someNumber, someOtherNumber), someNumber);
  assertEquals(M.alt(someNumber, M.none), someNumber);
  assertEquals(M.alt(M.none, someOtherNumber), someOtherNumber);
  assertEquals(M.alt(M.none, M.none), M.none);
});
