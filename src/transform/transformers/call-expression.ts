import { CallExpression } from 'estree'
import { YukiNode } from '../node-types'
import { TransformOptions } from '../types'
import { existsGlobal, existsExternal } from '../scope'
import { LocError } from '../utils';
import { isFreezeCallExpression } from '../node-predicates';

export const callExpressionNode =
  ( node: CallExpression, _parent: YukiNode, options: TransformOptions ) => {
    if( isFreezeCallExpression( node ) ) return

    const { callee } = node

    if( callee.type === 'Identifier' ){
      const { scope, external } = options

      if ( existsGlobal( scope, callee.name, 'functions' ) ) return

      if ( existsExternal( external, callee.name, 'functions' ) ) return
    }

    throw LocError( 'Unexpected CallExpression', node )
  }
