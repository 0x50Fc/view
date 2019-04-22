
import { Document } from "./Document"
import { Element, forEach } from "./Element";
import { View } from "./View";
import { Layout } from "./Layout";
import { Outlet } from "./Outlet";

export class DocumentView {

    readonly document: Document

    theme: any

    constructor(document: Document, theme?: any) {
        this.document = document;
        if (theme) {
            this.theme = theme;
        } else {
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

    get width(): number {
        return this.getLayout(this.document.root).width
    }

    get height(): number {
        return this.getLayout(this.document.root).height
    }

    get In(): Outlet {
        return this.getLayout(this.document.root).In
    }

    createView(element: Element): View {
        return new View();
    }

    getView(element: Element): View {
        if (element.data === undefined) {
            element.data = {};
        }
        if (element.data.view === undefined) {
            element.data.view = this.createView(element);
        }
        return element.data.view;
    }

    createLayout(element: Element): Layout {
        return new Layout();
    }

    getLayout(element: Element): Layout {
        if (element.data === undefined) {
            element.data = {};
        }
        if (element.data.layout === undefined) {
            element.data.layout = this.createLayout(element);
        }
        return element.data.layout;
    }

    calculate(ctx: CanvasRenderingContext2D): void {
        this.getLayout(this.document.root).calculate(this, this.document.root, ctx);
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
        this.getLayout(this.document.root).draw(this, this.document.root, ctx, x, y, width, height);
    }

    onDrawOutlet(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {

    }

    drawOutlet(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, e?: Element): void {
        if (e === undefined) {
            e = this.document.root
        }
        let v = this.getLayout(e);
        let x0 = x + v.Out.x;
        let y0 = y + v.Out.y;
        let p = e.firstChild;
        while (p) {
            let a = this.getLayout(p);
            this.onDrawOutlet(ctx, x0, y0, x + a.x, y + a.y);
            p = p.nextSibling;
        }
    }

}