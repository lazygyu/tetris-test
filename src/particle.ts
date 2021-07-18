import {BlockSize, Colors} from './constants';

export class Particle {
    private _y: number;
    private _x: number;
    private _color: string;
    private _elapsed: number = 0;

    private _dx: number = 0;
    private _dy: number = 0;

    private _vx: number = 0;
    private _vy: number = 0;

    public destroyed = false;

    constructor(x: number, y: number, color: string) {
        this._y = y * BlockSize;
        this._x = x * BlockSize;
        this._color = color;

        this._dx = this._x;
        this._dy = this._y;

        this._vx = Math.floor(Math.random() * 50) - 25;
        this._vy = -Math.floor(Math.random() * 250);
    }

    update() {
        this._elapsed += 10;
        if (this._elapsed > 500) {
            this.destroyed = true;
            return;
        }
        this._vy += 10;
        this._dy += this._vy * 0.01;

        this._dx += this._vx * 0.01;
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const opacity = Math.max(0, Math.min(0.5, 1 - this._elapsed / 500));
        ctx.globalAlpha = opacity;

        ctx.fillStyle = this._color;
        ctx.fillRect(this._dx, this._dy, BlockSize, BlockSize);
        ctx.restore();
    }
}
