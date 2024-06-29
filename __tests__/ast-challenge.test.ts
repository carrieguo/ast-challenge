import generate from "@babel/generator";
import * as t from "@babel/types";
import genCode from "../src";
import { transformCode } from "../src/transform-code";
import exampleMethods from "../example-methods.json";
const expectCode = (ast) => {
  expect(generate(ast).code).toMatchSnapshot();
};

it("gen-code", () => {
  expectCode(genCode(exampleMethods, 1));
});

it("transform-code", () => {
  expectCode(genCode(exampleMethods, 1));
});
