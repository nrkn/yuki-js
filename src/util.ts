import { BaseNode } from 'estree'

export const LocError = ( message: string, node: BaseNode ) => {
  if ( node.loc ) {
    const { start } = node.loc

    message += ` at line ${ start.line }, column ${ start.column }`
  }

  return Error( message )
}

export const normalizeRangeForBitLength = ( value: number ) =>
  value < 0 ? ( value * 2 ) - 1 : value
