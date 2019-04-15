const xMax = 127
const yMax = 127

let x = Uint7()
let y = Uint7()

let pX = Uint7( 64 )
let pY = Uint7( 64 )

function tick() {
  for( y = 0;; y++ ){
    for( x = 0;; x++ ){
      if (
        x === 0 || y === 0 || x === xMax || y === yMax ||
        ( x === pX && y === pY )
      ) {
        setPixel( x, y, 1 )
      } else {
        setPixel( x, y, 0 )
      }

      if( x === xMax ) break
    }

    if( y === yMax ) break
  }

  if ( up() && pY > 1 ) pY--
  if ( down() && pY < yMax - 1 ) pY++
  if ( left() && pX > 1 ) pX--
  if ( right() && pX < xMax - 1 ) pX++
}
