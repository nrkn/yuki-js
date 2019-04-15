import {
  IntFactory, UintFactory, Bool, IntArrayFactory, UintArrayFactory, BoolArray,
  YukiType
} from './index'

export const typeNames: string[] = [ 'Bool', 'BoolArr' ]

export const typeFactories: TypeFactoryMap = {}

export interface TypeFactoryMap {
  [ name: string ]: ( arg: number ) => YukiType
}

typeFactories.Bool = Bool
typeFactories.BoolArr = BoolArray

const createInt = ( bitLength: number ) => {
  const name = `Int${ bitLength }`

  typeNames.push( name )
  typeFactories[ name ] = IntFactory( bitLength )
}

const createUint = ( bitLength: number ) => {
  const name = `Uint${ bitLength }`

  typeNames.push( name )
  typeFactories[ name ] = UintFactory( bitLength )
}

const createIntArray = ( bitLength: number ) => {
  const name = `Int${ bitLength }Arr`

  typeNames.push( name )
  typeFactories[ name ] = IntArrayFactory( bitLength )
}

const createUintArray = ( bitLength: number ) => {
  const name = `Uint${ bitLength }Arr`

  typeNames.push( name )
  typeFactories[ name ] = UintArrayFactory( bitLength )
}

for ( let i = 2; i <= 32; i++ ) {
  createInt( i )
  createUint( i )
  createIntArray( i )
  createUintArray( i )
}
