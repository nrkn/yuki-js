import { YukiLet, YukiConst } from './declarations/value-types'
import { Program } from 'estree'
import { Visitor, traverse } from 'estraverse'
import { valueToBitLength } from 'bits-bytes'
import { normalizeRangeForBitLength } from './util'
import { declarationToYukiValue } from './declarations';
import { YukiDeclaration } from './declarations/types';

export const countConst = ( current: YukiConst ) => {
  if ( current.type === 'number' ) {
    const value = normalizeRangeForBitLength( current.value )

    return valueToBitLength( value )
  } else {
    let max = 0

    current.value.forEach( v => {
      v = normalizeRangeForBitLength( v )
      if ( v > max ) max = v
    } )

    return valueToBitLength( max ) * current.value.length
  }
}

export const countProgramSize = ( ast: Program, instructionSize: number ) => {
  let programSize = 0
  let constBits = 0

  const visitor: Visitor = {
    enter: ( node, parent ) => {
      if ( node.type === 'Literal' && typeof node.value === 'number' ) {
        let value = node.value

        if (
          parent &&
          parent.type === 'UnaryExpression' &&
          parent.operator === '-'
        ) {
          value = normalizeRangeForBitLength( value )
        }

        programSize += valueToBitLength( value )
      } else if( node.type === 'VariableDeclaration' && node.kind === 'const' ){
        const c = <YukiConst>declarationToYukiValue( <YukiDeclaration>node )

        constBits += countConst( c )
      } else {
        programSize += instructionSize
      }
    }
  }

  traverse( ast, visitor )

  programSize += Math.ceil( constBits / 8 )

  return programSize
}
