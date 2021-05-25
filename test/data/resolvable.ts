const e_u_b_r = {
    accounts: [{
        akahuId: '001',
        company: 'ANZ',
        name: 'ANZ Checking',
        readableName: 'Personal checking',
        type: 'CHECKING',
        tier: 1,
        current: 1350,
        min: 0,
        max: 1000
    }, {
        akahuId: '002',
        company: '',
        name: 'ANZ Checking',
        readableName: 'Joint checking',
        type: 'CHECKING',
        tier: 2,
        current: 180,
        min: 500,
        max: 550
    }, {
        akahuId: '003',
        company: '',
        name: 'ANZ Savings',
        readableName: 'Personal savings',
        type: 'SAVINGS',
        tier: 3,
        current: 9000,
        min: 0,
        max: 10000
    }, {
        akahuId: '004',
        company: '',
        name: 'SimpliSaving',
        readableName: 'Kiwi saver',
        type: 'INVESTMENT',
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
        akahuId: '001',
        company: '',
        name: 'ANZ Checking',
        readableName: 'Personal checking',
        type: 'CHECKING',
        tier: 1,
        current: 1250,
        min: 1000,
        max: 1500
    }, {
        akahuId: '002',
        company: '',
        name: 'ANZ Checking',
        readableName: 'Joint checking',
        type: 'CHECKING',
        tier: 2,
        current: 180,
        min: 500,
        max: 550
    }, {
        akahuId: '003',
        company: '',
        name: 'ANZ Savings',
        readableName: 'Personal savings',
        type: 'SAVINGS',
        tier: 3,
        current: 9000,
        min: 8000,
        max: 10000
    }, {
        akahuId: '004',
        company: '',
        name: 'SimpliSaving',
        readableName: 'Kiwi saver',
        type: 'INVESTMENT',
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
        akahuId: '001',
        company: '',
        name: 'ANZ Checking',
        readableName: 'Personal checking',
        type: 'CHECKING',
        tier: 1,
        current: 1500,
        min: 1000,
        max: 1250
    }, {
        akahuId: '002',
        company: '',
        name: 'ANZ Checking',
        readableName: 'Joint checking',
        type: 'CHECKING',
        tier: 1,
        current: 610,
        min: 500,
        max: 750
    }, {
        akahuId: '003',
        company: '',
        name: 'ANZ Savings',
        readableName: 'Personal savings',
        type: 'SAVINGS',
        tier: 2,
        current: 9000,
        min: 5000,
        max: 7500
    }, {
        akahuId: '004',
        company: '',
        name: 'SimpliSaving',
        readableName: 'Kiwi saver',
        type: 'INVESTMENT',
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
        akahuId: '001',
        company: '',
        name: 'ANZ Checking',
        readableName: 'Personal checking',
        type: 'CHECKING',
        tier: 1,
        current: 1250,
        min: 1000,
        max: 1500
    }, {
        akahuId: '002',
        company: '',
        name: 'ANZ Checking',
        readableName: 'Joint checking',
        type: 'CHECKING',
        tier: 1,
        current: 400,
        min: 500,
        max: 750
    }, {
        akahuId: '003',
        company: '',
        name: 'ANZ Savings',
        readableName: 'Personal savings',
        type: 'SAVINGS',
        tier: 2,
        current: 4300,
        min: 5000,
        max: 7500
    }, {
        akahuId: '004',
        company: '',
        name: 'SimpliSaving',
        readableName: 'Kiwi saver',
        type: 'INVESTMENT',
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
