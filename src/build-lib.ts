import { parseScript } from 'esprima'
import { replace } from 'estraverse'
import { Program, VariableDeclaration, VariableDeclarator } from 'estree'

export const buildLib = ( libAst: Program, maxSize: number, addressSize: number ) => {
  const callStackAst = parseScript( `
    const { $in, $out } = $CallStack( ${ maxSize }, ${ addressSize } )
  `)

  replace( libAst, {
    enter: ( node, parent ) => {
      if (
        node.type === 'AssignmentExpression' &&
        node.left.type === 'MemberExpression' &&
        node.left.object.type === 'Identifier' &&
        node.left.object.name === 'exports' &&
        node.left.property.type === 'Identifier'
      ) {
        const variableDeclarator: VariableDeclarator = {
          type: 'VariableDeclarator',
          id: {
            type: 'Identifier',
            name: node.left.property.name
          },
          init: node.right
        }
        const variableDeclaration: VariableDeclaration = {
          type: 'VariableDeclaration',
          kind: 'const',
          declarations: [ variableDeclarator ]
        }

        return variableDeclaration
      } else if (
        parent &&
        parent.type !== 'AssignmentExpression' &&
        node.type === 'MemberExpression' &&
        node.object.type === 'Identifier' &&
        node.object.name === 'exports' &&
        node.property.type === 'Identifier'
      ) {
        return node.property
      }

      return node
    }
  } )

  const [ useStrict, , ...rest ] = libAst.body

  libAst.body = [
    useStrict,
    ...rest,
    ...callStackAst.body
  ]

  return libAst.body
}
