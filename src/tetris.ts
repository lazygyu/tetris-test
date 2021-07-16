import {BlockSize, CanvasHeight, CanvasWidth, Colors} from './constants';

export class Tetris {
    private _board: number[][];

    private _elapsed: number = 0;

    constructor() {
        this._board = new Array(20);
        for (let i = 0; i < 20; i++) {
            this._board[i] = new Array(10).fill(0);
        }
    }

    public update(): void {
        this._elapsed += 0.010;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);

        this._drawBorder(ctx);

        ctx.translate(1, 1);
        this._board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this._drawRect(ctx, x, y, Colors[cell]);
                }
            });
        });
        ctx.restore();
    }

    private _drawBorder(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, BlockSize * 10 + 1, BlockSize * 20 + 1);
    }

    private _drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
        ctx.fillStyle = color;
        ctx.fillRect(x * BlockSize, y * BlockSize, BlockSize, BlockSize);
    }
}
