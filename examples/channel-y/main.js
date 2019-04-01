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
const {$in, $out} = $CallStack(49, 2);
const xMax = 127;
const yMax = 63;
const viewWidth = 102;
const viewHeight = 58;
const viewLeft = 13;
const viewTop = 3;
const playfieldWidth = 63;
const playfieldHeight = 46;
const playfieldTop = 6;
const playfieldBottom = 51;
const playfieldLeft = 32;
const playfieldRight = 94;
const subgridWidth = 189;
const subgridHeight = 132;
const centerX = 63;
const centerY = 27;
const scoreTop = 54;
const numberSprites = Object.freeze([
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1
]);
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
        'bitLength': 6,
        'signed': false
    },
    {
        'name': 'x1',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 7,
        'signed': false
    },
    {
        'name': 'y1',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 6,
        'signed': false
    },
    {
        'name': 'x2',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 7,
        'signed': false
    },
    {
        'name': 'y2',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 6,
        'signed': false
    },
    {
        'name': 'color',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 2,
        'signed': false
    },
    {
        'name': 'spriteIndex',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 4,
        'signed': false
    },
    {
        'name': 'spriteWidth',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 4,
        'signed': false
    },
    {
        'name': 'spriteHeight',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 4,
        'signed': false
    },
    {
        'name': 'p1Y',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 8,
        'signed': false
    },
    {
        'name': 'p2Y',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 8,
        'signed': false
    },
    {
        'name': 'ballX',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 8,
        'signed': false
    },
    {
        'name': 'ballY',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 9,
        'signed': true
    },
    {
        'name': 'ballSpeedX',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 4,
        'signed': true
    },
    {
        'name': 'ballSpeedY',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 4,
        'signed': true
    },
    {
        'name': 'ballPlayer',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 1,
        'signed': false
    },
    {
        'name': 'yOffset',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 9,
        'signed': true
    },
    {
        'name': 'volleyCount',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 3,
        'signed': true
    },
    {
        'name': 'score1',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 4,
        'signed': false
    },
    {
        'name': 'score2',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 4,
        'signed': false
    }
]);
'use strict';
const width = 128;
const height = 64;
const $backgrounds = new Array(height);
const $pixels = new Array(width * height);
const $canvas = document.getElementById('c');
const $context = $canvas.getContext('2d');
const $imageData = new ImageData(width, height);
$canvas.width = width;
$canvas.height = height;
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
let $isUp1 = false;
let $isDown1 = false;
let $isLeft1 = false;
let $isRight1 = false;
let $isUp2 = false;
let $isDown2 = false;
let $isLeft2 = false;
let $isRight2 = false;
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'w')
        $isUp1 = true;
    if (e.key.toLowerCase() === 's')
        $isDown1 = true;
    if (e.key.toLowerCase() === 'a')
        $isLeft1 = true;
    if (e.key.toLowerCase() === 'd')
        $isRight1 = true;
    if (e.key === 'ArrowUp')
        $isUp2 = true;
    if (e.key === 'ArrowDown')
        $isDown2 = true;
    if (e.key === 'ArrowLeft')
        $isLeft2 = true;
    if (e.key === 'ArrowRight')
        $isRight2 = true;
});
document.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'w')
        $isUp1 = false;
    if (e.key.toLowerCase() === 's')
        $isDown1 = false;
    if (e.key.toLowerCase() === 'a')
        $isLeft1 = false;
    if (e.key.toLowerCase() === 'd')
        $isRight1 = false;
    if (e.key === 'ArrowUp')
        $isUp2 = false;
    if (e.key === 'ArrowDown')
        $isDown2 = false;
    if (e.key === 'ArrowLeft')
        $isLeft2 = false;
    if (e.key === 'ArrowRight')
        $isRight2 = false;
});
$draw();
function up1() {
    return $isUp1;
}
function down1() {
    return $isDown1;
}
function left1() {
    return $isLeft1;
}
function right1() {
    return $isRight1;
}
function up2() {
    return $isUp2;
}
function down2() {
    return $isDown2;
}
function left2() {
    return $isLeft2;
}
function right2() {
    return $isRight2;
}
function rnd(value) {
    return Math.floor(Math.random() * value);
}
function setBackground(row, backgroundColor) {
    row = $toUnsigned(row, 6);
    backgroundColor = $toUnsigned(backgroundColor, 2);
    $backgrounds[row] = backgroundColor;
}
function setPixel(x, y, color) {
    x = $toUnsigned(x, 7);
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
function resetBall1() {
    $in();
    $.ballX = 3;
    $.ballY = $.p1Y + 6;
    $.ballSpeedX = 1;
    $.ballSpeedY = 0;
    $.volleyCount = 0;
    $.ballPlayer = 0;
    return $out();
}
function resetBall2() {
    $in();
    $.ballX = subgridWidth - 3;
    $.ballY = $.p2Y + 6;
    $.ballSpeedX = -1;
    $.ballSpeedY = 0;
    $.volleyCount = 0;
    $.ballPlayer = 1;
    return $out();
}
function drawSprite() {
    $in();
    for ($.y = 0; $.y < $.spriteHeight; $.y++) {
        for ($.x = 0; $.x < $.spriteWidth; $.x++) {
            if (numberSprites[$.spriteIndex * $.spriteWidth * $.spriteHeight + $.y * $.spriteWidth + $.x]) {
                setPixel($.x + $.x1, $.y + $.y1, $.color);
            }
        }
    }
    return $out();
}
function drawHorizontal() {
    $in();
    for ($.x = $.x1; $.x <= $.x2; $.x++) {
        setPixel($.x, $.y1, $.color);
    }
    return $out();
}
function drawVertical() {
    $in();
    for ($.y = $.y1; $.y <= $.y2; $.y++) {
        setPixel($.x1, $.y, $.color);
    }
    return $out();
}
function drawPlayfield() {
    $in();
    $.y1 = playfieldTop;
    $.x1 = playfieldLeft;
    $.x2 = playfieldRight;
    drawHorizontal();
    $.y1 = playfieldBottom;
    drawHorizontal();
    for ($.x = 0; $.x < 5; $.x++) {
        $.x1 = centerX;
        $.y1 = $.x * 9 + playfieldTop + 2;
        $.y2 = $.y1 + 5;
        drawVertical();
    }
    return $out();
}
function drawScore() {
    $in();
    $.spriteWidth = 5;
    $.spriteHeight = 5;
    $.y1 = scoreTop + 1;
    $.spriteIndex = $.score1 < 10 ? 0 : 1;
    $.x1 = 35;
    drawSprite();
    $.spriteIndex = $.score1 < 10 ? $.score1 : $.score1 - 10;
    $.x1 = 41;
    drawSprite();
    $.spriteIndex = $.score2 < 10 ? 0 : 1;
    $.x1 = 81;
    drawSprite();
    $.spriteIndex = $.score2 < 10 ? $.score2 : $.score2 - 10;
    $.x1 = 87;
    drawSprite();
    return $out();
}
function drawPlayer1() {
    $in();
    $.x1 = playfieldLeft;
    $.y1 = $.p1Y / 3 + playfieldTop + 1;
    $.y2 = $.y1 + 5;
    drawVertical();
    return $out();
}
function drawPlayer2() {
    $in();
    $.x1 = playfieldRight;
    $.y1 = $.p2Y / 3 + playfieldTop + 1;
    $.y2 = $.y1 + 5;
    drawVertical();
    return $out();
}
function drawBall() {
    $in();
    $.x1 = $.ballX / 3 + playfieldLeft;
    $.y1 = $.ballY / 3 + playfieldTop + 1;
    $.y2 = $.y1 + 1;
    drawVertical();
    $.x1++;
    drawVertical();
    return $out();
}
function updateBall() {
    $in();
    $.ballX += $.ballSpeedX;
    $.ballY += $.ballSpeedY;
    if ($.ballY < 0) {
        $.ballY = 0;
        $.ballSpeedY *= -1;
    } else if ($.ballY > subgridHeight - 6) {
        $.ballY = subgridHeight - 6;
        $.ballSpeedY *= -1;
    }
    if ($.ballSpeedX > 0) {
        if ($.ballX > subgridWidth - 9) {
            $.yOffset = $.ballY - $.p2Y + 5;
            if ($.yOffset >= 0 && $.yOffset < 23) {
                $.ballX = subgridWidth - 9;
                if ($.yOffset < 3) {
                    $.ballSpeedY = -3;
                } else if ($.yOffset < 6) {
                    $.ballSpeedY = -2;
                } else if ($.yOffset < 9) {
                    $.ballSpeedY = -1;
                } else if ($.yOffset < 14) {
                    $.ballSpeedY = 0;
                } else if ($.yOffset < 17) {
                    $.ballSpeedY = 1;
                } else if ($.yOffset < 20) {
                    $.ballSpeedY = 2;
                } else {
                    $.ballSpeedY = 3;
                }
                if ($.ballSpeedX < 3) {
                    $.volleyCount++;
                    if ($.volleyCount === 3) {
                        $.ballSpeedX++;
                        $.volleyCount = 0;
                    }
                }
                $.ballSpeedX *= -1;
                $.ballPlayer = 1;
            } else {
                $.score1++;
                resetBall1();
            }
        }
    } else {
        if ($.ballX < 3) {
            $.yOffset = $.ballY - $.p1Y + 5;
            if ($.yOffset >= 0 && $.yOffset < 23) {
                $.ballX = 3;
                $.yOffset = $.ballY - $.p1Y + 5;
                if ($.yOffset < 3) {
                    $.ballSpeedY = -3;
                } else if ($.yOffset < 6) {
                    $.ballSpeedY = -2;
                } else if ($.yOffset < 9) {
                    $.ballSpeedY = -1;
                } else if ($.yOffset < 14) {
                    $.ballSpeedY = 0;
                } else if ($.yOffset < 17) {
                    $.ballSpeedY = 1;
                } else if ($.yOffset < 20) {
                    $.ballSpeedY = 2;
                } else {
                    $.ballSpeedY = 3;
                }
                if ($.ballSpeedX > -3) {
                    $.volleyCount++;
                    if ($.volleyCount === 3) {
                        $.ballSpeedX--;
                        $.volleyCount = 0;
                    }
                }
                $.ballSpeedX *= -1;
                $.ballPlayer = 0;
            } else {
                $.score2++;
                resetBall2();
            }
        }
    }
    return $out();
}
function tick() {
    $in();
    $.color = 1;
    drawPlayfield();
    $.color = 3;
    drawPlayer1();
    drawPlayer2();
    drawBall();
    drawScore();
    if (up1() && $.p1Y > 3)
        $.p1Y -= 3;
    if (down1() && $.p1Y < subgridHeight - 18)
        $.p1Y += 3;
    if (up2() && $.p2Y > 3)
        $.p2Y -= 3;
    if (down2() && $.p2Y < subgridHeight - 18)
        $.p2Y += 3;
    updateBall();
    $.color = 0;
    drawPlayer1();
    $.color = 2;
    drawPlayer2();
    $.color = $.ballPlayer ? 2 : 0;
    drawBall();
    drawScore();
    return $out();
}
$.p1Y = 51;
$.p2Y = 51;
for ($.y = 0;; $.y++) {
    setBackground($.y, $.y < scoreTop ? 1 : 3);
    for ($.x = 0;; $.x++) {
        setPixel($.x, $.y, 3);
        if ($.x === xMax)
            break;
    }
    if ($.y === yMax)
        break;
}
if (rnd(2))
    resetBall1();
else
    resetBall2();