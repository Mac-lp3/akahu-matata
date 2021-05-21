import { AccountConfig, AccountPositions, TransferHalf, Transfer, TransferDirection } from '../types';

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
                    // repeat for accts between min and max 
                // is there still need?
                    // all accts are at min...

                if (remainingGreed > 0) {
                    // transfer to accounts not at max
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
