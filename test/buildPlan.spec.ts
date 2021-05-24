import { expect } from 'chai';
import { b_u_b_r, e_u_b_r, eb_e_r, bu_u_r } from './data/resolvable';
import { buildTransferPlan, getAccountRequests } from '../src/core/buildPlan';

describe('buildTransferPlan', function() {
    
    it('generates expected transfers for e_u_b_r', function() {
        const acctRequests = getAccountRequests(e_u_b_r.accounts)
        const transferPlan = buildTransferPlan(acctRequests)

        expect(transferPlan.length).to.equal(e_u_b_r.expected.numberOfTransfers);

        for (let i = 0; i < transferPlan.length; ++i) {
            expect(transferPlan[i].amount).to.equal(e_u_b_r.expected.transferAmounts[i]);
            expect(transferPlan[i].to.id).to.equal(e_u_b_r.expected.transferToIds[i]);
            expect(transferPlan[i].from.id).to.equal(e_u_b_r.expected.transferFromIds[i]);
        }

    })

    it('generates expected transfers for b_u_b_r', function() {

        const acctRequests = getAccountRequests(b_u_b_r.accounts)
        const transferPlan = buildTransferPlan(acctRequests)

        expect(transferPlan.length).to.equal(b_u_b_r.expected.numberOfTransfers);

        for (let i = 0; i < transferPlan.length; ++i) {
            expect(transferPlan[i].amount).to.equal(b_u_b_r.expected.transferAmounts[i]);
            expect(transferPlan[i].to.id).to.equal(b_u_b_r.expected.transferToIds[i]);
            expect(transferPlan[i].from.id).to.equal(b_u_b_r.expected.transferFromIds[i]);
        }

    })

    it('generates expected transfers for eb_e_r', function() {

        const acctRequests = getAccountRequests(eb_e_r.accounts)
        const transferPlan = buildTransferPlan(acctRequests)

        expect(transferPlan.length).to.equal(eb_e_r.expected.numberOfTransfers);

        for (let i = 0; i < transferPlan.length; ++i) {
            expect(transferPlan[i].amount).to.equal(eb_e_r.expected.transferAmounts[i]);
            expect(transferPlan[i].to.id).to.equal(eb_e_r.expected.transferToIds[i]);
            expect(transferPlan[i].from.id).to.equal(eb_e_r.expected.transferFromIds[i]);
        }

    })

    it('generates expected transfers for bu_u_r', function() {

        const acctRequests = getAccountRequests(bu_u_r.accounts)
        const transferPlan = buildTransferPlan(acctRequests)

        expect(transferPlan.length).to.equal(bu_u_r.expected.numberOfTransfers);

        for (let i = 0; i < transferPlan.length; ++i) {
            expect(transferPlan[i].amount).to.equal(bu_u_r.expected.transferAmounts[i]);
            expect(transferPlan[i].to.id).to.equal(bu_u_r.expected.transferToIds[i]);
            expect(transferPlan[i].from.id).to.equal(bu_u_r.expected.transferFromIds[i]);
        }

    })

})