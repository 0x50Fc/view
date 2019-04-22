import { Outlet } from "./Outlet";
import { Element } from "./Element";
import { DocumentView } from "./DocumentView";
import { addRoundedRect } from "./draw";

export class View {

    width: number
    height: number

    constructor() {
        this.width = 0;
        this.height = 0;
    }

    calculate(doc: DocumentView, e: Element, ctx: CanvasRenderingContext2D): void {
        let title = e.data.title || '';
        ctx.font = doc.theme.fontSize + 'px normal';
        let width = ctx.measureText(title).width;
        this.width = width + doc.theme.padding.left + doc.theme.padding.right;
        this.height = doc.theme.fontSize + doc.theme.padding.top + doc.theme.padding.bottom;
    }

    draw(doc: DocumentView, e: Element, ctx: CanvasRenderingContext2D) {

        let title = e.data.title || '';

        let view = doc.getView(e);

        if (doc.theme.backgroundColor) {

            ctx.beginPath();

            if (doc.theme.borderRadius > 0) {
                addRoundedRect(ctx, 0, 0, view.width, view.height, doc.theme.borderRadius);
            } else {
                ctx.rect(0, 0, view.width, view.height)
            }

            ctx.fillStyle = doc.theme.backgroundColor;

            ctx.fill();

        }

        if (doc.theme.borderWidth > 0 && doc.theme.borderColor) {

            ctx.beginPath();

            if (doc.theme.borderRadius > 0) {
                addRoundedRect(ctx, 0, 0, view.width, view.height, doc.theme.borderRadius);
            } else {
                ctx.rect(0, 0, view.width, view.height)
            }

            ctx.strokeStyle = doc.theme.borderColor;
            ctx.lineWidth = doc.theme.borderWidth;

            ctx.stroke();

        }

        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = doc.theme.color;
        ctx.font = doc.theme.fontSize + 'px normal';
        ctx.fillText(title, doc.theme.padding.left, doc.theme.padding.top);

    }

}
