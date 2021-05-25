import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { Dao, TransferPlan, User, GeneralError } from '../types';

/**
 * Used to load data from the local file system.
 * 
 * In a proper deployment, this would use various external services (eg, AWS S3, DynamoDB, etc)
 */
export class FileDao implements Dao {

    private static USERS_PATH: string = path.join(__dirname, '../data/users');
    private static PLANS_PATH: string = path.join(__dirname, '../data/plans');

    constructor() {
        
    }
    
    public async getUser(userId: string): Promise<User> {

        let targetFile;
        let rawdata;
        let user;

        try {

            targetFile = path.join(FileDao.USERS_PATH, `${userId}.json`);
            rawdata = await readFile(targetFile, 'utf-8');
            user = JSON.parse(rawdata);

        } catch(ex) {
            console.log(ex)
            throw new GeneralError('200', `Exception while loading user ${userId}`);
        }

        return user as User;
    };

    public async savePlan(plan: TransferPlan, userId: string): Promise<void> {
        /**
         * 1 plan per user for now
         */
         let targetFile;
         let rawdata;
 
         try {
 
            rawdata = JSON.stringify(plan);
            targetFile = path.join(FileDao.PLANS_PATH, `${userId}.json`);
            await writeFile(targetFile, rawdata);
 
         } catch(ex) {
             console.log(ex)
             throw new GeneralError('200', `Exception while saving plan for user ${userId}`);
         }


    }

}