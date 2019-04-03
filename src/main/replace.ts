import {
  Program, ReturnStatement, FunctionDeclaration, VariableDeclaration, ExpressionStatement, AssignmentExpression, BlockStatement
} from 'estree'

import { replace, Visitor } from 'estraverse'
import { identifierToAst, declarationToAst } from '../declarations'
import { YukiDeclaration } from '../declarations/types';

export const replaceMainProgram = ( program: Program, memorySize: number, addressSize: number ) => {
  program = JSON.parse( JSON.stringify( program ) )

  program.body = [
    ...initContext( memorySize, addressSize ),
    ...program.body
  ]

  const visitor: Visitor = {
    enter: ( node, parent ) => {
      if ( node.type === 'Identifier' ) {
        if (
          parent &&
          parent.type === 'MemberExpression' &&
          parent.object.type === 'Identifier' &&
          parent.object.name === '$'
        ) return node

        return identifierToAst( node )
      }

      if( node.type === 'BlockStatement' ){
        const block = <BlockStatement>JSON.parse( JSON.stringify( node ) )

        block.body = [
          ...enterContext( memorySize, addressSize ),
          ...block.body,
          {
            type: 'ExpressionStatement',
            expression: exitContext()
          }
        ]

        return block
      }

      if( node.type === 'VariableDeclaration' ){
        return declarationToAst( <YukiDeclaration>node )
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

const initContext = ( memorySize: number, addressSize: number ) => {
  const context: VariableDeclaration[] = [
    {
      type: 'VariableDeclaration',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: {
            type: 'Identifier',
            name: '$context'
          },
          init: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: '$Context'
            },
            arguments: [ {
              type: 'Literal',
              value: memorySize,
              raw: String( memorySize )
            }, {
              type: 'Literal',
              value: addressSize,
              raw: String( addressSize )
            } ]
          }
        }
      ],
      kind: 'let'
    },
    {
      type: 'VariableDeclaration',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: {
            type: 'ObjectPattern',
            properties: [
              {
                type: 'Property',
                key: {
                  type: 'Identifier',
                  name: '$'
                },
                computed: false,
                value: {
                  type: 'Identifier',
                  name: '$'
                },
                kind: 'init',
                method: false,
                shorthand: true
              }
            ]
          },
          init: {
            type: 'Identifier',
            name: '$context'
          }
        }
      ],
      kind: 'let'
    }
  ]

  return context
}

const enterContext = ( memorySize: number, addressSize: number ) => {
  const enter: [ VariableDeclaration, ExpressionStatement ] = [
    {
      type: 'VariableDeclaration',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: {
            type: 'Identifier',
            name: '$parent'
          },
          init: {
            type: 'Identifier',
            name: '$context'
          }
        }
      ],
      kind: 'const'
    },
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: '$context'
        },
        right: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: '$Context'
          },
          arguments: [
            {
              type: 'Literal',
              value: memorySize,
              raw: String( memorySize )
            },
            {
              type: 'Literal',
              value: addressSize,
              raw: String( addressSize )
            },
            {
              type: 'Identifier',
              name: '$parent'
            }
          ]
        }
      }
    }
  ]

  return enter
}

const exitContext = () => {
  const exit: AssignmentExpression = {
    type: 'AssignmentExpression',
    operator: '=',
    left: {
      type: 'Identifier',
      name: '$context'
    },
    right: {
      type: 'Identifier',
      name: 'parent'
    }
  }

  return exit
}

const replaceFunction = ( node: FunctionDeclaration ) => {
  node = JSON.parse( JSON.stringify( node ) )

  node.body.body = [
    {
      type: 'ExpressionStatement',
      expression: {
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
            name: 'fnIn'
          }
        },
        arguments: []
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
            name: 'fnOut'
          }
        },
        arguments: []
      },
      exitContext()
    ]
  }
} )
