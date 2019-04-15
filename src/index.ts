import { Program, ExpressionStatement } from 'estree'
import { CompileOptions } from './types'
import { DefaultCompileOptions } from './default-options'
import { DefaultTransformOptions } from './transform/default-options'
import { transform } from './transform'
import * as libObj from './lib/lib.json'
import { bitLengthToBytes, valueToBitLength } from 'bits-bytes'
import { transformLib } from './transform/transform-lib'
import { countProgramSize } from './count'

export const compile =
  ( yukiProgram: Program, opts: Partial<CompileOptions> = {} ) => {
    const options: CompileOptions = Object.assign(
      {}, DefaultCompileOptions(), opts
    )

    const {
      memorySize, maxProgramSize, instructionSize, externalLib, externalScope,
      requiredFunctions
    } = options

    const programSize = countProgramSize( yukiProgram, instructionSize )

    if ( programSize > maxProgramSize )
      throw Error(
        `Program size exceeded: ${ programSize }/${ maxProgramSize }`
      )

    const transformOptions = DefaultTransformOptions()

    transformOptions.external.consts.push( ...externalScope.consts )
    transformOptions.external.functions.push( ...externalScope.functions )

    const program = transform( yukiProgram, transformOptions )

    const programFunctions = transformOptions.scope.functions

    const missingFunctions = requiredFunctions.filter( name =>
      !programFunctions.includes( name )
    )

    if ( missingFunctions.length )
      throw Error(
        `Missing required functions: ${ missingFunctions.join( ', ' ) }`
      )

    const addressSize = bitLengthToBytes( valueToBitLength( maxProgramSize ) )

    let lib = JSON.parse( JSON.stringify( libObj ) ) as Program

    lib = transformLib( lib, memorySize, addressSize )

    const initCall: ExpressionStatement = {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: '$init'
        },
        arguments: []
      }
    }

    program.body = [
      ...lib.body,
      ...externalLib.body,
      ...program.body,
      initCall
    ]

    return { program, programSize }
  }
