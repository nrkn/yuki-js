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
    const libAst = esprima_1.parseScript(gameLibSource);
    const { main, memoryUsed, programSize } = __1.compile(yukiAst, { lib: libAst });
    const source = escodegen_1.generate(main);
    fs_1.writeFileSync('./examples/1-bit/main.js', source, 'utf8');
    console.log({ memoryUsed, programSize });
};
const buildChannelY = () => {
    console.log('channel Y');
    const gameYukiSource = fs_1.readFileSync('./examples/channel-y/src/game.yuki.js', 'utf8');
    const gameLibSource = fs_1.readFileSync('./examples/channel-y/src/lib.js', 'utf8');
    const yukiAst = esprima_1.parseScript(gameYukiSource, { loc: true });
    const libAst = esprima_1.parseScript(gameLibSource);
    const { main, memoryUsed, programSize } = __1.compile(yukiAst, {
        lib: libAst,
        maxProgramSize: 2048,
        memorySize: 64,
        requiredSubroutines: ['tick']
    });
    const source = escodegen_1.generate(main);
    fs_1.writeFileSync('./examples/channel-y/main.js', source, 'utf8');
    console.log({ memoryUsed, programSize });
};
build1Bit();
buildChannelY();
//# sourceMappingURL=build-examples.js.map