import { Program } from 'esprima'
import { LocError } from './util';

export const splitSource = ( program: Program ) => {
  const yukiDeclarations: Program = {
    type: 'Program',
    body: [],
    sourceType: 'script'
  }

  const yukiMain: Program = {
    type: 'Program',
    body: [],
    sourceType: 'module'
  }

  let isDeclaration = true

  program.body.forEach( node => {
    isDeclaration = isDeclaration && node.type === 'VariableDeclaration'

    if( isDeclaration ){
      yukiDeclarations.body.push( node )
      return
    }

    if ( node.type === 'VariableDeclaration' )
      throw LocError( 'Unexpected VariableDeclaration', node )

    yukiMain.body.push( node )
  })

  return { yukiDeclarations, yukiMain }
}
