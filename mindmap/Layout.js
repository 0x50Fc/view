"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Layout {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.top = 0;
        this.bottom = 0;
        this.left = 0;
        this.right = 0;
        this.In = { x: 0, y: 0 };
        this.Out = { x: 0, y: 0 };
    }
    calculate(doc, e, ctx) {
        let view = doc.getView(e);
        view.calculate(doc, e, ctx);
        this.In.x = 0;
        this.In.y = 0;
        this.Out.x = view.width;
        this.Out.y = 0;
        let count = 0;
        let height = 0;
        let maxWidth = 0;
        let p = e.firstChild;
        while (p) {
            let v = doc.getLayout(p);
            v.calculate(doc, p, ctx);
            height += v.bottom - v.top;
            if (v.right - v.left > maxWidth) {
                maxWidth = v.right - v.left;
            }
            count++;
            p = p.nextSibling;
        }
        if (count > 0 && !doc.isAutomatic(e)) {
            height += doc.theme.divideY * (count - 1);
            let top = -height * 0.5;
            this.top = top;
            p = e.firstChild;
            while (p) {
                let v = doc.getLayout(p);
                v.y = top + (v.bottom - v.top) * 0.5;
                v.x = view.width + doc.theme.divideX;
                top += (v.bottom - v.top) + doc.theme.divideY;
                p = p.nextSibling;
            }
            this.bottom = top;
            this.left = 0;
            this.right = view.width + doc.theme.divideX + maxWidth;
        }
        else {
            this.top = -view.height * 0.5;
            this.bottom = -this.top;
            this.right = view.width;
            this.left = 0;
            p = e.firstChild;
            while (p) {
                let v = doc.getLayout(p);
                v.y = 0;
                v.x = view.width + doc.theme.divideX;
                p = p.nextSibling;
            }
        }
    }
    draw(doc, e, ctx, x, y, width, height) {
        let x0 = this.x + x;
        let y0 = this.y + y;
        let view = doc.getView(e);
        let dh = view.height * 0.5;
        let l = x0;
        let r = x0 + this.right;
        let t = y0 - dh;
        let b = y0 + dh;
        let ml = Math.max(l, 0);
        let mr = Math.min(r, width);
        let mt = Math.max(t, 0);
        let mb = Math.min(b, height);
        if (mr > ml && mb > mt) {
            view.x = l;
            view.y = t;
            view.draw(doc, e, ctx);
        }
        if (doc.isAutomatic(e)) {
            return;
        }
        let p = e.firstChild;
        while (p) {
            doc.getLayout(p).draw(doc, p, ctx, x0, y0, width, height);
            p = p.nextSibling;
        }
    }
    getTopElement(doc, e) {
        let p = e.prevSibling;
        if (p !== undefined) {
            return p;
        }
        p = e.parent;
        if (p !== undefined) {
            p = p.prevSibling;
            if (p !== undefined) {
                p = p.lastChild;
                if (p !== undefined) {
                    return p;
                }
            }
        }
        return undefined;
    }
    getBottomElement(doc, e) {
        let p = e.nextSibling;
        if (p !== undefined) {
            return p;
        }
        p = e.parent;
        if (p !== undefined) {
            p = p.nextSibling;
            if (p !== undefined) {
                p = p.firstChild;
                if (p !== undefined) {
                    return p;
                }
            }
        }
        return undefined;
    }
    getLeftElement(doc, e) {
        let p = e.parent;
        if (p !== undefined) {
            return p;
        }
        return undefined;
    }
    getRightElement(doc, e) {
        return e.firstChild;
    }
}
exports.Layout = Layout;
