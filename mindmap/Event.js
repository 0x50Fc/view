"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
class Event {
}
exports.Event = Event;
class EventEmitter {
    constructor() {
        this._events = {};
        this._prefix = {};
    }
    on(name, func) {
        if (lib_1.hasSuffix(name, "*")) {
            let n = name.substr(0, name.length - 1);
            var v = this._prefix[n];
            if (v === undefined) {
                v = [];
                this._prefix[n] = v;
            }
            v.push(func);
        }
        else {
            var v = this._events[name];
            if (v === undefined) {
                v = [];
                this._events[name] = v;
            }
            v.push(func);
        }
    }
    off(name, func) {
        if (name === undefined && func === undefined) {
            this._events = {};
            this._prefix = {};
        }
        else if (func === undefined && name !== undefined) {
            if (lib_1.hasSuffix(name, "*")) {
                delete this._prefix[name];
            }
            else {
                delete this._events[name];
            }
        }
        else if (name !== undefined) {
            if (lib_1.hasSuffix(name, "*")) {
                let n = name.substr(0, name.length - 1);
                var v = this._prefix[n];
                if (v !== undefined) {
                    var vs = [];
                    for (let fn of v) {
                        if (fn != func) {
                            vs.push(fn);
                        }
                    }
                    this._prefix[n] = vs;
                }
            }
            else {
                var v = this._events[name];
                if (v !== undefined) {
                    var vs = [];
                    for (let fn of v) {
                        if (fn != func) {
                            vs.push(fn);
                        }
                    }
                    this._events[name] = vs;
                }
            }
        }
    }
    emit(name, event) {
        var fns = [];
        var v = this._events[name];
        if (v !== undefined) {
            fns = fns.concat(v);
        }
        for (let key in this._prefix) {
            if (lib_1.hasPrefix(name, key)) {
                var v = this._prefix[key];
                if (v !== undefined) {
                    fns = fns.concat(v);
                }
            }
        }
        for (let fn of fns) {
            fn(event, name);
        }
    }
    has(name) {
        if (this._events[name] !== undefined) {
            return true;
        }
        for (let key in this._prefix) {
            if (lib_1.hasPrefix(name, key)) {
                return true;
            }
        }
        return false;
    }
}
exports.EventEmitter = EventEmitter;
