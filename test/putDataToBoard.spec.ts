import {MinoType, MinoShapes, putDataToBoard} from '../src/blocks.ts';
describe('PutDataToBoard', () => {
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

    it('put block to 0, 0', () => {
        const result = putDataToBoard(board, x, y, block);

        board[0][1] = 4;
        board[0][2] = 4;
        board[1][1] = 4;
        board[1][2] = 4;

        expect(result).toEqual(board);
    });

    it('put block to 19, 0', () => {
        y = 19;
        const result = putDataToBoard(board, x, y, block);

        board[19][1] = 4;
        board[19][2] = 4;

        expect(result).toEqual(board);
    });

    it('put block to 18, 8', () => {
        x = 8;
        y = 18;
        const result = putDataToBoard(board, x, y, block);

        board[18][8] = 0;
        board[18][9] = 4;

        expect(result).toEqual(board);
    });
});
