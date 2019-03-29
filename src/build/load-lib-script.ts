import { readFileSync } from 'fs'
import { parseScript } from 'esprima'

const libScript = readFileSync( './dist/lib/index.js', 'utf8' )

export const libScriptAst = () => parseScript( libScript )
