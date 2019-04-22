import { Outlet } from "./Outlet";
import { Element } from "./Element";
import { DocumentView } from "./DocumentView";

export class Layout {


    x: number
    y: number
    width: number;
    height: number;
    In: Outlet
    Out: Outlet

    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.In = { x: 0, y: 0 };
        this.Out = { x: 0, y: 0 };
    }

    calculate(doc: DocumentView, e: Element, ctx: CanvasRenderingContext2D): void {

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

        let top = - height * 0.5;

        p = e.firstChild;

        while (p) {
            let v = doc.getLayout(p);
            v.y = top;
            v.x = view.width + doc.theme.divideX;
            top += v.height + doc.theme.divideY;
            p = p.nextSibling;
        }

        this.height = height;
        this.width = view.width + doc.theme.divideX + maxWidth;

    }


    draw(doc: DocumentView, e: Element, ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {

        let x0 = this.x + x;
        let y0 = this.y + y;
        let dh = this.height * 0.5;
        let l = x0;
        let r = x0 + this.width;
        let t = y0 - dh;
        let b = y0 + dh;

        let ml = Math.max(l, 0);
        let mr = Math.min(r, width);
        let mt = Math.max(t, 0);
        let mb = Math.min(b, height);

        if (mr > ml && mb > mt) {

            ctx.save();

            ctx.translate(l, t);

            doc.getView(e).draw(doc, e, ctx);

            ctx.restore();

            let p = e.firstChild;

            while (p) {
                doc.getLayout(p).draw(doc, p, ctx, x0, y0, width, height);
                p = p.nextSibling;
            }

        }

    }

}

