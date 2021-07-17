export enum MinoType {
    I = 1,
    J = 2,
    L = 3,
    O = 4,
    S = 5,
    T = 6,
    Z = 7,
}

export const MinoShapes: {[key in MinoType]: number[][]} = {
    [MinoType.I]: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],

    [MinoType.J]: [
        [3, 0, 0],
        [3, 3, 3],
        [0, 0, 0],
    ],

    [MinoType.L]: [
        [0, 0, 2],
        [2, 2, 2],
        [0, 0, 0],
    ],

    [MinoType.O]: [
        [0, 4, 4],
        [0, 4, 4],
        [0, 0, 0],
    ],

    [MinoType.S]: [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
    ],

    [MinoType.T]: [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0],
    ],

    [MinoType.Z]: [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
    ],
}

export enum RotateDirection {
    Clockwise = 0,
    CounterClockwise = 1,
}

export function rotate(mino: number[][], direction: RotateDirection = RotateDirection.Clockwise): number[][] {
    let result = mino;
    if (direction === RotateDirection.CounterClockwise) {
        result = rotateCW(rotateCW(mino));
    }
    result = rotateCW(result);
    return result;
}

function rotateCW(mino: number[][]): number[][] {
    const size = mino.length;
    const result = new Array(size);
    for (let y = 0; y < size; y++) {
        result[y] = new Array(size).fill(0);
        for (let x = 0; x < size; x++) {
            result[y][x] = mino[size - 1 - x][y];
        }
    }
    return result;
}

export function checkBlockPosition(board: number[][], x: number, y: number, mino: number[][]): boolean {
    const size = mino.length;
    for(let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (mino[i][j] > 0) {
                if (!board[y + i]){
                    return false;
                }
                const t = board[y + i][x + j] + mino[i][j];
                if (isNaN(t) || t > mino[i][j]){
                    return false;
                }
            }
        }
    }
    return true;
}

export function putDataToBoard(board: number[][], x: number, y: number, mino: number[][]): number[][] {
    const boardSize = board.length;
    const result: number[][] = new Array(board.length);

    for(let i = 0; i < boardSize; i++) {
        result[i] = new Array();
        for(let j = 0; j < board[i].length; j++) {
            result[i][j] = board[i][j];
        }
    }

    const minoSize = mino.length;
    for(let i = 0; i < minoSize; i++) {
        if ( y + i < 0 || y + i >= result.length) continue;
        for(let j = 0; j < minoSize; j++) {
            if (x + j < 0 || x + j >= result[i].length) continue;
            if (mino[i][j]) {
                result[i + y][j + x] = mino[i][j];
            }
        }
    }
    return result;
}

function deepCopy(arr: number[][]): number[][] {
    const result: number[][] = [];
    for(let i = 0; i < arr.length; i++) {
        result[i] = [];
        for (let j = 0; j < arr[i].length; j++) {
            result[i][j] = arr[i][j];
        }
    }
    return result;
}

export function eraseFilledLines(board: number[][]): number[][] {
    let result = deepCopy(board);
    for (let i = 0; i < board.length; i++) {
        if (result[i].every(v => v > 0)) {
            result = clampLine(result, i);
        }
    }
    return result;
}

function clampLine(board: number[][], line: number): number[][] {
    let result = deepCopy(board);
    result.splice(line, 1);
    result.unshift(new Array(board[0].length).fill(0));
    return result;
}

const bag: MinoType[] = [];

export function getNextMino(): MinoType {
    if (bag.length === 0) {
        bag.push(...([1, 2, 3, 4, 5, 6, 7].sort(() => Math.floor(Math.random() * 3) - 1)));
    }
    return bag.pop();
}
