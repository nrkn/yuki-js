import { readFileSync } from 'fs'
import * as assert from 'assert'
import { parseModule, parseScript } from 'esprima'
import { compile } from '..'
import { CompileOptions } from '../types'
import { bresenhamYuki } from '../examples/bresenham'
import { generate } from 'escodegen'
import { splitSource } from '../split-source';

const kitchenSinkJs = readFileSync(
  './src/test/fixtures/kitchen-sink.yuki.js', 'utf8'
)

const kitchenSinkAst = parseModule( kitchenSinkJs )

describe( 'yuki-js', () => {
  it( 'compiles', () => {
    const { main } = compile( kitchenSinkAst )

    assert( main )
  } )

  it( 'executes', () => {
    const expect = [
      10, 5, 11, 6, 12, 6, 13, 7, 14, 7, 15, 8, 16, 8, 17, 9, 18, 9, 19, 10, 20,
      10, 21, 11, 22, 11, 23, 12, 24, 12, 25, 13, 26, 13, 27, 14, 28, 14, 29,
      15, 30, 15, 31, 16, 32, 16, 33, 17, 34, 17, 35, 18, 36, 18, 37, 19
    ]

    const lib = parseScript( `
      function log(){}
    `)

    const options: Partial<CompileOptions> = {
      lib
    }

    const { main } = compile( bresenhamYuki, options )
    const bresenhamOut = generate( main )
    const exec = Function( bresenhamOut + '; return $' )

    const $ = exec()

    const values: number[] = []

    for ( let i = 0; i < $.lineIndex; i++ ) {
      values.push( $.line[ i ] )
    }

    assert.deepEqual( values, expect )
  } )

  describe( 'splitSource', () => {
    it( 'Unexpected VariableDeclaration', () => {
      const ast = parseScript( `
let x = Uint8
x = 0
let y = Uint8
      `.trim(), { loc: true } )

      assert.throws(
        () => splitSource( ast ),
        {
          message: 'Unexpected VariableDeclaration at line 3, column 0'
        }
      )
    } )
  } )
} )
