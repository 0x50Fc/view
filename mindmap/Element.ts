import { Id } from "./lib";
import { Document } from "./Document";
import { EventEmitter, Event } from "./Event";

export function copyObject(v: any): any {
    if (typeof (v) == 'object') {
        if (v instanceof Array) {
            let vs: any[] = [];
            for (var i of v) {
                vs.push(copyObject(i));
            }
            return vs;
        } else if (typeof v.copy == 'function') {
            return v.copy();
        } else {
            let a = {};
            for (var key in v) {
                a = copyObject(v[key]);
            }
            return a;
        }
    }
    return v;
}

export class ElementEvent extends Event {

    readonly element: Element

    data: any
    cannelBubble: boolean

    constructor(e: Element, data?: any) {
        super();
        this.element = e;
        this.data = data;
        this.cannelBubble = false;
    }

}

export class Element extends EventEmitter {

    readonly id: Id;
    readonly document: Document;

    private _firstChild: Element | undefined;
    private _lastChild: Element | undefined;
    private _nextSibling: Element | undefined;
    private _prevSibling: Element | undefined;
    private _parent: Element | undefined;

    data: any

    constructor(document: Document, id: Id) {
        super();
        this.id = id;
        this.document = document;
    }

    public get firstChild(): Element | undefined {
        return this._firstChild;
    }

    public get lastChild(): Element | undefined {
        return this._lastChild;
    }

    public get nextSibling(): Element | undefined {
        return this._nextSibling;
    }

    public get prevSibling(): Element | undefined {
        return this._prevSibling;
    }

    public get parent(): Element | undefined {
        return this._parent;
    }

    private _remove() {

        if (this._prevSibling) {
            this._prevSibling._nextSibling = this._nextSibling
            if (this._nextSibling) {
                this._nextSibling._prevSibling = this._prevSibling;
            } else if (this._parent) {
                this._parent._lastChild = this._prevSibling;
            }
        } else if (this._parent) {
            this._parent._firstChild = this._nextSibling;
            if (this._nextSibling) {
                this._nextSibling._prevSibling = undefined;
            } else {
                this._parent._lastChild = undefined;
            }
        }

        this._parent = undefined;
        this._prevSibling = undefined;
        this._nextSibling = undefined;

    }

    private _add(e: Element) {

        e._remove();

        if (this._lastChild) {
            this._lastChild._nextSibling = e;
            e._prevSibling = this._lastChild;
            this._lastChild = e;
        } else {
            this._firstChild = e;
            this._lastChild = e;
        }

        e._parent = this;

    }

    private _before(e: Element) {

        let p = this._parent;

        if (p === undefined) {
            return;
        }

        e._remove();

        if (this._prevSibling) {
            this._prevSibling._nextSibling = e;
            e._prevSibling = this._prevSibling;
            e._nextSibling = this;
            this._prevSibling = e;
            e._parent = p;
        } else {
            p._firstChild = e;
            e._nextSibling = this;
            this._prevSibling = e;
            e._parent = p;
        }
    }

    private _after(e: Element) {

        let p = this._parent;

        if (p === undefined) {
            return;
        }

        e._remove();

        if (this._nextSibling) {
            this._nextSibling._prevSibling = e;
            e._nextSibling = this._nextSibling;
            this._nextSibling = e;
            e._prevSibling = this;
            e._parent = p;
        } else {
            this._nextSibling = e;
            e._prevSibling = this;
            p._lastChild = e;
            e._parent = p;
        }

    }

    add(): Element {

        let e = this.document.create();

        this._add(e);

        return e;
    }

    before(): Element {

        let p = this._parent;

        if (p === undefined) {
            return this;
        }

        let e = this.document.create();

        this._before(e);

        return e;
    }

    after(): Element {

        let p = this._parent;

        if (p === undefined) {
            return this;
        }

        let e = this.document.create();

        this._after(e);

        return e;
    }

    del(): Element {

        this.document.del(this.id);

        let p = this._parent;

        if (p === undefined) {
            return this;
        }

        let n = this._firstChild;

        while (n) {
            let nn = n.nextSibling;
            n.del()
            n = nn;
        }

        this._remove();

        return p;
    }

    copyTo(parent?: Element, before?: Element, after?: Element): Element {

        if (parent === undefined && before === undefined && after === undefined) {
            return this;
        }

        let e = this.document.create();
        e.data = copyObject(this.data);
        let p = this.firstChild;
        while (p) {
            p.copyTo(e);
            p = p.nextSibling;
        }

        if (parent !== undefined) {
            parent._add(e);
        } else if (before !== undefined) {
            before._before(e);
        } else if (after !== undefined) {
            after._after(e);
        }

        return e;
    }

    moveTo(parent?: Element, before?: Element, after?: Element): Element {

        if (parent !== undefined) {
            if (!this.contains(parent)) {
                parent._add(this);
            }
        } else if (before !== undefined) {
            if (!this.contains(before)) {
                before._before(this);
            }
        } else if (after !== undefined) {
            if (!this.contains(after)) {
                after._after(this);
            }
        }

        return this;
    }

    contains(e: Element): boolean {
        if (this == e) {
            return true;
        }
        let p = this.firstChild;
        while (p) {
            if (p.contains(e)) {
                return true;
            }
            p = p.nextSibling;
        }
        return false;
    }

    public emit(name: string, event: Event): void {
        super.emit(name, event);

        if (event instanceof ElementEvent) {
            if (!event.cannelBubble) {
                let p = this._parent;
                if (p) {
                    p.emit(name, event);
                } else {
                    this.document.emit(name, event);
                }
            }
        }
    }
}

export function forEach(e: Element, fn: (e: Element) => boolean): boolean {

    if (fn(e)) {

        let p = e.firstChild;

        while (p) {
            let n = p.nextSibling;
            forEach(p, fn)
            p = n
        }

        return true;
    }
    
    return false;
}