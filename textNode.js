import {InlineAbstract} from "./inlineAbstract"
export class TextNode extends InlineAbstract{
    constructor(content=""){
        super();
        this.content=content;
    }
}