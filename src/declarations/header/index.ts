import {
  YukiDeclarationProgram, YukiLiteral, YukiArrayExpression
} from '../types'

import { YukiDeclarationHeader, YukiValueType } from './types'
import { UnaryExpression } from 'estree';

export const DeclarationHeader =
  ( program: YukiDeclarationProgram ) => {
    const header: YukiDeclarationHeader = {
      consts: [],
      lets: []
    }

    const { consts, lets } = header

    program.body.forEach( node => {
      if ( node.kind === 'const' ) {
        const valueType = node.kind
        const [ declarator ] = node.declarations

        const { id, init } = declarator
        const { name } = id

        const type = getType( init )
        const constValue = getConstValue( init )

        if( type === 'number' ){
          const value = <number>constValue

          consts.push( {
            name, valueType, type, value
          } )
        } else {
          const value = <number[]>constValue

          consts.push( {
            name, valueType, type, value
          } )
        }
      }

      if ( node.kind === 'let' ) {
        const valueType = node.kind
        const [ declarator ] = node.declarations

        const { id, init } = declarator
        const { name } = id

        if( init.type === 'Identifier' ){
          const bitLength = getBitLength( init.name )
          const signed = isSigned( init.name )
          const type = 'number'

          lets.push({
            name, valueType, type, bitLength, signed
          })
        } else {
          const bitLength = getBitLength( init.callee.name )
          const signed = isSigned( init.callee.name )
          const length = getLiteralValue( init.arguments[ 0 ] )
          const type = 'array'

          lets.push({
            name, valueType, type, bitLength, length, signed
          })
        }
      }
    } )

    return header
  }

const getConstValue =
  ( node: YukiLiteral | UnaryExpression | YukiArrayExpression ) => {
    if ( node.type === 'Literal' ) return getLiteralValue( node )

    if( node.type === 'UnaryExpression' ){
      return getLiteralValue( <YukiLiteral>node.argument ) * -1
    }

    return ( <YukiLiteral[]>node.elements ).map( getConstValue )
  }

const getLiteralValue = ( literal: YukiLiteral ) => {
  if ( typeof literal.value === 'boolean' ) {
    return literal.value ? 1 : 0
  }

  return literal.value
}

const getType =
  ( node: YukiLiteral | UnaryExpression | YukiArrayExpression ): YukiValueType => {
    if ( node.type === 'Literal' || node.type === 'UnaryExpression' )
      return 'number'

    return 'array'
  }

const getBitLength = ( name: string ) =>
  name === 'Bool' ? 1 : parseInt( name.replace( /\D/g, '' ), 10 )

const isSigned = ( name: string ) =>
  name === 'Bool' ? false : name.startsWith( 'I' )