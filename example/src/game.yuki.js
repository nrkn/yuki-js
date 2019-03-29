let x = Uint8
let y = Uint8

let pX = Uint7
let pY = Uint7

pX = 64
pY = 64

function tick() {
  for ( y = 0; y < 128; y++ ) {
    for ( x = 0; x < 128; x++ ) {
      if (
        x === 0 || y === 0 || x === 127 || y === 127 ||
        ( x === pX && y === pY )
      ) {
        setPixel( x, y, 1 )
      } else {
        setPixel( x, y, 0 )
      }
    }
  }

  if ( up() && pY > 1 ) pY--
  if ( down() && pY < 126 ) pY++
  if ( left() && pX > 1 ) pX--
  if ( right() && pX < 126 ) pX++
}
