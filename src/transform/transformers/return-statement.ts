import { ReturnStatement, SequenceExpression } from 'estree'
import { ExitCall } from './block-statement'
import { YukiNode } from '../node-types'
import { TransformOptions } from '../types'
import { countScopeDepthTo } from '../scope'

export const returnStatementNode =
  ( node: ReturnStatement, _parent: YukiNode, options: TransformOptions ) => {
    const { argument } = node
    const { scope } = options
    const depth = countScopeDepthTo( scope, 'function' )

    if( depth === -1 ){
      throw Error( 'Unexpected return' )
    }

    if( argument ){
      const sequence: SequenceExpression = {
        type: 'SequenceExpression',
        expressions: [
          ExitCall(),
          argument
        ]
      }

      node.argument = sequence
    } else {
      node.argument = ExitCall( depth )
    }

    return node
  }
