"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsExternal = (scope, name, key = 'any') => {
    const names = key === 'any' ?
        [...scope.consts, ...scope.functions] :
        scope[key];
    if (names.includes(name))
        return true;
    return false;
};
exports.existsLocal = (scope, name, key = 'any') => {
    const names = key === 'any' ?
        [
            ...scope.consts, ...scope.functions, ...scope.numbers, ...scope.arrays
        ] :
        scope[key];
    if (names.includes(name))
        return true;
    return false;
};
exports.existsGlobal = (scope, name, key = 'any') => {
    const names = key === 'any' ?
        [
            ...scope.consts, ...scope.functions, ...scope.numbers, ...scope.arrays
        ] :
        scope[key];
    if (names.includes(name))
        return true;
    if (scope.parent)
        return exports.existsGlobal(scope.parent, name, key);
    return false;
};
exports.enterScope = (options, type) => {
    const { scope } = options;
    const newScope = {
        type,
        consts: [],
        functions: [],
        numbers: [],
        arrays: [],
        parent: scope
    };
    options.scope = newScope;
};
exports.exitScope = (options) => {
    const { parent } = options.scope;
    if (parent === undefined)
        throw Error('No scope to exit!');
    options.scope = parent;
};
exports.countScopeDepthTo = (scope, type) => {
    let depth = 0;
    if (scope.type === type)
        return depth;
    let { parent } = scope;
    depth = 1;
    while (parent) {
        if (parent.type === type)
            return depth;
        parent = parent.parent;
        depth++;
    }
    return -1;
};
//# sourceMappingURL=scope.js.map