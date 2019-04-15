import {
  FunctionDeclaration, CallExpression, MemberExpression, VariableDeclarator,
  VariableDeclaration
} from 'estree'

import { YukiNode, YukiParam } from '../node-types'

import { TransformOptions } from '../types'
import { isYukiParamList } from '../node-predicates'
import { LocError } from '../utils'
import { declaratorToAllocate } from './variable-declaration'

export const functionDeclarationNode =
  ( node: FunctionDeclaration, _parent: YukiNode, options: TransformOptions ) => {
    const { params } = node

    if( !isYukiParamList( params ) )
      throw LocError( 'Unexpected params', node )

    const { scope } = options

    scope.functions.push( node.id!.name )

    node.params = (
      params.length ?
      [
        {
          type: 'RestElement',
          argument: {
            type: 'Identifier',
            name: '$args'
          }
        }
      ] :
      []
    )

    const lets = params.map( ( param, i ) => {
      if( param.right.callee.name.includes( 'Arr' ) ){
        return yukiArrayParamToLet( param, options, i )
      } else {
        return yukiNumberParamToLet( param, options, i )
      }
    })

    node.body.body = [
      ...lets,
      ...node.body.body
    ]

    return node
  }

const yukiNumberParamToLet =
  ( param: YukiParam, options: TransformOptions, index: number ) => {
    const { scope } = options

    scope.numbers.push( param.left.name )

    const right: CallExpression = param.right

    const expression: MemberExpression = {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: '$args'
      },
      property: {
        type: 'Literal',
        value: index
      },
      computed: true
    }

    right.arguments = [ expression ]

    const sequence = declaratorToAllocate( param.right )

    const declarator: VariableDeclarator = {
      type: 'VariableDeclarator',
      id: param.left,
      init: sequence
    }

    const declaration: VariableDeclaration = {
      type: 'VariableDeclaration',
      declarations: [ declarator ],
      kind: 'let'
    }

    return declaration
  }

const yukiArrayParamToLet =
  ( param: YukiParam, options: TransformOptions, index: number ) => {
    const { scope } = options

    scope.arrays.push( param.left.name )

    const expression: MemberExpression = {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: '$args'
      },
      property: {
        type: 'Literal',
        value: index
      },
      computed: true
    }

    const declarator: VariableDeclarator = {
      type: 'VariableDeclarator',
      id: param.left,
      init: expression
    }

    const declaration: VariableDeclaration = {
      type: 'VariableDeclaration',
      declarations: [ declarator ],
      kind: 'let'
    }

    return declaration
  }
