import {
  Literal, Identifier, Program, AssignmentExpression, MemberExpression,
  CallExpression, BaseNode, FunctionDeclaration, ReturnStatement, VariableDeclarator, VariableDeclaration, UnaryExpression
} from 'estree'

import { LocError } from '../util'
import { YukiValue } from '../declarations/value-types'
import { Visitor, traverse } from 'estraverse'
import { FunctionNames } from './types'
import { getAllNames } from './util'
import { numberTypes } from '../number-types';

const whitelist = [
  'Program',
  'ExpressionStatement',
  'AssignmentExpression',
  'Identifier',
  'MemberExpression',
  'Literal',
  'CallExpression',
  'UpdateExpression',
  'BinaryExpression',
  'LogicalExpression',
  'SequenceExpression',
  'UnaryExpression',
  'ConditionalExpression',
  'ForStatement',
  'BlockStatement',
  'WhileStatement',
  'IfStatement',
  'BreakStatement',
  'ContinueStatement',
  'DoWhileStatement',
  'FunctionDeclaration',
  'ReturnStatement',
  'VariableDecloration',
  'VariableDeclarator'
]

export const ValidateMainProgram = (
  functionNames: FunctionNames
) => {
  const validateNode = ValidateNode( functionNames )

  const validateMainProgram = ( program: Program, errors: Error[] = [] ) => {
    const validationVisitor: Visitor = {
      enter: node => {
        errors.push( ...validateNode( node ) )
      }
    }

    traverse( program, validationVisitor )

    return errors
  }

  return validateMainProgram
}

export const ValidateNode = (
  functionNames: FunctionNames
) => {
  const validators = {
    MemberExpression: validateMemberExpression,
    AssignmentExpression: ValidateAssignmentExpression(
      validateMemberExpression
    ),
    CallExpression: ValidateCallExpression( functionNames ),
    FunctionDeclaration: ValidateFunctionDeclaration( functionNames.external ),
    ReturnStatement: validateReturnStatement,
    Literal: validateLiteral
  }

  const validateNode = ( node: BaseNode ) => {
    const errors: Error[] = []

    if ( node.type in validators ) {
      errors.push( ...validators[ node.type ]( node ) )
    } else if ( !whitelist.includes( node.type ) ) {
      errors.push( LocError( `Unexpected type ${ node.type }`, node ) )
    }

    return errors
  }

  return validateNode
}


export const ValidateIdentifier = (
  functionNames: string[]
) =>
  ( node: Identifier ) => {
    const errors: Error[] = []

    if ( functionNames.includes( node.name ) ) return errors

    errors.push( LocError( `Unexpected Identifier ${ node.name }`, node ) )

    return errors
  }

export const validateMemberExpression =
  ( node: MemberExpression ) => {
    const errors: Error[] = []

    if ( node.object.type !== 'Identifier' ) {
      errors.push(
        LocError( `Unexpected type ${ node.object.type }`, node )
      )

      return errors
    }

    return errors
  }

export const ValidateAssignmentExpression = (
  validateMemberExpression: ( node: MemberExpression ) => Error[]
) => {
  const validateAssignmentExpression = ( node: AssignmentExpression ) => {
    const errors: Error[] = []
    const { left } = node

    if ( left.type === 'Identifier' ) {
      return errors
    }

    if ( left.type === 'MemberExpression' ) {
      const baseErrors = validateMemberExpression( left )

      if ( baseErrors.length ) return baseErrors

      return errors
    }

    errors.push( LocError( 'Expected Identifier or MemberExpression', left ) )

    return errors
  }

  return validateAssignmentExpression
}

export const ValidateCallExpression = (
  functionNames: FunctionNames
) =>
  ( node: CallExpression ) => {
    const errors: Error[] = []

    if ( node.callee.type !== 'Identifier' ) {
      errors.push( LocError( 'Expected Identifier', node.callee ) )

      return errors
    }

    const { name } = node.callee

    if (
      functionNames.subroutines.includes( name )
    ) {
      if ( node.arguments.length ) {
        errors.push( LocError( 'Unexpected arguments', node ) )

        return errors
      }

      return errors
    }

    if ( functionNames.external.includes( name ) ) return errors

    errors.push( LocError( `Unexpected Identifier ${ name }`, node.callee ) )

    return errors
  }

export const ValidateFunctionDeclaration = ( externals: string[] ) =>
  ( node: FunctionDeclaration ) => {
    const errors: Error[] = []

    if ( node.id!.name.startsWith( '$' ) ) {
      errors.push( LocError( 'Function names cannot start with $', node ) )

      return errors
    }

    if ( externals.includes( node.id!.name ) ) {
      errors.push( LocError(
        `Cannot redefine external function ${ node.id!.name }`, node
      ) )

      return errors
    }

    if ( node.params.length ) {
      errors.push( LocError( 'Unexpected params', node ) )

      return errors
    }

    return errors
  }

export const validateReturnStatement = ( node: ReturnStatement ) => {
  const errors: Error[] = []

  if ( node.argument ) {
    errors.push( LocError( 'Unexpected argument', node ) )
  }

  return errors
}

export const validateVariableDeclaration =
  ( declaration: VariableDeclaration, errors: Error[] = [] ) => {
    if ( declaration.kind === 'var' ) {
      errors.push( LocError( 'Unexpected var', declaration ) )

      return errors
    }

    if ( declaration.declarations.length !== 1 ) {
      errors.push( LocError( 'Expected a single declaration', declaration ) )

      return errors
    }

    const declarator = declaration.declarations[ 0 ]

    const { id, init } = declarator

    if ( init === null ) {
      errors.push( LocError( 'Expected init', declarator ) )

      return errors
    }

    if ( id.type !== 'Identifier' ) {
      errors.push( LocError( 'Expected Identifier', declarator ) )

      return errors
    }

    if ( id.name.startsWith( '$' ) ) {
      errors.push(
        LocError( 'Identifier names cannot start with $', declarator )
      )

      return errors
    }

    if ( declaration.kind === 'const' ) {
      errors.push( ...validateConst( declarator, errors ) )

      return errors
    }

    errors.push( ...validateLet( declarator, errors ) )

    return errors
  }

export const validateLiteral = ( literal: Literal, parent: BaseNode, errors: Error[] ) => {
  const literalType = typeof literal.value

  if ( literalType === 'number' || literalType === 'boolean' )
    return errors

  errors.push( LocError( `Unexpected type ${ literalType }`, parent ) )

  return errors
}

export const validateUnaryExpression = ( unary: UnaryExpression, parent: BaseNode, errors: Error[] ) => {
  if ( unary.operator !== '-' ) {
    errors.push( LocError(
      'Expected UnaryExpression operator to be -', unary
    ) )

    return errors
  }

  const { argument } = unary

  if ( argument.type === 'Literal' ) {
    errors.push( ...validateLiteral( argument, parent, errors ) )

    return errors
  }

  errors.push( LocError(
    'Expected UnaryExpression argument to be Literal', unary
  ) )

  return errors
}

export const validateConst =
  ( declarator: VariableDeclarator, errors: Error[] = [] ) => {
    const init = declarator.init!

    if ( init.type === 'Literal' ) {
      errors.push( ...validateLiteral( init, declarator, errors ) )

      return errors
    }

    if ( init.type === 'UnaryExpression' ) {
      errors.push( ...validateUnaryExpression( init, declarator, errors ) )

      return errors
    }

    if ( init.type === 'ArrayExpression' ) {
      const { elements } = init
      if ( elements.length < 1 ) {
        errors.push( LocError(
          'Unexpected empty ArrayExpression', declarator
        ) )

        return errors
      }

      let firstType = 'undefined'

      elements.forEach( ( node, i ) => {
        if ( node.type === 'Literal' ) {
          if ( i === 0 ) firstType = typeof node.value

          if ( typeof node.value !== firstType ) {
            errors.push( LocError(
              `Expected ArrayExpression[${ i }] to be ${ firstType }`,
              node
            ) )
            return
          }

          if ( typeof node.value === 'boolean' ) return
          if ( typeof node.value === 'number' ) return

          errors.push( LocError(
            `Unexpected ${ typeof node.value } in ArrayExpression[${ i }]`,
            node
          ) )

          return
        }

        if ( node.type === 'UnaryExpression' ) {
          errors.push( ...validateUnaryExpression( node, node, errors ) )

          return
        }

        errors.push( LocError(
          `Expected ArrayExpression[${ i }] to be Literal or UnaryExpression`,
          node
        ) )
      } )

      return errors
    }

    errors.push( LocError( `Unexpected type ${ init.type }`, declarator ) )

    return errors
  }

export const validateLet =
  ( declarator: VariableDeclarator, errors: Error[] = [] ) => {
    const init = declarator.init!

    if ( init.type === 'Identifier' ) {
      if ( numberTypes.includes( init.name ) ) return errors

      errors.push( LocError(
        `Unexpected init name ${ init.name }`, declarator
      ) )

      return errors
    }

    if ( init.type === 'CallExpression' ) {
      if ( init.callee.type === 'Identifier' ) {
        if ( numberTypes.includes( init.callee.name ) ) {
          if ( init.arguments.length !== 1 ) {
            errors.push( LocError( `Expected single argument`, declarator ) )

            return errors
          }

          const argument = init.arguments[ 0 ]

          if ( argument.type === 'Literal' ) {
            if ( typeof argument.value === 'number' ) return errors

            errors.push( LocError(
              `Unexpected argument ${ typeof argument.value }`, argument
            ) )

            return errors
          }

          errors.push( LocError(
            `Unexpected argument type ${ argument.type }`, argument
          ) )

          return errors
        }

        errors.push( LocError(
          `Unexpected callee name ${ init.callee.name }`, init.callee
        ) )

        return errors
      }

      errors.push( LocError(
        `Unexpected callee type ${ init.callee.type }`, init.callee
      ) )

      return errors
    }

    errors.push( LocError( `Unexpected init type ${ init.type }`, init ) )

    return errors
  }
