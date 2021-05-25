import { User } from './user';
import { TransferPlan } from './transferPlan';

export interface Dao {
    getUser: (userId: string) => Promise<User>;
    savePlan: (plan: TransferPlan, userId: string) => Promise<void>;
}

export interface Sender {
    send: (msg: string) => void;
}
