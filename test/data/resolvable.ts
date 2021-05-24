const e_u_b_r = {
    accounts: [{
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
    }],
    expected: {
        numberOfTransfers: 2,
        transferAmounts: [320, 30],
        transferFromIds: ['001', '001'],
        transferToIds: ['002', '003']
    }
}

const b_u_b_r = {
    accounts: [{
        id: '001',
        name: 'ANZ Checking',
        readableName: 'Personal checking',
        kind: 'CHECKING',
        tier: 1,
        current: 1250,
        min: 1000,
        max: 1500
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
        min: 8000,
        max: 10000
    }, {
        id: '004',
        name: 'SimpliSaving',
        readableName: 'Kiwi saver',
        kind: 'INVESTMENT',
        tier: 3,
        current: 34643,
        min: 0
    }],
    expected: {
        numberOfTransfers: 2,
        transferAmounts: [250, 70],
        transferFromIds: ['001', '003'],
        transferToIds: ['002', '002']
    }
}

const eb_e_r = {
    accounts: [{
        id: '001',
        name: 'ANZ Checking',
        readableName: 'Personal checking',
        kind: 'CHECKING',
        tier: 1,
        current: 1500,
        min: 1000,
        max: 1250
    }, {
        id: '002',
        name: 'ANZ Checking',
        readableName: 'Joint checking',
        kind: 'CHECKING',
        tier: 1,
        current: 610,
        min: 500,
        max: 750
    }, {
        id: '003',
        name: 'ANZ Savings',
        readableName: 'Personal savings',
        kind: 'SAVINGS',
        tier: 2,
        current: 9000,
        min: 5000,
        max: 7500
    }, {
        id: '004',
        name: 'SimpliSaving',
        readableName: 'Kiwi saver',
        kind: 'INVESTMENT',
        tier: 3,
        current: 34643,
        min: 0
    }],
    expected: {
        numberOfTransfers: 3,
        transferAmounts: [140, 110, 1500],
        transferFromIds: ['001', '001', '003'],
        transferToIds: ['002', '004', '004']
    }
}

const bu_u_r = {
    accounts: [{
        id: '001',
        name: 'ANZ Checking',
        readableName: 'Personal checking',
        kind: 'CHECKING',
        tier: 1,
        current: 1250,
        min: 1000,
        max: 1500
    }, {
        id: '002',
        name: 'ANZ Checking',
        readableName: 'Joint checking',
        kind: 'CHECKING',
        tier: 1,
        current: 400,
        min: 500,
        max: 750
    }, {
        id: '003',
        name: 'ANZ Savings',
        readableName: 'Personal savings',
        kind: 'SAVINGS',
        tier: 2,
        current: 4300,
        min: 5000,
        max: 7500
    }, {
        id: '004',
        name: 'SimpliSaving',
        readableName: 'Kiwi saver',
        kind: 'INVESTMENT',
        tier: 3,
        current: 34643,
        min: 0
    }],
    expected: {
        numberOfTransfers: 3,
        transferAmounts: [100, 150, 550],
        transferFromIds: ['001', '001', '004'],
        transferToIds: ['002', '003', '003']
    }
}

export { e_u_b_r };
export { b_u_b_r };
export { eb_e_r };
export { bu_u_r };
