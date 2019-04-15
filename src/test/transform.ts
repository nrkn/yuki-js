import * as assert from 'assert'
import { parseScript } from 'esprima'
import { transform } from '../transform'

import {
  isFreezeCallExpression, isFreezeMemberExpression
} from '../transform/node-predicates'

import { LocalScope, TransformOptions } from '../transform/types'

import {
  existsLocal, existsGlobal, exitScope, countScopeDepthTo
} from '../transform/scope'

import { DefaultTransformOptions } from '../transform/default-options'

describe( 'yuki-js', () => {
  describe( 'transform', () => {
    describe( 'transform', () => {
      it( 'Unexpected type', () => {
        const source = 'class x{}'

        const program = parseScript( source )

        assert.throws(
          () => transform( program ),
          {
            message: 'Unexpected type ClassDeclaration'
          }
        )
      } )

      it( 'LocError', () => {
        const source = 'class x{}'

        const program = parseScript( source, { loc: true } )

        assert.throws(
          () => transform( program ),
          {
            message: 'Unexpected type ClassDeclaration at line 1, column 0'
          }
        )
      } )
    } )

    describe( 'predicates', () => {
      it( 'isFreezeCallExpression', () => {
        assert( !isFreezeCallExpression( { type: 'Literal', value: 10 } ) )
      } )

      it( 'isFreezeMemberExpression ', () => {
        assert( !isFreezeMemberExpression( { type: 'Literal', value: 10 } ) )
      } )
    } )

    describe( 'scope', () => {
      const scope: LocalScope = {
        type: 'global',
        consts: [],
        numbers: [ 'foo' ],
        arrays: [],
        functions: []
      }

      describe( 'existsLocal', () => {
        it( 'has number', () => {
          assert( existsLocal( scope, 'foo', 'numbers' ) )
        } )
      } )

      describe( 'existsGlobal', () => {
        it( 'has number', () => {
          assert( existsGlobal( scope, 'foo' ) )
        } )
      } )

      describe( 'exitScope', () => {
        it( 'cannot exit parent', () => {
          const options: TransformOptions = DefaultTransformOptions()

          assert.throws(
            () => exitScope( options ),
            {
              message: 'No scope to exit!'
            }
          )
        } )
      } )

      describe( 'countScopeDepthTo', () => {
        it( 'has no parent', () => {
          const depth = countScopeDepthTo( scope, 'function' )

          assert.strictEqual( depth, -1 )
        } )
      } )
    } )
  } )
} )
