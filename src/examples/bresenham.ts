import { readFileSync } from 'fs'
import { parseScript } from 'esprima'
import { compile } from '..'
import { CompileOptions } from '../types'
import { generate } from 'escodegen'

const bresenhamYukiSource = readFileSync(
  './src/examples/bresenham.yuki.js', 'utf8'
)
const bresenhamYukiLib = readFileSync(
  './src/examples/bresenham.lib.js', 'utf8'
)

export const bresenhamYuki = parseScript( bresenhamYukiSource, { loc: true })

const lib = parseScript( bresenhamYukiLib )

const options: Partial<CompileOptions> = {
  lib
}

const { main } = compile( bresenhamYuki, options )

export const bresenhamOut = generate( main )
