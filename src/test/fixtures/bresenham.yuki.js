let x0 = Int16( 10 )
let y0 = Int16( 5 )
let x1 = Int16( 37 )
let y1 = Int16( 19 )

let dX = Int16()
let dY = Int16()
let sX = Int16()
let sY = Int16()
let err = Int16()
let err2 = Int16()

let line = Int16Arr( 100 )
let lineIndex = Uint8( 2 )
let i = Int16()

function abs( absValue = Int16() ) {
  return absValue < 0 ? absValue * -1 : absValue
}

line[ 0 ] = x0
line[ 1 ] = y0

dX = abs( x1 - x0 )
dY = abs( y1 - y0 )

sX = x0 < x1 ? 1 : -1
sY = y0 < y1 ? 1 : -1

err = dX - dY

while ( x0 !== x1 || y0 !== y1 ) {
  err2 = 2 * err

  if ( err2 > dY * -1 ) {
    err -= dY
    x0 += sX
  }

  if ( err2 < dX ) {
    err += dX
    y0 += sY
  }

  line[ lineIndex ] = x0
  line[ lineIndex + 1 ] = y0

  lineIndex += 2
}
