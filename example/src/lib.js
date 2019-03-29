"use strict"

const $pixels = new Array( 128 * 128 )
const $canvas = document.getElementById( 'c' )
const $context = $canvas.getContext( '2d' )
const $imageData = new ImageData( 128, 128 )

const $blit = () => {
    for ( let y = 0; y < 128; y++ ) {
        for ( let x = 0; x < 128; x++ ) {
            const i = y * 128 + x
            const index = i * 4
            const p = $pixels[ i ]
            const v = !!p * 255
            $imageData.data[ index ] = v
            $imageData.data[ index + 1 ] = v
            $imageData.data[ index + 2 ] = v
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

function setPixel( x, y, p ) {
    const i = y * 128 + x
    $pixels[ i ] = p
}
