import { Literal, Identifier, Program, AssignmentExpression, MemberExpression, CallExpression, BaseNode, FunctionDeclaration, ReturnStatement, ExportNamedDeclaration } from 'estree'
import { LocError } from '../util'
import { YukiDeclarationHeader, YukiValue } from '../declarations/header/types'
import { Visitor, traverse } from 'estraverse'
import { LocalFunctionNames, FunctionNames } from './types';
import { getAllNames } from './util';

// first pass - whitelist validation

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
  'ExportNamedDeclaration'
]

export const ValidateMainProgram = (
  headerMap: Map<string, YukiValue>,
  functionNames: FunctionNames
) => {
  const validateNode = ValidateNode( headerMap, functionNames )

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

const ValidateNode = (
  headerMap: Map<string, YukiValue>,
  functionNames: FunctionNames
) => {
  const allNames = getAllNames( functionNames )

  const validateIdentifer = ValidateIdentifier( headerMap, allNames )
  const validateMemberExpression = ValidateMemberExpression( headerMap )

  const validators = {
    Identifier: validateIdentifer,
    MemberExpression: validateMemberExpression,
    AssignmentExpression: ValidateAssignmentExpression(
      headerMap, validateIdentifer, validateMemberExpression
    ),
    CallExpression: ValidateCallExpression( functionNames ),
    FunctionDeclaration: validateFunctionDeclaration,
    ExportNamedDeclaration: validateExportNamedDeclaration,
    ReturnStatement: validateReturnStatement,
    Literal: validateLiteral
  }

  const validateNode = ( node: BaseNode ) => {
    const errors: Error[] = []

    if( node.type in validators ){
      errors.push( ...validators[ node.type ]( node ) )
    }

    return errors
  }

  return validateNode
}

const ValidateAssignmentExpression = (
  headerMap: Map<string, YukiValue>,
  validateIdentifier: ( node: Identifier ) => Error[],
  validateMemberExpression: ( node: MemberExpression ) => Error[]
) => {
  const validateAssignmentExpression = ( node: AssignmentExpression ) => {
    const errors: Error[] = []
    const { left } = node

    if( left.type === 'Identifier' ){
      const baseErrors = validateIdentifier( left )

      if( baseErrors.length ) return baseErrors

      const target = headerMap.get( left.name )

      if ( !target ) {
        errors.push(
          LocError( `Unexpected assignment to ${ left.name }`, left )
        )

        return errors
      }

      if( target.type === 'array' ){
        errors.push( LocError( 'Unexpected assignment to array', target ) )

        return errors
      }

      if( target.valueType === 'const' ){
        errors.push( LocError( 'Unexpected assignment to const', target ) )

        return errors
      }

      return errors
    }

    if( left.type === 'MemberExpression' ){
      const baseErrors = validateMemberExpression( left )

      if ( baseErrors.length ) return baseErrors

      const identifier = <Identifier>left.object
      const target = headerMap.get( identifier.name )

      if( !target ){
        errors.push(
          LocError(
            `Unexpected assignment to ${ identifier.name }`, identifier
          )
        )

        return errors
      }

      if ( target.valueType === 'const' ) {
        errors.push( LocError( 'Unexpected assignment to const', target ) )

        return errors
      }

      return errors
    }

    errors.push( LocError( 'Expected Identifier or MemberExpression', left ) )

    return errors
  }

  return validateAssignmentExpression
}

const ValidateIdentifier = (
  headerMap: Map<string, YukiValue>, functionNames: string[]
) =>
  ( node: Identifier ) => {
    const errors: Error[] = []

    if ( headerMap.has( node.name ) ) return errors
    if ( functionNames.includes( node.name ) ) return errors

    errors.push( LocError( `Unexpected Identifier ${ node.name }`, node ) )

    return errors
  }

const ValidateMemberExpression = ( headerMap: Map<string, YukiValue> ) =>
  ( node: MemberExpression ) => {
    const errors: Error[] = []

    if ( node.object.type !== 'Identifier' ) {
      errors.push(
        LocError( `Unexpected Identifier ${ node.object }`, node )
      )

      return errors
    }

    const target = headerMap.get( node.object.name )

    if ( !target ) {
      errors.push(
        LocError( `Unexpected Identifier ${ node.object.name }`, node )
      )

      return errors
    }

    if( target.type !== 'array' ){
      errors.push(
        LocError( `Expected array target ${ node.object.name }`, node )
      )

      return errors
    }

    return errors
  }

const ValidateCallExpression = (
  functionNames: FunctionNames
) =>
  ( node: CallExpression ) => {
    const errors: Error[] = []

    if( node.callee.type !== 'Identifier' ){
      errors.push( LocError( 'Expected Identifier', node.callee ) )

      return errors
    }

    const { name } = node.callee

    if (
      functionNames.subroutines.includes( name ) ||
      functionNames.exports.includes( name )
    ){
      if( node.arguments.length ){
        errors.push( LocError( 'Unexpected arguments', node ) )

        return errors
      }

      return errors
    }

    if( functionNames.external.includes( name ) ) return errors

    errors.push( LocError( `Unexpected Identifier ${ name }`, node.callee ) )

    return errors
  }

const validateFunctionDeclaration = ( node: FunctionDeclaration ) => {
  const errors: Error[] = []

  if( !node.id ){
    errors.push( LocError( 'Expected Identifier', node ) )

    return errors
  }

  if( node.params.length ){
    errors.push( LocError( 'Unexpected params', node ) )

    return errors
  }

  return errors
}

const validateExportNamedDeclaration = ( node: ExportNamedDeclaration ) => {
  const errors: Error[] = []

  if( !node.declaration ){
    errors.push( LocError( 'Expected declaration', node ) )

    return errors
  }

  if( node.declaration.type !== 'FunctionDeclaration' ){
    errors.push( LocError( 'Unexpected Declaration', node.declaration ) )

    return errors
  }

  return errors
}

const validateReturnStatement = ( node: ReturnStatement ) => {
  const errors: Error[] = []

  if( node.argument ){
    errors.push( LocError( 'Unexpected argument', node ) )
  }

  return errors
}

const validateLiteral = ( node: Literal ) => {
  const errors: Error[] = []

  if ( typeof node.value === 'number' || typeof node.value === 'boolean' )
    return errors

  errors.push( LocError( `Unexpected Literal ${ node.value }`, node ) )

  return errors
}
