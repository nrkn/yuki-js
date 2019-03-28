import { Program } from 'estree'
import { Visitor, traverse } from 'estraverse'
import { LocError } from '../util'
import { LocalFunctionNames, FunctionNames } from './types'

export const getSubroutineNames = ( program: Program ) => {
  const functionVisitor: Visitor = {
    enter: ( node, parent ) => {
      if ( node.type !== 'FunctionDeclaration' ) return

      if ( parent && !allowedFunctionParents.includes( parent.type ) )
        throw LocError( `Functions cannot be nested in ${ parent.type }`, node )

      const name = node.id!.name

      if ( subroutineNames.has( name ) || exportNames.has( name ) )
        throw LocError( `Duplicate function name ${ name }`, node )

      if( parent!.type === 'Program' )
        subroutineNames.add( name )

      if( parent!.type === 'ExportNamedDeclaration' )
        exportNames.add( name )
    }
  }

  const subroutineNames = new Set<string>()
  const exportNames = new Set<string>()

  traverse( program, functionVisitor )

  const subroutines = Array.from( subroutineNames )
  const exports = Array.from( exportNames )

  return <LocalFunctionNames>{ subroutines, exports }
}

export const getLibFunctionNames = ( program: Program ) => {
  const functionVisitor: Visitor = {
    enter: ( node, parent ) => {
      if ( node.type !== 'FunctionDeclaration' ) return

      const name = node.id!.name

      if ( functionNames.has( name ) )
        throw LocError( `Duplicate function name ${ name }`, node )

      if ( parent!.type === 'Program' )
        functionNames.add( name )
    }
  }

  const functionNames = new Set<string>()

  traverse( program, functionVisitor )

  return Array.from( functionNames )
}

const allowedFunctionParents = [
  'Program', 'ExportNamedDeclaration'
]

export const getAllNames = ( functionNames: FunctionNames ) =>
  [
    ...functionNames.subroutines,
    ...functionNames.exports,
    ...functionNames.external
  ]
