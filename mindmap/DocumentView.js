"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = require("./View");
const Layout_1 = require("./Layout");
const Editor_1 = require("./Editor");
class DocumentView {
    constructor(document, theme) {
        this.document = document;
        if (theme) {
            this.theme = theme;
        }
        else {
            this.theme = {
                font: '12px monospace',
                fontSize: 12,
                padding: {
                    left: 8,
                    right: 8,
                    top: 6,
                    bottom: 6
                },
                fontColor: '#fff',
                borderColor: '#333',
                borderWidth: 1,
                borderRadius: 2,
                backgroundColor: '#333',
                lineColor: '#666',
                lineWidth: 1,
                lineY: 0.9,
                divideY: 16,
                divideX: 32,
                focus: {
                    backgroundColor: '#000',
                    borderColor: '#000'
                },
                attr: {
                    divideY: 4,
                    fontColor: '#ddd'
                }
            };
        }
    }
    get In() {
        return this.getLayout(this.document.root).In;
    }
    createView(element) {
        return new View_1.View();
    }
    getView(element) {
        if (element.data === undefined) {
            element.data = {};
        }
        if (element.data.$view === undefined) {
            element.data.$view = this.createView(element);
        }
        return element.data.$view;
    }
    createLayout(element) {
        return new Layout_1.Layout();
    }
    getLayout(element) {
        if (element.data === undefined) {
            element.data = {};
        }
        if (element.data.$layout === undefined) {
            element.data.$layout = this.createLayout(element);
        }
        return element.data.$layout;
    }
    draw(ctx, x, y, width, height) {
        let v = this.getLayout(this.document.root);
        v.calculate(this, this.document.root, ctx);
        this.drawOutlet(ctx, x, y, width, height, this.document.root);
        v.draw(this, this.document.root, ctx, x, y, width, height);
        if (this._focus !== undefined && this.getView(this._focus).visible) {
            this.onDrawFocusElement(ctx, this._focus);
        }
    }
    onDrawFocusElement(ctx, e) {
        let view = this.getView(e);
        ctx.save();
        ctx.translate(view.x, view.y);
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = this.theme.fontColor;
        ctx.font = this.theme.font;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.theme.attr.fontColor;
        let top = view.height + this.theme.attr.divideY;
        for (let key in e.data) {
            if (key.length > 0 && key.substr(0, 1) == '@') {
                let text = key + ':' + e.data[key];
                ctx.fillText(text, 0, top + this.theme.fontSize * 0.5);
                top += this.theme.fontSize + this.theme.attr.divideY;
            }
        }
        ctx.restore();
    }
    onDrawOutlet(ctx, x0, y0, x1, y1, width, height) {
        let l = Math.max(Math.min(x0, x1), 0);
        let r = Math.min(Math.max(x0, x1), width);
        let t = Math.max(Math.min(y0, y1), 0);
        let b = Math.min(Math.max(y0, y1), height);
        if (l < r || t < b) {
            ctx.save();
            ctx.beginPath();
            ctx.bezierCurveTo(x0, y0, (x0 + x1) * 0.5, y0 + (y1 - y0) * this.theme.lineY, x1, y1);
            ctx.strokeStyle = this.theme.lineColor;
            ctx.lineWidth = this.theme.lineWidth;
            ctx.stroke();
            ctx.restore();
        }
    }
    drawOutlet(ctx, x, y, width, height, e) {
        if (e === undefined) {
            e = this.document.root;
        }
        if (this.isAutomatic(e)) {
            return;
        }
        let v = this.getLayout(e);
        let x0 = x + v.Out.x;
        let y0 = y + v.Out.y;
        let p = e.firstChild;
        while (p) {
            let a = this.getLayout(p);
            this.onDrawOutlet(ctx, x0, y0, x + a.x, y + a.y, width, height);
            this.drawOutlet(ctx, x + a.x, y + a.y, width, height, p);
            p = p.nextSibling;
        }
    }
    elementAt(x, y, dx = 0, dy = 0, e) {
        if (e === undefined) {
            e = this.document.root;
        }
        let v = this.getLayout(e);
        let view = this.getView(e);
        let l = dx + v.x;
        let r = l + view.width;
        let t = dy + v.y - view.height * 0.5;
        let b = dy + v.y + view.height * 0.5;
        if (x >= l && x < r && y >= t && y < b) {
            return e;
        }
        let p = e.firstChild;
        while (p) {
            let r = this.elementAt(x, y, dx + v.x, dy + v.y, p);
            if (r !== undefined) {
                return r;
            }
            p = p.nextSibling;
        }
        return undefined;
    }
    get focus() {
        return this._focus;
    }
    set focus(e) {
        this._focus = e;
    }
    isFocus(e) {
        return this._focus == e;
    }
    createEditor(e) {
        return new Editor_1.Editor(e);
    }
    isEditting() {
        return this._editor !== undefined;
    }
    updateEditting(x, y) {
        if (this._editor !== undefined) {
            this._editor.updateEditting(this, x, y);
        }
    }
    beginEditting(e, x, y) {
        if (this._editor) {
            this._editor.cancelEditting(this);
        }
        this._editor = this.createEditor(e);
        this._editor.beginEditting(this, x, y);
    }
    cancelEditting() {
        if (this._editor) {
            this._editor.cancelEditting(this);
            this._editor = undefined;
        }
    }
    commitEditting() {
        if (this._editor) {
            this._editor.commitEditting(this);
            this._editor = undefined;
        }
    }
    getTopElement(e) {
        return this.getLayout(e).getTopElement(this, e);
    }
    getBottomElement(e) {
        return this.getLayout(e).getBottomElement(this, e);
    }
    getLeftElement(e) {
        return this.getLayout(e).getLeftElement(this, e);
    }
    getRightElement(e) {
        return this.getLayout(e).getRightElement(this, e);
    }
    isAutomatic(p) {
        return typeof p.data == 'object' && p.data['@automatic'] && (this._focus === undefined || !p.contains(this._focus));
    }
}
exports.DocumentView = DocumentView;
