import { AccountRequests, HoldingClass, AccountConfig, AccountPositions, Request, Transfer, RequestDirection } from '../types';

interface CascadeConf {
    from: string;
    to: string;
    upOnly?: boolean;
}

export function buildTransferPlan(accounts: AccountConfig[]) {

    const positions: AccountPositions = insAndOuts(accounts);
    let outs: Request[] = positions.inExcess; // TODO dynamic
    let ins: Request[] = positions.inNeed;    // TODO dynamic

    const transfers: Transfer[] = [];
    let remainingNeed = positions.totalNeed;
    let remainingGreed = positions.totalExcess;

    let newPosition = cascade(positions, { from: 'Excess', to: 'Need' });
    if (newPosition.remainingNeed > 0) {
        newPosition = cascade(positions, { from: 'reserve', to: 'Need' });
    }

    // TODO repeate for each 
    return newPosition;

}


// ins = under, outs = excess
// more under?
    // ins = under, outs = between
    // more needed? 
        // ins = under, outs = reserve
        // done
// more excess?
    // ins = between, outs = excess
    // more excess?
        // ins = reserve, outs = excess
//done

// for each under:

    // any excess in same or lower tier?
        // create transfers
    // any betweens in same or lower tier?
        // create transfers
    // any reserves in this tier?
        // create transfers
    // enough?
        // repeate for t++


// excess goes any direction. Favor: up, side, down
// between goes side or down. favor down, then side

export function cascadeFrom(accountRequests: AccountRequests, conf: CascadeConf) {

    const transferPairs: any[] = [];

    const to: Request[] = (accountRequests as any)[`${conf.to}`].requests;
    const from: Request[] = (accountRequests as any)[`${conf.from}`].requests;
    let remainingTo: number = (accountRequests as any)[`${conf.to}`].total;
    let remainingFrom: number = (accountRequests as any)[`${conf.from}`].total;

    let tempAmount: number;
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

export function cascadeUnder(holdings: AccountRequests) {

    let transfers: any[] = [];

    if (holdings.under.total > 0) {

        if(holdings.excess.total > 0) {

            // TODO use the enums
            transfers.push(cascadeFrom(holdings, {from: 'excess', to: 'under'}))
        }

        if(holdings.under.total > 0 && holdings.between.total > 0) {

            // TODO use the enums
            transfers.push(cascadeFrom(holdings, {from: 'between', to: 'under'}))
        }

        if (holdings.under.total > 0 && holdings.reserve.total > 0) {

            // TODO use the enums
            transfers.push(cascadeFrom(holdings, {from: 'reserve', to: 'under'}))
        }
    }

    if (holdings.excess.total > 0) {
        
        // TODO enums
        // TODO e -> b should only go up
        transfers.push(cascadeFrom(holdings, {from: 'excess', to: 'between', upOnly: true}))

        if (holdings.excess.total > 0 && holdings.reserve.total > 0) {

            // TODO is there a better way to check for a reserve account?
            // TODO use the enums
            transfers.push(cascadeFrom(holdings, {from: 'excess', to: 'reserve'}))
        }
    }

    return transfers;

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

// t1 between, t2 under, t2' between, t3 between, t4 reserve

export function cascade(positions: AccountPositions, conf: CascadeConf) {

    const transferPairs: Transfer[] = [];

    const to: Request[] = (positions as any)[`in${conf.to}`];
    const from: Request[] = (positions as any)[`in${conf.from}`];
    let remainingNeed: number = (positions as any)[`total${conf.to}`];
    let remainingExcess: number = (positions as any)[`total${conf.from}`];
    
    if (from?.length > 0 && to.length > 0) {

        let isHigherTier: boolean = false;
        let hasRemainingCash: boolean = false;

        to.forEach(toAccount => {
            for (let i = 0; i < from.length; ++i) {

                hasRemainingCash = from[i].amount > 0;
                isHigherTier = from[i].account.tier > toAccount.account.tier;

                if (hasRemainingCash && isHigherTier) {

                    if (from[i].amount >= toAccount.amount) {

                        transferPairs.push({
                            in: toAccount.account,
                            out: from[i].account,
                            amount: toAccount.amount
                        })

                        remainingNeed -= toAccount.amount
                        remainingExcess -= toAccount.amount

                        from[i].amount = from[i].amount - toAccount.amount;
                        toAccount.amount = 0;

                        break;

                    } else {

                        transferPairs.push({
                            in: toAccount.account,
                            out: from[i].account,
                            amount: from[i].amount
                        })

                        remainingNeed -= from[i].amount
                        remainingExcess -= from[i].amount

                        toAccount.amount = toAccount.amount - from[i].amount;
                        from[i].amount = 0;
                    }

                }
            }
        });
    }

    const plan = {
        transfers: transferPairs,
        remainingExcess: remainingExcess,
        remainingNeed: remainingNeed
    }

    return plan;
}

export function idk(accounts: AccountConfig[]) {
    const requests = getAccountRequests(accounts);


}

// builds the initial positions object
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

export function insAndOuts(accounts: AccountConfig[]): AccountPositions {

    let totalInNeed: number = 0;
    const accountsInNeed: Request[] = [];

    let totalInExcess: number = 0;
    const accountsInExcess: Request[] = [];

    let totalInBetween: number = 0;
    const accountsInBetween: Request[] = [];

    let amountNeeded: number;
    accounts.forEach(curAcct => {

        if (curAcct.min > 0) {
            if (curAcct.current < curAcct.min) {

                amountNeeded = curAcct.min - curAcct.current;
                accountsInNeed.push({
                    account: curAcct,
                    amount: amountNeeded,
                    direction: RequestDirection.IN
                });
                totalInNeed += amountNeeded;
                return;
            }

            if (curAcct.current === curAcct.min) {
                return;
            }
        }

        if (curAcct.max && curAcct.max > 0) {
            if (curAcct.current <= curAcct.max) {

                amountNeeded = curAcct.max - curAcct.current;
                accountsInBetween.push({
                    account: curAcct,
                    amount: amountNeeded,
                    direction: RequestDirection.HOLD
                });
                totalInBetween += amountNeeded;

            } else {

                amountNeeded = curAcct.current - curAcct.max;
                accountsInExcess.push({
                    account: curAcct,
                    amount: amountNeeded,
                    direction: RequestDirection.OUT
                });
                totalInExcess += amountNeeded;
            }
        }
    });

    const io: AccountPositions = {
        inNeed: accountsInNeed,
        totalNeed: totalInNeed,
        inExcess: accountsInExcess,
        totalExcess: totalInExcess,
        between: accountsInBetween,
        totalBetween: totalInBetween
    }

    return io;
}

export function amountToTransfer(account: AccountConfig): number { return 0; }

export function underTheLine(accounts: AccountConfig[]) {
    // is acct under?
    // go up a tier
}

export function overTheLine(accounts: AccountConfig[]) {}

