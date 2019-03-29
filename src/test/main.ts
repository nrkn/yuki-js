import * as assert from 'assert'
import { parseScript, parseModule } from 'esprima'

import {
  Identifier, ExpressionStatement, MemberExpression, AssignmentExpression,
  CallExpression, FunctionDeclaration, ExportNamedDeclaration, ReturnStatement,
  Literal
} from 'estree'

import {
  YukiValue, YukiArray, YukiNumber, YukiConstNumber, YukiConstArray
} from '../declarations/header/types'

import { FunctionNames } from '../main/types'
import {
  ValidateNode, ValidateIdentifier, ValidateMemberExpression,
  ValidateAssignmentExpression, ValidateCallExpression,
  ValidateFunctionDeclaration, validateReturnStatement, validateLiteral
} from '../main/validate'
import { getSubroutineNames, getLibFunctionNames } from '../main/util';

describe( 'yuki-js', () => {
  describe( 'main', () => {
    describe( 'validate', () => {
      const headerMap = new Map<string, YukiValue>()
      const functionNames: FunctionNames = {
        external: [],
        subroutines: []
      }

      describe( 'ValidateNode', () => {
        const validateNode = ValidateNode( headerMap, functionNames )

        it( 'Unexpected type VariableDeclaration', () => {
          const ast = parseScript( 'let x = 0' )
          const node = ast.body[ 0 ]

          const errors = validateNode( node )

          assert.strictEqual( errors.length, 1 )
          assert( errors[ 0 ].message.startsWith( 'Unexpected type VariableDeclaration' ) )
        } )
      } )

      describe( 'ValidateIdentifier', () => {
        it( 'Unexpected Identifier a', () => {
          const validateIdentifier = ValidateIdentifier( headerMap, [] )
          const ast = parseScript( 'a' )

          const expression = <ExpressionStatement>ast.body[ 0 ]
          const identifier = <Identifier>expression.expression

          const errors = validateIdentifier( identifier )

          assert.strictEqual( errors.length, 1 )
          assert( errors[ 0 ].message.startsWith( 'Unexpected Identifier a' ) )
        } )
      } )

      describe( 'ValidateMemberExpression', () => {
        const headerMap = new Map<string, YukiValue>()

        const a: YukiNumber = {
          name: 'a',
          valueType: 'let',
          type: 'number',
          bitLength: 8,
          signed: true
        }

        headerMap.set( 'a', a )

        const validateMemberExpression = ValidateMemberExpression( headerMap )

        const validate = ( errorMessage: string, source: string ) => {
          it( errorMessage, () => {
            const ast = parseScript( source )

            const expression = <ExpressionStatement>ast.body[ 0 ]
            const memberExpression = <MemberExpression>expression.expression

            const errors = validateMemberExpression( memberExpression )

            assert.strictEqual( errors.length, 1 )
            assert(
              errors[ 0 ].message.startsWith( errorMessage )
            )
          } )
        }

        validate( 'Unexpected type ArrayExpression', '[ 1, 2, 3 ][ 0 ]' )
        validate( 'Unexpected name b', 'b[ 0 ]' )
        validate( 'Unexpected number a', 'a[ 0 ]' )
      } )

      describe( 'ValidateAssignmentExpression', () => {
        const headerMap = new Map<string, YukiValue>()

        const a: YukiNumber = {
          name: 'a',
          valueType: 'let',
          type: 'number',
          bitLength: 8,
          signed: true
        }

        const b: YukiArray = {
          name: 'b',
          valueType: 'let',
          type: 'array',
          bitLength: 8,
          signed: true,
          length: 10
        }

        const c: YukiConstNumber = {
          name: 'c',
          valueType: 'const',
          type: 'number',
          value: 10
        }

        const d: YukiConstArray = {
          name: 'd',
          valueType: 'const',
          type: 'array',
          value: [ 1, 2, 3 ]
        }

        headerMap.set( 'a', a )
        headerMap.set( 'b', b )
        headerMap.set( 'c', c )
        headerMap.set( 'd', d )

        const validateMemberExpression = ValidateMemberExpression( headerMap )
        const validateIdentifier = ValidateIdentifier( headerMap, [ 'foo' ] )
        const validateAssignmentExpression = ValidateAssignmentExpression(
          headerMap, validateIdentifier, validateMemberExpression
        )

        const validate = ( errorMessage: string, source: string ) => {
          it( errorMessage, () => {
            const ast = parseScript( source )

            const expression = <ExpressionStatement>ast.body[ 0 ]
            const assignmentExpression = <AssignmentExpression>(
              expression.expression
            )

            const errors = validateAssignmentExpression( assignmentExpression )

            assert.strictEqual( errors.length, 1 )
            assert(
              errors[ 0 ].message.startsWith( errorMessage )
            )
          } )
        }

        validate( 'Expected Identifier or MemberExpression', '[ a, b ] = c' )
        validate( 'Unexpected Identifier e', 'e = a' )
        validate( 'Unexpected assignment to foo', 'foo = a' )
        validate( 'Unexpected assignment to array', 'b = a' )
        validate( 'Unexpected assignment to const', 'c = a' )
        validate( 'Unexpected type ArrayExpression', '[ 1, 2, 3 ][ 0 ] = a' )
        validate( 'Unexpected assignment to const', 'd[ 0 ] = a' )
      } )

      describe( 'ValidateCallExpression', () => {
        const functionNames: FunctionNames = {
          external: [ 'foo' ],
          subroutines: [ 'bar' ]
        }

        const validateCallExpression = ValidateCallExpression( functionNames )

        const validate = ( errorMessage: string, source: string ) => {
          it( errorMessage, () => {
            const ast = parseScript( source )

            const expression = <ExpressionStatement>ast.body[ 0 ]
            const callExpression = <CallExpression>(
              expression.expression
            )

            const errors = validateCallExpression( callExpression )

            assert.strictEqual( errors.length, 1 )
            assert(
              errors[ 0 ].message.startsWith( errorMessage )
            )
          } )
        }

        validate( 'Expected Identifier', 'a[ 0 ]()' )
        validate( 'Unexpected arguments', 'bar( 1 )' )
        validate( 'Unexpected Identifier qux', 'qux()' )
      } )

      describe( 'validateFunctionDeclaration', () => {
        const validateFunctionDeclaration = ValidateFunctionDeclaration(
          [ 'size' ]
        )

        it( 'Unexpected params', () => {
          const ast = parseScript( 'function a( b ){}' )

          const declaration = <FunctionDeclaration>ast.body[ 0 ]

          const errors = validateFunctionDeclaration( declaration )

          assert(
            errors[ 0 ].message.startsWith( 'Unexpected params' )
          )
        } )

        it( 'Function names cannot start with $', () => {
          const ast = parseScript( 'function $(){}' )

          const declaration = <FunctionDeclaration>ast.body[ 0 ]

          const errors = validateFunctionDeclaration( declaration )

          assert(
            errors[ 0 ].message.startsWith(
              'Function names cannot start with $'
            )
          )
        } )

        it( 'Cannot redefine external function size', () => {
          const ast = parseScript( 'function size(){}' )

          const declaration = <FunctionDeclaration>ast.body[ 0 ]

          const errors = validateFunctionDeclaration( declaration )

          assert(
            errors[ 0 ].message.startsWith(
              'Cannot redefine external function size'
            )
          )
        } )
      } )

      describe( 'validateReturnStatement', () => {
        it( 'Unexpected argument', () => {
          const ast = parseScript( 'function a(){ return a }' )

          const declaration = <FunctionDeclaration>ast.body[ 0 ]
          const statement = <ReturnStatement>declaration.body.body[ 0 ]

          const errors = validateReturnStatement( statement )

          assert(
            errors[ 0 ].message.startsWith( 'Unexpected argument' )
          )
        } )
      } )

      describe( 'validateLiteral', () => {
        it( 'Unexpected type string', () => {
          const ast = parseScript( '""' )

          const expression = <ExpressionStatement>ast.body[ 0 ]
          const literal = <Literal>expression.expression

          const errors = validateLiteral( literal )

          assert(
            errors[ 0 ].message.startsWith( 'Unexpected type string' )
          )
        } )
      } )
    } )

    describe( 'util', () => {
      describe( 'getSubroutineNames', () => {
        it( 'Functions cannot be nested', () => {
          const ast = parseScript( '{function b(){}}' )

          assert.throws(
            () => getSubroutineNames( ast ),
            {
              message: 'Functions cannot be nested in BlockStatement'
            }
          )
        } )

        it( 'Duplicate function name', () => {
          const ast = parseScript( 'function b(){}function b(){}' )

          assert.throws(
            () => getSubroutineNames( ast ),
            {
              message: 'Duplicate function name b'
            }
          )
        } )
      } )

      describe( 'getLibFunctionNames', () => {
        it( 'Duplicate function name', () => {
          const ast = parseScript( 'function b(){}function b(){}' )

          assert.throws(
            () => getLibFunctionNames( ast ),
            {
              message: 'Duplicate function name b'
            }
          )
        } )

        it( 'Only gets top level functions', () => {
          const ast = parseScript( 'function b(){ function a(){} }' )

          const names = getLibFunctionNames( ast )

          assert.deepEqual( names, [ 'b' ] )
        })
      })
    } )
  } )
} )
