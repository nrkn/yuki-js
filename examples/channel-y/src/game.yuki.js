const xMax = 127
const yMax = 63

const viewWidth = 102
const viewHeight = 58

const viewLeft = 13
const viewTop = 3

const playfieldWidth = 63
const playfieldHeight = 46

const playfieldTop = 6
const playfieldBottom = 51
const playfieldLeft = 32
const playfieldRight = 94

const subgridWidth = 189
const subgridHeight = 132

const centerX = 63
const centerY = 27

const scoreTop = 54

const textSprites = [
  1, 1, 1, 1, 1,
  1, 0, 0, 0, 1,
  1, 0, 0, 0, 1,
  1, 0, 0, 0, 1,
  1, 1, 1, 1, 1,

  0, 0, 1, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 1, 0, 0,

  1, 1, 1, 1, 1,
  0, 0, 0, 0, 1,
  1, 1, 1, 1, 1,
  1, 0, 0, 0, 0,
  1, 1, 1, 1, 1,

  1, 1, 1, 1, 1,
  0, 0, 0, 0, 1,
  1, 1, 1, 1, 1,
  0, 0, 0, 0, 1,
  1, 1, 1, 1, 1,

  1, 0, 0, 0, 1,
  1, 0, 0, 0, 1,
  1, 1, 1, 1, 1,
  0, 0, 0, 0, 1,
  0, 0, 0, 0, 1,

  1, 1, 1, 1, 1,
  1, 0, 0, 0, 0,
  1, 1, 1, 1, 1,
  0, 0, 0, 0, 1,
  1, 1, 1, 1, 1,

  1, 1, 1, 1, 1,
  1, 0, 0, 0, 0,
  1, 1, 1, 1, 1,
  1, 0, 0, 0, 1,
  1, 1, 1, 1, 1,

  1, 1, 1, 1, 1,
  0, 0, 0, 0, 1,
  0, 0, 0, 0, 1,
  0, 0, 0, 0, 1,
  0, 0, 0, 0, 1,

  1, 1, 1, 1, 1,
  1, 0, 0, 0, 1,
  1, 1, 1, 1, 1,
  1, 0, 0, 0, 1,
  1, 1, 1, 1, 1,

  1, 1, 1, 1, 1,
  1, 0, 0, 0, 1,
  1, 1, 1, 1, 1,
  0, 0, 0, 0, 1,
  1, 1, 1, 1, 1
]

let x = Uint7
let y = Uint6
let x1 = Uint7
let y1 = Uint6
let x2 = Uint7
let y2 = Uint6

let color = Uint2

let spriteIndex = Uint4
let spriteWidth = Uint4
let spriteHeight = Uint4

let p1Y = Int9
let p2Y = Int9
let p1Speed = Uint4
let p2Speed = Uint4

let ballX = Int9
let ballY = Int9
let ballSpeedX = Int4
let ballSpeedY = Int4
let ballPlayer = Bool

let yOffset = Int9

let volleyCount = Int3

let score1 = Uint4
let score2 = Uint4

let winScreen = Bool

function clearScreen() {
  for ( y = 0; ; y++ ) {
    setBackground( y, y < scoreTop ? 1 : 3 )

    for ( x = 0; ; x++ ) {
      setPixel( x, y, y < scoreTop ? color : 3 )

      if ( x === xMax ) break
    }

    if ( y === yMax ) break
  }
}

function drawSprite() {
  for ( y = 0; y < spriteHeight; y++ ) {
    for ( x = 0; x < spriteWidth; x++ ) {
      if (
        textSprites[
          ( spriteIndex * spriteWidth * spriteHeight ) + ( y * spriteWidth ) + x
        ]
      ) {
        setPixel( x + x1, y + y1, color )
      }
    }
  }
}

function drawLineHorizontal() {
  for ( x = x1; x <= x2; x++ ) {
    setPixel( x, y1, color )
  }
}

function drawLineVertical() {
  for ( y = y1; y <= y2; y++ ) {
    setPixel( x1, y, color )
  }
}

function drawPlayfield() {
  // top line
  y1 = playfieldTop
  x1 = playfieldLeft
  x2 = playfieldRight
  drawLineHorizontal()

  // bottom line
  y1 = playfieldBottom
  drawLineHorizontal()

  // center line
  for ( x = 0; x < 5; x++ ) {
    x1 = centerX
    y1 = ( x * 9 ) + playfieldTop + 2
    y2 = y1 + 5
    drawLineVertical()
  }
}

function drawScore() {
  spriteWidth = 5
  spriteHeight = 5

  // score
  y1 = scoreTop + 1

  // score 1 digit 1
  spriteIndex = score1 < 10 ? 0 : 1
  x1 = 35
  drawSprite()

  // score 1 digit 2
  spriteIndex = score1 < 10 ? score1 : score1 - 10
  x1 = 41
  drawSprite()

  // score 2 digit 1
  spriteIndex = score2 < 10 ? 0 : 1
  x1 = 81
  drawSprite()

  // score 2 digit 2
  spriteIndex = score2 < 10 ? score2 : score2 - 10
  x1 = 87
  drawSprite()
}

function drawPlayer1() {
  x1 = playfieldLeft
  y1 = p1Y / 3 + playfieldTop + 1
  y2 = y1 + 5
  drawLineVertical()
}

function drawPlayer2() {
  x1 = playfieldRight
  y1 = p2Y / 3 + playfieldTop + 1
  y2 = y1 + 5
  drawLineVertical()
}

function drawBall() {
  x1 = ballX / 3 + playfieldLeft
  y1 = ballY / 3 + playfieldTop + 1
  y2 = y1 + 1
  drawLineVertical()
  x1++
  drawLineVertical()
}

function resetBall1() {
  ballX = 3
  ballY = p1Y + 6
  ballSpeedX = 1
  ballSpeedY = 0
  volleyCount = 0
  ballPlayer = 0
}

function resetBall2() {
  ballX = subgridWidth - 3
  ballY = p2Y + 6
  ballSpeedX = -1
  ballSpeedY = 0
  volleyCount = 0
  ballPlayer = 1
}

function setBallSpeedY() {
  if ( yOffset < 3 ) {
    ballSpeedY = -3
  } else if ( yOffset < 6 ) {
    ballSpeedY = -2
  } else if ( yOffset < 9 ) {
    ballSpeedY = -1
  } else if ( yOffset < 14 ) {
    ballSpeedY = 0
  } else if ( yOffset < 17 ) {
    ballSpeedY = 1
  } else if ( yOffset < 20 ) {
    ballSpeedY = 2
  } else {
    ballSpeedY = 3
  }
}

function updateBall() {
  ballX += ballSpeedX
  ballY += ballSpeedY

  if ( ballY < 0 ) {
    ballY = 0
    ballSpeedY *= -1
  } else if ( ballY > subgridHeight - 6 ) {
    ballY = subgridHeight - 6
    ballSpeedY *= -1
  }

  if ( ballSpeedX > 0 ) {
    if ( ballX > subgridWidth - 9 ) {
      yOffset = ballY - p2Y + 5

      if ( yOffset >= 0 && yOffset < 23 ) {
        ballX = subgridWidth - 9

        setBallSpeedY()

        if ( ballSpeedX < 3 ) {
          volleyCount++
          if ( volleyCount === 3 ) {
            ballSpeedX++
            volleyCount = 0
          }
        }

        ballSpeedX *= -1
        ballPlayer = 1
      } else {
        score1++
        resetBall1()

        if( score1 === 11 ){
          winP1()
        }
      }
    }
  } else {
    if ( ballX < 3 ) {
      yOffset = ballY - p1Y + 5

      if ( yOffset >= 0 && yOffset < 23 ) {
        ballX = 3

        setBallSpeedY()

        if ( ballSpeedX > -3 ) {
          volleyCount++
          if ( volleyCount === 3 ) {
            ballSpeedX--
            volleyCount = 0
          }
        }

        ballSpeedX *= -1
        ballPlayer = 0
      } else {
        score2++
        resetBall2()

        if( score2 === 11 ){
          winP2()
        }
      }
    }
  }
}

function handleInput() {
  if ( up1() || down1() ) {
    if ( up1() ) p1Y -= p1Speed / 3
    if ( down1() ) p1Y += p1Speed / 3

    if ( p1Y < 3 ) p1Y = 3
    if ( p1Y > subgridHeight - 18 ) p1Y = subgridHeight - 18

    if ( p1Speed < 15 ) p1Speed++
  } else {
    p1Speed = 0
  }

  if ( up2() || down2() ) {
    if ( up2() ) p2Y -= p2Speed / 3
    if ( down2() ) p2Y += p2Speed / 3

    if ( p2Y < 3 ) p2Y = 3
    if ( p2Y > subgridHeight - 18 ) p2Y = subgridHeight - 18

    if ( p2Speed < 15 ) p2Speed++
  } else {
    p2Speed = 0
  }
}

function tick() {
  if( winScreen ){
    if( left1() || right1() || left2() || right2() ){
      start()
    } else {
      return
    }
  }

  color = 1
  drawPlayfield()

  // clear objects
  color = 3
  drawPlayer1()
  drawPlayer2()
  drawBall()
  drawScore()

  handleInput()
  updateBall()

  if( winScreen ) return

  // draw objects
  color = 0
  drawPlayer1()
  color = 2
  drawPlayer2()
  color = ballPlayer ? 2 : 0
  drawBall()
  drawScore()
}

function win(){
  winScreen = true

  clearScreen()
  drawScore()
}

function winP1(){
  color = 0
  win()
}

function winP2(){
  color = 2
  win()
}

function start(){
  winScreen = false
  p1Y = 51
  p2Y = 51
  score1 = 0
  score2 = 0

  color = 3
  clearScreen()

  if ( rnd( 2 ) )
    resetBall1()
  else
    resetBall2()
}

start()
