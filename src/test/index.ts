import * as assert from 'assert'
import { readFileSync } from 'fs'
import { parseScript } from 'esprima'
import { compile } from '..'
import { generate } from 'escodegen'

const kitchenSinkYuki = readFileSync( './src/test/fixtures/kitchen-sink.yuki.js', 'utf8' )
const kitchenSinkAst = parseScript( kitchenSinkYuki, { loc: true } )

const bresenhamYuki = readFileSync( './src/test/fixtures/bresenham.yuki.js', 'utf8' )
const bresenhamAst = parseScript( bresenhamYuki, { loc: true } )

describe( 'yuki-js', () => {
  it( 'compiles', () => {
    assert.doesNotThrow( () => compile( kitchenSinkAst ) )
  } )

  it( 'executes', () => {
    const expect = [
      10, 5, 11, 6, 12, 6, 13, 7, 14, 7, 15, 8, 16, 8, 17, 9, 18, 9, 19, 10, 20,
      10, 21, 11, 22, 11, 23, 12, 24, 12, 25, 13, 26, 13, 27, 14, 28, 14, 29,
      15, 30, 15, 31, 16, 32, 16, 33, 17, 34, 17, 35, 18, 36, 18, 37, 19
    ]

    const { program } = compile( bresenhamAst )
    const source = generate( program )
    const exec = Function( source + '; return line' )
    const result = exec()
    const line: number[] = []

    for ( let i = 0; i < expect.length; i++ ) {
      line[ i ] = result[ i ]
    }

    assert.deepEqual( line, expect )
    assert.strictEqual( result[ expect.length ], 0 )
  } )
} )
