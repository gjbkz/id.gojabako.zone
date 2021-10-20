import {getAccountId} from './getAccountId';

describe(getAccountId.name, () => {
    it('return AWS Account ID', async () => {
        process.env.AWS_PROFILE = 'id.gojabako.zone';
        expect(await getAccountId()).toMatch(/^\d+$/);
    });
});
