
export interface AccountConfig {
    id: string;
    name: string;
    kind: string;
    readableName?: string
    tier: number;
    current: number;
    min: number;
    max?: number;
}

export enum AccountState {
    UNDER = 'UNDER',
    AT = 'AT' ,
    OVER = 'OVER'
}
