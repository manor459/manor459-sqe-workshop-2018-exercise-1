import * as esprima from 'esprima';
import * as escodegen  from 'escodegen';

const parseCode = (codeToParse) => {
    let parsedJson = esprima.parseScript(codeToParse,{loc:true});
    return parsedJson;
};
const getTaggedJsonCode =(parsedJSON) => {

    HtmlViewData=[];
    tagJSON(JSON.parse(parsedJSON));

    return HtmlViewData;
};

const JsonTypeToHandlerMap={
    'ExpressionStatement':tagExpressionStatement,
    'VariableDeclaration':tagVariableDeclaration,
    'AssignmentExpression':tagAssignmentExpression,
    'ReturnStatement':tagReturnStatement,
    'IfStatement':tagIfStatement,
    'WhileStatement':tagWhileStatement,
    'ForStatement':tagForStatement,
    'FunctionDeclaration':tagFunction,
    'Identifier':tagIdentifier,
    'Literal':tagLiteral,
    'BinaryExpression':tagBinaryExpression,
    'MemberExpression':tagMemberExpression,
    'VariableDeclarator':tagVariableDeclarator,
    'UpdateExpression':tagUpdateExpression,
    'Program': tagProgram,
    'UnaryExpression':tagUnaryExpression,
};

let HtmlViewData;

function tagJSON(JSON) {
    if(JSON==null) {return JSON;}
    return JsonTypeToHandlerMap[JSON.type](JSON);
}
function tagUnaryExpression(jsonNode) {return escodegen.generate(jsonNode);}
function tagProgram(jsonNode) {jsonNode.body.forEach(function (currNode) { tagJSON(currNode);});}
function tagUpdateExpression(jsonNode) {return escodegen.generate(jsonNode);}
function tagMemberExpression(jsonNode) {return escodegen.generate(jsonNode);}
function tagVariableDeclarator(jsonNode) {
    let currentNode = new Node(jsonNode.loc.start.line,'variable declarator', tagJSON(jsonNode.id),tagJSON(jsonNode.init),'');
    HtmlViewData.push(currentNode);
}

function tagIdentifier(jsonNode) {return escodegen.generate(jsonNode);}
function tagLiteral(jsonNode) {return jsonNode.value;}

function tagBinaryExpression(jsonNode) {return escodegen.generate(jsonNode);}

function tagFunction(jsonNode) {
    let currentNode = new Node(jsonNode.loc.start.line, 'function declaration',jsonNode.id.name,'','');
    HtmlViewData.push(currentNode);
    if(jsonNode.params!=null){jsonNode.params.forEach(function (currParam) {HtmlViewData.push(new Node(currParam.loc.start.line, 'variable declaration', currParam.name, '', ''));});}
    if(jsonNode.body!=null&&jsonNode.body.body!=null){jsonNode.body.body.forEach(function(nodeInBody){tagJSON(nodeInBody);});}
}

function tagVariableDeclaration(jsonNode) {
    if(jsonNode.declarations!=null){
        jsonNode.declarations.forEach(function (currDeclaration) {
            tagJSON(currDeclaration);
        });
    }
}

function tagExpressionStatement(jsonNode) {return tagJSON(jsonNode.expression);}

function tagReturnStatement(jsonNode) {
    let currentNode = new Node(jsonNode.loc.start.line,'return statement','', tagJSON(jsonNode.argument),'');
    HtmlViewData.push(currentNode);
}

function tagWhileStatement(jsonNode) {
    let currentNode = new Node(jsonNode.loc.start.line,'while statement','','',tagJSON(jsonNode.test.left) + ' ' + jsonNode.test.operator + ' ' + tagJSON(jsonNode.test.right));
    HtmlViewData.push(currentNode);
    if(jsonNode.body!=null) {
        if(jsonNode.body.body!=null) {jsonNode.body.body.forEach(function (nodeInBody) {tagJSON(nodeInBody);});}
        else {jsonNode.body.body.forEach(function (nodeInBody) {tagJSON(nodeInBody);});}
    }
}

function tagIfStatement(jsonNode,elseIf) {
    let type = 'if statement';
    if(elseIf){type='else if statement';}
    let currentNode = new Node(jsonNode.loc.start.line,type,'','',tagJSON(jsonNode.test.left) + ' ' + jsonNode.test.operator + ' ' + tagJSON(jsonNode.test.right));
    HtmlViewData.push(currentNode);
    if(jsonNode.consequent!=null){tagJSON(jsonNode.consequent);}
    if (jsonNode.alternate!=null) {
        if(jsonNode.alternate.type  === jsonNode.type){tagIfStatement(jsonNode.alternate, true);}
        else {tagJSON(jsonNode.alternate);}
    }
}

function tagForStatement(jsonNode) {
    let currentNode = new Node(jsonNode.loc.start.line, 'for statement','','',tagJSON(jsonNode.test.left) + ' ' + jsonNode.test.operator + ' ' + tagJSON(jsonNode.test.right));
    HtmlViewData.push(currentNode);
    tagJSON(jsonNode.init);
    tagJSON(jsonNode.update);
    if(jsonNode.consequent!=null&&jsonNode.consequent.body!=null) {
        jsonNode.consequent.body.forEach(function (nodeInBody) {
            tagJSON(nodeInBody);
        });
    }
}

function tagAssignmentExpression(jsonNode) {
    let currentNode = new Node(jsonNode.loc.start.line,'assignment expression',tagJSON(jsonNode.left),tagJSON(jsonNode.right),'');
    HtmlViewData.push(currentNode);
}

class Node {constructor(line, type, name, value, condition) {this.line = line;this.type = type;this.name = name;this.value = value;this.condition = condition;}}

export {parseCode,getTaggedJsonCode,Node};
