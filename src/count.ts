import { YukiLet, YukiConst } from './declarations/header/types'
import { Program } from 'estree'
import { Visitor, traverse } from 'estraverse'
import { valueToBitLength } from 'bits-bytes'
import { normalizeRangeForBitLength } from './util';

export const countMemory = ( lets: YukiLet[] ) => {
  let bitLength = 0

  lets.forEach( current => {
    if ( current.type === 'number' ) {
      bitLength += current.bitLength
    } else {
      bitLength += current.bitLength * current.length
    }
  } )

  return bitLength
}

export const countConsts = ( consts: YukiConst[] ) => {
  let bitLength = 0

  const addNumber = ( value: number ) => {
    value = normalizeRangeForBitLength( value )
    bitLength += valueToBitLength( value )
  }

  consts.forEach( current => {
    if ( current.type === 'number' ) {
      addNumber( current.value )
    } else {
      let max = 0

      current.value.forEach( v => {
        v = normalizeRangeForBitLength( v )
        if( v > max ) max = v
      })

      bitLength += valueToBitLength( max ) * current.value.length
    }
  } )

  return bitLength
}

export const countProgramSize = ( ast: Program, instructionSize: number ) => {
  let count = 0

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

        count += valueToBitLength( value )
      } else {
        count += instructionSize
      }
    }
  }

  traverse( ast, visitor )

  return count
}
