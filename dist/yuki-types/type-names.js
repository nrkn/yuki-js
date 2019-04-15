"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
exports.typeNames = ['Bool', 'BoolArr'];
exports.typeFactories = {};
exports.typeFactories.Bool = index_1.Bool;
exports.typeFactories.BoolArr = index_1.BoolArray;
const createInt = (bitLength) => {
    const name = `Int${bitLength}`;
    exports.typeNames.push(name);
    exports.typeFactories[name] = index_1.IntFactory(bitLength);
};
const createUint = (bitLength) => {
    const name = `Uint${bitLength}`;
    exports.typeNames.push(name);
    exports.typeFactories[name] = index_1.UintFactory(bitLength);
};
const createIntArray = (bitLength) => {
    const name = `Int${bitLength}Arr`;
    exports.typeNames.push(name);
    exports.typeFactories[name] = index_1.IntArrayFactory(bitLength);
};
const createUintArray = (bitLength) => {
    const name = `Uint${bitLength}Arr`;
    exports.typeNames.push(name);
    exports.typeFactories[name] = index_1.UintArrayFactory(bitLength);
};
for (let i = 2; i <= 32; i++) {
    createInt(i);
    createUint(i);
    createIntArray(i);
    createUintArray(i);
}
//# sourceMappingURL=type-names.js.map