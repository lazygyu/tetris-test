import {MinoType, MinoShapes, checkBlockPosition} from '../src/blocks.ts';
describe('Check block position', () => {
    const board = new Array(20);
    for(let i = 0; i < 10; i++){
        board[i] = new Array(10).fill(0);
    }

    let x = 0;
    let y = 0;

    const block = MinoShapes[MinoType.O];

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
});
