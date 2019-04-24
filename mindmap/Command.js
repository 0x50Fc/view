"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandQueue {
    constructor() {
        this._autoId = 0;
        this._id = [];
        this._In = [];
        this._Out = [];
    }
    clear() {
        this._In = [];
        this._Out = [];
    }
    beginTransaction() {
        if (this._id.length == 0) {
            this._id.push(++this._autoId);
        }
        else {
            this._id.push(this._id[this._id.length - 1]);
        }
    }
    commitTransaction() {
        this._id.pop();
    }
    cancelTransaction() {
        if (this._id.length > 0) {
            while (this._Out.length > 0) {
                this._Out.pop();
            }
            let id = this._id[this._id.length - 1];
            while (this._In.length > 0) {
                let v = this._In[this._In.length - 1];
                if (v.id !== id) {
                    break;
                }
                this._In.pop();
            }
        }
    }
    add(v) {
        while (this._Out.length > 0) {
            this._Out.pop();
        }
        if (this._id.length > 0) {
            v.id = this._id[this._id.length - 1];
        }
        else {
            v.id = ++this._autoId;
        }
        this._In.push(v);
    }
    canCancel() {
        return this._In.length > 0;
    }
    cancel() {
        let id;
        while (this._In.length > 0) {
            let v = this._In[this._In.length - 1];
            if (id === undefined) {
                id = v.id;
            }
            else if (v.id !== id) {
                break;
            }
            this._In.pop();
            this._Out.push(v);
            v.cancel();
        }
        return id !== undefined;
    }
    canRedo() {
        return this._Out.length > 0;
    }
    redo() {
        let id;
        while (this._Out.length > 0) {
            let v = this._Out[this._Out.length - 1];
            if (id === undefined) {
                id = v.id;
            }
            else if (v.id !== id) {
                break;
            }
            this._In.push(v);
            this._Out.pop();
            v.redo();
        }
        return id !== undefined;
    }
}
exports.CommandQueue = CommandQueue;
