import { YukiLet } from '../declarations/header/types'

export const size = ( arr: any ) => arr.length

export const $CallStack = ( maxSize: number, addressSize = 2 ) => {
  let callStackSize = 0

  const $in = () => {
    callStackSize += addressSize

    if ( callStackSize > maxSize )
      throw Error( 'Max call stack exceeded' )
  }

  const $out = () => {
    callStackSize -= addressSize
  }

  return { $in, $out }
}

export interface MemoryObject {
  [ key: string ]: number | { [ key: string ]: number }
}

export const $Memory = ( lets: YukiLet[] ) => {
  const $: MemoryObject = {}

  lets.forEach( l => {
    if ( l.type === 'array' ) {
      const arr = {}
      const data = Array<number>( l.length ).fill( 0 )

      for ( let i = 0; i < l.length; i++ ) {
        Object.defineProperty( arr, i, {
          get() {
            return data[ i ]
          },
          set( value: number ) {
            data[ i ] = $ensureNumber( value, l )
          }
        } )
      }

      Object.defineProperty( arr, 'length', { get() { return l.length } } )

      $[ l.name ] = arr
    } else {
      let data = 0

      Object.defineProperty( $, l.name, {
        get() {
          return data
        },
        set( value: number ) {
          data = $ensureNumber( value, l )
        }
      } )
    }
  } )

  Object.defineProperty( $, '$', {
    get() {
      const raw: any = {}

      lets.forEach( l => {
        if ( l.type === 'number' ) {
          raw[ l.name ] = $[ l.name ]
        } else {
          raw[ l.name ] = Array<number>( l.length )
          for ( let i = 0; i < l.length; i++ ) {
            raw[ l.name ][ i ] = $[ l.name ][ i ]
          }
        }
      } )

      return raw
    }
  } )

  return $
}

export const $ensureNumber = ( value: number, l: YukiLet ) => {
  if ( l.signed ) return $toSigned( value, l.bitLength )

  return $toUnsigned( value, l.bitLength )
}

export const $toUnsigned = ( value: number, bitLength: number ) => {
  if (
    typeof value !== 'number' ||
    isNaN( value ) ||
    !isFinite( value )
  ) {
    throw Error( 'Expected a number' )
  }

  // coerce to 32 bit integer
  value = ~~value

  const maxUint = $maxValue( bitLength )

  while ( value >= maxUint ) {
    value -= maxUint
  }

  while ( value < 0 ) {
    value += maxUint
  }

  return value
}

export const $toSigned = ( value: number, bitLength: number ) => {
  if (
    typeof value !== 'number' ||
    isNaN( value ) ||
    !isFinite( value )
  ) {
    throw Error( 'Expected a number' )
  }
  
  // coerce to 32 bit integer
  value = ~~value

  const maxUint = $maxValue( bitLength )
  const maxInt = Math.floor( maxUint / 2 - 1 )
  const minInt = Math.floor( maxUint / 2 ) * -1

  while ( value < minInt ) {
    value += maxUint
  }

  while ( value > maxInt ) {
    value -= maxUint
  }

  return value
}

export const $maxValue = ( bitLength: number ) =>
  Math.pow( 2, bitLength )
