import { replace, Visitor } from 'estraverse'
import { LocError } from './utils'
import { Program } from 'estree'
import { isYukiNode } from './node-predicates'
import { DefaultTransformOptions } from './default-options'
import { enterScope, exitScope } from './scope'

import {
  expressionToBlock, makeBlock
} from './transformers/expression-to-block'

import { transformers } from './transformers'
import { ScopeType } from './types'

export const transform = ( ast: Program, options = DefaultTransformOptions() ) => {
  ast = JSON.parse( JSON.stringify( ast ) )

  // first, turn expressions into blocks
  const preVisitor: Visitor = {
    enter: expressionToBlock,
    leave: node => {
      // block to contain potential VariableDeclaration in init
      if ( node.type === 'ForStatement' ) {
        return makeBlock( node )
      }
    }
  }

  ast = replace( ast, preVisitor ) as Program

  const visitor: Visitor = {
    enter: ( node, parent ) => {
      if ( !isYukiNode( node ) )
        throw LocError( `Unexpected type ${ node.type }`, node )

      if ( node.type === 'BlockStatement' ) {
        const parentType = parent!.type
        let scopeType: ScopeType = 'block'

        if ( parentType === 'FunctionDeclaration' ) {
          scopeType = 'function'
        } else if (
          parentType === 'ForStatement' ||
          parentType === 'WhileStatement' ||
          parentType === 'DoWhileStatement'
        ) {
          scopeType = 'loop'
        }

        enterScope( options, scopeType )
      }

      if ( node.type in transformers ) {
        return transformers[ node.type ]( node, parent, options )
      }
    },
    leave: node => {
      if ( node.type === 'BlockStatement' ) {
        exitScope( options )
      }
    }
  }

  return replace( ast, visitor ) as Program
}
