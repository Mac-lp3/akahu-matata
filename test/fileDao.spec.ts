import path from 'path';
import { assert, expect } from 'chai';
import { FileDao } from '../src/io';
import { TransferPlan, User } from '../src/types';
import { unlink, stat, readFile } from 'fs/promises';

describe('the file dao', function() {

    const testPlan: TransferPlan = {
        transfers: [{
            from: {
                akahuId: 'akahu111',
                company: 'banc',
                accountNumber: '111',
                name: 'T1 checking',
                type: 'CHECKING',
                tier: 1,
                current: 312.42,
                min: 100.00,
                max: 300.00
            },
            to: {
                akahuId: 'akahu222',
                company: 'banc',
                accountNumber: '222',
                name: 'T2 savings',
                type: 'SAVINGS',
                tier: 2,
                current: 521.57,
                min: 0
            },
            amount: 12.42
        }]
    };

    let user: User;
    const planFile = path.join(__dirname, '../src/data/plans/123.json')
    const dao = new FileDao();

    it('should load the dummy user', async function() {
        user = await dao.getUser('123');
        //console.log(us);

        expect(user).to.have.property('preferences');
        expect(user.preferences).to.exist;
        expect(user).to.have.property('accounts');
        expect(user.accounts).to.have.length.greaterThan(0);
    })

    it('should create plan json files', async function() {
        try {
            await unlink(planFile);
        } catch(ex) {}

        await dao.savePlan(testPlan, user.id);

        try {

            await stat(planFile);
            const tmp = await readFile(planFile, 'utf-8');
            const data = JSON.parse(tmp);

            expect(data.transfers).to.have.lengthOf(1);
            expect(data.transfers[0].amount).to.equal(12.42);

        } catch (ex) {
            assert.fail()
        }

    })

})