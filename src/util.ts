import { BaseNode } from 'estree'
import { YukiDeclarationHeader, YukiValue } from './declarations/header/types'
import { valueToBitLength } from 'bits-bytes'

export const LocError = ( message: string, node: BaseNode ) => {
  if ( node.loc ) {
    const { start } = node.loc

    message += ` at line ${ start.line }, column ${ start.column }`
  }

  return Error( message )
}

export const HeaderMap = ( header: YukiDeclarationHeader ) => {
  const headerMap = new Map<string, YukiValue>()

  header.consts.forEach( c => headerMap.set( c.name, c ) )
  header.lets.forEach( l => headerMap.set( l.name, l ) )

  return headerMap
}

export const normalizeRangeForBitLength = ( value: number ) =>
  value < 0 ? ( value * 2 ) - 1 : value