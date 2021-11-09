import {kebabCase} from './kebabCase';

describe(kebabCase.name, () => {
    it('should convert a string to kebab case', () => {
        expect(kebabCase(' a.B^c-D ')).toBe('a-b-c-d');
    });
});
