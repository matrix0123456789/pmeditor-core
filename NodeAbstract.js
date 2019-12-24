import {Path} from "./path";

export class NodeAbstract {
    getEndPointer() {
        const last = this._content[this._content.length - 1];
        if (last)
            return new Path(last).append(last.getEndPointer());
        else
            return Path.empty;
    }

    getStartPointer() {
        const first = this._content[0];
        if (first)
            return new Path(first).append(first.getStartPointer())
        else
            return Path.empty;
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
            return Path.empty;
        let result = element.movePointerLeft(path.slice(1));
        if (result && result.length > 0)
            return [element, ...result];
        else {
            let index = this._content.indexOf(element);
            let previous = this._content[index - 1];
            if (index >= 1)
                return new Path(previous).append(previous.movePointerLeftFromPrevious());
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
            let next = this._content[index + 1];
            if (next)
                return new Path(next).append(next.movePointerRightFromPrevious());
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

    getFragment(start, end) {
        let ret = new this.constructor();
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
}