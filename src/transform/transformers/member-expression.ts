import { MemberExpression } from 'estree'
import { YukiNode } from '../node-types'
import { TransformOptions } from '../types'
import { existsGlobal, existsExternal } from '../scope'
import { LocError } from '../utils'
import { isFreezeMemberExpression } from '../node-predicates'

export const memberExpressionNode =
  ( node: MemberExpression, _parent: YukiNode, options: TransformOptions ) => {
    if( isFreezeMemberExpression( node ) ) return

    const { object } = node

    if( object.type === 'Identifier' ){
      // TODO check if this is rigourous enough
      if( object.name === '$args' ) return

      const { scope, external } = options

      // TODO consts should be separated into arrays and numbers
      if ( existsGlobal( scope, object.name, 'consts' ) ) return

      if( existsGlobal( scope, object.name, 'arrays' ) ) return

      // TODO external consts should also be arrays and numbers
      if ( existsExternal( external, object.name, 'consts' ) ) return
    }

    throw LocError( 'Unexpected MemberExpression', node )
  }
