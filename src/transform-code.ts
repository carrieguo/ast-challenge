import babelTraverse from "@babel/traverse";
import { parse, ParserPlugin } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";

const code = `
export interface INTERFACE_NAME<TData> extends ReactQueryParams<RESPONSE_TYPE, TData> {
    request?: REQUEST_TYPE;
}
const FUNCTION_NAME = <TData = RESPONSE_TYPE,>({
    request,
    options
}: INTERFACE_NAME<TData>) => {
    return useQuery<RESPONSE_TYPE, Error, TData>(["KEY_NAME", request], () => {
        if (!queryService) throw new Error("Query Service not initialized");
        return queryService.QUERY_SERVICE_METHOD_NAME(request);
    }, options);
};
`;

export function transformCode(
  requestType: string,
  responseType: string,
  paramTypeName: string,
  functionName: string,
  keyName = "poolsQuery",
  queryServiceMethodName = "pools"
) {
  const plugins: ParserPlugin[] = ["typescript"];

  const ast = parse(code, {
    sourceType: "module",
    plugins,
  });

  babelTraverse(ast as any, {
    TSInterfaceDeclaration(path) {
      path.node.id.name = paramTypeName;
    },
    Identifier(path) {
      if (path.node.name === "REQUEST_TYPE") {
        path.node.name = requestType;
      } else if (path.node.name === "RESPONSE_TYPE") {
        path.node.name = responseType;
      } else if (path.node.name === "FUNCTION_NAME") {
        path.node.name = functionName;
      } else if (path.node.name === "QUERY_SERVICE_METHOD_NAME") {
        path.node.name = queryServiceMethodName;
      }
    },
    StringLiteral(path) {
      if (path.node.value === "KEY_NAME") {
        path.node.value = keyName;
      }
    },
  });

  return ast;
}
