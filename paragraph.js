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

    addText(text, path = []) {
        let index = this._content.indexOf(path[0]);
        let node = new TextNode(text);
        this._content = [...this._content.slice(0, index + 1), node, ...this._content.slice(index + 1)]
        this.contentChanged.dispatch();
        return [node, ...node.getEndPointer()];
    }

    getEndPointer() {
        const last = this._content[this.content.length - 1];
        if (last)
            return [last, ...last.getEndPointer()]
        else
            return [];
    }
}