import {Paragraph} from "./paragraph";
import {CreateEventDispatcher} from "./eventDispatcher";
import {NodeAbstract} from "./NodeAbstract";
import {ParseXml} from "./parsers/xml";

export class Document extends NodeAbstract {
    constructor(content = []) {
        super();
        this._content = content;
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
        return [block, ...block.getStartPointer()];
    }

    addSubdocument(subdocument, path) {
        let endPath = [];
        let index = this._content.indexOf(path[0]);
        if (path[0] && path[0].split) {
            let [first, second] = path[0].split(path.slice(1));
            let toAdd = subdocument.content.slice();
            for (let i = 0; i < toAdd.length; i++) {
                let block = toAdd[i];
                if (i === 0) {
                    if (first.joinContent && block.joinContent) {
                        first.joinContent(block);
                        toAdd[i] = first;
                    } else {
                        toAdd = [first, ...toAdd];
                        i++;
                    }
                }
                if (i === toAdd.length - 1) {
                    endPath = [toAdd[i], ...toAdd[i].getEndPointer()];
                    if (second.joinContent && block.joinContent) {
                        toAdd[i].joinContent(second);
                    } else {
                        toAdd.push(second);
                    }
                }
            }
            this._content = [...this._content.slice(0, index), ...toAdd, ...this._content.slice(index + 1)];
        } else {
            this._content = [...this._content.slice(0, index + 1), ...subdocument.content, ...this._content.slice(index + 1)];
            let last = subdocument.content[subdocument.content.length - 1];
            endPath = [last, ...last.getEndPointer()];
        }
        return endPath;
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
        return [];
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

    static fromXml(xml) {
        let ret = new Document();
        ret._content = Array.from(xml.childNodes).map(x => ParseXml(x));
        return ret;
    }
}