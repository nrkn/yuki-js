"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const bresenham_1 = require("./bresenham");
fs_1.writeFileSync('./dist/examples/bresenham.out.js', bresenham_1.bresenhamOut, 'utf8');
//# sourceMappingURL=index.js.map