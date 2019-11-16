import {Paragraph} from "./paragraph";
import {CreateEventDispatcher} from "./eventDispatcher";

export class Document {
    constructor() {
        this._content = [];
        this.contentChanged = CreateEventDispatcher();
    }

    get content() {
        return this._content.slice();
    }

    add(element, path=[]) {
        if (element instanceof String)
            return this.addText(element, path);
    }

    addText(text, path=[]) {
        let lastElement = this._content[this._content.length - 1];
        if (!(lastElement instanceof Paragraph)) {
            lastElement = new Paragraph();
            this.addBlock(lastElement);
        }
        lastElement.addText(text);
    }

    addBlock(block, path=[]) {
        this._content.push(block);
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