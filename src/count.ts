import { Program, Literal } from 'estree'
import { Visitor, traverse, VisitorOption } from 'estraverse'
import { valueToBitLength } from 'bits-bytes'

export const countProgramSize = ( ast: Program, instructionSize: number ) => {
  let count = 0

  const visitor: Visitor = {
    enter: ( node, parent ) => {
      if ( node.type === 'ArrayExpression' ) {
        let max = 0

        node.elements.forEach( el => {
          let value = 0

          if ( el.type === 'Literal' ) {
            if ( typeof el.value === 'boolean' )
              value = 1

            if ( typeof el.value === 'number' )
              value = valueToBitLength( el.value )
          }

          if ( el.type === 'UnaryExpression' && el.operator === '-' ) {
            const argument = el.argument as Literal

            value = maxForNegative( Number( argument.value ) )
          }

          if ( value > max ) max = value
        } )

        count += max * node.elements.length

        return VisitorOption.Skip
      }

      if ( node.type === 'Literal' && typeof node.value === 'number' ) {
        let value = node.value

        if (
          parent &&
          parent.type === 'UnaryExpression' &&
          parent.operator === '-'
        ) {
          value = maxForNegative( value )
        }

        count += valueToBitLength( value )
      } else {
        count += instructionSize
      }
    }
  }

  traverse( ast, visitor )

  return count
}

export const maxForNegative = ( value: number ) => value * 2 - 1
