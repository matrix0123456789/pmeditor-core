export class NodeAbstract {
    getEndPointer() {
        const last = this._content[this._content.length - 1];
        if (last)
            return [last, ...last.getEndPointer()]
        else
            return [];
    }
    add(element, path = []) {
        if (element instanceof String)
            return this.addText(element, path);
        else if(element instanceof NodeAbstract)
            return this.addBlock(element, path)
    }
}