import { CompileOptions } from './types'

export const DefaultCompileOptions = (): CompileOptions => ( {
  memorySize: 1024,
  maxProgramSize: 4096,
  instructionSize: 1,
  externalLib: {
    type: 'Program',
    body: [
      {
        type: 'FunctionDeclaration',
        id: {
          type: 'Identifier',
          name: '$init'
        },
        params: [],
        body: {
          type: 'BlockStatement',
          body: []
        }
      }
    ],
    sourceType: 'script'
  },
  externalScope: {
    consts: [],
    functions: []
  },
  requiredFunctions: []
} )
