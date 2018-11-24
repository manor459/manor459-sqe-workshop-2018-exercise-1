import * as esprima from 'esprima';
const parseCode = (codeToParse) => {
    let parsedJson = esprima.parseScript(codeToParse,{loc:true});
    return parsedJson;
};
const getTaggedJsonCode =(parsedJSON) => {
    HtmlViewData=[];
    let x =JSON.parse(parsedJSON);
    x.body.forEach(function (expression) {tagJSON(expression);});
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
};

let HtmlViewData;

function tagJSON(JSON) {
    if(JSON==null) {return JSON;}
    return JsonTypeToHandlerMap[JSON.type](JSON);
}

function tagIdentifier(jsonNode) {return jsonNode.name;}
function tagLiteral(jsonNode) {return jsonNode.value;}

function tagBinaryExpression(jsonNode) {return tagJSON(jsonNode.left()+jsonNode.operator+jsonNode.right)}

function tagFunction(jsonNode) {
    let currentNode = new Node(jsonNode.loc.start.line, 'function declaration',jsonNode.id.name,'','');
    HtmlViewData.push(currentNode);
    if(jsonNode.params!=null){jsonNode.params.forEach(function (currParam) {HtmlViewData.push(new Node(currParam.loc.start.line, 'variable declaration', currParam.name, '', ''));});}
    if(jsonNode.body!=null&&jsonNode.body.body!=null){jsonNode.body.body.forEach(function(nodeInBody){tagJSON(nodeInBody);});}
}

function tagVariableDeclaration(jsonNode) {
    if(jsonNode.declarations!=null){
    jsonNode.declarations.forEach(function (currDeclaration) {
        let currentNode;
        if(currDeclaration.init!=null) {currentNode= new Node(currDeclaration.loc.start.line, 'variable declaration', currDeclaration.id.name, currDeclaration.init.value, '');}
        else {currentNode= new Node(currDeclaration.loc.start.line, 'variable declaration', currDeclaration.id.name, '', '');}
        HtmlViewData.push(currentNode);
    });}
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

function tagIfStatement(jsonNode) {
    let currentNode = new Node(jsonNode.loc.start.line,'if statement','','',tagJSON(jsonNode.test.left) + ' ' + jsonNode.test.operator + ' ' + tagJSON(jsonNode.test.right));
    HtmlViewData.push(currentNode);
    if(jsonNode.consequent!=null&&jsonNode.consequent.body!=null) {
        jsonNode.consequent.body.forEach(function (nodeInBody) {
            tagJSON(nodeInBody);
        });
    }
    if (jsonNode.alternate!=null&&jsonNode.alternate.body!=null) {
        jsonNode.alternate.body.forEach(function (nodeInElseBody) {
            tagJSON(nodeInElseBody);
        });
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
