import { Program } from 'esprima'

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
      throw Error( 'Unexpected VariableDeclaration' )

    yukiMain.body.push( node )
  })

  return { yukiDeclarations, yukiMain }
}
