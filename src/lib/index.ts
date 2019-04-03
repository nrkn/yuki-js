import { YukiValue, YukiLet, YukiConst } from '../declarations/value-types'

export const size = ( arr: any ) => arr.length

export interface MemoryObject {
  [ key: string ]: number | { [ key: string ]: number }
}

export interface Context {
  incMemory: ( bits: number ) => void
  decMemory: ( bits: number ) => void
  declare: ( v: YukiValue ) => number | { [ key: string ]: number }
  isNumber: ( name: string ) => boolean
  isArray: ( name: string ) => boolean
  isConst: ( name: string ) => boolean
  assert: ( name: string ) => void
  usedBits: () => number
  freeBits: () => number
  fnIn: () => void
  fnOut: () => void
  $: MemoryObject
}

export const $Context = (
  memorySize: number, addressSize: number, parent?: Context
): Context => {
  let bitLength = 0

  const $: MemoryObject = {}
  const valueMap = new Map<string, YukiValue>()

  if( parent ){
    Object.keys( parent ).forEach( name => {
      if( parent.isNumber( name ) ){
        if( parent.isConst( name ) ){
          Object.defineProperty( $, name, {
            get() {
              return parent.$[ name ]
            }
          } )
        } else {
          Object.defineProperty( $, name, {
            get() {
              return parent.$[ name ]
            },
            set( value: number ) {
              parent.$[ name ] = value
            }
          } )
        }
      } else {
        $[ name ] = parent.$[ name ]
      }
    })
  }

  const incMemory = ( bits: number ) => {
    bitLength += bits

    if ( freeBits() < 0 )
      throw Error( 'Out of memory' )
  }

  const decMemory = ( bits: number ) => bitLength -= bits

  const declare = ( v: YukiValue ) => {
    if( valueMap.has( v.name ) )
      throw Error( `${ v.name } already declared` )

    if( v.valueType === 'let' ){
      const l = <YukiLet>v

      if ( l.type === 'number' ) {
        incMemory( l.bitLength )
        valueMap.set( l.name, l )

        let data = 0

        Object.defineProperty( $, l.name, {
          get() {
            return data
          },
          set( value: number ) {
            data = $ensureNumber( value, l )
          }
        } )
      } else {
        incMemory( l.bitLength * l.length )
        valueMap.set( l.name, l )

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
      }
    } else {
      const c = <YukiConst>v

      if( c.type === 'number' ){
        valueMap.set( c.name, c )

        Object.defineProperty( $, c.name, {
          get() {
            return c.value
          }
        } )
      } else {
        valueMap.set( c.name, c )

        const arr = {}

        for ( let i = 0; i < c.value.length; i++ ) {
          Object.defineProperty( arr, i, {
            get() {
              return c.value[ i ]
            }
          } )
        }

        Object.defineProperty( arr, 'length', { get() { return c.value.length } } )

        $[ c.name ] = arr
      }
    }

    return $[ v.name ]
  }

  const isNumber = ( name: string ) => {
    if( valueMap.has( name ) ) return valueMap.get( name )!.type === 'number'

    if( parent ) return parent.isNumber( name )

    return false
  }

  const isArray = ( name: string ) => {
    if ( valueMap.has( name ) ) return valueMap.get( name )!.type === 'array'

    if ( parent ) return parent.isArray( name )

    return false
  }

  const isConst = ( name: string ) => {
    if( valueMap.has( name ) )
      return valueMap.get( name )!.valueType === 'const'

    if( parent ) return parent.isConst( name )

    return false
  }

  const assert = ( name: string ) => {
    if( valueMap.has( name ) ) return

    if( parent ){
      parent.assert( name )
      return
    }

    throw Error( `Unexpected Identifier ${ name }` )
  }

  const usedBits = () => bitLength + ( parent ? parent.usedBits() : 0 )

  const freeBits = () => ( memorySize * 8 ) - usedBits()

  const fnIn = () => incMemory( addressSize * 8 )
  const fnOut = () => decMemory( addressSize * 8 )

  return {
    incMemory, decMemory, declare, isNumber, isArray, isConst, assert,
    usedBits, freeBits, fnIn, fnOut, $
  }
}

export const $ensureNumber = ( value: number | boolean, l: YukiLet ) => {
  if ( l.signed ) return $toSigned( value, l.bitLength )

  return $toUnsigned( value, l.bitLength )
}

export const $assertNumber = ( value: any ) => {
  if ( typeof value === 'boolean' ) return

  if (
    typeof value !== 'number' ||
    isNaN( value ) ||
    !isFinite( value )
  ) {
    throw Error( 'Expected a number' )
  }
}

export const $toUnsigned = ( value: number | boolean, bitLength: number ) => {
  $assertNumber( value )

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

export const $toSigned = ( value: number | boolean, bitLength: number ) => {
  $assertNumber( value )

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
