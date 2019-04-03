import { YukiLiteral, YukiArrayExpression, YukiDeclaration } from './types'
import { YukiValueType, YukiLet, YukiConst } from './value-types'
import { UnaryExpression, Identifier, SequenceExpression, CallExpression } from 'estree'
import { parseScript } from 'esprima';

export const declarationToYukiValue = ( node: YukiDeclaration ): YukiConst | YukiLet => {
  if ( node.kind === 'const' ) {
    const valueType = node.kind
    const [ declarator ] = node.declarations

    const { id, init } = declarator

    const { name } = id

    const type = getType( init )
    const constValue = getConstValue( init )

    if ( type === 'number' ) {
      const value = <number>constValue

      return {
        name, valueType, type, value
      }
    } else {
      const value = <number[]>constValue

      return {
        name, valueType, type, value
      }
    }
  }

  if ( node.kind === 'let' ) {
    const valueType = node.kind
    const [ declarator ] = node.declarations

    const { id, init } = declarator
    const { name } = id

    if ( init.type === 'Identifier' ) {
      const bitLength = getBitLength( init.name )
      const signed = isSigned( init.name )
      const type = 'number'

      return {
        name, valueType, type, bitLength, signed
      }
    } else {
      const bitLength = getBitLength( init.callee.name )
      const signed = isSigned( init.callee.name )
      const length = getLiteralValue( init.arguments[ 0 ] )
      const type = 'array'

      return {
        name, valueType, type, bitLength, length, signed
      }
    }
  }

  throw Error( 'Expected const or let' )
}

export const valueToAst = ( value: any ) => {
  const program = parseScript( `(${ JSON.stringify( value ) })` )

  const statement = program.body[ 0 ]

  if ( statement.type !== 'ExpressionStatement' )
    throw Error( `Unexpected type ${ statement.type }` )

  return statement.expression
}

export const identifierToAst = ( node: Identifier ) => {
  const { name } = node

  const sequence: SequenceExpression = {
    type: 'SequenceExpression',
    expressions: [
      {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          computed: false,
          object: {
            type: 'Identifier',
            name: '$context'
          },
          property: {
            type: 'Identifier',
            name: 'assert'
          }
        },
        arguments: [
          {
            type: 'Literal',
            value: name,
            raw: name
          }
        ]
      },
      {
        type: 'MemberExpression',
        computed: true,
        object: {
          type: 'Identifier',
          name: '$'
        },
        property: {
          type: 'Literal',
          value: name,
          raw: name
        }
      }
    ]
  }

  return sequence
}

export const declarationToAst = ( node: YukiDeclaration ) => {
  const yukiValue = declarationToYukiValue( node )
  const yukiExpression = valueToAst( yukiValue )

  const expression: CallExpression = {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: '$context'
      },
      property: {
        type: 'Identifier',
        name: 'declare'
      }
    },
    arguments: [ yukiExpression ]
  }

  return expression
}

const getConstValue =
  ( node: YukiLiteral | UnaryExpression | YukiArrayExpression ) => {
    if ( node.type === 'Literal' ) return getLiteralValue( node )

    if ( node.type === 'UnaryExpression' ) {
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
