export const numberTypes: string[] = [ 'Bool' ]

for ( let i = 2; i <= 32; i++ ) {
  numberTypes.push( `Uint${ i }` )
  numberTypes.push( `Int${ i }` )
}
