import { cascade, getAccountRequests, cascadeFrom } from '../src/core/buildPlan';
import { AccountConfig } from '../src/types';

// should move across same tier?
    // make it an option?
    // only excess? betweens ok?
        // only transfer excess option?

// t1 under & t1 between:
    // between moved to under?

// is between just is an order of operations thing?
// TODO option/setting for treat between as excess?
// t1 w/ excess, t2 in need, t3 reserve:
    // t1 -> t2
// t1 between, t2 in need, t3 reserve
    // t3 -> t2
// t1 in need, t2 w/ excess, t3 reserve
    // t2->t1
// t1 in need, t2 between, t3 reserve
    // t2 -> t1 (is this intended?)
    // t3->t1 instead? ppl would want to keep cash in interest accounts...

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

    // before(function() {
    //     console.log(testDeepNeed);
    // })
    
    it('solves deep need', function() {
        const xfrs = getAccountRequests(testDeepNeed)

        console.log(xfrs)

        console.log(cascade(xfrs));

        console.log(xfrs)

        // console.log(cascadeFrom(xfrs, { from: 'excess', to: 'under' }), xfrs)
    })

})