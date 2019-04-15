import { Node } from 'estree'
import { whitelist } from './whitelist'

import {
  YukiNode, PreYukiLiteral, YukiLiteral, YukiConstDeclaration,
  YukiConstDeclarator, YukiConstArrayExpression, YukiCallExpressionDeclarator,
  YukiLetDeclarator, YukiLetDeclaration, YukiParam, YukiUnaryExpression,
  yukiUnaryOperators, FreezeCallExpression, FreezeMemberExpression
} from './node-types'

import { typeNames } from '../yuki-types/type-names'

export const isYukiNode =
  ( node?: Node | null ): node is YukiNode =>
    node !== undefined && node !== null && whitelist.includes( node.type )

export const isPreYukiLiteral =
  ( node?: Node | null ): node is PreYukiLiteral =>
    node !== undefined && node !== null && node.type === 'Literal' &&
    ( typeof node.value === 'number' || typeof node.value === 'boolean' )

export const isYukiLiteral =
  ( node: Node ): node is YukiLiteral =>
    node.type === 'Literal' && typeof node.value === 'number'

export const isYukiConstArrayExpression =
  ( node?: Node | null ): node is YukiConstArrayExpression =>
    node !== undefined && node !== null && node.type === 'ArrayExpression' &&
    node.elements.every( el =>
      isPreYukiLiteral( el ) || isYukiConstUnaryExpression( el )
    )

export const isYukiConstDeclarator =
  ( node: Node ): node is YukiConstDeclarator =>
    node.type === 'VariableDeclarator' && node.id.type === 'Identifier' &&
    (
      isPreYukiLiteral( node.init ) ||
      isYukiConstArrayExpression( node.init ) ||
      isYukiConstUnaryExpression( node.init )
    )

export const isYukiConstDeclaration =
  ( node: Node ): node is YukiConstDeclaration =>
    node.type === 'VariableDeclaration' && node.kind === 'const' &&
    node.declarations.length === 1 &&
    isYukiConstDeclarator( node.declarations[ 0 ] )

export const isYukiCallExpressionDeclarator =
  ( node?: Node | null ): node is YukiCallExpressionDeclarator =>
    node !== undefined && node !== null && node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    typeNames.includes( node.callee.name ) &&
    (
      node.callee.name.endsWith( 'Arr' ) ? (
        ( node.arguments.length === 1 && isYukiLiteral( node.arguments[ 0 ] ) )
      ) :
        node.arguments.length === 0 ||
        ( node.arguments.length === 1 && isYukiLiteral( node.arguments[ 0 ] ) )
    )

export const isYukiLetDeclarator =
  ( node: Node ): node is YukiLetDeclarator =>
    node.type === 'VariableDeclarator' && node.id.type === 'Identifier' &&
    isYukiCallExpressionDeclarator( node.init )

export const isYukiLetDeclaration =
  ( node: Node ): node is YukiLetDeclaration =>
    node.type === 'VariableDeclaration' && node.kind === 'let' &&
    node.declarations.length === 1 &&
    isYukiLetDeclarator( node.declarations[ 0 ] )

export const isYukiParam =
  ( node: Node ): node is YukiParam =>
    node.type === 'AssignmentPattern' && node.left.type === 'Identifier' &&
    isYukiCallExpressionDeclarator( node.right )

export const isYukiParamList =
  ( nodes: Node[] ): nodes is YukiParam[] => nodes.every( isYukiParam )

export const isYukiUnaryExpression =
  ( node?: Node | null ): node is YukiUnaryExpression =>
    node !== undefined && node !== null && node.type === 'UnaryExpression' &&
    yukiUnaryOperators.includes( node.operator )

export const isYukiConstUnaryExpression =
  ( node?: Node | null ): node is YukiUnaryExpression =>
    isYukiUnaryExpression( node ) && isPreYukiLiteral( node.argument )

export const isFreezeCallExpression =
  ( node: Node ): node is FreezeCallExpression => {
    if ( node.type !== 'CallExpression' ) return false

    const { callee } = node

    if ( callee.type === 'MemberExpression' ) {
      return isFreezeMemberExpression( callee )
    }

    return false
  }

export const isFreezeMemberExpression =
  ( node: Node ): node is FreezeMemberExpression => {
    if ( node.type !== 'MemberExpression' ) return false

    const { object, property } = node

    if ( object.type === 'Identifier' && property.type === 'Identifier' ) {
      if ( object.name === 'Object' && property.name === 'freeze' )
        return true
    }

    return false
  }
