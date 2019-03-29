import * as assert from 'assert'
import { parseScript } from 'esprima'
import { compile } from '..'

describe( 'yuki-js', () => {
  describe( 'compile', () => {
    it( 'Invalid Declarations', () => {
      const program = parseScript( 'var x = Int8', { loc: true } )

      assert.throws(
        () => compile( program ),
        {
          message: 'Unexpected var at line 1, column 0'
        }
      )
    } )

    it( 'Missing required subroutines', () => {
      const program = parseScript( '' )

      assert.throws(
        () => {
          compile( program, { requiredSubroutines: [ 'tick' ] } )
        },
        {
          message: 'Missing required subroutines: tick'
        }
      )
    } )

    it( 'Invalid Main', () => {
      const program = parseScript( '""', { loc: true } )

      assert.throws(
        () => compile( program ),
        {
          message: 'Unexpected type string at line 1, column 0'
        }
      )
    })

    it( 'Memory allocation exceeded', () => {
      const program = parseScript( 'let x = Uint16' )

      assert.throws(
        () => compile( program, { memorySize: 1 } ),
        {
          message: 'Memory allocation exceeded: 2/1'
        }
      )
    })

    it( 'Program size exceeded', () => {
      const program = parseScript( 'let x = Uint16; x = 0' )

      assert.throws(
        () => compile( program, { maxProgramSize: 1 } ),
        {
          message: 'Program size exceeded: 7/1'
        }
      )
    })
  } )
} )
