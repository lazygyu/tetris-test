import {MinoShapes, MinoType, checkTSpin} from '../src/blocks';

describe('Check T-spin', () => {
    let board: number[][];
    let x: number = 0, y: number = 0;
    let block: number[][];
    beforeEach(() => {
        board = new Array(20);
        for(let i = 0; i < 20; i++){
            board[i] = new Array(10).fill(0);
        }
        x = 0;
        y = 0;
        block = MinoShapes[MinoType.O];
    });

    it('returns false if there is no block arround', () => {
        const result = checkTSpin(board, 0, 0);
        expect(result).toEqual(false);
    });

    it('returns true if there are blocks arround', () => {
        board[0][0] = 1;
        board[2][0] = 1;
        board[0][2] = 1;

        const result = checkTSpin(board, 0, 0);
        expect(result).toEqual(true);
    });

    it('returns true if wall included', () => {
        board[0][1] = 1;

        const result = checkTSpin(board, -1, 0);
        expect(result).toEqual(true);
    });
});
