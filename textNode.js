import {InlineAbstract} from "./inlineAbstract"

export class TextNode extends InlineAbstract {
    constructor(content = "") {
        super();
        this.content = content;
    }

    getEndPointer() {
        return [this.content.length];
    }

    movePointerLeft(path) {
        if (path[0] > 0)
            return [path[0] - 1]
        else
            return null;
    }

    movePointerRight(path) {
        path[0] = path[0] || 0;
        if (path[0] < this.content.length)
            return [path[0] + 1];
        else
            return null;
    }

    deleteOnce(path) {
        if (path[0] > 0) {
            this.content = this.content.substr(0, path[0] - 1) + this.content.substr(path[0]);
            return [path[0] - 1]
        } else
            return null;
    }

    getFragment(start, end) {
        let ret = new TextNode();
        if (start.length === 0) {
            if (end.length === 0) {
                ret.content = this.content;
            } else {
                ret.content = this.content.substr(0, end[0]);
            }
        } else {

            if (end.length === 0) {
                ret.content = this.content.substr(start[0]);
            } else {
                ret.content = this.content.substr(start[0], end[0]);
            }
        }
        return ret;
    }

    clone() {
        let ret = new TextNode();
        ret.content = this.content;
        return ret;
    }
    serialize(){
        return this.content;
    }
    toText(){
        return this.content;
    }
}