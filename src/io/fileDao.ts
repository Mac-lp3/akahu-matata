import path from 'path';
import { readFile } from 'fs/promises';
import { Dao, TransferPlan, User, GeneralError } from '../types';

/**
 * Used to load data from the local file system.
 * 
 * In a proper deployment, this would use various external services (eg, AWS S3, DynamoDB, etc)
 */
export class FileDao implements Dao {

    private static USERS_PATH: string = path.join(__dirname, '../data/users');

    constructor() {
        
    }
    
    public async getUser(someId: any): Promise<User> {

        let targetFile;
        let rawdata;
        let user;

        try {

            targetFile = path.join(FileDao.USERS_PATH, `${someId}.json`);
            rawdata = await readFile(targetFile, 'utf-8');
            user = JSON.parse(rawdata);

        } catch(ex) {
            console.log(ex)
            throw new GeneralError('200', `Exception while loading user ${someId}`);
        }

        return user as User;
    };

    public async savePlan(plan: TransferPlan): Promise<void> {

    }

}