import {eraseFilledLines} from '../src/blocks';

describe('Erase filled lines', () => {
    let board: number[][];
    beforeEach(() => {
        board = new Array(20);
        for(let i = 0; i < 20; i++){
            board[i] = new Array(10).fill(0);
        }
    });


    it('nothing happens when there is no line to erase', () => {
        const result = eraseFilledLines(board);

        expect(result).toEqual(board);
    });


    it('erase filled lines', () => {
        for(let i = 0; i < 10; i++) {
            board[4][i] = i % 2 === 0 ? 1 : 2;
        }
        board[3][5] = 3;
        const result = eraseFilledLines(board);
        

        for(let i = 0; i < 10; i++) {
            board[4][i] = 0;
        }
        board[3][5] = 0;
        board[4][5] = 3;
        expect(result).toEqual(board);
    });
});
