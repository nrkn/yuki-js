export const Memory = ( maxMemoryBytes: number ) => {
  // bits
  const used = [ 0 ]

  const $allocate = yukiValue => {
    used[ used.length - 1 ] += yukiValue._bitLength

    const bytes = Math.ceil( used[ used.length - 1 ] / 8 )

    if ( bytes > maxMemoryBytes ) throw Error( 'Out of memory' )

    return yukiValue
  }

  const $enter = () => {
    used[ used.length ] = used[ used.length - 1 ]
  }

  const $exit = count => {
    for ( let i = 0; i < count; i++ ) {
      used.pop()
    }
  }

  return { $allocate, $enter, $exit }
}

export const size = arr => arr.length
