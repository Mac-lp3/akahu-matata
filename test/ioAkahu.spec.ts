import { expect } from 'chai';
import { User } from '../src/types';
import { FileDao } from '../src/io/fileDao';
import { getAccountConfigs } from '../src/io/akahu';

describe('the akahu API callers', function() {

    const dao = new FileDao();
    let user: User;

    before(async function() {
        user = await dao.getUser('123');
    })

    it('uses look ups to get the right data', async function() {
        
        const configs = await getAccountConfigs(user.accounts);

        expect(configs.length).to.equal(user.accounts.length);
        configs.forEach(con => {
            expect(con.current).is.a('number');
        });
    })
})