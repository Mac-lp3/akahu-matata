import { expect } from 'chai';
import { User } from '../src/types';
import { FileDao, getAccounts } from '../src/io';

describe('the akahu API callers', function() {

    const dao = new FileDao();
    let user: User;

    before(async function() {
        user = await dao.getUser('123');
    })

    it('uses look ups to get the right data', async function() {
        
        const configs = await getAccounts(user.accounts);

        expect(configs.length).to.equal(user.accounts.length);
        configs.forEach(con => {
            expect(con.current).is.a('number');
        });
    })
})