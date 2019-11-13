import {BlockAbstract} from "./blockAbstract";
import {TextNode} from "./textNode";

export class Paragraph extends BlockAbstract {
    constructor() {
        this._content = [];
    }

    get content() {
        return this.content.slice();
    }

    appendText(text) {
        this._content.push(new TextNode(text));
    }
}