import {BlockSize, CanvasHeight, CanvasWidth, Colors} from './constants';
import {MinoType, MinoShapes, checkBlockPosition, rotate, putDataToBoard, eraseFilledLines, getNextMino} from './blocks';

export class Tetris {
    private _board: number[][];

    private _elapsed: number = 0;

    private _x: number = 4;
    private _y: number = 0;
    private _currentMino: MinoType = MinoType.T;
    private _currentMinoData: number[][] = MinoShapes[MinoType.T];

    private _blockCount = 0;

    constructor() {
        this._board = new Array(20);
        for (let i = 0; i < 20; i++) {
            this._board[i] = new Array(10).fill(0);
        }

        document.addEventListener('keydown', e => {
            switch(e.code) {
                case 'ArrowLeft':
                    if (checkBlockPosition(this._board, this._x - 1, this._y, this._currentMinoData)) {
                        this._x--;
                    }
                    break;
                case 'ArrowRight':
                    if (checkBlockPosition(this._board, this._x + 1, this._y, this._currentMinoData)) {
                        this._x++;
                    }
                    break;
                case 'ArrowDown':
                    this._moveDown();
                    break;
                case 'Space':
                    this._hardDrop();
                    break;
                case 'ArrowUp':
                    const nextBlock = rotate(this._currentMinoData);
                    if (checkBlockPosition(this._board, this._x, this._y, nextBlock)) {
                        this._currentMinoData = nextBlock;
                    }
                    break;
            }
        });
    }

    public update(): void {
        this._elapsed += 0.010;

        const span = (Math.max(1 - (this._blockCount/100), 0.05));

        if (this._elapsed > span) {
            this._elapsed -= span;
            this._moveDown();
        }
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

        this._drawMino(ctx);

        ctx.restore();
    }

    private _drawMino(ctx: CanvasRenderingContext2D): void {
        this._currentMinoData.forEach((row, y) => {
            row.forEach((block, x) => {
                if (block !== 0) {
                    this._drawRect(ctx, this._x + x, this._y + y, Colors[block]);
                }
            });
        });
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

    private _hardDrop() {
        while (checkBlockPosition(this._board, this._x, this._y + 1, this._currentMinoData)) {
            this._y++;
        }
        this._moveDown();
    }

    private _moveDown() {
        if (checkBlockPosition(this._board, this._x, this._y + 1, this._currentMinoData)) {
            this._y++;
        } else {
            this._board = putDataToBoard(this._board, this._x, this._y, this._currentMinoData);
            this._board = eraseFilledLines(this._board);
            this._currentMino = getNextMino();
            this._currentMinoData = MinoShapes[this._currentMino];
            this._blockCount++;

            this._y = 0;
            this._x = 3;
        }
    }
}
