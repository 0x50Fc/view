"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Element_1 = require("./Element");
const Event_1 = require("./Event");
class Document extends Event_1.EventEmitter {
    get root() {
        return this._root;
    }
    constructor(queue) {
        super();
        this._queue = queue;
        this._elementSet = {};
        this._id = 0;
        this._root = new Element_1.Element(this, 0);
    }
    save() {
        let items = [];
        function add(e) {
            let item = {
                $id: e.id,
                $pid: e.parent !== undefined ? e.parent.id : undefined
            };
            if (typeof e.data == 'object') {
                for (let key in e.data) {
                    if (key.length > 0 && key.substr(0, 1) == '$') {
                        continue;
                    }
                    item[key] = e.data[key];
                }
            }
            items.push(item);
            let p = e.firstChild;
            while (p) {
                add(p);
                p = p.nextSibling;
            }
        }
        add(this.root);
        return {
            id: this._id,
            items: items
        };
    }
    restore(data) {
        if (this._queue !== undefined) {
            this._queue.clear();
        }
        this._id = data.id;
        this._elementSet = {};
        for (let item of data.items) {
            let id = item.$id;
            let pid = item.$pid;
            let data = {};
            for (let key in item) {
                if (key.length > 0 && key.substr(0, 1) == '$') {
                    continue;
                }
                data[key] = item[key];
            }
            if (id == 0) {
                this._root = new Element_1.Element(this, id);
                this._root.data = data;
            }
            else {
                let e = new Element_1.Element(this, id);
                e.data = data;
                this._elementSet[id] = e;
                if (pid === 0) {
                    this._root.add(e);
                }
                else if (pid !== undefined) {
                    let p = this._elementSet[pid];
                    if (p !== undefined) {
                        p.add(e);
                    }
                }
            }
        }
    }
    get(id) {
        return this._elementSet[id];
    }
    create() {
        let id = ++this._id;
        let e = new Element_1.Element(this, id);
        this._elementSet[id] = e;
        if (this._queue !== undefined) {
            this._queue.add({
                cancel: () => {
                    this._elementSet[id];
                },
                redo: () => {
                    this._elementSet[id] = e;
                }
            });
        }
        return e;
    }
    del(id) {
        let v = this._elementSet[id];
        if (v !== undefined) {
            delete this._elementSet[id];
            if (this._queue !== undefined) {
                this._queue.add({
                    cancel: () => {
                        this._elementSet[id] = v;
                    },
                    redo: () => {
                        delete this._elementSet[id];
                    }
                });
            }
        }
    }
    addCommand(v) {
        if (this._queue !== undefined) {
            this._queue.add(v);
        }
    }
}
exports.Document = Document;
