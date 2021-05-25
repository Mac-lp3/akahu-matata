/**
 * A portion of Akahu's account data would be displayed on the set up page.
 * 
 * Users would select an account and specify a min, max, and tier value.
 * 
 * That info would be sent back (either 1 at a time or all at once) for storage.
 * 
 * At run time, these methods are used again to get the current $.
 */
import got, { Response } from 'got';
import { AccountConfig, AccountLookUp, GeneralError } from '../types'

// TODO pattern for this
const defaultHeaders: any = {
    'Authorization': `Bearer ${process.env.AKAHU_USER_TOKEN}`,
    'X-Akahu-ID': `${process.env.AKAHU_APP_TOKEN}`
}

// TODO return type
async function retrieveAccountData(acctLookUp: AccountLookUp | AccountLookUp[]): Promise<any[]> {

    let returnData: any[] = [];
    let response: Response<string>;
    let body: any;
    
    try {

        // getting just one account or all of them?
        const url = Array.isArray(acctLookUp) ? 
            `${process.env.BASE_URL}accounts` :
            `${process.env.BASE_URL}accounts/${acctLookUp}`;

        // get the account data from akahu
        response = await got(url, { 
            headers: defaultHeaders
        });

        body = JSON.parse(response.body);

        // make sure this is not an error response
        if (response.statusCode > 299) {
            console.log(`The given id: ${acctLookUp}`);
            console.log(`API error message? : ${body.message}`);
            throw new GeneralError('101', 'Could not get data from external API.');
        }

        // filter out any irrelevant accounts
        if (Array.isArray(acctLookUp)) {          
            returnData = body.items.filter((item: any) => {
                return acctLookUp.some(lookUp => {
                    return lookUp.akahuId === item._id;
                })
            });
        } else {
            returnData.push(body.item);
        }

    } catch (ex) {
        if (ex instanceof GeneralError) {
            throw ex;
        } else {
            console.log(`unknown error during Akahu API call`, ex)
            throw new GeneralError('100', 'Unknown error during external API call.');
        }
    }

    return returnData;
}

// TODO move this to a builder?
function buildAccountConfig(accountLookUp: AccountLookUp, rawAkahu: any): AccountConfig {

    let config: AccountConfig;

    try {

        config = {
            akahuId: accountLookUp.akahuId,
            company: accountLookUp.company,
            accountNumber: accountLookUp.accountNumber,
            current: rawAkahu.balance.current,
            min: accountLookUp.min,
            name: accountLookUp.name,
            tier: accountLookUp.tier,
            type: accountLookUp.type
        };
    
        accountLookUp.hasOwnProperty('max') ? config['max'] = accountLookUp.max : false;
        accountLookUp.hasOwnProperty('nickName') ? config['nickName'] = accountLookUp.nickName : false;

    } catch (ex) {
        console.log(`unknown error while formatting Akahu API payload`, ex)
        throw new GeneralError('100', 'Unknown error while formatting external API response.');
    }

    return config;
}

export async function getAccountConfigs(accountLookUps: AccountLookUp[]): Promise<AccountConfig[]> {

    const rawAccountData = await retrieveAccountData(accountLookUps);

    let lookUp;
    const configs: AccountConfig[] = rawAccountData.map(data => {
        lookUp = accountLookUps.find(alu => alu.akahuId === data._id);
        return buildAccountConfig(lookUp as AccountLookUp, data);
    });

    return configs;
}

export class Akahu {
    
}