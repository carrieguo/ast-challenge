import * as t from "@babel/types";

export function genInterface(
  requestType: string,
  responseType: string,
  interaceName: string
) {
  const typeParameters = t.tsTypeParameterDeclaration([
    t.tsTypeParameter(null, undefined, "TData"),
  ]);

  const _extends = [
    t.tsExpressionWithTypeArguments(
      t.identifier("ReactQueryParams"),
      t.tsTypeParameterInstantiation([
        t.tsTypeReference(t.identifier(responseType)),
        t.tsTypeReference(t.identifier("TData")),
      ])
    ),
  ];

  const requestProp = t.tsPropertySignature(
    t.identifier("request"),
    t.tsTypeAnnotation(t.tsTypeReference(t.identifier(requestType)))
  );

  requestProp.optional = true;

  const interfaceBody = t.tsInterfaceBody([requestProp]);

  return t.tsInterfaceDeclaration(
    t.identifier(interaceName),
    typeParameters,
    _extends,
    interfaceBody
  );
}
