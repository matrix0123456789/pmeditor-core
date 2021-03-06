import {BlockAbstract} from "./blockAbstract";
import {TextNode} from "./textNode";
import {CreateEventDispatcher} from "./eventDispatcher";
import {ParseXml} from "./parsers/xml";

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
        if (path.length > 1 && path[0].addText) {
            let newPath = path[0].addText(text, path.slice(1))
            return [path[0], ...newPath];
        } else {
            let index = this._content.indexOf(path[0]);
            let node = new TextNode(text);
            this._content = [...this._content.slice(0, index + 1), node, ...this._content.slice(index + 1)]
            this.contentChanged.dispatch();
            return [node, ...node.getEndPointer()];
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

    static fromXml(xml) {
        let ret = new Paragraph();
        ret._content = Array.from(xml.childNodes).map(x => {
            if (x instanceof Text) {
                return new TextNode(x.textContent);
            } else {
                return ParseXml(x);
            }
        });
        return ret;
    }
}