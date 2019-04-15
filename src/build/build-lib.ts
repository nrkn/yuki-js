import { readFileSync, writeFileSync } from 'fs'
import { parseScript } from 'esprima'
import { VariableDeclaration, Program } from 'estree'

const createTypeFactories = () => {
  const declarations: VariableDeclaration[] = []

  for ( let i = 2; i <= 32; i++ ) {
    const int = createTypeFactory( `Int${ i }`, 'IntFactory', i )
    const uint = createTypeFactory( `Uint${ i }`, 'UintFactory', i )
    const intArr = createTypeFactory( `Int${ i }Arr`, 'IntArrayFactory', i )
    const uintArr = createTypeFactory( `Uint${ i }Arr`, 'UintArrayFactory', i )

    declarations.push( int )
    declarations.push( uint )
    declarations.push( intArr )
    declarations.push( uintArr )
  }

  return declarations
}

const createTypeFactory = ( name: string, factoryName: string, bitLength: number ) => {
  const declaration: VariableDeclaration = {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name
        },
        init: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: factoryName
          },
          arguments: [
            {
              type: 'Literal',
              value: bitLength,
            }
          ]
        }
      }
    ],
    kind: 'const'
  }

  return declaration
}

const typeSource = readFileSync( './lib/types/index.js', 'utf8' )

const libSource = readFileSync( './lib/index.js', 'utf8' )

const typeAst = parseScript( typeSource )
const libAst = parseScript( libSource )

const ast: Program = {
  type: 'Program',
  body: [
    ...typeAst.body,
    ...createTypeFactories(),
    ...libAst.body
  ],
  sourceType: 'script'
}

const json = JSON.stringify( ast, null, 2 )

writeFileSync( './src/lib/lib.json', json, 'utf8' )
