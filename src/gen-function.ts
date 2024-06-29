import * as t from "@babel/types";

export function genFunction(
  responseType: string,
  paramTypeName: string,
  functionName: string,
  keyName = "poolsQuery",
  queryServiceMethodName = "pools"
) {
  // 创建函数参数
  const requestParam = t.objectPattern([
    t.objectProperty(
      t.identifier("request"),
      t.identifier("request"),
      false,
      true
    ),
    t.objectProperty(
      t.identifier("options"),
      t.identifier("options"),
      false,
      true
    ),
  ]);

  requestParam.typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier(paramTypeName),
      t.tsTypeParameterInstantiation([t.tsTypeReference(t.identifier("TData"))])
    )
  );

  const functionBody = t.blockStatement([
    t.returnStatement(
      t.callExpression(t.identifier("useQuery"), [
        t.arrayExpression([t.stringLiteral(keyName), t.identifier("request")]),
        t.arrowFunctionExpression(
          [],
          t.blockStatement([
            t.ifStatement(
              t.unaryExpression("!", t.identifier("queryService")),
              t.blockStatement([
                t.throwStatement(
                  t.newExpression(t.identifier("Error"), [
                    t.stringLiteral("Query Service not initialized"),
                  ])
                ),
              ])
            ),
            t.returnStatement(
              t.callExpression(
                t.memberExpression(
                  t.identifier("queryService"),
                  t.identifier(queryServiceMethodName)
                ),
                [t.identifier("request")]
              )
            ),
          ])
        ),
      ])
    ),
  ]);
  const functionExpression = t.arrowFunctionExpression(
    [requestParam],
    functionBody,
    true
  );

  // 声明泛型类型参数 TData
  functionExpression.typeParameters = t.tsTypeParameterDeclaration([
    t.tsTypeParameter(
      null,
      t.tsTypeReference(t.identifier(responseType)),
      "TData"
    ),
  ]);

  const constDec = t.variableDeclaration("const", [
    t.variableDeclarator(t.identifier(functionName), functionExpression),
  ]);
  return constDec;
}
