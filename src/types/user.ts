export interface UserInput {
}

export interface AccountLookUp {
    akahuId: string;
    company: string;
    name: string;
    type: string;
    tier: number;
    accountNumber: string;
    min: number;
    max?: number;
    nickName?: string;
}

export interface User {
    id: string;
    akahuId: string;
    firstName: string;
    lastName: string;
    email: string;
    telecom: string,
    preferences: {
        nickName: string;
        sendEmail: boolean;
        sendSms: boolean;
        botSig?: string;
    }
    accounts: AccountLookUp[]
}
