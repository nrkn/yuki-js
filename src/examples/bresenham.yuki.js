let x0 = Int16
let y0 = Int16
let x1 = Int16
let y1 = Int16

let dX = Int16
let dY = Int16
let sX = Int16
let sY = Int16
let err = Int16
let err2 = Int16

let line = Int16( 100 )
let lineIndex = Uint8

let absValue = Int16

function abs() {
  if ( absValue < 0 ) absValue *= -1
}

x0 = 10
y0 = 5
x1 = 37
y1 = 19

line[ 0 ] = x0
line[ 1 ] = y0
lineIndex = 2

absValue = x1 - x0
abs()
dX = absValue

absValue = y1 - y0
abs()
dY = absValue

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

log( line )