import { readFileSync } from 'fs'
import { parseScript } from 'esprima'

const libScript = readFileSync( './dist/lib/index.js', 'utf8' )

const createCallStackScript = ( maxSize: number, addressSize = 2 ) => `
const { $in, $out } = CallStack( ${ maxSize }, ${ addressSize } )
`

export const buildLib = ( maxSize: number, addressSize = 2 ) => {
  const callStackAst = parseScript(
    createCallStackScript( maxSize, addressSize )
  )
  const libAst = parseScript( libScript )

  const [ useStrict, , ...rest ] = libAst.body

  libAst.body = [
    useStrict,
    ...rest,
    ...callStackAst.body
  ]

  return libAst.body
}
