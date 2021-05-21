import { AccountConfig, AccountPositions, TransferHalf, Transfer, TransferDirection } from '../types';

interface CascadeConf {
    from: string;
    to: string;
}

export function cascade(positions: AccountPositions, conf: CascadeConf) {

    const transferPairs: Transfer[] = [];

    const to: TransferHalf[] = (positions as any)[`in${conf.to}`];
    const from: TransferHalf[] = (positions as any)[`in${conf.from}`];
    let remainingNeed: number = (positions as any)[`total${conf.to}`];
    let remainingExcess: number = (positions as any)[`total${conf.from}`];
    
    if (from.length > 0 && to.length > 0) {

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
    // from & to > 0? 
        // for each to
            // for each from
                // from.tier > to.tier? from.hasCash?
                    // 

// function fillToMin()
    // ins = need, outs = excess
    // more needed?
        // ins = need, outs = between
        // more needed?
            // ins = need, outs = reserve
        // done
// function fillToMax()
    // ins = between, outs = excess
// function fillReserve()
    // still excess?
        // ins = reserve, outs = excess
        //

export function buildTransferPlan(accounts: AccountConfig[]) {

    const positions: AccountPositions = insAndOuts(accounts);
    let outs: TransferHalf[] = positions.inExcess; // TODO dynamic
    let ins: TransferHalf[] = positions.inNeed;    // TODO dynamic

    const transfers: Transfer[] = [];
    let remainingNeed = positions.totalNeed;
    let remainingGreed = positions.totalExcess;

    const idk = cascade(positions, { from: 'Excess', to: 'Need' });
    return idk;

}

export function plan(accounts: AccountConfig[]) {

    const positions: AccountPositions = insAndOuts(accounts);
    const outs: TransferHalf[] = positions.inExcess;
    const ins: TransferHalf[] = positions.inNeed;
    const transfers: Transfer[] = [];

    let remainingNeed = positions.totalNeed;
    let remainingGreed = positions.totalExcess;

    // match lower tier ins/outs
    if (ins.length > 0) {
        if (outs.length > 0) {

            let greedAcct;
            let isHigherTier: boolean = false;
            let hasRemainingCash: boolean = false;

            ins.forEach(needAcct => {
            
                for (let i = 0; i < outs.length; ++i) {

                    greedAcct = outs[i];
                    hasRemainingCash = greedAcct.amount > 0;
                    isHigherTier = greedAcct.account.tier != needAcct.account.tier;
                    
                    if (hasRemainingCash && isHigherTier) {

                        if (greedAcct.amount >= needAcct.amount) {

                            transfers.push({
                                in: needAcct.account,
                                out: greedAcct.account,
                                amount: needAcct.amount
                            })

                            remainingNeed -= needAcct.amount
                            remainingGreed -= needAcct.amount

                            greedAcct.amount = greedAcct.amount - needAcct.amount;
                            needAcct.amount = 0;

                            break;

                        } else {

                            transfers.push({
                                in: needAcct.account,
                                out: greedAcct.account,
                                amount: greedAcct.amount
                            })

                            remainingNeed -= greedAcct.amount
                            remainingGreed -= greedAcct.amount

                            needAcct.amount = needAcct.amount - greedAcct.amount;
                            greedAcct.amount = 0;
                        }
                    }
                }

                // is there still excess?
                    // xfer to next tier not at max
                // is there still need?
                    // repeat for accts between min and max (HOLD amt)

                if (remainingGreed > 0) {
                    // transfer to next tier not at max
                    // still remaining?
                    // transfer to finally.
                }

                if (remainingNeed > 0) { 
                    // TODO
                }
            })
        } else {
            // TODO - bring down to min
        }
    }

    const plan = {
        transfers: transfers,
        remainingExcess: remainingGreed,
        remainingNeed: remainingNeed
    }

    return plan;

}

export function insAndOuts(accounts: AccountConfig[]): AccountPositions {

    let totalInNeed: number = 0;
    const accountsInNeed: TransferHalf[] = [];

    let totalInExcess: number = 0;
    const accountsInExcess: TransferHalf[] = [];

    let totalInBetween: number = 0;
    const accountsInBetween: TransferHalf[] = [];

    let amountNeeded: number;
    accounts.forEach(curAcct => {

        if (curAcct.min > 0) {
            if (curAcct.current < curAcct.min) {

                amountNeeded = curAcct.min - curAcct.current;
                accountsInNeed.push({
                    account: curAcct,
                    amount: amountNeeded,
                    direction: TransferDirection.IN
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
                    direction: TransferDirection.HOLD
                });
                totalInBetween += amountNeeded;

            } else {

                amountNeeded = curAcct.current - curAcct.max;
                accountsInExcess.push({
                    account: curAcct,
                    amount: amountNeeded,
                    direction: TransferDirection.OUT
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
