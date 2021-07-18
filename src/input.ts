const LONG_PRESS = 150;

export class Input {
    private _lastKeys: {[key: string]: number} = {};
    private _currentKeys: {[key: string]: number} = {};
    constructor() {
        document.addEventListener('keydown', this._keydown.bind(this));
        document.addEventListener('keyup', this._keyup.bind(this));
    }

    public update() {
        this._backupKeys();
    }

    private _keydown(e) {
        this._currentKeys[e.code] = Date.now();
        e.preventDefault();
    }

    private _backupKeys() {
        this._lastKeys = Object.assign({}, this._currentKeys);
    }

    private _keyup(e) {
        this._currentKeys[e.code] = 0;
        e.preventDefault();
    }

    public isDown(key: string): boolean {
        return !!this._currentKeys[key];
    }

    public isLongDown(key: string): boolean {
        const now = Date.now();
        return this._currentKeys[key] && (now - this._currentKeys[key] > LONG_PRESS);
    }

    public isUp(key: string): boolean {
        return !this._currentKeys[key];
    }

    public isPressed(key: string): boolean {
        return !!this._currentKeys[key] && !this._lastKeys[key];
    }

    public isReleased(key: string): boolean {
        return !this._currentKeys[key] && !!this._lastKeys[key];
    }
}
