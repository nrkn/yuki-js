import { Literal } from 'estree'
import { isPreYukiLiteral } from '../node-predicates'
import { LocError } from '../utils'

export const literalNode = ( node: Literal ) => {
  if ( !isPreYukiLiteral( node ) )
    throw LocError( 'Expected number or boolean', node )

  if ( typeof node.value === 'boolean' ) {
    node.value = node.value ? 1 : 0
    node.raw = String( node.value )

    return node
  }
}
