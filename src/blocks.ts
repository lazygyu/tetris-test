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
                if (isNaN(t)){
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
