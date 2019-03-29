import { readFileSync, writeFileSync } from 'fs'
import { parseScript } from 'esprima'

const libScript = readFileSync( './dist/lib/index.js', 'utf8' )

const ast = parseScript( libScript )

const json = JSON.stringify( ast, null, 2 )

writeFileSync( './src/lib-ast/lib.ast.json', json, 'utf8' )
