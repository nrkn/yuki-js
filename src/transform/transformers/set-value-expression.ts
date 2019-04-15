import { AssignmentExpression, UpdateExpression } from 'estree'
import { YukiNode } from '../node-types'
import { TransformOptions } from '../types'
import { existsGlobal } from '../scope'
import { LocError } from '../utils'

type SetValueExpression = AssignmentExpression | UpdateExpression

export const setValueExpressionNode =
  ( node: SetValueExpression, _parent: YukiNode, options: TransformOptions ) => {
    const target = (
      node.type === 'AssignmentExpression' ?
      node.left : node.argument
    )

    if( target.type === 'Identifier' ){
      const { scope } = options
      const { name } = target

      if ( existsGlobal( scope, name, 'numbers' ) ) return
    }

    if( target.type === 'MemberExpression' ){
      const { scope } = options

      const { object } = target

      if( object.type === 'Identifier' ){
        const { name } = object

        if ( existsGlobal( scope, name, 'arrays' ) ) return
      }
    }

    throw LocError( 'Unexpected Assignment', node )
  }
