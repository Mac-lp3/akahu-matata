import { AccountConfig } from './accounts';

export enum HoldingClass {
    UNDER = 'under',
    BETWEEN = 'between',
    EXCESS = 'excess',
    RESERVE = 'reserve'
}

export interface Transfer {
    from: AccountConfig;
    to: AccountConfig;
    amount: number;
}

export interface TransferPlan {
    transfers: Transfer[];
    createdDate: string;
}

export interface TransferRequest {
    account: AccountConfig;
    amount: number;
}
