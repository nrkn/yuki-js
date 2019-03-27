import { readFileSync, writeFileSync } from 'fs'
import { parseModule, parseScript } from 'esprima'
import { compile } from '..'
import { CompileOptions } from '../types'
import { generate } from 'escodegen'

const bresenhamYukiSource = readFileSync(
  './src/examples/bresenham.yuki.js', 'utf8'
)
const bresenhamYukiLib = readFileSync(
  './src/examples/bresenham.lib.js', 'utf8'
)

const program = parseModule( bresenhamYukiSource, { loc: true })
const lib = parseScript( bresenhamYukiLib )

const options: Partial<CompileOptions> = {
  lib
}

const { main } = compile( program, options )

const outputSource = generate( main )

writeFileSync( './dist/examples/bresenham.out.js', outputSource, 'utf8' )
