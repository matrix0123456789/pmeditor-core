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

    add(element, path = []) {
        if (element instanceof String)
            return this.addText(element, path);
    }

    addText(text, path = []) {
        let element = path[0];
        if (!element)
            element = this._content[0];
        if (!(element instanceof Paragraph)) {
            element = new Paragraph();
            this.addBlock(element, path);
            path = [];
        }
        let newPath = element.addText(text, path.slice(1));
        return [element, ...newPath];
    }

    addBlock(block, path = []) {
        let index = this._content.indexOf(this._content);
        this._content = [...this._content.slice(0, index + 1), block, ...this._content.slice(index + 1)]
        this.contentChanged.dispatch();
        return [block];
    }

    getEndPointer() {
        const last = this._content[this.content.length - 1];
        if (last)
            return [last, ...last.getEndPointer()]
        else
            return [];
    }
}