import {
  YukiDeclarationHeader, YukiConstNumber, YukiConstArray, YukiLet, YukiNumber,
  YukiArray
} from './types'

import {
  VariableDeclaration, Property, ObjectExpression, Program, ArrayExpression,
  SimpleLiteral,
  ExpressionStatement,
} from 'estree'
import { parseScript } from 'esprima';

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
          type: 'Literal',
          value,
          raw
        }
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
