"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./Event");
function copyObject(v) {
    if (typeof (v) == 'object') {
        if (v instanceof Array) {
            let vs = [];
            for (var i of v) {
                vs.push(copyObject(i));
            }
            return vs;
        }
        else if (typeof v.copy == 'function') {
            return v.copy();
        }
        else {
            let a = {};
            for (var key in v) {
                if (key.length > 0 && key.substr(0, 1) == '$') {
                    continue;
                }
                a[key] = copyObject(v[key]);
            }
            return a;
        }
    }
    return v;
}
exports.copyObject = copyObject;
class ElementEvent extends Event_1.Event {
    constructor(e, data) {
        super();
        this.element = e;
        this.data = data;
        this.cannelBubble = false;
    }
}
exports.ElementEvent = ElementEvent;
class Element extends Event_1.EventEmitter {
    constructor(document, id) {
        super();
        this.id = id;
        this.document = document;
    }
    get firstChild() {
        return this._firstChild;
    }
    get lastChild() {
        return this._lastChild;
    }
    get nextSibling() {
        return this._nextSibling;
    }
    get prevSibling() {
        return this._prevSibling;
    }
    get parent() {
        return this._parent;
    }
    _removeCommand() {
        let p = this._parent;
        if (p === undefined) {
            return;
        }
        let prev = this._prevSibling;
        this.document.addCommand({
            cancel: () => {
                if (prev !== undefined) {
                    prev._after(this);
                }
                else if (p !== undefined) {
                    p._add(this);
                }
            },
            redo: () => {
                this._remove();
            }
        });
    }
    _remove() {
        if (this._prevSibling) {
            this._prevSibling._nextSibling = this._nextSibling;
            if (this._nextSibling) {
                this._nextSibling._prevSibling = this._prevSibling;
            }
            else if (this._parent) {
                this._parent._lastChild = this._prevSibling;
            }
        }
        else if (this._parent) {
            this._parent._firstChild = this._nextSibling;
            if (this._nextSibling) {
                this._nextSibling._prevSibling = undefined;
            }
            else {
                this._parent._lastChild = undefined;
            }
        }
        this._parent = undefined;
        this._prevSibling = undefined;
        this._nextSibling = undefined;
    }
    _addCommand(e) {
        this.document.addCommand({
            cancel: () => {
                e._remove();
            },
            redo: () => {
                this._add(e);
            }
        });
    }
    _add(e) {
        e._remove();
        if (this._lastChild) {
            this._lastChild._nextSibling = e;
            e._prevSibling = this._lastChild;
            this._lastChild = e;
        }
        else {
            this._firstChild = e;
            this._lastChild = e;
        }
        e._parent = this;
    }
    _beforeCommand(e) {
        this.document.addCommand({
            cancel: () => {
                e._remove();
            },
            redo: () => {
                this._before(e);
            }
        });
    }
    _before(e) {
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
        }
        else {
            p._firstChild = e;
            e._nextSibling = this;
            this._prevSibling = e;
            e._parent = p;
        }
    }
    _afterCommand(e) {
        this.document.addCommand({
            cancel: () => {
                e._remove();
            },
            redo: () => {
                this._after(e);
            }
        });
    }
    _after(e) {
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
        }
        else {
            this._nextSibling = e;
            e._prevSibling = this;
            p._lastChild = e;
            e._parent = p;
        }
    }
    add(e) {
        if (e === undefined) {
            e = this.document.create();
        }
        this._addCommand(e);
        this._add(e);
        return e;
    }
    before() {
        let p = this._parent;
        if (p === undefined) {
            return this;
        }
        let e = this.document.create();
        this._beforeCommand(e);
        this._before(e);
        return e;
    }
    after() {
        let p = this._parent;
        if (p === undefined) {
            return this;
        }
        let e = this.document.create();
        this._afterCommand(e);
        this._after(e);
        return e;
    }
    del() {
        this.document.del(this.id);
        let p = this._parent;
        if (p === undefined) {
            return this;
        }
        let n = this._firstChild;
        while (n) {
            let nn = n.nextSibling;
            n.del();
            n = nn;
        }
        this._removeCommand();
        this._remove();
        return p;
    }
    copyTo(parent, before, after) {
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
            parent._addCommand(e);
            parent._add(e);
        }
        else if (before !== undefined) {
            before._beforeCommand(e);
            before._before(e);
        }
        else if (after !== undefined) {
            after._afterCommand(e);
            after._after(e);
        }
        return e;
    }
    moveTo(parent, before, after) {
        if (parent !== undefined) {
            if (!this.contains(parent)) {
                parent._addCommand(this);
                parent._add(this);
            }
        }
        else if (before !== undefined) {
            if (!this.contains(before)) {
                before._beforeCommand(this);
                before._before(this);
            }
        }
        else if (after !== undefined) {
            if (!this.contains(after)) {
                after._afterCommand(this);
                after._after(this);
            }
        }
        return this;
    }
    contains(e) {
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
    setData(data) {
        this.data = data;
        return this;
    }
    done() {
        if (this.parent !== undefined) {
            return this.parent;
        }
        return this;
    }
    emit(name, event) {
        super.emit(name, event);
        if (event instanceof ElementEvent) {
            if (!event.cannelBubble) {
                let p = this._parent;
                if (p) {
                    p.emit(name, event);
                }
                else {
                    this.document.emit(name, event);
                }
            }
        }
    }
    setValue(key, value) {
        if (this.data === undefined) {
            this.data = {};
        }
        let v = this.data[key];
        if (value === undefined) {
            delete this.data[key];
        }
        else {
            this.data[key] = value;
        }
        this.document.addCommand({
            cancel: () => {
                if (v === undefined) {
                    delete this.data[key];
                }
                else {
                    this.data[key] = v;
                }
            },
            redo: () => {
                if (value === undefined) {
                    delete this.data[key];
                }
                else {
                    this.data[key] = value;
                }
            }
        });
        return this;
    }
}
exports.Element = Element;
function forEach(e, fn) {
    if (fn(e)) {
        let p = e.firstChild;
        while (p) {
            let n = p.nextSibling;
            forEach(p, fn);
            p = n;
        }
        return true;
    }
    return false;
}
exports.forEach = forEach;
