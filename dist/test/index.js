"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const assert = require("assert");
const esprima_1 = require("esprima");
const __1 = require("..");
const kitchenSinkJs = fs_1.readFileSync('./src/test/fixtures/kitchen-sink.yuki.js', 'utf8');
const kitchenSinkAst = esprima_1.parseModule(kitchenSinkJs);
describe('yuki-js', () => {
    it('compiles', () => {
        const { main } = __1.compile(kitchenSinkAst);
        assert(main);
    });
});
//# sourceMappingURL=index.js.map