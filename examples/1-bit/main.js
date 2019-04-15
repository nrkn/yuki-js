'use strict';
const Bool = (value = 0) => {
    value = value ? 1 : 0;
    return {
        get _bitLength() {
            return 1;
        },
        get $() {
            return value;
        },
        set $(n) {
            value = n ? 1 : 0;
        }
    };
};
const BoolArray = length => {
    const values = Array(length);
    const arr = {
        get _bitLength() {
            return length;
        },
        get length() {
            return length;
        }
    };
    for (let i = 0; i < length; i++) {
        values[i] = Bool();
        Object.defineProperty(arr, i, {
            get() {
                return values[i].$;
            },
            set(v) {
                values[i].$ = v;
            }
        });
    }
    return arr;
};
const IntFactory = bitLength => {
    const Int = (value = 0) => {
        value = ensureSigned(value, bitLength);
        return {
            get _bitLength() {
                return bitLength;
            },
            get $() {
                return value;
            },
            set $(n) {
                value = ensureSigned(n, bitLength);
            }
        };
    };
    return Int;
};
const ensureSigned = (value, bitLength) => {
    const maxUint = maxValue(bitLength);
    const maxInt = Math.floor(maxUint / 2 - 1);
    const minInt = Math.floor(maxUint / 2) * -1;
    if (value && typeof value !== 'number' && '$' in value)
        value = value.$;
    assertNumber(value);
    value = ~~value;
    while (value < minInt) {
        value += maxUint;
    }
    while (value > maxInt) {
        value -= maxUint;
    }
    return value;
};
const UintFactory = bitLength => {
    const Uint = (value = 0) => {
        value = ensureUnsigned(value, bitLength);
        return {
            get _bitLength() {
                return bitLength;
            },
            get $() {
                return value;
            },
            set $(n) {
                value = ensureUnsigned(n, bitLength);
            }
        };
    };
    return Uint;
};
const ensureUnsigned = (value, bitLength) => {
    const maxUint = maxValue(bitLength);
    if (value && typeof value !== 'number' && '$' in value)
        value = value.$;
    assertNumber(value);
    value = ~~value;
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value < 0) {
        value += maxUint;
    }
    return value;
};
const IntArrayFactory = bitLength => {
    const Int = IntFactory(bitLength);
    const IntArray = length => {
        const values = Array(length);
        const arr = {
            get _bitLength() {
                return bitLength * length;
            },
            get length() {
                return length;
            }
        };
        for (let i = 0; i < length; i++) {
            values[i] = Int();
            Object.defineProperty(arr, i, {
                get() {
                    return values[i].$;
                },
                set(v) {
                    values[i].$ = v;
                }
            });
        }
        return arr;
    };
    return IntArray;
};
const UintArrayFactory = bitLength => {
    const Uint = UintFactory(bitLength);
    const UintArray = length => {
        const values = Array(length);
        const arr = {
            get _bitLength() {
                return bitLength * length;
            },
            get length() {
                return length;
            }
        };
        for (let i = 0; i < length; i++) {
            values[i] = Uint();
            Object.defineProperty(arr, i, {
                get() {
                    return values[i].$;
                },
                set(v) {
                    values[i].$ = v;
                }
            });
        }
        return arr;
    };
    return UintArray;
};
const assertNumber = value => {
    if (typeof value === 'boolean')
        return;
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
        throw Error('Expected a number');
    }
};
const maxValue = bitLength => Math.pow(2, bitLength);
const Int2 = IntFactory(2);
const Uint2 = UintFactory(2);
const Int2Arr = IntArrayFactory(2);
const Uint2Arr = UintArrayFactory(2);
const Int3 = IntFactory(3);
const Uint3 = UintFactory(3);
const Int3Arr = IntArrayFactory(3);
const Uint3Arr = UintArrayFactory(3);
const Int4 = IntFactory(4);
const Uint4 = UintFactory(4);
const Int4Arr = IntArrayFactory(4);
const Uint4Arr = UintArrayFactory(4);
const Int5 = IntFactory(5);
const Uint5 = UintFactory(5);
const Int5Arr = IntArrayFactory(5);
const Uint5Arr = UintArrayFactory(5);
const Int6 = IntFactory(6);
const Uint6 = UintFactory(6);
const Int6Arr = IntArrayFactory(6);
const Uint6Arr = UintArrayFactory(6);
const Int7 = IntFactory(7);
const Uint7 = UintFactory(7);
const Int7Arr = IntArrayFactory(7);
const Uint7Arr = UintArrayFactory(7);
const Int8 = IntFactory(8);
const Uint8 = UintFactory(8);
const Int8Arr = IntArrayFactory(8);
const Uint8Arr = UintArrayFactory(8);
const Int9 = IntFactory(9);
const Uint9 = UintFactory(9);
const Int9Arr = IntArrayFactory(9);
const Uint9Arr = UintArrayFactory(9);
const Int10 = IntFactory(10);
const Uint10 = UintFactory(10);
const Int10Arr = IntArrayFactory(10);
const Uint10Arr = UintArrayFactory(10);
const Int11 = IntFactory(11);
const Uint11 = UintFactory(11);
const Int11Arr = IntArrayFactory(11);
const Uint11Arr = UintArrayFactory(11);
const Int12 = IntFactory(12);
const Uint12 = UintFactory(12);
const Int12Arr = IntArrayFactory(12);
const Uint12Arr = UintArrayFactory(12);
const Int13 = IntFactory(13);
const Uint13 = UintFactory(13);
const Int13Arr = IntArrayFactory(13);
const Uint13Arr = UintArrayFactory(13);
const Int14 = IntFactory(14);
const Uint14 = UintFactory(14);
const Int14Arr = IntArrayFactory(14);
const Uint14Arr = UintArrayFactory(14);
const Int15 = IntFactory(15);
const Uint15 = UintFactory(15);
const Int15Arr = IntArrayFactory(15);
const Uint15Arr = UintArrayFactory(15);
const Int16 = IntFactory(16);
const Uint16 = UintFactory(16);
const Int16Arr = IntArrayFactory(16);
const Uint16Arr = UintArrayFactory(16);
const Int17 = IntFactory(17);
const Uint17 = UintFactory(17);
const Int17Arr = IntArrayFactory(17);
const Uint17Arr = UintArrayFactory(17);
const Int18 = IntFactory(18);
const Uint18 = UintFactory(18);
const Int18Arr = IntArrayFactory(18);
const Uint18Arr = UintArrayFactory(18);
const Int19 = IntFactory(19);
const Uint19 = UintFactory(19);
const Int19Arr = IntArrayFactory(19);
const Uint19Arr = UintArrayFactory(19);
const Int20 = IntFactory(20);
const Uint20 = UintFactory(20);
const Int20Arr = IntArrayFactory(20);
const Uint20Arr = UintArrayFactory(20);
const Int21 = IntFactory(21);
const Uint21 = UintFactory(21);
const Int21Arr = IntArrayFactory(21);
const Uint21Arr = UintArrayFactory(21);
const Int22 = IntFactory(22);
const Uint22 = UintFactory(22);
const Int22Arr = IntArrayFactory(22);
const Uint22Arr = UintArrayFactory(22);
const Int23 = IntFactory(23);
const Uint23 = UintFactory(23);
const Int23Arr = IntArrayFactory(23);
const Uint23Arr = UintArrayFactory(23);
const Int24 = IntFactory(24);
const Uint24 = UintFactory(24);
const Int24Arr = IntArrayFactory(24);
const Uint24Arr = UintArrayFactory(24);
const Int25 = IntFactory(25);
const Uint25 = UintFactory(25);
const Int25Arr = IntArrayFactory(25);
const Uint25Arr = UintArrayFactory(25);
const Int26 = IntFactory(26);
const Uint26 = UintFactory(26);
const Int26Arr = IntArrayFactory(26);
const Uint26Arr = UintArrayFactory(26);
const Int27 = IntFactory(27);
const Uint27 = UintFactory(27);
const Int27Arr = IntArrayFactory(27);
const Uint27Arr = UintArrayFactory(27);
const Int28 = IntFactory(28);
const Uint28 = UintFactory(28);
const Int28Arr = IntArrayFactory(28);
const Uint28Arr = UintArrayFactory(28);
const Int29 = IntFactory(29);
const Uint29 = UintFactory(29);
const Int29Arr = IntArrayFactory(29);
const Uint29Arr = UintArrayFactory(29);
const Int30 = IntFactory(30);
const Uint30 = UintFactory(30);
const Int30Arr = IntArrayFactory(30);
const Uint30Arr = UintArrayFactory(30);
const Int31 = IntFactory(31);
const Uint31 = UintFactory(31);
const Int31Arr = IntArrayFactory(31);
const Uint31Arr = UintArrayFactory(31);
const Int32 = IntFactory(32);
const Uint32 = UintFactory(32);
const Int32Arr = IntArrayFactory(32);
const Uint32Arr = UintArrayFactory(32);
const $maxMemory = 1024;
const $addressSize = 16;
const $used = [0];
const $allocate = yukiValue => {
    $used[$used.length - 1] += yukiValue._bitLength;
    const bytes = Math.ceil($used[$used.length - 1] / 8);
    if (bytes > $maxMemory)
        throw Error('Out of memory');
    return yukiValue;
};
const $enter = () => {
    $used[$used.length] = $used[$used.length - 1];
};
const $exit = count => {
    for (let i = 0; i < count; i++) {
        $used.pop();
    }
};
const size = arr => arr.length;
'use strict';
const $pixels = new Array(128 * 128);
const $canvas = document.getElementById('c');
const $context = $canvas.getContext('2d');
const $imageData = new ImageData(128, 128);
const $blit = () => {
    for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
            const i = y * 128 + x;
            const index = i * 4;
            const p = $pixels[i];
            const v = !!p * 255;
            $imageData.data[index] = v;
            $imageData.data[index + 1] = v;
            $imageData.data[index + 2] = v;
            $imageData.data[index + 3] = 255;
        }
    }
    $context.putImageData($imageData, 0, 0);
};
const $draw = () => {
    tick();
    $blit();
    requestAnimationFrame($draw);
};
let $isUp = false;
let $isDown = false;
let $isLeft = false;
let $isRight = false;
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp')
        $isUp = true;
    if (e.key === 'ArrowDown')
        $isDown = true;
    if (e.key === 'ArrowLeft')
        $isLeft = true;
    if (e.key === 'ArrowRight')
        $isRight = true;
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowUp')
        $isUp = false;
    if (e.key === 'ArrowDown')
        $isDown = false;
    if (e.key === 'ArrowLeft')
        $isLeft = false;
    if (e.key === 'ArrowRight')
        $isRight = false;
});
const $init = () => {
    $draw();
};
function up() {
    return $isUp;
}
function down() {
    return $isDown;
}
function left() {
    return $isLeft;
}
function right() {
    return $isRight;
}
function setPixel(x, y, p) {
    const i = y * 128 + x;
    $pixels[i] = p;
}
const xMax = 127;
const yMax = 127;
let x = $allocate(Uint7());
let y = $allocate(Uint7());
let pX = $allocate(Uint7(64));
let pY = $allocate(Uint7(64));
function tick(...$args) {
    $enter();
    $allocate($addressSize);
    {
        $enter();
        for (y.$ = 0;; y.$++) {
            $enter();
            {
                $enter();
                for (x.$ = 0;; x.$++) {
                    $enter();
                    if (x.$ === 0 || y.$ === 0 || x.$ === xMax || y.$ === yMax || x.$ === pX.$ && y.$ === pY.$) {
                        $enter();
                        setPixel(x.$, y.$, 1);
                        $exit(1);
                    } else {
                        $enter();
                        setPixel(x.$, y.$, 0);
                        $exit(1);
                    }
                    if (x.$ === xMax) {
                        $enter();
                        $exit(2);
                        break;
                        $exit(1);
                    }
                    $exit(1);
                }
                $exit(1);
            }
            if (y.$ === yMax) {
                $enter();
                $exit(2);
                break;
                $exit(1);
            }
            $exit(1);
        }
        $exit(1);
    }
    if (up() && pY.$ > 1) {
        $enter();
        pY.$--;
        $exit(1);
    }
    if (down() && pY.$ < yMax - 1) {
        $enter();
        pY.$++;
        $exit(1);
    }
    if (left() && pX.$ > 1) {
        $enter();
        pX.$--;
        $exit(1);
    }
    if (right() && pX.$ < xMax - 1) {
        $enter();
        pX.$++;
        $exit(1);
    }
    $exit(1);
}
$init();