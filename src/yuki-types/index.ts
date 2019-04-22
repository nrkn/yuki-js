type ValueMapper = ( n: number ) => number

type YukiNumberFactory = ( value: any ) => YukiNumber

const NumberFactory = (
  kind: YukiKind, bitLength: number, isSigned: boolean, valueMapper: ValueMapper
) => {
  const Num = ( value: any = 0 ): YukiNumber => {
    value = valueMapper( value )

    const num: Partial<YukiNumber> = {
      get _bitLength() {
        return bitLength
      },
      get _signed() {
        return isSigned
      },
      get _kind() {
        return kind
      }
    }

    if ( kind === 'let' ) {
      Object.defineProperty( num, '$', {
        get: () => value,
        set: n => {
          value = valueMapper( n )
        }
      } )
    } else {
      Object.defineProperty( num, '$', {
        get: () => value
      } )
    }

    return <YukiNumber>num
  }

  return Num
}

export const ArrayFactory = (
  kind: YukiKind, bitLength: number, isSigned: boolean,
  NumberFactory: YukiNumberFactory
) => {
  const Arr = ( arg: number | any[] ): YukiArray => {
    const length = Array.isArray( arg ) ? arg.length : arg
    const values = Array<YukiNumber>( length )

    const arr: YukiArray = {
      get _bitLength() {
        return length * bitLength
      },
      get _signed() {
        return isSigned
      },
      get _kind() {
        return kind
      },
      get length() {
        return length
      }
    }

    for ( let i = 0; i < length; i++ ) {
      const value = Array.isArray( arg ) ? arg[ i ] : 0

      values[ i ] = NumberFactory( value )

      attachArrayIndexer( kind, arr, values, i )
    }

    return arr
  }

  return Arr
}

export const StringFactory = (
  kind: YukiKind, bitLength: 8 | 16
) => {
  const ArrFactory = UintArrayFactory( bitLength, kind )

  const Arr = ( arg: number | string | number[] ): YukiArray => {
    if ( typeof arg === 'number' || Array.isArray( arg ) ) {
      return ArrFactory( arg )
    }

    const codes = arg.split( '' ).map( c => c.charCodeAt( 0 ) )

    return ArrFactory( codes )
  }

  return Arr
}

export const String8Factory = ( kind: YukiKind ) => StringFactory( kind, 8 )

export const String16Factory = ( kind: YukiKind ) => StringFactory( kind, 16 )

export const BoolFactory = ( kind: YukiKind ) =>
  NumberFactory( kind, 1, false, n => n ? 1 : 0 )

export const BoolArrayFactory = ( kind: YukiKind ) =>
  ArrayFactory( kind, 1, false, BoolFactory( kind ) )

export const IntFactory = ( bitLength: number, kind: YukiKind ) =>
  NumberFactory( kind, bitLength, true, n => ensureSigned( n, bitLength ) )

export const UintFactory = ( bitLength: number, kind: YukiKind ) =>
  NumberFactory( kind, bitLength, false, n => ensureUnsigned( n, bitLength ) )

export const IntArrayFactory = ( bitLength: number, kind: YukiKind ) =>
  ArrayFactory( kind, bitLength, true, IntFactory( bitLength, kind ) )

export const UintArrayFactory = ( bitLength: number, kind: YukiKind ) =>
  ArrayFactory( kind, bitLength, false, UintFactory( bitLength, kind ) )

export const Float32Factory = ( kind: YukiKind ) =>
  NumberFactory( kind, 32, true, toFloat32 )

export const Float32ArrayFactory = ( kind: YukiKind ) =>
  ArrayFactory( kind, 32, true, Float32Factory( kind ) )

export const Float64Factory = ( kind: YukiKind ) =>
  NumberFactory( kind, 64, true, toFloat64 )

export const Float64ArrayFactory = ( kind: YukiKind ) =>
  ArrayFactory( kind, 64, true, Float64Factory( kind ) )

export const Bool = BoolFactory( 'let' )
export const ConstBool = BoolFactory( 'const' )
export const BoolArr = BoolArrayFactory( 'let' )
export const ConstBoolArr = BoolArrayFactory( 'const' )

export const Float32 = Float32Factory( 'let' )
export const ConstFloat32 = Float32Factory( 'const' )
export const Float32Arr = Float32ArrayFactory( 'let' )
export const ConstFloat32Arr = Float32ArrayFactory( 'const' )

export const Float64 = Float64Factory( 'let' )
export const ConstFloat64 = Float64Factory( 'const' )
export const Float64Arr = Float64ArrayFactory( 'let' )
export const ConstFloat64Arr = Float64ArrayFactory( 'const' )

export const String8 = String8Factory( 'let' )
export const ConstString8 = String8Factory( 'const' )

export const String16 = String16Factory( 'let' )
export const ConstString16 = String16Factory( 'const' )

export const ensureSigned = ( value: any, bitLength: number ) => {
  const maxUint = maxValue( bitLength )
  const maxInt = Math.floor( maxUint / 2 - 1 )
  const minInt = Math.floor( maxUint / 2 ) * -1

  if ( value && typeof value !== 'number' && '$' in value ) value = value.$

  assertNumber( value )

  value = ~~value

  while ( value < minInt ) {
    value += maxUint
  }

  while ( value > maxInt ) {
    value -= maxUint
  }

  return value
}

export const ensureUnsigned = ( value: any, bitLength: number ) => {
  const maxUint = maxValue( bitLength )

  if ( value && typeof value !== 'number' && '$' in value ) value = value.$

  assertNumber( value )

  value = ~~value

  while ( value >= maxUint ) {
    value -= maxUint
  }

  while ( value < 0 ) {
    value += maxUint
  }

  return value
}

export const assertNumber = ( value: any ) => {
  if ( typeof value === 'boolean' ) return

  if (
    typeof value !== 'number' ||
    isNaN( value ) ||
    !isFinite( value )
  ) {
    throw Error( 'Expected a number' )
  }
}

const attachArrayIndexer = (
  kind: YukiKind, arr: YukiArray, values: YukiNumber[], index: number
) => {
  if ( kind === 'let' ) {
    Object.defineProperty( arr, index, {
      get() {
        return values[ index ].$
      },
      set( v ) {
        values[ index ].$ = v
      }
    } )
  } else {
    Object.defineProperty( arr, index, {
      get() {
        return values[ index ].$
      }
    } )
  }
}

export const bitLengthFromValue = ( value: any ) => {
  assertNumber( value )

  // suprisingly, this works for both positive and negative numbers!
  return Number( value ).toString( 2 ).length
}

export const maxValue = ( bitLength: number ) =>
  Math.pow( 2, bitLength )

const float32Arr = new Float32Array( 1 )

export const toFloat32 = ( value: any ) => {
  value = Number( value )

  assertNumber( value )

  float32Arr[ 0 ] = value

  return float32Arr[ 0 ]
}

export const toFloat64 = ( value: any ) => {
  value = Number( value )

  assertNumber( value )

  return value
}

export interface YukiArray {
  readonly _bitLength: number
  readonly _signed: boolean
  readonly _kind: YukiKind
  readonly length: number
  [ n: number ]: number
}

export interface YukiNumber {
  readonly _bitLength: number
  readonly _signed: boolean
  readonly _kind: YukiKind
  $: number
}

export type YukiType = YukiArray | YukiNumber

export type YukiKind = 'const' | 'let'
