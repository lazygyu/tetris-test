import {CanvasHeight, CanvasWidth} from './constants';
import {Tetris} from './tetris';

class Game {
    private _canvas: HTMLCanvasElement;

    private _lastTime: number;
    private _accumulator: number = 0;
    private _msPerFrame: number = 10; // update 시간 간격 (밀리초)

    public loop: (timestamp: DOMHighResTimeStamp) => void;

    private _gamelogic: Tetris;

    constructor(wrapper: HTMLElement) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = CanvasWidth;
        this._canvas.height = CanvasHeight;

        this.loop = this._loop.bind(this);

        wrapper.appendChild(this._canvas);

        this._gamelogic = new Tetris();
        this._initialize();
    }

    private _initialize(): void {
        requestAnimationFrame(this.loop);
    }

    private _loop(timestamp: DOMHighResTimeStamp): void {
        if (!this._lastTime) {
            this._lastTime = timestamp;
        }
        const elapsed = timestamp - this._lastTime;
        this._lastTime = timestamp;
        this._accumulator += elapsed;

        while (this._accumulator > this._msPerFrame) {
            this._update();
            this._accumulator -= this._msPerFrame;
        }

        this._render();

        requestAnimationFrame(this.loop);
    }

    private _update(): void {
        // this._msPerFrame 마다 실행
        this._gamelogic.update();
    }

    private _render(): void {
        // 화면 그리기
        const ctx = this._canvas.getContext('2d');
        ctx.save();
        ctx.translate(0.5, 0.5); // canvas 는 가상 좌표계라서 0.5 씩 밀어줘야 픽셀과 1:1 대응이 됨
        this._gamelogic.render(ctx);
        ctx.restore();
    }
}

const game = new Game(document.querySelector('#game'));
