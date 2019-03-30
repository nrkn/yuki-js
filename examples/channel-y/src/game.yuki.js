const xMax = 95
const yMax = 63

let x = Uint7
let y = Uint7

let pX = Uint7
let pY = Uint7

pX = 48
pY = 32

for( y = 0;; y++ ){
  setBackground( y, y / 16 )

  if( y === yMax ) break
}

function tick() {
  for( y = 0;; y++ ){
    for( x = 0;; x++ ){
      setPixel( x, y,  
        x === 0 || y === 0 || x === xMax || y === yMax ?
        x / 32 :
        x === pX && y === pY ?
        3 - ( x / 32 ) :
        3
      )

      if( x === xMax ) break
    }

    if( y === yMax ) break
  }

  if ( up() && pY > 1 ) pY--
  if ( down() && pY < yMax - 1 ) pY++
  if ( left() && pX > 1 ) pX--
  if ( right() && pX < xMax - 1 ) pX++
}
