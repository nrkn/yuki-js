import { Program } from 'estree'
import { Visitor, traverse } from 'estraverse'
import { LocError } from '../util'
import { LocalFunctionNames, FunctionNames } from './types'

export const getSubroutineNames = ( program: Program ) => {
  const functionVisitor: Visitor = {
    enter: ( node, parent ) => {
      if ( node.type !== 'FunctionDeclaration' ) return

      if ( parent && parent!.type !== 'Program' )
        throw LocError( `Functions cannot be nested in ${ parent.type }`, node )

      const name = node.id!.name

      if ( subroutineNames.has( name ) )
        throw LocError( `Duplicate function name ${ name }`, node )

      subroutineNames.add( name )
    }
  }

  const subroutineNames = new Set<string>()

  traverse( program, functionVisitor )

  const subroutines = Array.from( subroutineNames )

  return <LocalFunctionNames>{ subroutines }
}

export const getLibFunctionNames = ( program: Program ) => {
  const functionVisitor: Visitor = {
    enter: ( node, parent ) => {
      if ( node.type !== 'FunctionDeclaration' ) return

      const name = node.id!.name

      if ( functionNames.has( name ) )
        throw LocError( `Duplicate function name ${ name }`, node )

      if ( parent!.type === 'Program' && !name.startsWith( '$' ) )
        functionNames.add( name )
    }
  }

  const functionNames = new Set<string>()

  traverse( program, functionVisitor )

  return Array.from( functionNames )
}

export const getAllNames = ( functionNames: FunctionNames ) =>
  [
    ...functionNames.subroutines,
    ...functionNames.external
  ]
