import { Statement, BlockStatement, Node } from 'estree'

export const makeBlock = ( node: Statement ): BlockStatement => {
  return {
    type: 'BlockStatement',
    body: [
      node
    ]
  }
}

export const expressionToBlock = ( node: Node ) => {
  if ( node.type === 'IfStatement' ) {
    if ( node.consequent.type !== 'BlockStatement' ) {
      node.consequent = makeBlock( node.consequent )
    }

    if (
      node.alternate &&
      node.alternate.type !== 'BlockStatement' &&
      node.alternate.type !== 'IfStatement'
    ) {
      node.alternate = makeBlock( node.alternate )
    }

    return node
  }

  if (
    node.type === 'ForStatement' ||
    node.type === 'DoWhileStatement' ||
    node.type === 'WhileStatement'
  ) {
    if ( node.body.type !== 'BlockStatement' ) {
      node.body = makeBlock( node.body )

      return node
    }
  }
}
