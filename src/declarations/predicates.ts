import { Program } from 'estree'
import { validateDeclarationsProgram } from './validate'
import { YukiDeclarationProgram } from './types'

export const isYukiDeclarations =
  ( program: Program ): program is YukiDeclarationProgram => {
    const errors = validateDeclarationsProgram( program )

    return errors.length === 0
  }
