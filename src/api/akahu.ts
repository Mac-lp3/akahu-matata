import got from 'got';

const defaultHeaders: any = {
    'Authorization': `Bearer ${process.env.AKAHU_USER_TOKEN}`,
    'X-Akahu-ID': `${process.env.AKAHU_APP_TOKEN}`
}

async function retrieveUserAccounts(idkSomeList: any[]) {

    let r = await got('https://api.akahu.io/v1/accounts', { 
        headers: defaultHeaders
    });

}


