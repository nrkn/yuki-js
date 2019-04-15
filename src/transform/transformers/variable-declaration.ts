import {
  VariableDeclaration, VariableDeclarator, CallExpression, ArrayExpression,
  Expression
} from 'estree'

import {
  YukiNode, YukiLetDeclarator, YukiCallExpressionDeclarator,
  FreezeMemberExpression, FreezeCallExpression
} from '../node-types'

import { TransformOptions } from '../types'
import { LocError } from '../utils'

import {
  isYukiConstDeclaration, isYukiLetDeclaration, isYukiConstDeclarator,
  isFreezeCallExpression
} from '../node-predicates'

import { existsExternal, existsLocal, countScopeDepthTo } from '../scope'

export const variableDeclarationNode =
  ( node: VariableDeclaration, parent: YukiNode, options: TransformOptions ) => {
    if ( node.kind === 'const' )
      return constNode( node, parent, options )

    if ( node.kind === 'let' )
      return letNode( node, parent, options )

    throw LocError( 'Expected const or let', node )
  }


export const letDeclaratorNode =
  ( node: VariableDeclarator, parent: VariableDeclaration, options: TransformOptions ) => {
    if ( !isYukiLetDeclaration( parent ) ) return

    const yukiLetDeclarator = node as YukiLetDeclarator

    const { init, id } = yukiLetDeclarator
    const { external, scope } = options

    if (
      existsExternal( external, id.name ) ||
      existsLocal( scope, id.name )
    ) throw LocError( `Cannot redefine ${ id.name }`, node )


    const { name } = init.callee

    if ( name.includes( 'Arr' ) ) {
      scope.arrays.push( id.name )
    } else {
      scope.numbers.push( id.name )
    }

    const sequence = declaratorToAllocate( init )

    node.init = sequence

    return node
  }

export const arrayExpressionNode =
  ( node: ArrayExpression, parent: YukiNode ) => {
    if ( !isYukiConstDeclarator( parent ) ){
      if( isFreezeCallExpression( parent ) ) return

      throw LocError( 'Unexpected ArrayExpression', node )
    }

    return freezeNode( node )
  }

export const freezeNode = ( node: Expression ) => {
  const freeze: FreezeMemberExpression = {
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: 'Object'
    },
    property: {
      type: 'Identifier',
      name: 'freeze'
    },
    computed: false
  }

  const callFreeze: FreezeCallExpression = {
    type: 'CallExpression',
    callee: freeze,
    arguments: [
      node
    ]
  }

  return callFreeze
}

export const declaratorToAllocate =
  ( init: YukiCallExpressionDeclarator ) => {
    const allocateCall: CallExpression = {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: '$allocate'
      },
      arguments: [ init ]
    }

    return allocateCall
  }

export const constNode =
  ( node: VariableDeclaration, _parent: YukiNode, options: TransformOptions ) => {
    if ( !isYukiConstDeclaration( node ) )
      throw LocError( 'Invalid const', node )

    const { external, scope } = options
    const [ declarator ] = node.declarations
    const { name } = declarator.id

    if (
      existsExternal( external, name ) ||
      existsLocal( scope, name )
    ) throw LocError( `Cannot redefine ${ name }`, node )

    scope.consts.push( name )
  }

export const letNode =
  ( node: VariableDeclaration, _parent: YukiNode, options: TransformOptions ) => {
    if ( !isYukiLetDeclaration( node ) ){
      const fnDepth = countScopeDepthTo( options.scope, 'function' )

      if( fnDepth === 0 ){
        const [ declarator ] = node.declarations
        const { init } = declarator

        if (
          init &&
          init.type === 'CallExpression' &&
          init.callee.type === 'Identifier' &&
          init.callee.name === '$allocate'
        ) return

        if(
          init && init.type === 'MemberExpression' &&
          init.object.type === 'Identifier' && init.object.name === '$args'
        ) return
      }

      throw LocError( 'Invalid let', node )
    }
  }
