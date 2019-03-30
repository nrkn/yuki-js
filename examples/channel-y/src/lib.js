"use strict"

const width = 96
const height = 64

const $backgrounds = new Array( height )
const $pixels = new Array( width * height )
const $canvas = document.getElementById( 'c' )
const $context = $canvas.getContext( '2d' )
const $imageData = new ImageData( width, height )

const $palette = {
    lightGrey: [ 224, 224, 224 ],
    lightGreen: [ 145, 255, 166 ],
    lightBlue: [ 206, 208, 255 ],
    black: [ 16, 16, 16 ],
    red: [ 255, 49, 83 ],
    green: [ 2, 204, 93 ],
    blue: [ 75, 63, 243 ],
    white: [ 252, 252, 252 ]
}

const $background = [ 'lightGrey', 'lightGreen', 'lightBlue', 'black' ]
const $foreground = [ 'red', 'green', 'blue', 'white' ]

const $blit = () => {
    for ( let y = 0; y < height; y++ ) {
        for ( let x = 0; x < width; x++ ) {
            const i = y * width + x
            const index = i * 4
            const [ r, g, b ] = $pixels[ i ] || $palette.black
            $imageData.data[ index ] = r
            $imageData.data[ index + 1 ] = g
            $imageData.data[ index + 2 ] = b
            $imageData.data[ index + 3 ] = 255
        }
    }
    $context.putImageData( $imageData, 0, 0 )
}

const $draw = () => {
    tick()
    $blit()
    requestAnimationFrame( $draw )
}

let $isUp = false
let $isDown = false
let $isLeft = false
let $isRight = false

document.addEventListener( 'keydown', e => {
    if ( e.key === 'ArrowUp' )
        $isUp = true
    if ( e.key === 'ArrowDown' )
        $isDown = true
    if ( e.key === 'ArrowLeft' )
        $isLeft = true
    if ( e.key === 'ArrowRight' )
        $isRight = true
} )

document.addEventListener( 'keyup', e => {
    if ( e.key === 'ArrowUp' )
        $isUp = false
    if ( e.key === 'ArrowDown' )
        $isDown = false
    if ( e.key === 'ArrowLeft' )
        $isLeft = false
    if ( e.key === 'ArrowRight' )
        $isRight = false
} )

$draw()

function up() { return $isUp }
function down() { return $isDown }
function left() { return $isLeft }
function right() { return $isRight }

function setBackground( row, backgroundColor ){
    row = $toUnsigned( row, 6 )
    backgroundColor = $toUnsigned( backgroundColor, 2 )

    $backgrounds[ row ] = backgroundColor
}

function setPixel( x, y, color ) {
    x = $toUnsigned( x, 7 )

    while( x > width ) x -= width

    y = $toUnsigned( y, 6 )

    const i = y * width + x

    color = $toUnsigned( color, 2 )

    if( color === 3 ){
        color = $palette[ $background[ $backgrounds[ y ] ] ]
    } else if( $backgrounds[ y ] === 3 ){
        color = $palette.white
    } else {
        color = $palette[ $foreground[ color ] ]
    }

    $pixels[ i ] = color
}
