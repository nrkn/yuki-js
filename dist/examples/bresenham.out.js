'use strict';
const size = arr => arr.length;
const CallStack = (maxSize, addressSize = 2) => {
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
};
const Memory = (lets, debug = false) => {
    const $ = {};
    const numbers = new Map();
    lets.forEach(l => {
        if (l.type === 'array') {
            $[l.name] = ArrayProxy(l, debug);
        } else {
            numbers.set(l.name, l);
            $[l.name] = 0;
        }
    });
    const handler = {
        set: (target, key, value) => {
            if (typeof key !== 'string')
                return false;
            const yukiNumber = numbers.get(key);
            if (!yukiNumber)
                return false;
            target[key] = ensureNumber(value, yukiNumber);
            return true;
        }
    };
    return new Proxy($, handler);
};
const ArrayProxy = (a, debug) => {
    const arr = Array(a.length).fill(0);
    const handler = {
        get: (target, key) => {
            if (typeof key === 'symbol')
                return target[key];
            const index = typeof key === 'number' ? key : parseInt(key, 10);
            if (isNaN(index) && debug)
                return target[key];
            if (isNaN(index) || index < 0 || index >= a.length)
                throw Error(`Unexpected index ${ key }`);
            return target[index];
        },
        set: (target, key, value) => {
            if (typeof key === 'symbol')
                return false;
            const index = typeof key === 'number' ? key : parseInt(key, 10);
            if (isNaN(index) || index < 0 || index >= a.length)
                throw Error(`Index out of bounds: ${ index }`);
            target[index] = ensureNumber(value, a);
            return true;
        }
    };
    return new Proxy(arr, handler);
};
const ensureNumber = (value, l) => l.signed ? unsignedToSigned(value, l.bitLength) : signedToUnsigned(value, l.bitLength);
const signedToUnsigned = (value, bitLength) => {
    value = Math.floor(value);
    const maxUint = maxValue(bitLength);
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value < 0) {
        value += maxUint;
    }
    return value;
};
const unsignedToSigned = (value, bitLength) => {
    value = Math.floor(value);
    const maxUint = maxValue(bitLength);
    const maxInt = Math.floor(maxUint / 2 - 1);
    while (value >= maxUint) {
        value -= maxUint;
    }
    while (value > maxInt) {
        value -= maxUint;
    }
    return value;
};
const maxValue = bitLength => Math.pow(2, bitLength);
const {$in, $out} = CallStack(799, 2);
function log(value) {
    console.log(value);
}
const $ = Memory([
    {
        'name': 'x0',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'y0',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'x1',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'y1',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'dX',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'dY',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'sX',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'sY',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'err',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'err2',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'line',
        'valueType': 'let',
        'type': 'array',
        'bitLength': 16,
        'length': 100,
        'signed': true
    },
    {
        'name': 'lineIndex',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 8,
        'signed': false
    },
    {
        'name': 'i',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    },
    {
        'name': 'absValue',
        'valueType': 'let',
        'type': 'number',
        'bitLength': 16,
        'signed': true
    }
]);
function abs() {
    $in();
    if ($.absValue < 0)
        $.absValue *= -1;
    return $out();
}
$.x0 = 10;
$.y0 = 5;
$.x1 = 37;
$.y1 = 19;
$.line[0] = $.x0;
$.line[1] = $.y0;
$.lineIndex = 2;
$.absValue = $.x1 - $.x0;
abs();
$.dX = $.absValue;
$.absValue = $.y1 - $.y0;
abs();
$.dY = $.absValue;
$.sX = $.x0 < $.x1 ? 1 : -1;
$.sY = $.y0 < $.y1 ? 1 : -1;
$.err = $.dX - $.dY;
while ($.x0 !== $.x1 || $.y0 !== $.y1) {
    $.err2 = 2 * $.err;
    if ($.err2 > $.dY * -1) {
        $.err -= $.dY;
        $.x0 += $.sX;
    }
    if ($.err2 < $.dX) {
        $.err += $.dX;
        $.y0 += $.sY;
    }
    $.line[$.lineIndex] = $.x0;
    $.line[$.lineIndex + 1] = $.y0;
    $.lineIndex += 2;
}
log($.lineIndex);
for ($.i = 0; $.i < $.lineIndex; $.i++) {
    log($.line[$.i]);
}