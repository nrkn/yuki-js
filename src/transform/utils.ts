import { Node } from 'estree'

export const LocError = ( message: string, node: Node ) => {
  if ( node.loc ) {
    const { start } = node.loc

    message += ` at line ${ start.line }, column ${ start.column }`
  }

  return Error( message )
}
