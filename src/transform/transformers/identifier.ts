import { Identifier, MemberExpression } from 'estree'
import { YukiNode } from '../node-types'
import { TransformOptions } from '../types'
import { existsGlobal, existsExternal } from '../scope'
import { LocError } from '../utils'

export const identifierNode =
  ( node: Identifier, parent: YukiNode, options: TransformOptions ) => {
    if ( parent.type === 'VariableDeclarator' ) return
    if ( parent.type === 'FunctionDeclaration' ) return
    if ( parent.type === 'AssignmentPattern' ) return

    const { name } = node

    if ( name === '$' ) return
    if ( name === '$args' ) return

    const { external, scope } = options

    const isNumber = existsGlobal( scope, name, 'numbers' )

    if ( parent.type === 'MemberExpression' ) {
      if ( parent.property.type === 'Identifier' && parent.property.name === '$' )
        return

      if ( !isNumber ) return
    }

    if ( existsExternal( external, name ) ) return

    if ( existsGlobal( scope, name, 'arrays' ) ) return

    if ( existsGlobal( scope, name, 'consts' ) ) return

    if ( existsGlobal( scope, name, 'functions' ) ) return

    if ( !isNumber )
      throw LocError( `Unexpected identifier ${ name }`, node )

    const expression: MemberExpression = {
      type: 'MemberExpression',
      object: node,
      property: {
        type: 'Identifier',
        name: '$'
      },
      computed: false
    }

    return expression
  }
