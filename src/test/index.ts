import { readFileSync } from 'fs'
import * as assert from 'assert'
import { parseModule } from 'esprima'
import { compile } from '..'

const kitchenSinkJs = readFileSync(
  './src/test/fixtures/kitchen-sink.yuki.js', 'utf8'
)

const kitchenSinkAst = parseModule( kitchenSinkJs )

describe( 'yuki-js', () => {
  it( 'compiles', () => {
    const { header, main } = compile( kitchenSinkAst )

    assert( header )
    assert( main )
  })
})
