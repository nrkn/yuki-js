export const CallStack = ( maxSize: number ) => {
  let size = 0

  const $in = () => {
    size++

    if( size > maxSize )
      throw Error( 'Max call stack exceeded' )
  }

  const $out = () => {
    size--
  }

  return { $in, $out }
}
