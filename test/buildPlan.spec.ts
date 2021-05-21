import { plan, insAndOuts, buildTransferPlan } from '../src/core/buildPlan';
import { AccountConfig } from '../src/types';

const testOne: AccountConfig[] = [{
    id: '001',
    name: 'ANZ Checking',
    readableName: 'Personal checking',
    kind: 'CHECKING',
    tier: 1,
    current: 1350,
    min: 0,
    max: 1000
}, {
    id: '002',
    name: 'ANZ Checking',
    readableName: 'Joint checking',
    kind: 'CHECKING',
    tier: 2,
    current: 180,
    min: 500,
    max: 550
}, {
    id: '003',
    name: 'ANZ Savings',
    readableName: 'Personal savings',
    kind: 'SAVINGS',
    tier: 3,
    current: 9000,
    min: 0,
    max: 10000
}, {
    id: '004',
    name: 'SimpliSaving',
    readableName: 'Kiwi saver',
    kind: 'INVESTMENT',
    tier: 3,
    current: 34643,
    min: 0
}]

const testDeepNeed: AccountConfig[] = [{
    id: '001',
    name: 'ANZ Checking',
    readableName: 'Personal checking',
    kind: 'CHECKING',
    tier: 1,
    current: 1350,
    min: 0,
    max: 1000
}, {
    id: '002',
    name: 'ANZ Checking',
    readableName: 'Joint checking',
    kind: 'CHECKING',
    tier: 2,
    current: 180,
    min: 1000,
    max: 1500
}, {
    id: '004',
    name: 'SimpliSaving',
    readableName: 'Kiwi saver',
    kind: 'INVESTMENT',
    tier: 3,
    current: 34643,
    min: 0
}]

describe('core logic', function() {
    
    it('ins and outs', function() {

        const pos = insAndOuts(testDeepNeed);

        console.log(pos);
    })

    // it('solves shallow need', function() {
    //     const xfrs = plan(testOne)

    //     console.log(xfrs)
    // })

    it('solves deep need', function() {
        const xfrs = buildTransferPlan(testDeepNeed)

        console.log(xfrs)
    })

})