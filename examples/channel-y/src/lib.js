"use strict"

const width = 128
const height = 64

const $backgrounds = new Array( height )
const $pixels = new Array( width * height )
const $canvas = document.getElementById( 'c' )
const $context = $canvas.getContext( '2d' )
const $imageData = new ImageData( width, height )

$canvas.width = width
$canvas.height = height

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

let $isUp1 = false
let $isDown1 = false
let $isLeft1 = false
let $isRight1 = false
let $isUp2 = false
let $isDown2 = false
let $isLeft2 = false
let $isRight2 = false

document.addEventListener( 'keydown', e => {
    if ( e.key.toLowerCase() === 'w' )
        $isUp1 = true
    if ( e.key.toLowerCase() === 's' )
        $isDown1 = true
    if ( e.key.toLowerCase() === 'a' )
        $isLeft1 = true
    if ( e.key.toLowerCase() === 'd' )
        $isRight1 = true
    if ( e.key === 'ArrowUp' )
        $isUp2 = true
    if ( e.key === 'ArrowDown' )
        $isDown2 = true
    if ( e.key === 'ArrowLeft' )
        $isLeft2 = true
    if ( e.key === 'ArrowRight' )
        $isRight2 = true
} )

document.addEventListener( 'keyup', e => {
    if ( e.key.toLowerCase() === 'w' )
        $isUp1 = false
    if ( e.key.toLowerCase() === 's' )
        $isDown1 = false
    if ( e.key.toLowerCase() === 'a' )
        $isLeft1 = false
    if ( e.key.toLowerCase() === 'd' )
        $isRight1 = false
    if ( e.key === 'ArrowUp' )
        $isUp2 = false
    if ( e.key === 'ArrowDown' )
        $isDown2 = false
    if ( e.key === 'ArrowLeft' )
        $isLeft2 = false
    if ( e.key === 'ArrowRight' )
        $isRight2 = false
} )

const $init = () => {
    $draw()
}

function up1() { return $isUp1 }
function down1() { return $isDown1 }
function left1() { return $isLeft1 }
function right1() { return $isRight1 }
function up2() { return $isUp2 }
function down2() { return $isDown2 }
function left2() { return $isLeft2 }
function right2() { return $isRight2 }

function rnd( value ){
    return Math.floor( Math.random() * value )
}

function setBackground( row, backgroundColor ){
    row = ensureUnsigned( row, 6 )
    backgroundColor = ensureUnsigned( backgroundColor, 2 )

    $backgrounds[ row ] = backgroundColor
}

function setPixel( x, y, color ) {
    x = ensureUnsigned( x, 7 )
    y = ensureUnsigned( y, 6 )

    const i = y * width + x

    color = ensureUnsigned( color, 2 )

    if( color === 3 ){
        color = $palette[ $background[ $backgrounds[ y ] ] ]
    } else if( $backgrounds[ y ] === 3 ){
        color = $palette.white
    } else {
        color = $palette[ $foreground[ color ] ]
    }

    $pixels[ i ] = color
}
