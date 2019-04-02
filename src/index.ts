import { Program } from 'estree'
import { splitSource } from './split-source'
import { validateDeclarationsProgram } from './declarations/validate'
import { isYukiDeclarations } from './declarations/predicates'
import { DeclarationHeader } from './declarations/header'
import { HeaderMap } from './util'
import { getSubroutineNames, getLibFunctionNames } from './main/util'
import { FunctionNames } from './main/types'
import { ValidateMainProgram } from './main/validate'
import { declarationsToAst } from './declarations/header/to-ast'
import { replaceMainProgram } from './main/replace'
import { CompileOptions } from './types'
import { buildLib } from './build-lib'
import { countMemory, countProgramSize, countConsts } from './count'
import { valueToBitLength, bitLengthToBytes } from 'bits-bytes'
import * as libScript from './lib-ast/lib.ast.json'

export const compile = ( yukiProgram: Program, opts: Partial<CompileOptions> = {} ) => {
  const options: CompileOptions = Object.assign(
    {}, defaultCompileOptions, opts
  )

  const {
    memorySize, maxProgramSize, instructionSize, lib, requiredSubroutines
  } = options

  const { yukiDeclarations, yukiMain } = splitSource( yukiProgram )

  if ( !isYukiDeclarations( yukiDeclarations ) ) {
    const errors = validateDeclarationsProgram( yukiDeclarations )

    throw errors[ 0 ]
  }

  const declarationHeader = DeclarationHeader( yukiDeclarations )
  const headerMap = HeaderMap( declarationHeader )

  const localSubroutineNames = getSubroutineNames( yukiMain )

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

  const validateMainProgram = ValidateMainProgram( headerMap, functionNames )

  const errors = validateMainProgram( yukiMain )

  if ( errors.length ) {
    throw errors[ 0 ]
  }

  const addressSize = bitLengthToBytes( valueToBitLength( maxProgramSize ) )
  const memoryUsed = bitLengthToBytes( countMemory( declarationHeader.lets ) )

  if ( memoryUsed > memorySize )
    throw Error( `Memory allocation exceeded: ${ memoryUsed }/${ memorySize }` )

  const libScriptAst: Program = JSON.parse( JSON.stringify( libScript ) )

  const callstackMax = memorySize - memoryUsed

  const libAst = buildLib( libScriptAst, callstackMax, addressSize )

  const header = declarationsToAst( declarationHeader )
  const main = replaceMainProgram( yukiMain, declarationHeader.lets )

  const instructionsSize = countProgramSize( main, instructionSize )
  const constsSize = bitLengthToBytes( countConsts( declarationHeader.consts ) )
  const programSize = instructionsSize + constsSize

  if ( programSize > maxProgramSize )
    throw Error( `Program size exceeded: ${ programSize }/${ maxProgramSize }` )

  main.body = [
    ...libAst,
    ...header.body,
    ...lib.body,
    ...main.body
  ]

  return { main, memoryUsed, programSize }
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
