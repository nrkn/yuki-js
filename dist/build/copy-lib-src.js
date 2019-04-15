"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const root = './src/yuki-types';
const out = './lib-src';
const files = ['index.ts'];
files.forEach(name => {
    const inPath = path_1.join(root, name);
    const outPath = path_1.join(out, name);
    // hack :/
    const contents = fs_1.readFileSync(inPath, 'utf8').replace(/export\s/g, '');
    fs_1.writeFileSync(outPath, contents, 'utf8');
});
//# sourceMappingURL=copy-lib-src.js.map