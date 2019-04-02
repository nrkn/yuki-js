import {
  Identifier, MemberExpression, Program, ReturnStatement, FunctionDeclaration
} from 'estree'

import { YukiLet } from '../declarations/header/types'
import { replace, Visitor } from 'estraverse'

export const replaceMainProgram = ( program: Program, lets: YukiLet[] ) => {
  program = JSON.parse( JSON.stringify( program ) )

  const map = new Map<string, YukiLet>()

  lets.forEach( l => map.set( l.name, l ) )

  const visitor: Visitor = {
    enter: ( node, parent ) => {
      if ( node.type === 'Identifier' && map.has( node.name ) ) {
        if (
          parent &&
          parent.type === 'MemberExpression' &&
          parent.object.type === 'Identifier' &&
          parent.object.name === '$'
        ) return node

        return replaceIdentifier( node )
      }

      if ( node.type === 'ReturnStatement' && !node.argument ) {
        return replaceReturn( node )
      }

      if ( node.type === 'FunctionDeclaration' ) {
        return replaceFunction( node )
      }

      return node
    }
  }

  replace( program, visitor )

  return program
}

const replaceIdentifier = ( node: Identifier ) => {
  const { name } = node

  const expression: MemberExpression = {
    type: 'MemberExpression',
    computed: false,
    object: {
      type: 'Identifier',
      name: '$'
    },
    property: {
      type: 'Identifier',
      name
    }
  }

  return expression
}

const replaceFunction = ( node: FunctionDeclaration ) => {
  node = JSON.parse( JSON.stringify( node ) )

  node.body.body = [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "Identifier",
          "name": "$in"
        },
        "arguments": []
      }
    },
    ...node.body.body,
    returnStatement()
  ]

  return node
}

const replaceReturn = ( _node: ReturnStatement ) => returnStatement()

const returnStatement = (): ReturnStatement => ( {
  type: 'ReturnStatement',
  argument: {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: '$out'
    },
    arguments: []
  }
} )
