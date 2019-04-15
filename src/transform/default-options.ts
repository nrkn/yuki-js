import { TransformOptions } from './types'
import { typeNames } from '../yuki-types/type-names'

export const DefaultTransformOptions = (): TransformOptions => ( {
  external: {
    consts: [ '$addressSize' ],
    functions: [ ...typeNames, '$allocate', '$enter', '$exit', 'size' ]
  },
  scope: {
    type: 'global',
    consts: [],
    functions: [],
    numbers: [],
    arrays: []
  }
} )
