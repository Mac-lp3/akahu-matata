import { expect } from 'chai';
import { buildPlanSummary } from '../src/core/buildPlanSummary';
import { b_u_b_r, e_u_b_r, eb_e_r, bu_u_r } from './data/resolvable';
import { buildTransferPlan, getAccountRequests } from '../src/core/buildPlan';

describe('build text message for transfer plan', function() {
    
    it('generates expected transfers for e_u_b_r', function() {
        const acctRequests = getAccountRequests(e_u_b_r.accounts)
        const transferPlan = buildTransferPlan(acctRequests)

        buildPlanSummary(transferPlan);
    })

})