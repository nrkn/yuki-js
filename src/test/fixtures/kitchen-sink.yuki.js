// const flag
const FLAG_1 = true
const FLAG_2 = false
// const number
const VAL_1 = 10
// const array
const ARR_1 = [ 1, 2, 3 ]
const FLAGS_1 = [ true, false, true ]

// mutable flag
let flag3 = Bool
let flag4 = Bool
// mutable numbers
let length = Uint8
let i = Uint8
let a = Uint8
let b = Uint8
let c = Uint8
let d = Int8
let e = Uint8

// fixed size arrays
let flags = Bool( 10 )
let arr2 = Uint8( 20 )

// assignment
i = VAL_1
e = 10
flags[ 0 ] = true
a = ARR_1[ 0 ]
b = ARR_1[ 1 ]
c = ARR_1[ 2 ]
flag4 = FLAGS_1[ 1 ]
flag3 = FLAG_2 && flag4

// size
length = size( arr2 )

// operators
a++
b--
++a
--b
c = a + b
c = a - b
c = a / b
c = a * b
c = a % b
c = a & b
c = a | b
c = a ^ b
c = a && b
c = a || b
c = a << b
c = a >> b
c = a >>> c
c = a, b
c += a
c -= a
c /= a
c *= a
c &= a
c ^= a
c |= a
c %= a
c = ~a
c = !a
c = -a
c = +a
c <<= a
c >>= a
c >>>= a
c = a < b ? a : b
c = a > b ? a : b
c = a <= b ? a : b
c = a >= b ? a : b
c = a == b ? a : b
c = a != b ? a : b

// mix signed and unsigned
d = -32
c = a + d
d = b + -64

// grouping
c = ( a + b ) * c

// for loop
for ( i = 0; i < e; i++ ) {
  arr2[ i ] = e - i
}

// while loop
i = length
while ( i >= 0 ) {
  arr2[ i ] += 1

  i--
}

// break
i = length
while ( true ) {
  arr2[ i ] += 1

  i--

  if ( i <= 0 ) break
}

//continue
for ( i = 0; i < 10; ) {
  if ( i > 5 ) continue
  i++
}

// do while
i = length
do {
  arr2[ i ] += 1

  i--
} while ( i >= 0 )

// if
if ( flag3 ) {
  flag3 = !flag3
} else if ( FLAG_1 ) {
  flag3 = FLAG_1
}

// function, subroutine only
function add() {
  c = a + b
}

// allow early return
function addIfFlag() {
  if ( flag3 ) return

  add()
}

// tick
export function tick() {
  addIfFlag()
}

// can call exported function
tick()