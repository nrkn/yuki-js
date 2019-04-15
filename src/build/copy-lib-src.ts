import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const root = './src/yuki-types'
const out = './lib-src'

const files = [ 'index.ts' ]

files.forEach( name => {
  const inPath = join( root, name )
  const outPath = join( out, name )
  // hack :/
  const contents = readFileSync( inPath, 'utf8' ).replace( /export\s/g, '' )

  writeFileSync( outPath, contents, 'utf8' )
} )
