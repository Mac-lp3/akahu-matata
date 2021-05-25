import { assert } from 'chai';
import { ConsoleSender } from '../src/io';

describe('console sender', function() {

    it('should not throw an error', function() {
        try {
            const cs = new ConsoleSender();
            cs.send('lol');
        } catch(ex) {
            assert.fail();
        }
    })
})