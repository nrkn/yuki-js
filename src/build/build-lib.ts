import { readFileSync } from 'fs'
import { parseScript } from 'esprima'

const libScript = readFileSync( './dist/lib/index.js', 'utf8' )

export const buildLib = ( maxSize: number, addressSize: number ) => {
  const callStackAst = parseScript(`
    const { $in, $out } = CallStack( ${ maxSize }, ${ addressSize } )
  `)

  const libAst = parseScript( libScript )
  const [ useStrict, , ...rest ] = libAst.body

  libAst.body = [
    useStrict,
    ...rest,
    ...callStackAst.body
  ]

  return libAst.body
}
