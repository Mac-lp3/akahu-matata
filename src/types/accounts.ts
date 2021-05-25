
export interface AccountConfig {
    akahuId: string;
    company: string;
    name: string;
    type: string;
    nickName?: string
    tier: number;
    current: number; // retrieved at run time
    min: number;
    max?: number;
}

export enum AccountState {
    UNDER = 'UNDER',
    AT = 'AT' ,
    OVER = 'OVER'
}
