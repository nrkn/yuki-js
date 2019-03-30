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
    if (l.signed)
        return $toSigned(value, l.bitLength);
    return $toUnsigned(value, l.bitLength);
};;
const $toUnsigned = (value, bitLength) => {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
        throw Error('Expected a number');
    }
    value = ~~value;
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
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
        throw Error('Expected a number');
    }
    value = ~~value;
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
const {$in, $out} = $CallStack(60, 2);
const xMax = 95;
const yMax = 63;
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
const width = 96;
const height = 64;
const $backgrounds = new Array(height);
const $pixels = new Array(width * height);
const $canvas = document.getElementById('c');
const $context = $canvas.getContext('2d');
const $imageData = new ImageData(width, height);
const $palette = {
    lightGrey: [
        224,
        224,
        224
    ],
    lightGreen: [
        145,
        255,
        166
    ],
    lightBlue: [
        206,
        208,
        255
    ],
    black: [
        16,
        16,
        16
    ],
    red: [
        255,
        49,
        83
    ],
    green: [
        2,
        204,
        93
    ],
    blue: [
        75,
        63,
        243
    ],
    white: [
        252,
        252,
        252
    ]
};
const $background = [
    'lightGrey',
    'lightGreen',
    'lightBlue',
    'black'
];
const $foreground = [
    'red',
    'green',
    'blue',
    'white'
];
const $blit = () => {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = y * width + x;
            const index = i * 4;
            const [r, g, b] = $pixels[i] || $palette.black;
            $imageData.data[index] = r;
            $imageData.data[index + 1] = g;
            $imageData.data[index + 2] = b;
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
function setBackground(row, backgroundColor) {
    row = $toUnsigned(row, 6);
    backgroundColor = $toUnsigned(backgroundColor, 2);
    $backgrounds[row] = backgroundColor;
}
function setPixel(x, y, color) {
    x = $toUnsigned(x, 7);
    while (x > width)
        x -= width;
    y = $toUnsigned(y, 6);
    const i = y * width + x;
    color = $toUnsigned(color, 2);
    if (color === 3) {
        color = $palette[$background[$backgrounds[y]]];
    } else if ($backgrounds[y] === 3) {
        color = $palette.white;
    } else {
        color = $palette[$foreground[color]];
    }
    $pixels[i] = color;
}
$.pX = 48;
$.pY = 32;
for ($.y = 0;; $.y++) {
    setBackground($.y, $.y / 16);
    if ($.y === yMax)
        break;
}
function tick() {
    $in();
    for ($.y = 0;; $.y++) {
        for ($.x = 0;; $.x++) {
            setPixel($.x, $.y, $.x === 0 || $.y === 0 || $.x === xMax || $.y === yMax ? $.x / 32 : $.x === $.pX && $.y === $.pY ? 3 - $.x / 32 : 3);
            if ($.x === xMax)
                break;
        }
        if ($.y === yMax)
            break;
    }
    if (up() && $.pY > 1)
        $.pY--;
    if (down() && $.pY < yMax - 1)
        $.pY++;
    if (left() && $.pX > 1)
        $.pX--;
    if (right() && $.pX < xMax - 1)
        $.pX++;
    return $out();
}