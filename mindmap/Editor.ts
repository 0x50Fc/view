import { DocumentView } from './DocumentView'
import { Element } from "./Element"

export class Editor {

    readonly element: Element

    constructor(element: Element) {
        this.element = element;
    }

    beginEditting(doc: DocumentView, x: number, y: number): void {
        let p: Element | undefined = this.element
        while (p) {
            let v = doc.getLayout(p);
            x += v.x;
            y += v.y;
            p = p.parent;
        }
        let view = doc.getView(this.element);
        this.onShowEditting(doc, x, y - view.height * 0.5, view.width, view.height);
    }

    updateEditting(doc: DocumentView, x: number, y: number): void {
        let p: Element | undefined = this.element
        while (p) {
            let v = doc.getLayout(p);
            x += v.x;
            y += v.y;
            p = p.parent;
        }
        let view = doc.getView(this.element);
        this.onUpdateEditting(doc, x, y - view.height * 0.5, view.width, view.height);
    }

    commitEditting(doc: DocumentView): void {

    }

    cancelEditting(doc: DocumentView): void {

    }

    onShowEditting(doc: DocumentView, x: number, y: number, width: number, height: number) {

    }

    onUpdateEditting(doc: DocumentView, x: number, y: number, width: number, height: number) {

    }
}
