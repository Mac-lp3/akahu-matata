import { expect } from 'chai';
import { User } from '../src/types';
import { FileDao } from '../src/io/fileDao';
import { buildPlanSummary } from '../src/core/buildMessageText';
import { b_u_b_r, e_u_b_r, eb_e_r, bu_u_r } from './data/resolvable';
import { buildTransferPlan, getAccountRequests } from '../src/core/buildPlan';

describe('build text message for transfer plan', function() {

    const dao = new FileDao();
    let user: User;

    before(async function() {
        user = await dao.getUser('123');
    })
    
    it('generates expected transfers for e_u_b_r', function() {
        const acctRequests = getAccountRequests(e_u_b_r.accounts);
        const transferPlan = buildTransferPlan(acctRequests);

        console.log(buildPlanSummary(transferPlan, user));
    })

})