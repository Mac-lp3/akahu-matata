import { AccountConfig, AccountState } from './accounts';

export enum TransferDirection {
    IN = 'IN',
    OUT = 'OUT',
    HOLD = 'HOLD'
}

export interface AccountPositions {
    inNeed: TransferHalf[];
    totalNeed: number;
    inExcess: TransferHalf[];
    totalExcess: number;
    between: TransferHalf[];
    totalBetween: number;
}

export interface Transfer {
    in: AccountConfig;
    out: AccountConfig;
    amount: number;
}

export interface TransferDef {
    in: TransferHalf;
    out: TransferHalf;
    from: string;
    fromFier: number;
    to: string;
    toTier: number;
    amount: number;
}

export interface TransferHalf {
    direction: TransferDirection;
    account: AccountConfig;
    amount: number;
}

export interface TransferPlan {
    orderedTransfers: TransferDef[];
}

