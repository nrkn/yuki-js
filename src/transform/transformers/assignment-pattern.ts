import { AssignmentPattern } from 'estree'
import { LocError } from '../utils'

export const assignmentPatternNode =
  ( node: AssignmentPattern ) => {
    throw LocError( 'Unexpected type AssignmentPattern', node )
  }
