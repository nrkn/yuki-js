"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const esprima_1 = require("esprima");
const escodegen_1 = require("escodegen");
const __1 = require("..");
const build1Bit = () => {
    console.log('1 bit');
    const gameYukiSource = fs_1.readFileSync('./examples/1-bit/src/game.yuki.js', 'utf8');
    const gameLibSource = fs_1.readFileSync('./examples/1-bit/src/lib.js', 'utf8');
    const yukiAst = esprima_1.parseScript(gameYukiSource, { loc: true });
    const externalLib = esprima_1.parseScript(gameLibSource);
    const externalScope = {
        consts: [],
        functions: ['up', 'down', 'left', 'right', 'setPixel']
    };
    const requiredFunctions = ['tick'];
    const { program, programSize } = __1.compile(yukiAst, { externalLib, externalScope, requiredFunctions });
    const source = escodegen_1.generate(program);
    fs_1.writeFileSync('./examples/1-bit/main.js', source, 'utf8');
    console.log({ programSize });
};
const buildChannelY = () => {
    console.log('channel Y');
    const gameYukiSource = fs_1.readFileSync('./examples/channel-y/src/game.yuki.js', 'utf8');
    const gameLibSource = fs_1.readFileSync('./examples/channel-y/src/lib.js', 'utf8');
    const yukiAst = esprima_1.parseScript(gameYukiSource, { loc: true });
    const externalLib = esprima_1.parseScript(gameLibSource);
    const externalScope = {
        consts: [],
        functions: [
            'up1', 'down1', 'left1', 'right1', 'up2', 'down2', 'left2', 'right2',
            'setPixel', 'setBackground', 'rnd'
        ]
    };
    const { program, programSize } = __1.compile(yukiAst, {
        externalLib,
        externalScope,
        maxProgramSize: 2048,
        memorySize: 64,
        requiredFunctions: ['tick']
    });
    const source = escodegen_1.generate(program);
    fs_1.writeFileSync('./examples/channel-y/main.js', source, 'utf8');
    console.log({ programSize });
};
build1Bit();
buildChannelY();
//# sourceMappingURL=build-examples.js.map