import {MinoShapes, MinoType, rotate, RotateDirection} from '../src/blocks';

describe('Simple Mino Rotation', function () {
    it('Rotate I-mino clockwise', () => {
        // given
        const mino = MinoShapes[MinoType.I];

        // when
        const result = rotate(mino, RotateDirection.Clockwise);

        // then
        expect(result).toEqual([
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
        ]);
    });

    it('Rotate L-mino Clockwise', () => {
        // given
        const mino = MinoShapes[MinoType.L];

        // when
        const result = rotate(mino);

        // then
        expect(result).toEqual([
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ]);
    });

    it('Rotate L-mino CountClockWise', () => {
        // given
        const mino = MinoShapes[MinoType.L];

        // when
        const result = rotate(mino, RotateDirection.CounterClockwise);

        // then
        expect(result).toEqual([
            [2, 2, 0],
            [0, 2, 0],
            [0, 2, 0],
        ]);
    });

    it('Rotate T-mino 2 times', () => {
        // given
        const mino = MinoShapes[MinoType.T];

        // when
        const result = rotate(rotate(mino));

        // then
        expect(result).toEqual([
            [0, 0, 0],
            [6, 6, 6],
            [0, 6, 0],
        ]);
    });

    it('Rotate Z-mino CW', () => {
        // given
        const mino = MinoShapes[MinoType.Z];

        // when
        const result = rotate(mino);

        // then
        expect(result).toEqual([
            [0, 0, 7],
            [0, 7, 7],
            [0, 7, 0],
        ]);
    });

    it('Rotate Z-mino CCW', () => {
        // given
        const mino = MinoShapes[MinoType.Z];

        // when
        const result = rotate(mino, RotateDirection.CounterClockwise);

        // then
        expect(result).toEqual([
            [0, 7, 0],
            [7, 7, 0],
            [7, 0, 0],
        ]);
    });
});