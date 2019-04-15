import { Program } from 'estree'
import { replace } from 'estraverse'

export const transformLib =
  ( lib: Program, memorySize: number, addressSize: number ) => {
    return replace( lib, {
      enter: node => {
        if ( node.type === 'VariableDeclaration' && node.kind === 'const' ) {
          if ( node.declarations.length === 1 ) {
            const [ declarator ] = node.declarations

            if ( declarator.id.type === 'Identifier' ) {
              if ( declarator.id.name === '$maxMemory' ) {
                declarator.init = {
                  type: 'Literal',
                  value: memorySize
                }

                return node
              }

              if ( declarator.id.name === '$addressSize' ) {
                declarator.init = {
                  type: 'Literal',
                  value: addressSize * 8
                }

                return node
              }
            }
          }
        }
      }
    } ) as Program
  }
