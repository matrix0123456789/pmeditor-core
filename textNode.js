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
        if (path[0] > 1)
            return [path[0] - 1]
        else
            return null;
    }

    movePointerRight(path) {
        path[0] = path[0] || 0;
        if (path[0] < this.content.length)
            return [path[0] + 1]
        else
            return null;
    }

    deleteOnce(path) {
        if (path[0] > 1) {
            this.content = this.content.substr(0, path[0] - 1) + this.content.substr(path[0]);
            return [path[0] - 1]
        } else
            return null;
    }
}