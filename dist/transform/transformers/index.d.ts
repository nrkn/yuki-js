export declare const transformers: {
    Literal: (node: import("estree").Literal) => import("../node-types").PreYukiLiteral | undefined;
    VariableDeclaration: (node: import("estree").VariableDeclaration, parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => void;
    VariableDeclarator: (node: import("estree").VariableDeclarator, parent: import("estree").VariableDeclaration, options: import("../types").TransformOptions) => import("estree").VariableDeclarator | undefined;
    ArrayExpression: (node: import("estree").ArrayExpression, parent: import("../node-types").YukiNode) => import("../node-types").FreezeCallExpression | undefined;
    BlockStatement: (node: import("estree").BlockStatement, parent: import("../node-types").YukiNode) => import("estree").BlockStatement;
    FunctionDeclaration: (node: import("estree").FunctionDeclaration, _parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => import("estree").FunctionDeclaration;
    Identifier: (node: import("estree").Identifier, parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => import("estree").MemberExpression | undefined;
    ReturnStatement: (node: import("estree").ReturnStatement, _parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => import("estree").ReturnStatement;
    ContinueStatement: (node: import("estree").BreakStatement | import("estree").ContinueStatement, parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => void;
    BreakStatement: (node: import("estree").BreakStatement | import("estree").ContinueStatement, parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => void;
    AssignmentPattern: (node: import("estree").AssignmentPattern) => never;
    RestElement: (node: import("estree").RestElement, parent: import("../node-types").YukiNode) => void;
    AssignmentExpression: (node: import("estree").UpdateExpression | import("estree").AssignmentExpression, _parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => void;
    UpdateExpression: (node: import("estree").UpdateExpression | import("estree").AssignmentExpression, _parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => void;
    MemberExpression: (node: import("estree").MemberExpression, _parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => void;
    CallExpression: (node: import("estree").CallExpression, _parent: import("../node-types").YukiNode, options: import("../types").TransformOptions) => void;
};
