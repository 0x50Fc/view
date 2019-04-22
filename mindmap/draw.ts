

export function addRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, r: number): void {

    let a_x = x + r
    let a_y = y
    let b_x = x + width
    let b_y = y
    let c_x = x + width
    let c_y = y + height
    let d_x = x
    let d_y = y + height
    let e_x = x
    let e_y = y

    ctx.moveTo(a_x, a_y);
    ctx.arcTo(b_x, b_y, c_x, c_y, r);
    ctx.arcTo(c_x, c_y, d_x, d_y, r);
    ctx.arcTo(d_x, d_y, e_x, e_y, r);
    ctx.arcTo(e_x, e_y, a_x, a_y, r);

}
