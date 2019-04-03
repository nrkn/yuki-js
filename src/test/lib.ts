import * as assert from 'assert'
import { $ensureNumber } from '../lib'
import { YukiNumber } from '../declarations/value-types'

describe( 'yuki-js', () => {
  describe( 'main', () => {
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
            $ensureNumber( <any>'a', unsigned )
          },
          { message: 'Expected a number' }
        )

        assert.throws(
          () => {
            $ensureNumber( NaN, unsigned )
          },
          { message: 'Expected a number' }
        )

        assert.throws(
          () => {
            $ensureNumber( Infinity, unsigned )
          },
          { message: 'Expected a number' }
        )

        assert.throws(
          () => {
            $ensureNumber( <any>'a', signed )
          },
          { message: 'Expected a number' }
        )

        assert.throws(
          () => {
            $ensureNumber( NaN, signed )
          },
          { message: 'Expected a number' }
        )

        assert.throws(
          () => {
            $ensureNumber( Infinity, signed )
          },
          { message: 'Expected a number' }
        )
      } )

      it( 'wraps unsigned numbers', () => {
        assert.strictEqual( $ensureNumber( 256, unsigned ), 0 )
        assert.strictEqual( $ensureNumber( 345, unsigned ), 89 )
      } )

      it( 'wraps signed numbers', () => {
        assert.strictEqual( $ensureNumber( -129, signed ), 127 )
        assert.strictEqual( $ensureNumber( -345, signed ), -89 )
      } )

      it( 'coerces unsigned to signed', () => {
        assert.strictEqual( $ensureNumber( 135, signed ), -121 )
        assert.strictEqual( $ensureNumber( 345, signed ), 89 )
      } )

      it( 'coerces signed to unsigned', () => {
        assert.strictEqual( $ensureNumber( -256, unsigned ), 0 )
        assert.strictEqual( $ensureNumber( -345, unsigned ), 167 )
      } )

      it( 'coerces boolean to number', () => {
        assert.strictEqual( $ensureNumber( true, unsigned ), 1 )
        assert.strictEqual( $ensureNumber( false, unsigned ), 0 )
        assert.strictEqual( $ensureNumber( true, signed ), 1 )
        assert.strictEqual( $ensureNumber( false, signed ), 0 )
      } )
    } )
  } )
} )
