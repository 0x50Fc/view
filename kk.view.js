(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = require("./Element");
var Event_1 = require("./Event");
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document() {
        var _this = _super.call(this) || this;
        _this._elementSet = {};
        _this._id = 0;
        _this.root = new Element_1.Element(_this, 0);
        return _this;
    }
    Document.prototype.get = function (id) {
        return this._elementSet[id];
    };
    Document.prototype.create = function () {
        var id = ++this._id;
        var e = new Element_1.Element(this, id);
        this._elementSet[id] = e;
        return e;
    };
    Document.prototype.del = function (id) {
        delete this._elementSet[id];
    };
    return Document;
}(Event_1.EventEmitter));
exports.Document = Document;

},{"./Element":3,"./Event":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var View_1 = require("./View");
var Layout_1 = require("./Layout");
var DocumentView = /** @class */ (function () {
    function DocumentView(document, theme) {
        this.document = document;
        if (theme) {
            this.theme = theme;
        }
        else {
            this.theme = {
                fontSize: 14,
                padding: {
                    left: 6,
                    right: 6,
                    top: 6,
                    bottom: 6
                },
                fontColor: '#fff',
                borderColor: '#000',
                borderWidth: '1',
                borderRadius: '2',
                backgroundColor: '#000',
                lineColor: '#000',
                divideY: 10,
                divideX: 20
            };
        }
    }
    Object.defineProperty(DocumentView.prototype, "width", {
        get: function () {
            return this.getLayout(this.document.root).width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentView.prototype, "height", {
        get: function () {
            return this.getLayout(this.document.root).height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentView.prototype, "In", {
        get: function () {
            return this.getLayout(this.document.root).In;
        },
        enumerable: true,
        configurable: true
    });
    DocumentView.prototype.createView = function (element) {
        return new View_1.View();
    };
    DocumentView.prototype.getView = function (element) {
        if (element.data === undefined) {
            element.data = {};
        }
        if (element.data.view === undefined) {
            element.data.view = this.createView(element);
        }
        return element.data.view;
    };
    DocumentView.prototype.createLayout = function (element) {
        return new Layout_1.Layout();
    };
    DocumentView.prototype.getLayout = function (element) {
        if (element.data === undefined) {
            element.data = {};
        }
        if (element.data.layout === undefined) {
            element.data.layout = this.createLayout(element);
        }
        return element.data.layout;
    };
    DocumentView.prototype.calculate = function (ctx) {
        this.getLayout(this.document.root).calculate(this, this.document.root, ctx);
    };
    DocumentView.prototype.draw = function (ctx, x, y, width, height) {
        this.getLayout(this.document.root).draw(this, this.document.root, ctx, x, y, width, height);
    };
    DocumentView.prototype.onDrawOutlet = function (ctx, x0, y0, x1, y1) {
    };
    DocumentView.prototype.drawOutlet = function (ctx, x, y, width, height, e) {
        if (e === undefined) {
            e = this.document.root;
        }
        var v = this.getLayout(e);
        var x0 = x + v.Out.x;
        var y0 = y + v.Out.y;
        var p = e.firstChild;
        while (p) {
            var a = this.getLayout(p);
            this.onDrawOutlet(ctx, x0, y0, x + a.x, y + a.y);
            p = p.nextSibling;
        }
    };
    return DocumentView;
}());
exports.DocumentView = DocumentView;

},{"./Layout":5,"./View":6}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = require("./Event");
function copyObject(v) {
    if (typeof (v) == 'object') {
        if (v instanceof Array) {
            var vs = [];
            for (var _i = 0, v_1 = v; _i < v_1.length; _i++) {
                var i = v_1[_i];
                vs.push(copyObject(i));
            }
            return vs;
        }
        else if (typeof v.copy == 'function') {
            return v.copy();
        }
        else {
            var a = {};
            for (var key in v) {
                a = copyObject(v[key]);
            }
            return a;
        }
    }
    return v;
}
exports.copyObject = copyObject;
var ElementEvent = /** @class */ (function (_super) {
    __extends(ElementEvent, _super);
    function ElementEvent(e, data) {
        var _this = _super.call(this) || this;
        _this.element = e;
        _this.data = data;
        _this.cannelBubble = false;
        return _this;
    }
    return ElementEvent;
}(Event_1.Event));
exports.ElementEvent = ElementEvent;
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element(document, id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.document = document;
        return _this;
    }
    Object.defineProperty(Element.prototype, "firstChild", {
        get: function () {
            return this._firstChild;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "lastChild", {
        get: function () {
            return this._lastChild;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "nextSibling", {
        get: function () {
            return this._nextSibling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "prevSibling", {
        get: function () {
            return this._prevSibling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Element.prototype._remove = function () {
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
    };
    Element.prototype._add = function (e) {
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
    };
    Element.prototype._before = function (e) {
        var p = this._parent;
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
    };
    Element.prototype._after = function (e) {
        var p = this._parent;
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
    };
    Element.prototype.add = function () {
        var e = this.document.create();
        this._add(e);
        return e;
    };
    Element.prototype.before = function () {
        var p = this._parent;
        if (p === undefined) {
            return this;
        }
        var e = this.document.create();
        this._before(e);
        return e;
    };
    Element.prototype.after = function () {
        var p = this._parent;
        if (p === undefined) {
            return this;
        }
        var e = this.document.create();
        this._after(e);
        return e;
    };
    Element.prototype.del = function () {
        this.document.del(this.id);
        var p = this._parent;
        if (p === undefined) {
            return this;
        }
        var n = this._firstChild;
        while (n) {
            var nn = n.nextSibling;
            n.del();
            n = nn;
        }
        this._remove();
        return p;
    };
    Element.prototype.copyTo = function (parent, before, after) {
        if (parent === undefined && before === undefined && after === undefined) {
            return this;
        }
        var e = this.document.create();
        e.data = copyObject(this.data);
        var p = this.firstChild;
        while (p) {
            p.copyTo(e);
            p = p.nextSibling;
        }
        if (parent !== undefined) {
            parent._add(e);
        }
        else if (before !== undefined) {
            before._before(e);
        }
        else if (after !== undefined) {
            after._after(e);
        }
        return e;
    };
    Element.prototype.moveTo = function (parent, before, after) {
        if (parent !== undefined) {
            if (!this.contains(parent)) {
                parent._add(this);
            }
        }
        else if (before !== undefined) {
            if (!this.contains(before)) {
                before._before(this);
            }
        }
        else if (after !== undefined) {
            if (!this.contains(after)) {
                after._after(this);
            }
        }
        return this;
    };
    Element.prototype.contains = function (e) {
        if (this == e) {
            return true;
        }
        var p = this.firstChild;
        while (p) {
            if (p.contains(e)) {
                return true;
            }
            p = p.nextSibling;
        }
        return false;
    };
    Element.prototype.setData = function (data) {
        this.data = data;
        return this;
    };
    Element.prototype.done = function () {
        if (this.parent !== undefined) {
            return this.parent;
        }
        return this;
    };
    Element.prototype.emit = function (name, event) {
        _super.prototype.emit.call(this, name, event);
        if (event instanceof ElementEvent) {
            if (!event.cannelBubble) {
                var p = this._parent;
                if (p) {
                    p.emit(name, event);
                }
                else {
                    this.document.emit(name, event);
                }
            }
        }
    };
    return Element;
}(Event_1.EventEmitter));
exports.Element = Element;
function forEach(e, fn) {
    if (fn(e)) {
        var p = e.firstChild;
        while (p) {
            var n = p.nextSibling;
            forEach(p, fn);
            p = n;
        }
        return true;
    }
    return false;
}
exports.forEach = forEach;

},{"./Event":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
var Event = /** @class */ (function () {
    function Event() {
    }
    return Event;
}());
exports.Event = Event;
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this._events = {};
        this._prefix = {};
    }
    EventEmitter.prototype.on = function (name, func) {
        if (lib_1.hasSuffix(name, "*")) {
            var n = name.substr(0, name.length - 1);
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
    };
    EventEmitter.prototype.off = function (name, func) {
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
                var n = name.substr(0, name.length - 1);
                var v = this._prefix[n];
                if (v !== undefined) {
                    var vs = [];
                    for (var _i = 0, v_1 = v; _i < v_1.length; _i++) {
                        var fn = v_1[_i];
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
                    for (var _a = 0, v_2 = v; _a < v_2.length; _a++) {
                        var fn = v_2[_a];
                        if (fn != func) {
                            vs.push(fn);
                        }
                    }
                    this._events[name] = vs;
                }
            }
        }
    };
    EventEmitter.prototype.emit = function (name, event) {
        var fns = [];
        var v = this._events[name];
        if (v !== undefined) {
            fns = fns.concat(v);
        }
        for (var key in this._prefix) {
            if (lib_1.hasPrefix(name, key)) {
                var v = this._prefix[key];
                if (v !== undefined) {
                    fns = fns.concat(v);
                }
            }
        }
        for (var _i = 0, fns_1 = fns; _i < fns_1.length; _i++) {
            var fn = fns_1[_i];
            fn(event, name);
        }
    };
    EventEmitter.prototype.has = function (name) {
        if (this._events[name] !== undefined) {
            return true;
        }
        for (var key in this._prefix) {
            if (lib_1.hasPrefix(name, key)) {
                return true;
            }
        }
        return false;
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;

},{"./lib":8}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layout = /** @class */ (function () {
    function Layout() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.In = { x: 0, y: 0 };
        this.Out = { x: 0, y: 0 };
    }
    Layout.prototype.calculate = function (doc, e, ctx) {
        var view = doc.getView(e);
        view.calculate(doc, e, ctx);
        this.In.x = 0;
        this.In.y = 0;
        this.Out.x = view.width;
        this.Out.y = 0;
        var count = 0;
        var height = 0;
        var maxWidth = 0;
        var p = e.firstChild;
        while (p) {
            var v = doc.getLayout(p);
            v.calculate(doc, p, ctx);
            height += v.height;
            if (v.width > maxWidth) {
                v.width = maxWidth;
            }
            count++;
            p = p.nextSibling;
        }
        if (count > 1) {
            height += doc.theme.divideY * (count - 1);
        }
        var top = -height * 0.5;
        p = e.firstChild;
        while (p) {
            var v = doc.getLayout(p);
            v.y = top;
            v.x = view.width + doc.theme.divideX;
            top += v.height + doc.theme.divideY;
            p = p.nextSibling;
        }
        this.height = height;
        this.width = view.width + doc.theme.divideX + maxWidth;
    };
    Layout.prototype.draw = function (doc, e, ctx, x, y, width, height) {
        console.info("[draw] ", x, y, width, height);
        var x0 = this.x + x;
        var y0 = this.y + y;
        var dh = this.height * 0.5;
        var l = x0;
        var r = x0 + this.width;
        var t = y0 - dh;
        var b = y0 + dh;
        var ml = Math.max(l, 0);
        var mr = Math.min(r, width);
        var mt = Math.max(t, 0);
        var mb = Math.min(b, height);
        console.info("[layout] ", l, r, t, b);
        if (mr > ml && mb > mt) {
            ctx.save();
            ctx.translate(l, t);
            doc.getView(e).draw(doc, e, ctx);
            ctx.restore();
            var p = e.firstChild;
            while (p) {
                doc.getLayout(p).draw(doc, p, ctx, x0, y0, width, height);
                p = p.nextSibling;
            }
        }
    };
    return Layout;
}());
exports.Layout = Layout;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var draw_1 = require("./draw");
var View = /** @class */ (function () {
    function View() {
        this.width = 0;
        this.height = 0;
    }
    View.prototype.calculate = function (doc, e, ctx) {
        var title = e.data.title || '';
        ctx.font = doc.theme.fontSize + 'px normal';
        var width = ctx.measureText(title).width;
        this.width = width + doc.theme.padding.left + doc.theme.padding.right;
        this.height = doc.theme.fontSize + doc.theme.padding.top + doc.theme.padding.bottom;
    };
    View.prototype.draw = function (doc, e, ctx) {
        var title = e.data.title || '';
        var view = doc.getView(e);
        if (doc.theme.backgroundColor) {
            ctx.beginPath();
            if (doc.theme.borderRadius > 0) {
                draw_1.addRoundedRect(ctx, 0, 0, view.width, view.height, doc.theme.borderRadius);
            }
            else {
                ctx.rect(0, 0, view.width, view.height);
            }
            ctx.fillStyle = doc.theme.backgroundColor;
            ctx.fill();
        }
        if (doc.theme.borderWidth > 0 && doc.theme.borderColor) {
            ctx.beginPath();
            if (doc.theme.borderRadius > 0) {
                draw_1.addRoundedRect(ctx, 0, 0, view.width, view.height, doc.theme.borderRadius);
            }
            else {
                ctx.rect(0, 0, view.width, view.height);
            }
            ctx.strokeStyle = doc.theme.borderColor;
            ctx.lineWidth = doc.theme.borderWidth;
            ctx.stroke();
        }
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = doc.theme.fontColor;
        ctx.font = doc.theme.fontSize + 'px normal';
        ctx.fillText(title, doc.theme.padding.left, doc.theme.padding.top);
    };
    return View;
}());
exports.View = View;

},{"./draw":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addRoundedRect(ctx, x, y, width, height, r) {
    var a_x = x + r;
    var a_y = y;
    var b_x = x + width;
    var b_y = y;
    var c_x = x + width;
    var c_y = y + height;
    var d_x = x;
    var d_y = y + height;
    var e_x = x;
    var e_y = y;
    ctx.moveTo(a_x, a_y);
    ctx.arcTo(b_x, b_y, c_x, c_y, r);
    ctx.arcTo(c_x, c_y, d_x, d_y, r);
    ctx.arcTo(d_x, d_y, e_x, e_y, r);
    ctx.arcTo(e_x, e_y, a_x, a_y, r);
}
exports.addRoundedRect = addRoundedRect;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasPrefix(s, p) {
    return s.indexOf(p) === 0;
}
exports.hasPrefix = hasPrefix;
function hasSuffix(s, p) {
    var n = s.length - p.length;
    if (n < 0) {
        return false;
    }
    return s.lastIndexOf(p) === n;
}
exports.hasSuffix = hasSuffix;

},{}],9:[function(require,module,exports){

var mindmap = {
    DocumentView: require('./bin/DocumentView').DocumentView,
    Document: require('./bin/Document').Document,
    Element: require('./bin/Element').Element,
    View: require('./bin/View').View
};

window.kk = {
    mindmap: mindmap
};


},{"./bin/Document":1,"./bin/DocumentView":2,"./bin/Element":3,"./bin/View":6}]},{},[9]);
