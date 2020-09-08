import * as assert from "assert";
import { compose, constant, flip, identity } from "../src/fns";

const a = {};
const add = (a: number) => (b: number) => a + b;
const addOne = add(1);
const addTwo = add(2);

it("identity", () => {
  assert.strictEqual(identity(a), a);
});

it("flip", () => {
  assert.deepStrictEqual(flip(add)(1)(2), flip(add)(2)(1));
});

it("compose", () => {
  assert.deepStrictEqual(compose(addOne)(addTwo)(0), 3);
});

it("constant", () => {
  assert.deepStrictEqual(constant(a)(), a);
});
