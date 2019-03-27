import * as assert from 'assert'
import { parseScript } from 'esprima'
import { VariableDeclaration } from 'estree'

import {
  validateDeclarationsProgram, validateConst, validateLet
} from '../declarations/validate'

describe( 'yuki-js', () => {
  describe( 'declarations', () => {
    describe( 'validate', () => {
      const validate = ( errorMessage: string, source: string ) => {
        it( errorMessage, () => {
          const ast = parseScript( source )

          const errors = validateDeclarationsProgram( ast )

          assert.strictEqual( errors.length, 1 )
          assert(
            errors[ 0 ].message.startsWith( errorMessage )
          )
        } )
      }

      validate( 'Expected VariableDeclaration', '0' )
      validate( 'Unexpected var', 'var a = Int8' )
      validate( 'Expected a single declaration', 'let a, b = Int8' )
      validate( 'Expected init', 'let a' )
      validate( 'Expected Identifier', 'let [ a, b ] = Uint8(10)' )

      describe( 'const', () => {
        const validate = ( errorMessage: string, source: string ) => {
          it( errorMessage, () => {
            const ast = parseScript( source )

            const declaration = <VariableDeclaration>ast.body[ 0 ]
            const declarator = declaration.declarations[ 0 ]
            const errors = validateConst( declarator )

            assert.strictEqual( errors.length, 1 )
            assert(
              errors[ 0 ].message.startsWith( errorMessage )
            )
          } )
        }

        validate( 'Expected boolean or number', 'const x = "a"' )
        validate( 'Unexpected type', 'const x = y' )
        validate( 'Unexpected empty ArrayExpression', 'const x = []' )
        validate( 'Expected ArrayExpression[1] to be number', 'const x = [ 1, false ]' )
        validate( 'Unexpected string in ArrayExpression[0]', 'const x = [ "" ]' )
        validate( 'Expected ArrayExpression[0] to be Literal', 'const x = [ a ]' )
      } )

      describe( 'let', () => {
        const validate = ( errorMessage: string, source: string ) => {
          it( errorMessage, () => {
            const ast = parseScript( source )

            const declaration = <VariableDeclaration>ast.body[ 0 ]
            const declarator = declaration.declarations[ 0 ]
            const errors = validateLet( declarator )

            assert.strictEqual( errors.length, 1 )
            assert(
              errors[ 0 ].message.startsWith( errorMessage )
            )
          } )
        }

        validate( 'Unexpected init name Foo', 'let a = Foo' )
        validate( 'Unexpected init type Literal', 'let a = 1' )
        validate( 'Unexpected callee type MemberExpression', 'let a = b[ 0 ]()' )
        validate( 'Unexpected callee name Foo', 'let a = Foo()' )
        validate( 'Expected single argument', 'let a = Int8()' )
        validate( 'Unexpected argument type Identifier', 'let a = Int8( b )' )
        validate( 'Unexpected argument', 'let a = Int8( "a" )' )
      } )
    } )
  } )
} )
