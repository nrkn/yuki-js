'use strict';
const size = arr => arr.length;;
const $CallStack = (maxSize, addressSize = 2) => {
    let callStackSize = 0;
    const $in = () => {
        callStackSize += addressSize;
        if (callStackSize > maxSize)
            throw Error('Max call stack exceeded');
    };
    const $out = () => {
        callStackSize -= addressSize;
    };
    return {
        $in,
        $out
    };
};;
const $Memory = lets => {
    const $ = {};
    lets.forEach(l => {
        if (l.type === 'array') {
            const arr = {};
            const data = Array(l.length).fill(0);
            for (let i = 0; i < l.length; i++) {
                Object.defineProperty(arr, i, {
                    get() {
                        return data[i];
                    },
                    set(value) {
                        data[i] = $ensureNumber(value, l);
                    }
                });
            }
            Object.defineProperty(arr, 'length', {
                get() {
                    return l.length;
                }
            });
            $[l.name] = arr;
        } else {
            let data = 0;
            Object.defineProperty($, l.name, {
                get() {
                    return data;
                },
                set(value) {
                    data = $ensureNumber(value, l);
                }
            });
        }
    });
    Object.defineProperty($, '$', {
        get() {
            const raw = {};
            lets.forEach(l => {
                if (l.type === 'number') {
                    raw[l.name] = $[l.name];
                } else {
                    raw[l.name] = Array(l.length);
                    for (let i = 0; i < l.length; i++) {
                        raw[l.name][i] = $[l.name][i];
                    }
                }
            });
            return raw;
        }
    });
    return $;
};;
const $ensureNumber = (value, l) => {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
        throw Error('Expected a number');
    }
    value = ~~value;
    if (l.signed)
        return $toSigned(value, l.bitLength);
    return $toUnsigned(value, l.bitLength);
};;
const $toUnsigned = (value, bitLength) => {
    const maxUint = $maxValue(bitLength);
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value < 0) {
        value += maxUint;
    }
    return value;
};;
const $toSigned = (value, bitLength) => {
    const maxUint = $maxValue(bitLength);
    const maxInt = Math.floor(maxUint / 2 - 1);
    const minInt = Math.floor(maxUint / 2) * -1;
    while (value < minInt) {
        value += maxUint;
    }
    while (value > maxInt) {
        value -= maxUint;
    }
    return value;
};;
const $maxValue = bitLength => Math.pow(2, bitLength);;
const {$in, $out} = $CallStack(1020, 2);
const $ = $Memory([
    {
        'name': 'x',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 7,
        'signed': false
    },
    {
        'name': 'y',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 7,
        'signed': false
    },
    {
        'name': 'pX',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 7,
        'signed': false
    },
    {
        'name': 'pY',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 7,
        'signed': false
    }
]);
'use strict';
const $pixels = new Array(128 * 128);
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
$draw();
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
;
$.pX = 64;
$.pY = 64;
function tick() {
    $in();
    for ($.y = 0;; $.y++) {
        for ($.x = 0;; $.x++) {
            if ($.x === 0 || $.y === 0 || $.x === 127 || $.y === 127 || $.x === $.pX && $.y === $.pY) {
                setPixel($.x, $.y, 1);
            } else {
                setPixel($.x, $.y, 0);
            }
            if ($.x === 127)
                break;
        }
        if ($.y === 127)
            break;
    }
    if (up() && $.pY > 1)
        $.pY--;
    if (down() && $.pY < 126)
        $.pY++;
    if (left() && $.pX > 1)
        $.pX--;
    if (right() && $.pX < 126)
        $.pX++;
    return $out();
}