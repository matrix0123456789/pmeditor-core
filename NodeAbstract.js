export class NodeAbstract {
    getEndPointer() {
        const last = this._content[this._content.length - 1];
        if (last)
            return [last, ...last.getEndPointer()]
        else
            return [];
    }

    getStartPointer() {
        const first = this._content[0];
        if (first)
            return [first, ...first.getStartPointer()]
        else
            return [];
    }

    add(element, path = []) {
        if (element instanceof String)
            return this.addText(element, path);
        else if (element instanceof NodeAbstract)
            return this.addBlock(element, path)
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
                return [this._content[index - 1], ...this._content[index - 1].movePointerLeftFromPrevious()];
            else
                return null;
        }
    }

    movePointerRight(path) {
        let element = path[0];
        if (!element)
            return [this._content[0], ...this._content[0].movePointerRight([])];
        let result = element.movePointerRight(path.slice(1));
        if (result && result.length > 0)
            return [element, ...result];
        else {
            let index = this._content.indexOf(element);
            if (this._content[index + 1])
                return [this._content[index + 1], ...this._content[index + 1].movePointerRightFromPrevious()];
            else
                return null;
        }
    }

    movePointerRightFromPrevious() {
        return this.getStartPointer();
    }

    movePointerLeftFromPrevious() {
        return this.getEndPointer();
    }
}