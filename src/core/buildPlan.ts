import { AccountRequests, HoldingClass, AccountConfig, Request, RequestDirection } from '../types';

interface CascadeConf {
    from: string;
    to: string;
    upOnly?: boolean;
}

// t1 excess, t2 between, t3 reserve
    // t1->t2->t3
// t1 excess, t2 under, t3 reserve:
    // t1->t2->t3
// t1 between, t2 under, t3 reserve
    // t1->t2
// t1 between, t2 excess, t3 reserve
    // t2->t3
// t1 under, t2 w/ excess, t3 reserve
    // t2->t1
// t1 under, t2 between, t3 reserve
    // t2->t1

// t1 excess, t2 under, t3 between, t4 reserve
    // t1->t2, t3->t2, t4->t2
    // t1->t4

// t1 excess, t2 under, t3 excess, t4 reserve
    // t1->t2, t3->t2, t4->t2
    // t1->t4, t3->t4

export function cascadeFrom(accountRequests: AccountRequests, conf: CascadeConf) {

    const transferPairs: any[] = [];

    const to: Request[] = (accountRequests as any)[`${conf.to}`].requests;
    const from: Request[] = (accountRequests as any)[`${conf.from}`].requests;
    let remainingTo: number = (accountRequests as any)[`${conf.to}`].total;
    let remainingFrom: number = (accountRequests as any)[`${conf.from}`].total;

    for (let i = 0; i < to.length; ++i) {

        for(let j = 0; j < from.length; ++j) {

            // TODO check tiers

            if (to[i].amount <= from[j].amount) {

                transferPairs.push({
                    from: from[i].account,
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
                    from: from[i].account,
                    to: to[i].account,
                    amount: from[i].amount
                });
                
                remainingTo -= from[i].amount;
                remainingFrom -= from[i].amount;
                to[j].amount -= from[i].amount;
                from[i].amount = 0;
            }

        }
    }

    (accountRequests as any)[`${conf.to}`].total = remainingTo;
    (accountRequests as any)[`${conf.from}`].total = remainingFrom;

    return transferPairs;
}

export function cascade(holdings: AccountRequests) {

    let transfers: any[] = [];

    if (holdings.under.total > 0) {

        if (holdings.excess.total > 0) {

            transfers.push(cascadeFrom(holdings, {from: HoldingClass.EXCESS, to: HoldingClass.UNDER}))
        }

        if (holdings.under.total > 0 && holdings.between.total > 0) {

            transfers.push(cascadeFrom(holdings, {from: HoldingClass.BETWEEN, to: HoldingClass.UNDER}))
        }

        if (holdings.under.total > 0 && holdings.reserve.total > 0) {

            transfers.push(cascadeFrom(holdings, {from: HoldingClass.RESERVE, to: HoldingClass.UNDER}))
        }
    }

    if (holdings.excess.total > 0) {
        
        // TODO e -> b should only go up
        transfers.push(cascadeFrom(holdings, {from: HoldingClass.EXCESS, to: HoldingClass.BETWEEN, upOnly: true}))

        if (holdings.excess.total > 0 && holdings.reserve.total > 0) {

            // TODO is there a better way to check for a reserve account?
            transfers.push(cascadeFrom(holdings, {from: HoldingClass.EXCESS, to: HoldingClass.RESERVE}))
        }
    }

    return transfers;

}

export function getAccountRequests(accounts: AccountConfig[]): AccountRequests {

    let totalUnder: number = 0;
    const accountsUnder: Request[] = [];

    let totalBetween: number = 0;
    const accountsBetween: Request[] = [];

    let totalExcess: number = 0;
    const accountsExcess: Request[] = [];

    let totalReserve: number = 0;
    const accountsReserve: Request[] = [];

    let tempAmount: number;
    accounts.forEach(curAcct => {

        // TODO where/how are errors handled?

        switch(getHoldingClass(curAcct)) {

            case HoldingClass.UNDER:
                tempAmount = curAcct.min - curAcct.current;
                accountsUnder.push({
                    account: curAcct,
                    amount: tempAmount,
                    direction: RequestDirection.IN
                });
                totalUnder += tempAmount;
                break;

            case HoldingClass.BETWEEN:
                tempAmount = (curAcct.max || 0) - curAcct.current;
                accountsBetween.push({
                    account: curAcct,
                    amount: tempAmount,
                    direction: RequestDirection.HOLD
                });
                totalBetween += tempAmount;
                break;

            case HoldingClass.EXCESS:
                tempAmount = curAcct.current - (curAcct.max || 0);
                accountsExcess.push({
                    account: curAcct,
                    amount: tempAmount,
                    direction: RequestDirection.OUT
                });
                totalExcess += tempAmount;
                break;

            case HoldingClass.RESERVE:
                tempAmount = curAcct.current - (curAcct.max || 0);
                accountsReserve.push({
                    account: curAcct,
                    amount: tempAmount,
                    direction: RequestDirection.HOLD
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

function sortByTier(req1: Request, req2: Request) {
    return req1.account.tier - req2.account.tier;
}


// TODO build errors
const theError = 'idk whats up with this';

function getHoldingClass(account: AccountConfig): HoldingClass {

    // TODO handle exactly @ min/max

    // for readability
    const hasAMax = account.hasOwnProperty('max');
    const isAboveMin = account.current > account.min;
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
        throw theError;
    }
    
    return holdingClass;
}
