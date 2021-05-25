import { AccountConfig } from './accounts';

// TODO remove this?
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

export interface TransferDefinition {
    from: AccountConfig;
    to: AccountConfig;
    amount: number;
}

export interface TransferPlan {
    transfers: TransferDefinition[];
    createdDate: string;
}

export interface Request {
    direction: RequestDirection;
    account: AccountConfig;
    amount: number;
}
