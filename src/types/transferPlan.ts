import { AccountConfig, AccountState } from './accounts';

export enum RequestDirection {
    IN = 'IN',
    OUT = 'OUT',
    HOLD = 'HOLD'
}

interface RequestSummary {
    requests: Request[],
    total: number;
}

// input/return the same object for re-position?
export interface AccountRequests {
    under: RequestSummary,
    between: RequestSummary,
    excess: RequestSummary,
    reserve: RequestSummary
}

// these values must match the fields in the AccountHoldings interface
export enum HoldingClass {
    UNDER = 'under',
    BETWEEN = 'between',
    EXCESS = 'excess',
    RESERVE = 'reserve'
}

export interface AccountPositions {
    inNeed: Request[];
    totalNeed: number;
    inExcess: Request[];
    totalExcess: number;
    between: Request[];
    totalBetween: number;
}

export interface Transfer {
    in: AccountConfig;
    out: AccountConfig;
    amount: number;
}

export interface TransferDef {
    in: Request;
    out: Request;
    from: string;
    fromFier: number;
    to: string;
    toTier: number;
    amount: number;
}

export interface Request {
    direction: RequestDirection;
    account: AccountConfig;
    amount: number;
}

export interface TransferPlan {
    requests: AccountRequests;
    orderedTransfers: TransferDef[];
}

