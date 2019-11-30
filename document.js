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
        let index = this._content.indexOf(path[0]);
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

    movePointerLeft(path) {
        let element = path[0];
        if (!element)
            return [];
        let result = element.movePointerLeft(path.slice(1));
        if (result)
            return [element, ...result];
        else {
            let index = this._content.indexOf(element);
            if (index >= 1)
                return [this._content[index - 1], ...this._content[index - 1].getEndPointer()];
            else
                return [];
        }
    }

    movePointerRight(path) {
        let element = path[0];
        if (!element)
            return [];
        let result = element.movePointerRight(path.slice(1));
        if (result)
            return [element, ...result];
        else {
            let index = this._content.indexOf(element);
            if (this._content[index + 1])
                return [this._content[index + 1]];
            else
                return path;
        }
    }

    deleteOnce(path) {
        let element = path[0];
        if (!element)
            return path;
        if (element.deleteOnce) {
            let newPath = element.deleteOnce(path.slice(1));
            return [element, ...newPath];
        }
    }

    getFragment(start, end) {
        let ret = new Document();
        let started = start.length === 0;
        for (let node of this._content) {
            if (!started && start[0] === node) {
                started = true;
                if (end[0] === node) {
                    ret._content.push(node.getFragment(start.slice(1), end.slice(1)));
                    break;
                } else {
                    ret._content.push(node.getFragment(start.slice(1), []));
                }
            } else if (started && end[0] === node) {
                ret._content.push(node.getFragment([], end.slice(1)));
                break;
            } else if (started) {
                ret._content.push(node.clone());
            }
        }
        return ret;
    }

    serialize() {
        const xml = document.implementation.createDocument(null, 'pmeditor');
        for (let child of this._content) {
            xml.firstElementChild.append(child.serialize(xml));
        }
        const serializer = new XMLSerializer();
        return serializer.serializeToString(xml);
    }

    clone() {
        let ret = new Document();
        ret._content = this._content.map(x => x.clone());
        return ret;
    }

    toText() {
        return this._content.map(x => x.toText()).join('\r\n');
    }
}