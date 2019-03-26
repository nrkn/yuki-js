import { YukiConst, YukiLet } from './types'
import { valueToBitLength } from 'bits-bytes'

export const countRom = ( consts: YukiConst[] ) => {
  let bitLength = 0

  consts.forEach( current => {
    if( current.type === 'number' ){
      bitLength += valueToBitLength( current.value )
    } else {
      bitLength += valueToBitLength( current.value.length )

      current.value.forEach( v => {
        bitLength += valueToBitLength( v )
      })
    }
  })

  return bitLength
}

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