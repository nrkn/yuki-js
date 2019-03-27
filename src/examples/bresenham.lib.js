function log( arg ){
  const newArray = []

  for( let i = 0; i < 100; i++  ){
    if( arg[ i ] === 0 ) break

    newArray[ i ] = arg[ i ]
  }

  console.log( newArray )
}
