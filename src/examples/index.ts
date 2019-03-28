import { writeFileSync } from 'fs'
import { bresenhamOut } from './bresenham'

writeFileSync( './dist/examples/bresenham.out.js', bresenhamOut, 'utf8' )
