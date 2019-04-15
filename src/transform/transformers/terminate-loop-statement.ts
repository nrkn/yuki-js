import { ContinueStatement, ExpressionStatement, BreakStatement } from 'estree'
import { YukiNode } from '../node-types'
import { countScopeDepthTo } from '../scope'
import { TransformOptions } from '../types'
import { LocError } from '../utils'
import { ExitCall } from './block-statement'

type TerminateLoopStatement = ContinueStatement | BreakStatement

export const terminateLoopStatementNode =
  ( node: TerminateLoopStatement, parent: YukiNode, options: TransformOptions ) => {
    if( node.label )
      throw LocError( 'Unexpected label', node )

    if( parent.type !== 'BlockStatement' )
      throw LocError( `Expected ${ node.type } to be in block`, node )

    const { scope } = options
    const index = parent.body.indexOf( node )

    const depth = countScopeDepthTo( scope, 'loop' )

    if( depth === -1 ){
      throw LocError(
        `Expected ${ node.type } to be in loop`, node
      )
    }

    const exitStatement: ExpressionStatement = {
      type: 'ExpressionStatement',
      expression: ExitCall( depth )
    }

    parent.body.splice( index, 0, exitStatement )
  }
