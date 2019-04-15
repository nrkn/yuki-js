import { readFileSync, writeFileSync } from 'fs'
import { parseScript } from 'esprima'
import { generate } from 'escodegen'
import { compile } from '..'
import { ExternalScope } from '../transform/types'

const build1Bit = () => {
  console.log( '1 bit' )

  const gameYukiSource = readFileSync(
    './examples/1-bit/src/game.yuki.js', 'utf8'
  )
  const gameLibSource = readFileSync( './examples/1-bit/src/lib.js', 'utf8' )

  const yukiAst = parseScript( gameYukiSource, { loc: true } )

  const externalLib = parseScript( gameLibSource )

  const externalScope: ExternalScope = {
    consts: [],
    functions: [ 'up', 'down', 'left', 'right', 'setPixel' ]
  }

  const requiredFunctions = [ 'tick' ]

  const { program, programSize } = compile(
    yukiAst, { externalLib, externalScope, requiredFunctions }
  )

  const source = generate( program )

  writeFileSync( './examples/1-bit/main.js', source, 'utf8' )

  console.log( { programSize } )
}

const buildChannelY = () => {
  console.log( 'channel Y' )

  const gameYukiSource = readFileSync(
    './examples/channel-y/src/game.yuki.js', 'utf8'
  )
  const gameLibSource = readFileSync(
    './examples/channel-y/src/lib.js', 'utf8'
  )

  const yukiAst = parseScript( gameYukiSource, { loc: true } )
  const externalLib = parseScript( gameLibSource )

  const externalScope: ExternalScope = {
    consts: [],
    functions: [
      'up1', 'down1', 'left1', 'right1', 'up2', 'down2', 'left2', 'right2',
      'setPixel', 'setBackground', 'rnd'
    ]
  }

  const { program, programSize } = compile( yukiAst, {
    externalLib,
    externalScope,
    maxProgramSize: 2048,
    memorySize: 64,
    requiredFunctions: [ 'tick' ]
  } )

  const source = generate( program )

  writeFileSync( './examples/channel-y/main.js', source, 'utf8' )

  console.log( { programSize } )
}

build1Bit()
buildChannelY()
