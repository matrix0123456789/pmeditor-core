import {BlockAbstract} from "./blockAbstract";
import {TextNode} from "./textNode";

export class Paragraph extends BlockAbstract {
    constructor() {
        super();
        this._content = [];
        this.contentChanged = CreateEventDispatcher();
    }

    get content() {
        return this._content.slice();
    }

    appendText(text) {
        this._content.push(new TextNode(text));
        this.contentChanged.dispatch();
    }
}