export class Path extends Array {
    constructor(...args) {
        super();
        for (let arg of args.flat())
            this.push(arg);
    }

    append(...args) {
        return new Path(this, ...args);
    }
}

Path.empty = new Path();
window.Path = Path;