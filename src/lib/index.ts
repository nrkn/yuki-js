import { YukiLet, YukiArray, YukiNumber } from '../declarations/header/types'

export const size = ( arr: any[] ) => arr.length

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
  [ key: string ]: number | number[]
}

export const $Memory = ( lets: YukiLet[] ) => {
  const $: MemoryObject = {}

  const numbers = new Map<string, YukiNumber>()

  lets.forEach( l => {
    if ( l.type === 'array' ) {
      $[ l.name ] = $ArrayProxy( l )
    } else {
      numbers.set( l.name, l )
      $[ l.name ] = 0
    }
  } )

  const handler: ProxyHandler<MemoryObject> = {
    get: ( target, key: string ) => {
      if( key === '$' ){
        const raw: MemoryObject = {}

        lets.forEach( l => {
          if( l.type === 'number' ){
            raw[ l.name ] = target[ l.name ]
          } else {
            raw[ l.name ] = Array<number>( l.length )
            for( let i = 0; i < l.length; i++ ){
              raw[ l.name ][ i ] = target[ l.name ][ i ]
            }
          }
        })

        return raw
      }

      return target[ key ]
    },
    set: ( target, key: string, value ) => {
      const yukiNumber = numbers.get( key )

      if ( !yukiNumber )
        throw Error( `Unexpected identifier ${ key }` )

      target[ key ] = $ensureNumber( value, yukiNumber )

      return true
    }
  }

  return new Proxy( $, handler )
}

export const $ArrayProxy = ( a: YukiArray ) => {
  const arr: number[] = Array( a.length ).fill( 0 )

  const handler: ProxyHandler<number[]> = {
    get: ( target, key: string | symbol ) => {
      if ( typeof key === 'symbol' ) return target[ key ]

      const index = parseInt( key, 10 )

      if ( isNaN( index ) || index < 0 || index >= a.length )
        throw Error( `Unexpected index ${ key }` )

      return target[ index ]
    },
    set: ( target, key: string | symbol, value ) => {
      if ( typeof key === 'symbol' ) return false

      const index = parseInt( key, 10 )

      if ( isNaN( index ) || index < 0 || index >= a.length )
        throw Error( `Index out of bounds: ${ index }` )

      target[ index ] = $ensureNumber( value, a )

      return true
    }
  }

  return new Proxy( arr, handler )
}

export const $ensureNumber = ( value: number, l: YukiLet ) => {
  if(
    typeof value !== 'number' ||
    isNaN( value ) ||
    !isFinite( value )
  ){
    throw Error( 'Expected a number' )
  }

  // coerce to 32 bit integer
  value = ~~value

  if ( l.signed ) return $toSigned( value, l.bitLength )

  return $toUnsigned( value, l.bitLength )
}

export const $toUnsigned = ( value: number, bitLength: number ) => {
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
