import { hasSuffix, hasPrefix } from "./lib";


export class Event {

}

type EventFunction = (event: Event, name: string) => void;

interface EventMap {
    [key: string]: EventFunction[]
}

export class EventEmitter {

    private _events: EventMap = {};
    private _prefix: EventMap = {};

    public on(name: string, func: EventFunction): void {
        if (hasSuffix(name, "*")) {
            let n = name.substr(0, name.length - 1);
            var v: EventFunction[] = this._prefix[n];
            if (v === undefined) {
                v = [];
                this._prefix[n] = v;
            }
            v.push(func);
        } else {
            var v: EventFunction[] = this._events[name];
            if (v === undefined) {
                v = [];
                this._events[name] = v;
            }
            v.push(func);
        }
    }

    public off(name?: string, func?: EventFunction): void {
        if (name === undefined && func === undefined) {
            this._events = {};
            this._prefix = {};
        } else if (func === undefined && name !== undefined) {
            if (hasSuffix(name, "*")) {
                delete this._prefix[name];
            } else {
                delete this._events[name];
            }
        } else if (name !== undefined) {
            if (hasSuffix(name, "*")) {
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
            } else {
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

    public emit(name: string, event: Event): void {
        var fns: EventFunction[] = []
        var v = this._events[name];
        if (v !== undefined) {
            fns = fns.concat(v);
        }
        for (let key in this._prefix) {
            if (hasPrefix(name, key)) {
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

    public has(name: string): boolean {
        if (this._events[name] !== undefined) {
            return true;
        }
        for (let key in this._prefix) {
            if (hasPrefix(name, key)) {
                return true;
            }
        }
        return false;
    }


}