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

export const countProgramSize = ( ast: Program, instructionSize = 2 ) => {
  let count = 0

  const visitor: Visitor = {
    enter: node => {
      if( node.type === 'Literal' && typeof node.value === 'number' ){
        count += valueToBitLength( node.value )
      } else {
        count += instructionSize
      }
    }
  }

  traverse( ast, visitor )

  return count
}
