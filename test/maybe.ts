import * as assert from "assert";
import { compose } from "../src/fns";
import * as M from "../src/maybe";

const addOne = (n: number) => n + 1;
const someAddOne = M.some(addOne);
const someNumber = M.some(2);
const someOtherNumber = M.some(3);
const onSome = addOne;
const onNone = () => 100;

describe("maybe", () => {
  it("ap", () => {
    assert.deepStrictEqual(M.ap(someAddOne, someNumber), M.some(3));
    assert.deepStrictEqual(M.ap(someAddOne, M.none), M.none);
  });

  it("chain", () => {
    const addOneChain = compose(addOne)(M.of);
    assert.deepStrictEqual(M.chain(addOneChain, someNumber), M.some(3));
    assert.deepStrictEqual(M.chain(addOneChain, M.none), M.none);
  });

  it("fold", () => {
    assert.deepStrictEqual(M.fold(onSome, onNone, someNumber), 3);
    assert.deepStrictEqual(M.fold(onSome, onNone, M.none), 100);
  });

  it("getOrElse", () => {
    assert.deepStrictEqual(M.getOrElse(onNone, someNumber), 2);
    assert.deepStrictEqual(M.getOrElse(onNone, M.none), 100);
  });

  it("some", () => {
    assert.deepStrictEqual(M.some(3), { tag: "Some", value: 3 });
  });

  it("none", () => {
    assert.deepStrictEqual(M.none, { tag: "None" });
  });

  it("constNone", () => {
    assert.deepStrictEqual(M.constNone(), M.none);
  });

  it("isSome", () => {
    assert.deepStrictEqual(M.isSome(someNumber), true);
    assert.deepStrictEqual(M.isSome(M.none), false);
  });

  it("isNone", () => {
    assert.deepStrictEqual(M.isNone(someNumber), false);
    assert.deepStrictEqual(M.isNone(M.none), true);
  });

  it("join", () => {
    assert.deepStrictEqual(M.join(M.some(M.some(3))), M.some(3));
    assert.deepStrictEqual(M.join(M.some(M.none)), M.none);
    assert.deepStrictEqual(M.join(M.none), M.none);
  });

  it("map", () => {
    assert.deepStrictEqual(M.map(addOne, someNumber), M.some(3));
    assert.deepStrictEqual(M.map(addOne, M.none), M.none);
  });

  it("show", () => {
    const { show } = M.getShow({ show: (n: number) => n.toString() });

    assert.deepStrictEqual(show(someNumber), "Some(2)");
    assert.deepStrictEqual(show(M.none), "None");
  });

  it("alt", () => {
    assert.deepStrictEqual(M.alt(someNumber, someOtherNumber), someNumber);
    assert.deepStrictEqual(M.alt(someNumber, M.none), someNumber);
    assert.deepStrictEqual(M.alt(M.none, someOtherNumber), someOtherNumber);
    assert.deepStrictEqual(M.alt(M.none, M.none), M.none);
  });
});
