import assert from 'assert';
import {parseCode,getTaggedJsonCode,Node} from '../src/js/code-analyzer';
import * as esprima from 'esprima';

describe('Tagging JSON file To html table', () => {
    it('tag variable decleration', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('let x=3'))),[new Node(1,'variable declaration','x','3','')]);});
    it('tag assianment statement', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('x = x+1'))),[new Node(1,'assignment expression','x','x+1','')]);});
    it('tag assianment statement nested', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('y = y*x+1'))),[new Node(1,'assignment expression','y','y*x+1','')]);});
    it('tag function statement', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('function func(){}'))),[new Node(1,'function declaration','func','','')])});
    it('tag function statement with body', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('function func(){let x=9}'))),[new Node(1,'function declaration','func','',''),
            new Node(1,'variable declaration','x','9','')])});
    it('tag function statement with return', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('function func(){return 2}'))),[new Node(1,'function declaration','func','',''),
            new Node(1,'return statement','','2','')])});
    it('tag while statement', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('while(x=2){}'))),[new Node(1,'while statement','','','x = 2')])});
    it('tag for statement', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('for(let i=0;i<2;i=i+1){}'))),[new Node(1,'for statement','','','i < 2'),
            new Node(1,'variable declaration','i','0',''),
            new Node(1,'assignment expression','i','i+1','')
        ])});
    it('tag if statement', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('if(x<2){}'))),[new Node(1,'if statement','','','x < 2')])});
    it('tag if else statementi', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('if(x<2){let x=3}else{}'))),[new Node(1,'if statement','','','x < 2'),
            new Node(1,'variable declaration','x','3','')])});
    it('tag if else statement', () => {
        assert.deepEqual(getTaggedJsonCode(JSON.stringify(parseCode('if(x<2){}else{let x=1}'))),[new Node(1,'if statement','','','x < 2'),
            new Node(1,'variable declaration','x','1','')])});
});
