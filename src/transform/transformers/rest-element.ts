import { RestElement } from 'estree'
import { LocError } from '../utils'
import { YukiNode } from '../node-types'

export const restElementNode =
  ( node: RestElement, parent: YukiNode ) => {
    if(
      parent.type === 'FunctionDeclaration' &&
      node.argument.type === 'Identifier' &&
      node.argument.name === '$args'
    ) return

    throw LocError( 'Unexpected type RestElement', node )
  }
