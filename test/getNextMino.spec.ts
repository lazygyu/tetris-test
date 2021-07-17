import {getNextMino} from '../src/blocks';

describe('getNextMino', () => {
    let cnt = 0;

    it('getNextMino returns a mino', () => {
        const result = getNextMino();
        cnt++;

        expect(result).not.toBeNull();
    });

    it('getNextMino returns a mino', () => {
        const first = getNextMino();
        let diff = false;

        for(let i = 0; i < 10; i++) {
            const result = getNextMino();
            cnt++;
            if (first !== result) {
                diff = true;
                break;
            }
        }
        expect(diff).toEqual(true);
    });

    it('getNextMino returns a mino which is not appears in last 6 times', () => {
        const results = [];
        while (cnt % 7 !== 6) {
            getNextMino();
            cnt++;
        }
        for(let i = 0; i < 7; i++) {
            results.push(getNextMino());
        }

        expect(results.every((v, i) => results.indexOf(v) === i)).toEqual(true);
    });
});
