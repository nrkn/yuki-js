import { YukiLet } from './declarations/header/types'
import { Program } from 'estree'
import { Visitor, traverse } from 'estraverse'
import { valueToBitLength } from 'bits-bytes'

export const countMemory = ( lets: YukiLet[] ) => {
  let bitLength = 0

  lets.forEach( current => {
    if( current.type === 'number' ){
      bitLength += current.bitLength
    } else {
      bitLength += current.bitLength * current.length
    }
  })

  return bitLength
}

export const countProgramSize = ( ast: Program, instructionSize: number ) => {
  let count = 0

  const visitor: Visitor = {
    enter: ( node, parent ) => {
      if( node.type === 'Literal' && typeof node.value === 'number' ){
        let value = node.value

        if(
          parent &&
          parent.type === 'UnaryExpression' &&
          parent.operator === '-'
        ){
          value = ( value * 2 ) - 1
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
