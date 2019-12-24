import {Paragraph} from "./paragraph";
import {CreateEventDispatcher} from "./eventDispatcher";
import {NodeAbstract} from "./NodeAbstract";

export class Document extends NodeAbstract {
    constructor() {
        super();
        this._content = [];
        this.contentChanged = CreateEventDispatcher();
    }

    get content() {
        return this._content.slice();
    }

    movePointerLeft(path) {
        let result = super.movePointerLeft(path);
        return result || path;
    }

    movePointerRight(path) {
        let result = super.movePointerRight(path);
        return result || path;
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
        if (path[0] && path[0].split && block.joinContent) {
            let [first, second] = path[0].split(path.slice(1));
            block.joinContent(second);
            this._content = [...this._content.slice(0, index), first, block, ...this._content.slice(index + 1)];
        } else {
            this._content = [...this._content.slice(0, index + 1), block, ...this._content.slice(index + 1)];
        }
        this.contentChanged.dispatch();
        return [block];
    }

    deleteOnce(path) {
        let element = path[0];
        let previous = this._content[this._content.indexOf(element) - 1];
        if (!element)
            return path;
        if (element.deleteOnce) {
            let newPath = element.deleteOnce(path.slice(1));
            if (newPath)
                return [element, ...newPath];
            else if (element instanceof Paragraph && previous instanceof Paragraph) {
                previous.joinContent(element);
                this._content = this._content.filter(x => x !== element);
                return [previous, ...previous.getEndPointer()];
            }
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

    toJSON() {
        return this.serialize();
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