import * as t from "@babel/types";
import { genInterface } from "../src/gen-interace";
import { genFunction } from "../src/gen-function";
import { transformCode } from "./transform-code";

export default (
  obj: Record<string, { requestType: string; responseType: string }>,
  type: 1 | 2 = 1
) => {
  return t.file(
    t.program([
      ...Object.entries(obj).flatMap(([key, value]) => {
        const functionName = `use${key}Query`;
        const interfaceName = `Use${key}Query`;
        const { requestType, responseType } = obj[key];
        if (type === 1) {
          // 使用pure，直接生成
          return [
            genInterface(requestType, responseType, interfaceName),
            genFunction(responseType, interfaceName, functionName),
          ];
        } else {
          // 使用transformCode
          return transformCode(
            requestType,
            responseType,
            interfaceName,
            functionName
          ).program.body;
        }
      }),
    ])
  );
};
