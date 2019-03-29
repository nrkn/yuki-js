import { readFileSync, writeFileSync } from 'fs'
import { parseModule, parseScript } from 'esprima'
import { generate } from 'escodegen'
import { compile } from '..'

const gameYukiSource = readFileSync( './example/src/game.yuki.js', 'utf8' )
const gameLibSource = readFileSync( './example/src/lib.js', 'utf8' )

const yukiAst = parseModule( gameYukiSource, { loc: true } )
const libAst = parseScript( gameLibSource )

const { main } = compile( yukiAst, { lib: libAst } )

const source = generate( main )

writeFileSync( './example/main.js', source, 'utf8' )
