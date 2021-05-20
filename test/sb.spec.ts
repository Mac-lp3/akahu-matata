import got from 'got';
import * as http from 'http';

const defaultHeaders: any = {};
defaultHeaders['Authorization'] = `Bearer ${process.env.AKAHU_USER_TOKEN}`
defaultHeaders['X-Akahu-ID'] = `${process.env.AKAHU_APP_TOKEN}`

describe('something', function() {

    it('can get ME', async function() {

        try {

            const r = await got(`${process.env.BASE_URL}/me`, { 
                headers: defaultHeaders
            });

            console.log(r.statusCode);
            console.log(JSON.parse(r.body));

        } catch (ex) {
            console.log(ex);
        }
    })

    it('lists categories', async function() {

        let r = await got('https://api.akahu.io/v1/categories', { 
            headers: defaultHeaders
        });

        console.log(r.statusCode);
        console.log(JSON.parse(r.body));

        r = await got('https://api.akahu.io/v1/categories/category_ck3dmv1ir000001qkexzn5kw7', { 
            headers: defaultHeaders
        });

        console.log(r.statusCode);
        console.log(JSON.parse(r.body));
    })

})
