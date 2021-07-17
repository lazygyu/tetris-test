import {MinoType, MinoShapes, checkBlockPosition} from '../src/blocks.ts';
describe('Check block position', () => {
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


    it('Block can go over 0, 0', () => {
        const result = checkBlockPosition(board, x, y, block);

        expect(result).toEqual(true);
    });

    it('Block can go in the board', () => {
        x = -1;
        const result = checkBlockPosition(board, x, y, block);
        expect(result).toEqual(true);
    });

    it('Block cannot go over left border', () => {
        x = -2;
        const result = checkBlockPosition(board, x, y, block);
        expect(result).toEqual(false);
    });

    it('Block cannot go over right border', () => {
        x = 8;
        const result = checkBlockPosition(board, x, y, block);
        expect(result).toEqual(false);
    });

    it('Return false if collides', () => {
        board[5][3] = 1;
        x = 2;
        y = 5;
        const result = checkBlockPosition(board, x, y, block);
        expect(result).toEqual(false);
    });

    


});
