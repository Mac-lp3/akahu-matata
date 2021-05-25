import { 
    HoldingClass,
    AccountConfig,
    TransferRequest,
    Transfer,
    TransferPlan,
    GeneralError 
} from '../types';

export function buildTransferPlan(accounts: AccountConfig[]): TransferPlan {

    const holdings: AccountRequests = sortAccountsByState(accounts);

    let transfers: Transfer[] = [];

    if (holdings.under.total > 0) {

        if (holdings.excess.total > 0) {

            transfers.push(...createTransfers(holdings, {from: HoldingClass.EXCESS, to: HoldingClass.UNDER}))
        }

        if (holdings.under.total > 0 && holdings.between.total > 0) {

            transfers.push(...createTransfers(holdings, {from: HoldingClass.BETWEEN, to: HoldingClass.UNDER}))
        }

        if (holdings.under.total > 0 && holdings.reserve.total > 0) {

            transfers.push(...createTransfers(holdings, {from: HoldingClass.RESERVE, to: HoldingClass.UNDER}))
        }
    }

    if (holdings.excess.total > 0) {
        
        transfers.push(...createTransfers(holdings, {from: HoldingClass.EXCESS, to: HoldingClass.BETWEEN, upOnly: true}))

        if (holdings.excess.total > 0 && holdings.reserve.total > 0) {

            // TODO is there a better way to check for a reserve account?
            transfers.push(...createTransfers(holdings, {from: HoldingClass.EXCESS, to: HoldingClass.RESERVE}))
        }
    }

    const thePlan: TransferPlan = {
        transfers: transfers,
        createdDate: new Date().toISOString()
    }

    return thePlan;

}

interface TransferConfig {
    from: HoldingClass;
    to: HoldingClass;
    upOnly?: boolean;
}

function createTransfers(accountRequests: AccountRequests, conf: TransferConfig): Transfer[] {

    const transferPairs: Transfer[] = [];

    const to: TransferRequest[] = (accountRequests as any)[`${conf.to}`].requests;
    const from: TransferRequest[] = (accountRequests as any)[`${conf.from}`].requests;
    let remainingTo: number = (accountRequests as any)[`${conf.to}`].total;
    let remainingFrom: number = (accountRequests as any)[`${conf.from}`].total;

    for (let i = 0; i < to.length; ++i) {

        for(let j = 0; j < from.length; ++j) {

            if (conf.upOnly) {
                // only allow sideways & upward movement
                if (from[j].account.tier > to[i].account.tier) {
                    continue;
                }
            }

            // break if the last account had enough to reconcile
            if (to[i].amount === 0) {
                break;
            }

            if (to[i].amount <= from[j].amount) {

                transferPairs.push({
                    from: from[j].account,
                    to: to[i].account,
                    amount: to[i].amount
                });

                remainingTo -= to[i].amount;
                remainingFrom -= to[i].amount;
                from[j].amount -= to[i].amount;
                to[i].amount = 0;
                break;

            } else {
                
                transferPairs.push({
                    from: from[j].account,
                    to: to[i].account,
                    amount: from[j].amount
                });
                
                remainingTo -= from[j].amount;
                remainingFrom -= from[j].amount;
                to[i].amount -= from[j].amount;
                from[j].amount = 0;
            }

        }
    }

    (accountRequests as any)[`${conf.to}`].total = remainingTo;
    (accountRequests as any)[`${conf.from}`].total = remainingFrom;

    return transferPairs;
}

type AccountRequests = {
    [key in HoldingClass]: {
        requests: TransferRequest[];
        total: number;
    };
}

function sortAccountsByState(accounts: AccountConfig[]): AccountRequests {

    let totalUnder: number = 0;
    const accountsUnder: TransferRequest[] = [];

    let totalBetween: number = 0;
    const accountsBetween: TransferRequest[] = [];

    let totalExcess: number = 0;
    const accountsExcess: TransferRequest[] = [];

    let totalReserve: number = 0;
    const accountsReserve: TransferRequest[] = [];

    let tempAmount: number;
    accounts.forEach(curAcct => {

        // TODO where/how are errors handled?

        switch(getAccountState(curAcct)) {

            case HoldingClass.UNDER:
                tempAmount = curAcct.min - curAcct.current;
                accountsUnder.push({
                    account: curAcct,
                    amount: tempAmount
                });
                totalUnder += tempAmount;
                break;

            case HoldingClass.BETWEEN:
                tempAmount = (curAcct.max || 0) - curAcct.current;
                accountsBetween.push({
                    account: curAcct,
                    amount: tempAmount
                });
                totalBetween += tempAmount;
                break;

            case HoldingClass.EXCESS:
                tempAmount = curAcct.current - (curAcct.max || 0);
                accountsExcess.push({
                    account: curAcct,
                    amount: tempAmount
                });
                totalExcess += tempAmount;
                break;

            case HoldingClass.RESERVE:
                tempAmount = curAcct.current - (curAcct.max || 0);
                accountsReserve.push({
                    account: curAcct,
                    amount: tempAmount
                });
                totalReserve += tempAmount;
                break;
        }
    });

    return {
        under: { requests: accountsUnder.sort(sortByTier), total: totalUnder },
        between: { requests: accountsBetween.sort(sortByTier), total: totalBetween },
        excess: { requests: accountsExcess.sort(sortByTier), total: totalExcess },
        reserve: { requests: accountsReserve.sort(sortByTier), total: totalReserve }
    } as AccountRequests;
}

function sortByTier(req1: TransferRequest, req2: TransferRequest) {
    return req1.account.tier - req2.account.tier;
}

function getAccountState(account: AccountConfig): HoldingClass {

    // TODO handle exactly @ min/max

    // for readability
    const hasAMax = account.hasOwnProperty('max');
    const isAboveMin = account.current >= account.min;
    const isAboveMax = hasAMax && account.current > (account.max || Infinity);
    const isBetweenMinAndMax = isAboveMin && hasAMax && account.current <= (account.max || -Infinity);

    let holdingClass: HoldingClass;

    if (!isAboveMin) {

        holdingClass = HoldingClass.UNDER;

    } else if (isBetweenMinAndMax) {

        holdingClass = HoldingClass.BETWEEN;

    } else if (isAboveMax) {

        holdingClass = HoldingClass.EXCESS;

    } else if (isAboveMin && !hasAMax) {

        holdingClass = HoldingClass.RESERVE;

    } else {
        throw new GeneralError('000', 'Could not determine holding class');
    }
    
    return holdingClass;
}
