import { Id } from "./lib";
import { Element } from "./Element";
import { EventEmitter } from "./Event";

interface ElementSet {
    [id: number]: Element
}

export class Document extends EventEmitter{

    readonly root: Element

    protected _id: Id
    protected _elementSet: ElementSet

    constructor() {
        super();
        this._elementSet = {}
        this._id = 0;
        this.root = new Element(this, 0);
    }

    get(id: Id): Element | undefined {
        return this._elementSet[id];
    }

    create(): Element {
        let id = ++this._id;
        let e = new Element(this, id);
        this._elementSet[id] = e;
        return e;
    }

    del(id: Id): void {
        delete this._elementSet[id];
    }
    
}

