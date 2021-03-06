import { expect } from 'chai';
import { buildTransferPlan } from '../src/core';
import { b_u_b_r, e_u_b_r, eb_e_r, bu_u_r } from './data/resolvable';

describe('buildTransferPlan', function() {
    
    it('generates expected transfers for e_u_b_r', function() {

        const transferPlan = buildTransferPlan(e_u_b_r.accounts)

        expect(transferPlan.transfers.length).to.equal(e_u_b_r.expected.numberOfTransfers);

        for (let i = 0; i < transferPlan.transfers.length; ++i) {
            expect(transferPlan.transfers[i].amount).to.equal(e_u_b_r.expected.transferAmounts[i]);
            expect(transferPlan.transfers[i].to.akahuId).to.equal(e_u_b_r.expected.transferToIds[i]);
            expect(transferPlan.transfers[i].from.akahuId).to.equal(e_u_b_r.expected.transferFromIds[i]);
        }

    })

    it('generates expected transfers for b_u_b_r', function() {

        const transferPlan = buildTransferPlan(b_u_b_r.accounts)

        expect(transferPlan.transfers.length).to.equal(b_u_b_r.expected.numberOfTransfers);

        for (let i = 0; i < transferPlan.transfers.length; ++i) {
            expect(transferPlan.transfers[i].amount).to.equal(b_u_b_r.expected.transferAmounts[i]);
            expect(transferPlan.transfers[i].to.akahuId).to.equal(b_u_b_r.expected.transferToIds[i]);
            expect(transferPlan.transfers[i].from.akahuId).to.equal(b_u_b_r.expected.transferFromIds[i]);
        }

    })

    it('generates expected transfers for eb_e_r', function() {

        const transferPlan = buildTransferPlan(eb_e_r.accounts)

        expect(transferPlan.transfers.length).to.equal(eb_e_r.expected.numberOfTransfers);

        for (let i = 0; i < transferPlan.transfers.length; ++i) {
            expect(transferPlan.transfers[i].amount).to.equal(eb_e_r.expected.transferAmounts[i]);
            expect(transferPlan.transfers[i].to.akahuId).to.equal(eb_e_r.expected.transferToIds[i]);
            expect(transferPlan.transfers[i].from.akahuId).to.equal(eb_e_r.expected.transferFromIds[i]);
        }

    })

    it('generates expected transfers for bu_u_r', function() {

        const transferPlan = buildTransferPlan(bu_u_r.accounts)

        expect(transferPlan.transfers.length).to.equal(bu_u_r.expected.numberOfTransfers);

        for (let i = 0; i < transferPlan.transfers.length; ++i) {
            expect(transferPlan.transfers[i].amount).to.equal(bu_u_r.expected.transferAmounts[i]);
            expect(transferPlan.transfers[i].to.akahuId).to.equal(bu_u_r.expected.transferToIds[i]);
            expect(transferPlan.transfers[i].from.akahuId).to.equal(bu_u_r.expected.transferFromIds[i]);
        }

    })

})