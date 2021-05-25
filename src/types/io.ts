import { User } from './user';
import { TransferPlan } from './transferPlan';

export interface Dao {
    getUser: (someId: any) => Promise<User>;
    savePlan: (plan: TransferPlan) => Promise<void>;
}

export interface Sender {
    send: (msg: string) => void;
}
