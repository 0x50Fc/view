"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Editor {
    constructor(element) {
        this.element = element;
    }
    beginEditting(doc, x, y) {
        let p = this.element;
        while (p) {
            let v = doc.getLayout(p);
            x += v.x;
            y += v.y;
            p = p.parent;
        }
        let view = doc.getView(this.element);
        this.onShowEditting(doc, x, y - view.height * 0.5, view.width, view.height);
    }
    updateEditting(doc, x, y) {
        let p = this.element;
        while (p) {
            let v = doc.getLayout(p);
            x += v.x;
            y += v.y;
            p = p.parent;
        }
        let view = doc.getView(this.element);
        this.onUpdateEditting(doc, x, y - view.height * 0.5, view.width, view.height);
    }
    commitEditting(doc) {
    }
    cancelEditting(doc) {
    }
    onShowEditting(doc, x, y, width, height) {
    }
    onUpdateEditting(doc, x, y, width, height) {
    }
}
exports.Editor = Editor;
