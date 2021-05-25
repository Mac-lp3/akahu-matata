
export interface AccountConfig {
    akahuId: string;
    company: string;
    accountNumber: string;
    name: string;
    type: string;
    nickName?: string
    tier: number;
    current: number; // retrieved at run time
    min: number;
    max?: number;
}
