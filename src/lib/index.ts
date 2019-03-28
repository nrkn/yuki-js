import { YukiLet, YukiArray, YukiNumber } from '../declarations/header/types'

const size = ( arr: any[] ) => arr.length

const CallStack = ( maxSize: number, addressSize = 2 ) => {
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

interface MemoryObject {
  [ key: string ]: number | number[]
}

const Memory = ( lets: YukiLet[], debug = false ) => {
  const $: MemoryObject = {}

  const numbers = new Map<string, YukiNumber>()

  lets.forEach( l => {
    if ( l.type === 'array' ) {
      $[ l.name ] = ArrayProxy( l, debug )
    } else {
      numbers.set( l.name, l )
      $[ l.name ] = 0
    }
  } )

  const handler: ProxyHandler<MemoryObject> = {
    set: ( target, key, value ) => {
      if ( typeof key !== 'string' ) return false

      const yukiNumber = numbers.get( key )

      if ( !yukiNumber ) return false

      target[ key ] = ensureNumber( value, yukiNumber )

      return true
    }
  }

  return new Proxy( $, handler )
}

const ArrayProxy = ( a: YukiArray, debug: boolean ) => {
  const arr: number[] = Array( a.length ).fill( 0 )

  const handler: ProxyHandler<number[]> = {
    get: ( target, key ) => {
      if ( typeof key === 'symbol' ) return target[ key ]

      const index = typeof key === 'number' ? key : parseInt( key, 10 )

      if ( isNaN( index ) && debug ) return target[ key ]

      if ( isNaN( index ) || index < 0 || index >= a.length )
        throw Error( `Unexpected index ${ key }` )

      return target[ index ]
    },
    set: ( target, key, value ) => {
      if ( typeof key === 'symbol' ) return false

      const index = typeof key === 'number' ? key : parseInt( key, 10 )

      if ( isNaN( index ) || index < 0 || index >= a.length )
        throw Error( `Index out of bounds: ${ index }` )

      target[ index ] = ensureNumber( value, a )

      return true
    }
  }

  return new Proxy( arr, handler )
}

const ensureNumber = ( value: number, l: YukiLet ) => {
  if(
    typeof value !== 'number' ||
    isNaN( value ) ||
    !isFinite( value )
  ){
    throw Error( 'Expected a number' )
  }

  // coerce to 32 bit integer
  value = ~~value

  if ( l.signed ) return unsignedToSigned( value, l.bitLength )

  return signedToUnsigned( value, l.bitLength )
}

const signedToUnsigned = ( value: number, bitLength: number ) => {
  const maxUint = maxValue( bitLength )

  while ( value >= maxUint ) {
    value -= maxUint
  }

  while ( value < 0 ) {
    value += maxUint
  }

  return value
}

const unsignedToSigned = ( value: number, bitLength: number ) => {
  const maxUint = maxValue( bitLength )
  const maxInt = Math.floor( maxUint / 2 - 1 )

  while ( value >= maxUint ) {
    value -= maxUint
  }

  while ( value > maxInt ) {
    value -= maxUint
  }

  return value
}

const maxValue = ( bitLength: number ) =>
  Math.pow( 2, bitLength )
