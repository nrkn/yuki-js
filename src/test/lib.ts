import * as assert from 'assert'
import { size, CallStack, Memory, ensureNumber } from '../lib'
import { YukiLet, YukiNumber } from '../declarations/header/types';

describe( 'yuki-js', () => {
  describe( 'main', () => {
    it( 'size', () => {
      const arr = [ 1, 2, 3 ]

      assert.strictEqual( size( arr ), 3 )
    } )

    describe( 'CallStack', () => {
      it( 'Max call stack exceeded', () => {
        const maxSize = 10
        const { $in } = CallStack( maxSize, 1 )

        assert.throws(
          () => {
            for ( let i = 0; i < maxSize + 1; i++ ) {
              $in()
            }
          },
          {
            message: 'Max call stack exceeded'
          }
        )
      } )

      it( 'Exits correctly', () => {
        const maxSize = 10
        const { $in, $out } = CallStack( maxSize )

        assert.doesNotThrow(
          () => {
            for ( let i = 0; i < maxSize + 1; i++ ) {
              $in()
              $out()
            }
          }
        )
      } )
    } )

    describe( 'Memory', () => {
      const lets: YukiLet[] = [
        {
          name: 'int8',
          valueType: 'let',
          type: 'number',
          bitLength: 8,
          signed: true
        },
        {
          name: 'uint8',
          valueType: 'let',
          type: 'number',
          bitLength: 8,
          signed: false
        },
        {
          name: 'arrInt8',
          valueType: 'let',
          type: 'array',
          bitLength: 8,
          length: 3,
          signed: true
        },
        {
          name: 'arrUint8',
          valueType: 'let',
          type: 'array',
          bitLength: 8,
          length: 3,
          signed: false
        }
      ]

      const memory = Memory( lets )
      const debugMemory = Memory( lets, true )

      it( 'sets number', () => {
        memory.int8 = 10

        assert.strictEqual( memory.int8, 10 )
      })

      it( 'Unexpected identifier', () => {
        assert.throws(
          () => {
            memory.foo = 10
          },
          { message: 'Unexpected identifier foo' }
        )
      })

      it( 'Expected a number', () => {
        assert.throws(
          () => {
            memory.int8 = <any>'a'
          },
          { message: 'Expected a number' }
        )

        assert.throws(
          () => {
            memory.int8 = NaN
          },
          { message: 'Expected a number' }
        )

        assert.throws(
          () => {
            memory.int8 = Infinity
          },
          { message: 'Expected a number' }
        )
      })

      it( 'sets array member', () => {
        memory.arrInt8[ 0 ] = 10

        assert.strictEqual( memory.arrInt8[ 0 ], 10 )
      })

      it( 'gets symbol on array', () => {
        assert.doesNotThrow( () => {
          memory.arrInt8[ Symbol.iterator ]
        })
      })

      it( 'Unexpected index', () => {
        assert.throws(
          () => {
            memory.arrInt8[ 'length' ]
          },
          {
            message: 'Unexpected index length'
          }
        )

        assert.throws(
          () => {
            memory.arrInt8[ -1 ]
          },
          {
            message: 'Unexpected index -1'
          }
        )

        assert.throws(
          () => {
            memory.arrInt8[ 3 ]
          },
          {
            message: 'Unexpected index 3'
          }
        )
      })

      it( 'No unexpected index for debug', () => {
        assert.doesNotThrow(
          () => {
            debugMemory.arrInt8[ 'length' ]
          }
        )
      })

      it( 'Cannot set symbol on array', () => {
        assert.throws( () => {
          memory.arrInt8[ Symbol.iterator ] = [][ Symbol.iterator ]
        })
      })

      it( 'Index out of bounds', () => {
        assert.throws(
          () => {
            memory.arrInt8[ 'length' ] = 3
          },
          {
            message: 'Index out of bounds: NaN'
          }
        )

        assert.throws(
          () => {
            memory.arrInt8[ -1 ] = 0
          },
          {
            message: 'Index out of bounds: -1'
          }
        )

        assert.throws(
          () => {
            memory.arrInt8[ 3 ] = 0
          },
          {
            message: 'Index out of bounds: 3'
          }
        )
      } )
    })

    describe( 'ensureNumber', () => {
      const signed: YukiNumber = {
        name: 'int8',
        valueType: 'let',
        type: 'number',
        bitLength: 8,
        signed: true
      }

      const unsigned: YukiNumber = {
        name: 'uint8',
        valueType: 'let',
        type: 'number',
        bitLength: 8,
        signed: false
      }

      it( 'Only accepts finite numbers', () => {
        assert.throws(
          () => {
            ensureNumber( <any>'a', signed )
          },
          { message: 'Expected a number' }
        )

        assert.throws(
          () => {
            ensureNumber( NaN, signed )
          },
          { message: 'Expected a number' }
        )

        assert.throws(
          () => {
            ensureNumber( Infinity, signed )
          },
          { message: 'Expected a number' }
        )
      })

      it( 'wraps unsigned numbers', () => {
        assert.strictEqual( ensureNumber( 256, unsigned ), 0 )
        assert.strictEqual( ensureNumber( 345, unsigned ), 89 )
      })

      it( 'wraps signed numbers', () => {
        assert.strictEqual( ensureNumber( -129, signed ), 127 )
        assert.strictEqual( ensureNumber( -345, signed ), -89 )
      })

      it( 'coerces unsigned to signed', () => {
        assert.strictEqual( ensureNumber( 135, signed ), -121 )
        assert.strictEqual( ensureNumber( 345, signed ), 89 )
      })

      it( 'coerces signed to unsigned', () => {
        assert.strictEqual( ensureNumber( -256, unsigned ), 0 )
        assert.strictEqual( ensureNumber( -345, unsigned ), 167 )
      })
    })
  } )
} )