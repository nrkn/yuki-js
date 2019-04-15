import * as assert from 'assert'

import {
  AssignmentPattern, CallExpression, MemberExpression, RestElement,
  ReturnStatement, Identifier, AssignmentExpression, ContinueStatement,
  BlockStatement, VariableDeclaration, VariableDeclarator, ArrayExpression
} from 'estree'

import {
  assignmentPatternNode
} from '../transform/transformers/assignment-pattern'

import {
  freezeNode, variableDeclarationNode, letDeclaratorNode, arrayExpressionNode,
  constNode,
  letNode
} from '../transform/transformers/variable-declaration'

import { callExpressionNode } from '../transform/transformers/call-expression'
import { DefaultTransformOptions } from '../transform/default-options'
import { YukiNode } from '../transform/node-types'
import { parseScript } from 'esprima'
import { transform } from '../transform'
import { identifierNode } from '../transform/transformers/identifier'
import { literalNode } from '../transform/transformers/literal'

import {
  memberExpressionNode
} from '../transform/transformers/member-expression'

import { restElementNode } from '../transform/transformers/rest-element'
import { returnStatementNode } from '../transform/transformers/return-statement'

import {
  setValueExpressionNode
} from '../transform/transformers/set-value-expression'

import {
  terminateLoopStatementNode
} from '../transform/transformers/terminate-loop-statement'

import { LocalScope, TransformOptions } from '../transform/types'

describe( 'yuki-js', () => {
  describe( 'transform', () => {
    describe( 'transformers', () => {
      const options = DefaultTransformOptions()

      options.external.consts.push( 'baz' )

      const dummyParent: YukiNode = {
        type: 'Program',
        body: [],
        sourceType: 'script'
      }

      const assignmentPattern: AssignmentPattern = {
        type: 'AssignmentPattern',
        left: {
          type: 'Identifier',
          name: 'foo'
        },
        right: {
          type: 'Identifier',
          name: 'foo'
        }
      }

      it( 'AssignmentPattern', () => {
        assert.throws(
          () => assignmentPatternNode( assignmentPattern ),
          {
            message: 'Unexpected type AssignmentPattern'
          }
        )
      } )

      it( 'RestElement', () => {
        const restElement: RestElement = {
          type: 'RestElement',
          argument: {
            type: 'Identifier',
            name: 'foo'
          }
        }

        assert.throws(
          () => restElementNode( restElement, dummyParent ),
          {
            message: 'Unexpected type RestElement'
          }
        )
      } )

      describe( 'CallExpression', () => {
        it( 'Freeze expression', () => {
          const freezeCall = freezeNode( { type: 'Identifier', name: 'foo' } )

          assert.strictEqual(
            callExpressionNode( freezeCall, dummyParent, options ), undefined
          )
        } )

        describe( 'Unexpected CallExpression', () => {
          it( 'wrong callee type', () => {
            const callExpression: CallExpression = {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                property: {
                  type: 'Identifier',
                  name: 'bar'
                },
                computed: false
              },
              arguments: []
            }

            assert.throws(
              () => callExpressionNode( callExpression, dummyParent, options ),
              {
                message: 'Unexpected CallExpression'
              }
            )
          } )

          it( 'does not exist', () => {
            const callExpression: CallExpression = {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo'
              },
              arguments: []
            }

            assert.throws(
              () => callExpressionNode( callExpression, dummyParent, options ),
              {
                message: 'Unexpected CallExpression'
              }
            )
          } )
        } )
      } )

      describe( 'FunctionDeclaration', () => {
        it( 'Unexpected params', () => {
          const source = 'function a( b, c ){}'
          const program = parseScript( source )

          assert.throws(
            () => transform( program ),
            { message: 'Unexpected params' }
          )
        } )
      } )

      describe( 'Identifier', () => {
        it( 'early return when parent AssignmentPattern', () => {
          assert.strictEqual(
            identifierNode(
              { type: 'Identifier', name: 'foo' },
              assignmentPattern,
              options
            ),
            undefined
          )
        } )

        it( 'not found', () => {
          assert.throws(
            () => {
              identifierNode(
                { type: 'Identifier', name: 'bar' },
                dummyParent,
                options
              )
            },
            { message: 'Unexpected identifier bar' }
          )
        } )
      } )

      it( 'Literal', () => {
        assert.throws(
          () => {
            literalNode( { type: 'Literal', value: 'a' } )
          },
          {
            message: 'Expected number or boolean'
          }
        )
      } )

      describe( 'MemberExpression', () => {
        it( 'Unexpected MemberExpression', () => {
          assert.throws(
            () => {
              const expression: MemberExpression = {
                type: 'MemberExpression',
                object: {
                  type: 'Literal',
                  value: 4
                },
                property: {
                  type: 'Literal',
                  value: 4
                },
                computed: true
              }

              memberExpressionNode( expression, dummyParent, options )
            },
            {
              message: 'Unexpected MemberExpression'
            }
          )
        } )

        it( 'does not exist', () => {
          assert.throws(
            () => {
              const expression: MemberExpression = {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'bar'
                },
                property: {
                  type: 'Literal',
                  value: 4
                },
                computed: true
              }

              memberExpressionNode( expression, dummyParent, options )
            },
            {
              message: 'Unexpected MemberExpression'
            }
          )
        } )

        it( 'early return for external', () => {
          const expression: MemberExpression = {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: 'baz'
            },
            property: {
              type: 'Literal',
              value: 4
            },
            computed: true
          }

          assert.strictEqual(
            memberExpressionNode( expression, dummyParent, options ),
            undefined
          )
        } )
      } )

      it( 'ReturnStatement', () => {
        const returnStatement: ReturnStatement = {
          type: 'ReturnStatement'
        }

        assert.throws(
          () => {
            returnStatementNode( returnStatement, dummyParent, options )
          },
          {
            message: 'Unexpected return'
          }
        )
      } )

      describe( 'SetValueExpression', () => {
        it( 'Unexpected Assignment because no Identifier', () => {
          const identifier: Identifier = {
            type: 'Identifier',
            name: 'foo'
          }

          const expression: AssignmentExpression = {
            type: 'AssignmentExpression',
            left: identifier,
            right: {
              type: 'Literal',
              value: 0
            },
            operator: '='
          }

          assert.throws(
            () => {
              setValueExpressionNode( expression, dummyParent, options )
            },
            { message: 'Unexpected Assignment' }
          )
        } )

        it( 'Unexpected Assignment because no MemberExpression', () => {
          const member: MemberExpression = {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: 'foo'
            },
            property: {
              type: 'Literal',
              value: 0
            },
            computed: true
          }

          const expression: AssignmentExpression = {
            type: 'AssignmentExpression',
            left: member,
            right: {
              type: 'Literal',
              value: 0
            },
            operator: '='
          }

          assert.throws(
            () => {
              setValueExpressionNode( expression, dummyParent, options )
            },
            { message: 'Unexpected Assignment' }
          )
        } )
      } )

      describe( 'TerminateLoopStatementNode', () => {
        it( 'Unexpected label', () => {
          const statement: ContinueStatement = {
            type: 'ContinueStatement',
            label: {
              type: 'Identifier',
              name: 'foo'
            }
          }

          assert.throws(
            () => {
              terminateLoopStatementNode( statement, dummyParent, options )
            },
            {
              message: 'Unexpected label'
            }
          )
        } )

        it( 'Expected ContinueStatement to be in block', () => {
          const statement: ContinueStatement = {
            type: 'ContinueStatement'
          }

          assert.throws(
            () => {
              terminateLoopStatementNode( statement, dummyParent, options )
            },
            {
              message: 'Expected ContinueStatement to be in block'
            }
          )
        } )

        it( 'Expected ContinueStatement to be in loop', () => {
          const statement: ContinueStatement = {
            type: 'ContinueStatement'
          }

          const block: BlockStatement = {
            type: 'BlockStatement',
            body: [
              statement
            ]
          }

          assert.throws(
            () => {
              terminateLoopStatementNode( statement, block, options )
            },
            {
              message: 'Expected ContinueStatement to be in loop'
            }
          )
        } )
      } )

      describe( 'VariableDeclaration', () => {
        it( 'Expected const or let', () => {
          const declaration: VariableDeclaration = {
            type: 'VariableDeclaration',
            declarations: [],
            kind: 'var'
          }

          assert.throws(
            () => {
              variableDeclarationNode( declaration, dummyParent, options )
            },
            {
              message: 'Expected const or let'
            }
          )
        } )

        it( 'Cannot redefine', () => {
          const scope: LocalScope = {
            type: 'block',
            consts: [],
            numbers: [ 'foo' ],
            arrays: [],
            functions: []
          }

          const opts: TransformOptions = {
            scope,
            external: options.external
          }

          const declarator: VariableDeclarator = {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier',
              name: 'foo'
            },
            init: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'Int8'
              },
              arguments: []
            }
          }

          const declaration: VariableDeclaration = {
            type: 'VariableDeclaration',
            declarations: [
              declarator
            ],
            kind: 'let'
          }

          assert.throws(
            () => {
              letDeclaratorNode( declarator, declaration, opts )
            },
            {
              message: 'Cannot redefine foo'
            }
          )
        } )

        it( 'Unexpected ArrayExpression', () => {
          const arrayExpression: ArrayExpression = {
            type: 'ArrayExpression',
            elements: []
          }

          assert.throws(
            () => {
              arrayExpressionNode( arrayExpression, dummyParent )
            },
            {
              message: 'Unexpected ArrayExpression'
            }
          )
        } )

        describe( 'constNode', () => {
          it( 'Invalid const', () => {
            const constDeclaration: VariableDeclaration = {
              type: 'VariableDeclaration',
              declarations: [],
              kind: 'const'
            }

            assert.throws(
              () => {
                constNode( constDeclaration, dummyParent, options )
              },
              {
                message: 'Invalid const'
              }
            )
          } )

          it( 'Cannot redefine', () => {
            const scope: LocalScope = {
              type: 'block',
              consts: [],
              numbers: [ 'foo' ],
              arrays: [],
              functions: []
            }

            const opts: TransformOptions = {
              scope,
              external: options.external
            }

            const declarator: VariableDeclarator = {
              type: 'VariableDeclarator',
              id: {
                type: 'Identifier',
                name: 'foo'
              },
              init: {
                type: 'Literal',
                value: 0
              }
            }

            const declaration: VariableDeclaration = {
              type: 'VariableDeclaration',
              declarations: [
                declarator
              ],
              kind: 'const'
            }

            assert.throws(
              () => {
                constNode( declaration, dummyParent, opts )
              },
              {
                message: 'Cannot redefine foo'
              }
            )
          } )
        } )

        describe( 'letNode', () => {
          it( 'Invalid let', () => {
            const declaration: VariableDeclaration = {
              type: 'VariableDeclaration',
              declarations: [],
              kind: 'let'
            }

            assert.throws(
              () => {
                letNode( declaration, dummyParent, options )
              },
              {
                message: 'Invalid let'
              }
            )
          } )

          it( 'Invalid let because bad sequence', () => {
            const scope: LocalScope = {
              type: 'function',
              consts: [],
              numbers: [],
              arrays: [],
              functions: []
            }

            const opts: TransformOptions = {
              scope,
              external: options.external
            }

            const node: VariableDeclaration = {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  init: {
                    type: 'SequenceExpression',
                    expressions: [
                      {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: 8
                          }
                        ]
                      },
                      {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'Uint8'
                        },
                        arguments: []
                      }
                    ]
                  }
                }
              ],
              kind: 'let'
            }

            assert.throws(
              () => {
                letNode( node, dummyParent, opts )
              },
              {
                message: 'Invalid let'
              }
            )
          } )
        } )
      } )
    } )
  } )
} )