import { readFileSync, writeFileSync } from 'fs'
import { parseModule, parseScript } from 'esprima'
import { generate } from 'escodegen'
import { compile } from '..'

const build1Bit = () => {
  console.log( '1 bit' )

  const gameYukiSource = readFileSync( './examples/1-bit/src/game.yuki.js', 'utf8' )
  const gameLibSource = readFileSync( './examples/1-bit/src/lib.js', 'utf8' )

  const yukiAst = parseModule( gameYukiSource, { loc: true } )
  const libAst = parseScript( gameLibSource )

  const { main, memoryUsed, programSize } = compile( yukiAst, { lib: libAst } )

  const source = generate( main )

  writeFileSync( './examples/1-bit/main.js', source, 'utf8' )

  console.log( { memoryUsed, programSize } )
}

const buildChannelY = () => {
  console.log( 'channel Y' )

  const gameYukiSource = readFileSync( './examples/channel-y/src/game.yuki.js', 'utf8' )
  const gameLibSource = readFileSync( './examples/channel-y/src/lib.js', 'utf8' )

  const yukiAst = parseModule( gameYukiSource, { loc: true } )
  const libAst = parseScript( gameLibSource )

  const { main, memoryUsed, programSize } = compile( yukiAst, {
    lib: libAst,
    maxProgramSize: 2048,
    memorySize: 64,
    requiredSubroutines: [ 'tick' ]
  } )

  const source = generate( main )

  writeFileSync( './examples/channel-y/main.js', source, 'utf8' )

  console.log( { memoryUsed, programSize } )
}

build1Bit()
buildChannelY()
