// Imports in Blue Button MDX point at files in that repo (e.g. `#assets/images/...`),
// which the preview can't resolve, and a failed import stops the whole document from
// rendering. Replace each import with `const name = undefined` so the rest still renders.

type EsmNode = {
  type: string
  data?: { estree?: { body: any[] } }
}

function stubImport(statement: any) {
  if (!statement.specifiers.length) {
    return []
  }
  return [{
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: statement.specifiers.map((specifier: any) => ({
      type: 'VariableDeclarator',
      id: { type: 'Identifier', name: specifier.local.name },
      init: { type: 'Identifier', name: 'undefined' },
    })),
  }]
}

export function remarkStubImports() {
  return (tree: { children: EsmNode[] }) => {
    tree.children = tree.children.filter((node) => {
      const estree = node.type === 'mdxjsEsm' ? node.data?.estree : undefined
      if (!estree) {
        return true
      }
      estree.body = estree.body.flatMap(statement =>
        statement.type === 'ImportDeclaration' ? stubImport(statement) : [statement],
      )
      return estree.body.length > 0
    })
  }
}
