import * as assert from 'assert'
import { parseScript } from 'esprima'
import { CompileOptions } from '../types'
import { compile } from '..'

describe( 'yuki-js', () => {
  describe( 'compile', () => {
    it( 'maxProgramSize', () => {
      const source = 'const x = 10'
      const program = parseScript( source )

      const opts: Partial<CompileOptions> = {
        maxProgramSize: 1
      }

      assert.doesNotThrow( () => compile( program ) )

      assert.throws(
        () => {
          compile( program, opts )
        },
        {
          message: 'Program size exceeded: 8/1'
        }
      )
    } )

    it( 'missing functions', () => {
      const pass = 'function foo(){};function bar(){}'
      const fail = 'const x = 10'
      const passProgram = parseScript( pass )
      const failProgram = parseScript( fail )

      const opts: Partial<CompileOptions> = {
        requiredFunctions: [ 'foo', 'bar' ]
      }

      assert.doesNotThrow( () => compile( passProgram, opts ) )

      assert.throws(
        () => {
          compile( failProgram, opts )
        },
        {
          message: 'Missing required functions: foo, bar'
        }
      )
    } )
  } )
} )
