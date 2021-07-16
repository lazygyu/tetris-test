export enum MinoType {
    I = 1,
    L = 2,
    J = 3,
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

    [MinoType.L]: [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
    ],

    [MinoType.J]: [
        [0, 0, 3],
        [3, 3, 3],
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
