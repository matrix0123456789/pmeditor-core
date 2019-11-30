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

    movePointerLeft(path) {
        let element = path[0];
        if (!element)
            return [];
        let result = element.movePointerLeft(path.slice(1));
        if (result && result.length > 0)
            return [element, ...result];
        else {
            let index = this._content.indexOf(element);
            if (index >= 1)
                return this.movePointerLeft([this._content[index - 1], ...this._content[index - 1].getEndPointer()]);
            else
                return [];
        }
    }

    movePointerRight(path) {
        let element = path[0];
        if (!element)
            return [this._content[0]];
        let result = element.movePointerRight(path.slice(1));
        if (result && result.length > 0)
            return [element, ...result];
        else {
            let index = this._content.indexOf(element);
            if (this._content[index + 1])
                return [this._content[index + 1], ...this._content[index + 1].movePointerRight([])];
            else
                return null;
        }
    }

    deleteOnce(path) {
        let element = path[0];
        if (!element)
            return null;
        let result = element.deleteOnce(path.slice(1));
        if (result)
            return [element, ...result];
        else {
            let index = this._content.indexOf(element);
            if (index >= 1) {
                this._content.splice(index, 1);
                return this.deleteOnce([this._content[index - 1], ...this._content[index - 1].getEndPointer()]);
            } else
                return null;
        }
    }

    serialize(xml) {
        const node = xml.createElement('paragraph');
        for (let child of this._content) {
            node.append(child.serialize());
        }
        return node;
    }

    getFragment(start, end) {
        let ret = new Paragraph();
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

    clone() {
        let ret = new Paragraph();
        ret._content = this._content.map(x => x.clone());
        return ret;
    }

    toText() {
        return this._content.map(x => x.toText()).join('');
    }

    joinContent(node) {
        this._content = [...this._content, ...node._content];
    }

    split(path) {
        let left = this.getFragment([], path);
        let right = this.getFragment(path, this.getEndPointer());
        return [left, right];
    }
}