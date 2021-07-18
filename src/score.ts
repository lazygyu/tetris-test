export enum ActionType {
    None = 0,
    Single = 1,
    Double = 2,
    Triple = 3,
    Tetris = 4,
    TSpin = 5,
};

const EraseNames = ['', 'Single', 'Double', 'Triple', 'Tetris'];
const B2BActions = [ActionType.TSpin, ActionType.Tetris];

export interface ScoreObject {
    backToBack: boolean;
    combo: number;
    actionName: string;
    tspin: boolean;
    score: number;
}

export class Score {
    private _score: number = 0;
    private _highScore: number = 0;
    private _erased: number = 0;
    private _lastAction: ActionType = ActionType.None;
    private _lastEraseAction: ActionType = ActionType.None;
    private _backToBack: number = 0;
    private _maxCombo: number = 0;
    private _combo: number = 0;
    private _tspin: number = 0;
    private _currentState: string = '';

    public get level(): number {
        return Math.floor(this._erased / 100 * 20);
    }

    public get currentState(): string {
        return this._currentState;
    }

    constructor() {
    }

    reset() {
        this._score = 0;
        this._combo = 0;
        this._lastAction = ActionType.None;
        this._lastEraseAction = ActionType.None;
        this._erased = 0;
        this._backToBack = 0;
        this._tspin = 0;
        this._currentState = '';
    }

    update(line: number, action: ActionType = ActionType.None): ScoreObject | null {
        const scoreObject = {
            backToBack: false,
            combo: 0,
            actionName: '',
            tspin: false,
            score: 0,
        };

        if (line === 0) {
            this._combo = 0;
            this._currentState = '';
        }

        if (line > 0 && this._lastAction !== ActionType.None) {
            this._combo++;
            this._maxCombo = Math.max(this._combo, this._maxCombo);
            scoreObject.combo = this._combo;
        }

        if (line > 0 && action === ActionType.TSpin) {
            this._tspin++;
            scoreObject.tspin = true;
        }

        if (line > 0 && B2BActions.includes(action) && B2BActions.includes(this._lastEraseAction)) {
            this._backToBack++;
            scoreObject.backToBack = true;
        } else if (line > 0) {
            this._backToBack = 0;
        }

        if (line > 0) {
            this._lastEraseAction = action;
            scoreObject.actionName = EraseNames[line];
        }

        const score = ((line * line) + this._combo) * (this._backToBack + 1);
        scoreObject.score = score;

        this._erased += line;
        this._score += score;
        this._highScore = Math.max(this._highScore, this._score);
        this._lastAction = action;

        return score > 0 ? scoreObject : null;
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.font = '16px monospace';
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 120, 200);
        ctx.textBaseline = 'top';

        ctx.fillStyle = 'white';
        ctx.fillText(`HiScr ${lpad(this._highScore, 5)}`, 5, 5);
        ctx.fillText(`MaxCb ${lpad(this._maxCombo, 5)}`, 5, 25);

        ctx.fillText(`Level ${lpad(this.level, 5)}`, 5, 55);
        ctx.fillText(`Score ${lpad(this._score, 5)}`, 5, 75);
        ctx.fillText(`Erase ${lpad(this._erased, 5)}`, 5, 95);
        ctx.fillText(`Combo ${lpad(this._combo, 5)}`, 5, 115);
        ctx.fillText(`Tspin ${lpad(this._tspin, 5)}`, 5, 135);
        ctx.fillText(`Bk2Bk ${lpad(this._backToBack, 5)}`, 5, 155);
        ctx.restore();
    }
}

function lpad(v: number, digits: number): string {
    return (new Array(digits).fill(0).join('') + v.toString()).substr(-digits);
}
