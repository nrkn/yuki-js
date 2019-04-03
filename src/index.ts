import { Program } from 'estree'
import { getSubroutineNames, getLibFunctionNames } from './main/util'
import { FunctionNames } from './main/types'
import { ValidateMainProgram } from './main/validate'
import { replaceMainProgram } from './main/replace'
import { CompileOptions } from './types'
import { buildLib } from './build-lib'
import { countProgramSize } from './count'
import { valueToBitLength, bitLengthToBytes } from 'bits-bytes'
import * as libScript from './lib-ast/lib.ast.json'

export const compile = ( yukiProgram: Program, opts: Partial<CompileOptions> = {} ) => {
  const options: CompileOptions = Object.assign(
    {}, defaultCompileOptions, opts
  )

  const {
    memorySize, maxProgramSize, instructionSize, lib, requiredSubroutines
  } = options

  const localSubroutineNames = getSubroutineNames( yukiProgram )

  const missingSubroutines = requiredSubroutines.filter( name =>
    !localSubroutineNames.subroutines.includes( name )
  )

  if ( missingSubroutines.length )
    throw Error(
      `Missing required subroutines: ${ missingSubroutines.join( ', ' ) }`
    )

  const libFunctionNames = getLibFunctionNames( lib )

  const functionNames: FunctionNames = {
    ...localSubroutineNames,
    external: [ 'size', ...libFunctionNames ]
  }

  const validateMainProgram = ValidateMainProgram( functionNames )

  const errors = validateMainProgram( yukiProgram )

  if ( errors.length ) {
    throw errors[ 0 ]
  }

  const addressSize = bitLengthToBytes( valueToBitLength( maxProgramSize ) )

  const libScriptAst: Program = JSON.parse( JSON.stringify( libScript ) )

  const libAst = buildLib( libScriptAst )

  const main = replaceMainProgram( yukiProgram, memorySize, addressSize )

  const programSize = countProgramSize( main, instructionSize )

  if ( programSize > maxProgramSize )
    throw Error( `Program size exceeded: ${ programSize }/${ maxProgramSize }` )

  main.body = [
    ...libAst,
    ...lib.body,
    ...main.body
  ]

  return { main, programSize }
}

export const defaultCompileOptions: CompileOptions = {
  memorySize: 1024,
  maxProgramSize: 1024,
  instructionSize: 1,
  lib: {
    type: 'Program',
    body: [],
    sourceType: 'script'
  },
  requiredSubroutines: []
}
