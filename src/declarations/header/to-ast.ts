import {
  YukiDeclarationHeader, YukiConstNumber, YukiConstArray, YukiLet
} from './types'

import {
  VariableDeclaration, Program, ArrayExpression, SimpleLiteral,
  ExpressionStatement,
  UnaryExpression
} from 'estree'

import { parseScript } from 'esprima'

export const declarationsToAst = ( declarations: YukiDeclarationHeader ) => {
  const program: Program = {
    type: 'Program',
    body: [],
    sourceType: 'script'
  }

  declarations.consts.forEach( c => {
    if ( c.type === 'array' ) {
      program.body.push( yukiConstArrayToAst( c ) )
    } else {
      program.body.push( yukiConstNumberToAst( c ) )
    }
  } )

  program.body.push( yukiLetsToAst( declarations.lets ) )

  return program
}

const yukiConstNumberToAst = ( num: YukiConstNumber ) => {
  const { name, value } = num
  const raw = String( value )

  const init: UnaryExpression | SimpleLiteral = (
    value < 0 ?
      {
        type: 'UnaryExpression',
        operator: '-',
        prefix: true,
        argument: {
          type: 'Literal',
          value: value * -1,
          raw: String( value * -1 )
        }
      } :
      {
        type: 'Literal',
        value,
        raw
      }
  )

  const declaration: VariableDeclaration = {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name
        },
        init
      }
    ],
    kind: 'const'
  }

  return declaration
}

const yukiConstArrayToAst = ( arr: YukiConstArray ) => {
  const { name, value } = arr

  const arrayExpression: ArrayExpression = {
    type: 'ArrayExpression',
    elements: value.map( v => (
      v < 0 ?
      <UnaryExpression>{
        type: 'UnaryExpression',
        operator: '-',
        prefix: true,
        argument: {
          type: 'Literal',
          value: v * -1,
          raw: String( v * -1 )
        }
      }:
      <SimpleLiteral>{
        type: 'Literal',
        value: v,
        raw: String( v )
      }
    ) )
  }

  const declaration: VariableDeclaration = {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name
        },
        init: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'Identifier',
              name: 'Object'
            },
            property: {
              type: 'Identifier',
              name: 'freeze'
            }
          },
          arguments: [
            arrayExpression
          ]
        }
      }
    ],
    kind: 'const'
  }

  return declaration
}

const yukiLetsToAst = ( lets: YukiLet[] ) => {
  const letsJson = parseScript( JSON.stringify( lets ) )
  const jsonExpression = <ExpressionStatement>letsJson.body[ 0 ]
  const jsonArray = <ArrayExpression>jsonExpression.expression

  const objectDeclaration: VariableDeclaration = {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: '$'
        },
        init: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: '$Memory'
          },
          arguments: [ jsonArray ]
        }
      }
    ],
    kind: 'const'
  }

  return objectDeclaration
}
