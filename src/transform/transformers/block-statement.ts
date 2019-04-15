import { BlockStatement, CallExpression } from 'estree'
import { YukiNode } from '../node-types'

export const blockStatementNode =
  ( node: BlockStatement, parent: YukiNode ) => {
    const { body } = node

    node.body = []

    node.body.push( {
      type: 'ExpressionStatement',
      expression: EnterCall()
    } )

    if ( parent.type === 'FunctionDeclaration' ) {
      const allocateCall: CallExpression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: '$allocate'
        },
        arguments: [
          {
            type: 'Identifier',
            name: '$addressSize'
          }
        ]
      }

      node.body.push( {
        type: 'ExpressionStatement',
        expression: allocateCall
      } )
    }

    node.body.push( ...body )

    const tail = node.body[ node.body.length - 1 ]

    if(
      tail.type !== 'ReturnStatement' &&
      tail.type !== 'ContinueStatement'
    ){
      node.body.push( {
        type: 'ExpressionStatement',
        expression: ExitCall()
      } )
    }

    return node
  }

export const EnterCall = (): CallExpression => ( {
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: '$enter'
  },
  arguments: []
} )

export const ExitCall = ( depth = 0 ): CallExpression => ( {
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: '$exit'
  },
  arguments: [
    {
      type: 'Literal',
      value: depth + 1
    }
  ]
} )