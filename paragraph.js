import {BlockAbstract} from "./blockAbstract";
import {TextNode} from "./textNode";
import {CreateEventDispatcher} from "./eventDispatcher";

export class Paragraph extends BlockAbstract {
    constructor() {
        super();
        this._content = [];
        this.contentChanged = CreateEventDispatcher();
    }

    get content() {
        return this._content.slice();
    }

    addText(text, path=[]) {
        this._content.push(new TextNode(text));
        this.contentChanged.dispatch();
    }
    getEndPointer() {
        const last = this._content[this.content.length - 1];
        if (last)
            return [last, last.getEndPointer()]
        else
            return [];
    }

    getStartPointer() {
        const first = this._content[0];
        if (first)
            return [first, first.getStartPointer()]
        else
            return [];
    }
}