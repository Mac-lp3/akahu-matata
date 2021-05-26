import { assert } from 'chai';
import { main } from '../src/main';

describe('the main func', function() {

    it('should?', async function() {
        try {
            await main(['123']);
        } catch(ex) {
            assert.fail();
        }
    })
})
