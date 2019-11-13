import {Paragraph} from "./paragraph";

export class Document {
    constructor() {
        this._content = [];
    }

    get content() {
        return this.content.slice();
    }
    append(element){
        if(element instanceof String)
            return this .appendText(element);
    }
    appendText(text){
        let lastElement=this._content[this._content.length-1];
        if(!lastElement instanceof Paragraph)
        {
            lastElement=new Paragraph();
            this.appendBlock(lastElement);
        }
        lastElement.appendText(text);
    }
    appendBlock(block){
        this._content.push(block);
    }
}