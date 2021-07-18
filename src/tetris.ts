import {BlockSize, CanvasHeight, CanvasWidth, Colors} from './constants';
import {
    MinoType,
    MinoShapes,
    checkBlockPosition,
    rotate,
    putDataToBoard,
    eraseFilledLines,
    getNextMino,
    getSRSOffsets,
    RotateDirection,
    checkTSpin,
} from './blocks';
import {Input} from './input';
import {ActionType, Score, ScoreObject} from './score';
import {Particle} from './particle';

export class Tetris {
    private _board: number[][];

    private _elapsed: number = 0;

    private _x: number = 4;
    private _y: number = -2;
    private _currentMino: MinoType = MinoType.T;
    private _currentMinoData: number[][] = MinoShapes[MinoType.T];
    private _direction: number = 0;

    private _nextStack: MinoType[] = [];
    private _started = false;
    private _hold: MinoType | null = null;
    private _holdAvailable: boolean = true;
    private _lastTurnTime: number = 0;
    private _score: Score = new Score();
    private _moved: boolean = false;
    private _scoreObject: ScoreObject | null = null;

    private _particles: Particle[] = [];

    private _input: Input;

    constructor() {
        this._reset();
        this._input = new Input();
    }

    private _reset(): void {
        this._started = true;
        this._elapsed = 0;
        this._board = new Array(20);
        this._x = 3;
        this._y = -1;
        this._moved = false;
        this._holdAvailable = true;
        this._hold = null;
        this._direction = 0;
        for (let i = 0; i < 20; i++) {
            this._board[i] = new Array(10).fill(0);
        }
        this._fillNextStack();
        this._currentMino = this._nextStack.shift();
        this._currentMinoData = MinoShapes[this._currentMino];
        this._fillNextStack();
        this._score.reset();
    }

    public update(): void {
        if (this._started) {
            this._elapsed += 0.010;

            const span = (Math.max(1 - (this._score.level / 20), 0.05));

            if (this._elapsed > span) {
                this._elapsed -= span;
                this._moveDown(this._lastTurnTime < 0);
                this._lastTurnTime -= 10;
            }
        }
        this._particles.forEach(p => { 
            p.update(); 
        });
        this._particles = this._particles.filter(p => !p.destroyed);
        this._processInput();
        this._input.update();
    }

    private _processInput(): void {
        const now = Date.now();
        if (this._started) {
            if (this._input.isPressed('ArrowLeft') || this._input.isLongDown('ArrowLeft')) {
                if (checkBlockPosition(this._board, this._x - 1, this._y, this._currentMinoData)) {
                    this._x--;
                    this._moved = true;
                }
            } 
            if (this._input.isPressed('ArrowRight') || this._input.isLongDown('ArrowRight')) {
                if (checkBlockPosition(this._board, this._x + 1, this._y, this._currentMinoData)) {
                    this._x++;
                    this._moved = true;
                }
            } 
            if (this._input.isPressed('Space')) {
                this._hardDrop();
            } 
            if (this._input.isPressed('ArrowDown')) {
                this._moveDown(true);
            } else if (this._input.isLongDown('ArrowDown')) {
                this._moveDown(false);
            }
            if (this._input.isPressed('ArrowUp') || this._input.isPressed('KeyX')) {
                this._turn(RotateDirection.Clockwise);
            }
            if (this._input.isPressed('KeyZ')) {
                this._turn(RotateDirection.CounterClockwise);
            } 
            if (this._input.isPressed('ShiftLeft')) {
                this._holding();
            }
        } else {
            if (this._input.isPressed('Space')) {
                this._reset();
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);

        ctx.translate(BlockSize * 7, 40);
        this._drawBorder(ctx);

        ctx.translate(1, 1);
        this._board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this._drawRect(ctx, x, y, this._started ? Colors[cell] : '#999');
                }
            });
        });

        this._drawGhost(ctx);

        this._drawMino(ctx, this._currentMinoData, this._x, this._y);
        this._particles.forEach(p => {
            p.render(ctx);
        });

        this._drawNexts(ctx);
        ctx.restore();

        this._drawHold(ctx);
        this._drawScore(ctx);
        if (!this._started) {
            this._renderGameOver(ctx);
        }
    }

    private _renderGameOver(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(BlockSize * 12, 40 + BlockSize * 10);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText('Press Space bar to start', 0, 0);
        ctx.restore();
    }

    private _drawScore(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(0, 110);
        this._score.render(ctx);
        ctx.restore();

        if (this._scoreObject) {
            ctx.save();
            ctx.translate(BlockSize * 12, BlockSize * 5);
            ctx.textAlign = 'center';
            if (this._scoreObject.backToBack) {
                ctx.font = '20px bold monospace';
                ctx.fillStyle = '#69c';
                ctx.fillText('BackToBack', 0, 0);
            }
            if (this._scoreObject.actionName) {
                let str = this._scoreObject.tspin ? 'T-SPIN ' : '';
                str += this._scoreObject.actionName;
                str += '+ ' + this._scoreObject.score;
                ctx.font = '24px bold monospace';
                ctx.fillStyle = 'white';
                ctx.fillText(str, 0, 20);
            }
            if (this._scoreObject.combo) {
                ctx.font = '16px bold monospace';
                ctx.fillStyle = '#fcc';
                ctx.fillText(`${this._scoreObject.combo} combo`, 0, 44);
            }
            
            ctx.restore();
        }
    }

    private _drawHold(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, BlockSize * 5, BlockSize * 5);

        if (this._hold) {
            this._drawMino(ctx, MinoShapes[this._hold], 0, 0);
        }
    }

    private _drawNexts(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(BlockSize * 10.5, BlockSize * 13);
        ctx.scale(0.5, 0.5);
        this._nextStack.forEach((minoType, n) => {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, n * 5 * BlockSize, BlockSize * 4, BlockSize * 4);
            const x = (minoType === MinoType.I) ? -1 : 0.5;
            const y = n * 5 + ((minoType === MinoType.I) ? -0.5 : 1);
            this._drawMino(ctx, MinoShapes[minoType], x, y); 
        });
        ctx.restore();
    }

    private _fillNextStack() {
        while(this._nextStack.length < 3) {
            this._nextStack.push(getNextMino());
        }
    }

    private _drawMino(ctx: CanvasRenderingContext2D, mino: number[][], x: number, y: number, filled: boolean = true): void {
        mino.forEach((row, _y) => {
            row.forEach((block, _x) => {
                if (block !== 0) {
                    this._drawRect(ctx, _x + x, _y + y, Colors[block], filled);
                }
            });
        });
    }

    private _drawGhost(ctx: CanvasRenderingContext2D): void {
        let ghostY = this._y;
        while(checkBlockPosition(this._board, this._x, ghostY + 1, this._currentMinoData)) {
            ghostY++;
        }
        ctx.save();
        this._drawMino(ctx, this._currentMinoData, this._x, ghostY, false);
        ctx.restore();
    }

    private _drawBorder(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, -BlockSize * 2, BlockSize * 10 + 1, BlockSize * 22 + 1);
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, BlockSize * 10 + 1, 1);
    }

    private _drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, filled: boolean = true): void {
        if (filled) {
            ctx.fillStyle = color;
            ctx.fillRect(x * BlockSize, y * BlockSize, BlockSize, BlockSize);
        } else {
            ctx.strokeStyle = color;
            ctx.strokeRect(x * BlockSize, y * BlockSize, BlockSize, BlockSize);
        }
    }

    private _hardDrop() {
        while (checkBlockPosition(this._board, this._x, this._y + 1, this._currentMinoData)) {
            this._y++;
            this._moved = true;
        }
        this._moveDown(true);
    }

    private _moveDown(toStock: boolean = true) {
        if (checkBlockPosition(this._board, this._x, this._y + 1, this._currentMinoData)) {
            this._y++;
            this._moved = true;
        } else if (toStock) {
            this._drop();
        }
    }

    private _drop() {
        this._board = putDataToBoard(this._board, this._x, this._y, this._currentMinoData);
        const eraseLine = this._countFilledLines();
        this._makeParticles();

        const mino = this._currentMino;
        this._currentMino = this._nextStack.shift();
        this._currentMinoData = MinoShapes[this._currentMino];
        let actionType = [ActionType.None, ActionType.Single, ActionType.Double, ActionType.Triple, ActionType.Tetris][eraseLine];
        if (mino === MinoType.T && !this._moved) {
            const isTspin = checkTSpin(this._board, this._x, this._y);
            if (isTspin) {
                actionType = ActionType.TSpin;
            }
        }
        this._board = eraseFilledLines(this._board);
        const scoreObject = this._score.update(eraseLine, actionType);
        this._scoreObject = scoreObject;
        this._fillNextStack();
        this._holdAvailable = true;
        this._elapsed = 0;

        if (this._y < 0) {
            this._started = false;
        }
        this._y = -2;
        this._x = 3;
        this._direction = 0;
    }

    private _countFilledLines(): number {
        let result = 0;
        this._board.forEach(row => {
            if (row.every(v => v > 0)) {
                result++;
            }
        });
        return result;
    }

    private _makeParticles(): void {
        for(let y = 0; y < 20; y++) {
            if (this._board[y].every(v => v > 0)) {
                for(let x = 0; x < 10; x++) {
                    const p = new Particle(x, y, Colors[this._board[y][x]]);
                    this._particles.push(p);
                }
            }
        }
    }

    private _holding(): void {
        if (!this._holdAvailable) return;
        const nextBlock = this._hold ? this._hold : this._nextStack.shift();
        this._hold = this._currentMino;
        this._currentMino = nextBlock;
        this._currentMinoData = MinoShapes[this._currentMino];
        this._fillNextStack();

        this._y = -2;
        this._x = 3;
        this._direction = 0;
        this._holdAvailable = false;
    }

    private _turn(direction: RotateDirection = RotateDirection.Clockwise): void {
        const nextDirection = (this._direction + (direction === RotateDirection.Clockwise ? 1 : -1)) & 3;
        const nextOffsets = getSRSOffsets(this._currentMino, this._direction, nextDirection);
        const nextBlock = rotate(this._currentMinoData, direction);

        for (let i = 0; i < nextOffsets.length; i++) {
            const pos = nextOffsets[i];
            if (checkBlockPosition(this._board, this._x + pos[0], this._y + pos[1], nextBlock)) {
                this._currentMinoData = nextBlock;
                this._x += pos[0];
                this._y += pos[1];
                this._direction = nextDirection;
                this._lastTurnTime = 100;
                this._moved = false;
                return;
            }
        }
    }
}
