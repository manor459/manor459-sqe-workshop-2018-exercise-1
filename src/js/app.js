import $ from 'jquery';
import {getTaggedJsonCode, parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let parsedCodeNodes = getTaggedJsonCode(JSON.stringify(parsedCode));
        $('#tableViewRows').empty();
        let CodeNodesRowsHTML;
        if(parsedCodeNodes!=null) {
            parsedCodeNodes.forEach(function (currentNode) {
                CodeNodesRowsHTML = CodeNodesRowsHTML + '<tr>' + '<td>' + currentNode.line + '</td>'+ '<td>' + currentNode.type + '</td>'+ '<td>' + currentNode.name + '</td>'+ '<td>' + currentNode.condition + '</td>'+ '<td>' + currentNode.value + '</td>' + '</tr>';
            });
        }
        $('#tableViewRows').append(CodeNodesRowsHTML);
    });
});

