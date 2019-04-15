// bytes
const $maxMemory = 64

// bits
const $addressSize = 16

// bits
const $used = [ 0 ]

const $allocate = yukiValue => {
  $used[ $used.length - 1 ] += yukiValue._bitLength

  const bytes = Math.ceil( $used[ $used.length - 1 ] / 8 )

  if ( bytes > $maxMemory ) throw Error( 'Out of memory' )

  return yukiValue
}

const $enter = () => {
  $used[ $used.length ] = $used[ $used.length - 1 ]
}

const $exit = count => {
  for( let i = 0; i < count; i++ ){
    $used.pop()
  }
}

const size = arr => arr.length
