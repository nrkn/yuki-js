import {
  ExternalScope, ExternalScopeKey, LocalScope, LocalScopeKey, TransformOptions,
  ScopeType
} from './types'

export const existsExternal =
  ( scope: ExternalScope, name: string, key: ExternalScopeKey = 'any' ) => {
    const names: string[] =
      key === 'any' ?
        [ ...scope.consts, ...scope.functions ] :
        scope[ key ]

    if ( names.includes( name ) ) return true

    return false
  }

export const existsLocal =
  ( scope: LocalScope, name: string, key: LocalScopeKey = 'any' ) => {
    const names: string[] =
      key === 'any' ?
        [
          ...scope.consts, ...scope.functions, ...scope.numbers, ...scope.arrays
        ] :
        scope[ key ]

    if ( names.includes( name ) ) return true

    return false
  }

export const existsGlobal =
  ( scope: LocalScope, name: string, key: LocalScopeKey = 'any' ) => {
    const names: string[] =
      key === 'any' ?
        [
          ...scope.consts, ...scope.functions, ...scope.numbers, ...scope.arrays
        ] :
        scope[ key ]
    if ( names.includes( name ) ) return true

    if ( scope.parent ) return existsGlobal( scope.parent, name, key )

    return false
  }

export const enterScope = ( options: TransformOptions, type: ScopeType ) => {
  const { scope } = options

  const newScope: LocalScope = {
    type,
    consts: [],
    functions: [],
    numbers: [],
    arrays: [],
    parent: scope
  }

  options.scope = newScope
}

export const exitScope = ( options: TransformOptions ) => {
  const { parent } = options.scope

  if ( parent === undefined )
    throw Error( 'No scope to exit!' )

  options.scope = parent
}

export const countScopeDepthTo = ( scope: LocalScope, type: ScopeType ) => {
  let depth = 0

  if ( scope.type === type ) return depth

  let { parent } = scope
  depth = 1

  while ( parent ) {
    if ( parent.type === type ) return depth

    parent = parent.parent
    depth++
  }

  return -1
}
