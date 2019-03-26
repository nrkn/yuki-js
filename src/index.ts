import { Program } from 'estree'
import { splitSource } from './split-source'
import { validateDeclarationsProgram } from './declarations/validate'
import { isYukiDeclarations } from './declarations/predicates'
import { DeclarationHeader } from './declarations/header'
import { HeaderMap } from './util'
import { getSubroutineNames } from './main/util'
import { FunctionNames } from './main/types'
import { ValidateMainProgram } from './main/validate'
import { declarationsToAst } from './declarations/header/to-ast'
import { replaceMainProgram } from './main/replace'

export const compile = ( yukiProgram: Program ) => {
  const { yukiDeclarations, yukiMain } = splitSource( yukiProgram )

  if ( !isYukiDeclarations( yukiDeclarations ) ){
    const errors = validateDeclarationsProgram( yukiDeclarations )

    errors.forEach( console.error )

    throw Error( 'Invalid Declarations' )
  }

  const declarationHeader = DeclarationHeader( yukiDeclarations )
  const headerMap = HeaderMap( declarationHeader )

  const localSubroutineNames = getSubroutineNames( yukiMain )

  const functionNames: FunctionNames = {
    ...localSubroutineNames,
    external: [ 'size' ]
  }

  const validateMainProgram = ValidateMainProgram( headerMap, functionNames )

  const errors = validateMainProgram( yukiMain )

  if( errors.length ){
    errors.forEach( console.error )

    throw Error( 'Invalid Program' )
  }

  const header = declarationsToAst( declarationHeader )
  const main = replaceMainProgram( yukiMain, declarationHeader.lets )

  return { header, main }
}
