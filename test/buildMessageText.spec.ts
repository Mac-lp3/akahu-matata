import { expect } from 'chai';
import { User } from '../src/types';
import { FileDao } from '../src/io/fileDao';
import { buildPlanSummary, buildTransferPlan } from '../src/core';
import { b_u_b_r, e_u_b_r, eb_e_r, bu_u_r } from './data/resolvable';

describe('build text message for transfer plan', function() {

    const dao = new FileDao();
    let user: User;

    before(async function() {
        user = await dao.getUser('123');
    })
    
    it('generates expected transfers for e_u_b_r', function() {
        const transferPlan = buildTransferPlan(e_u_b_r.accounts);

        console.log(buildPlanSummary(transferPlan, user));
    })

})