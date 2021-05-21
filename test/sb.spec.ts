// import got from 'got';
// import * as http from 'http';

// const defaultHeaders: any = {};
// defaultHeaders['Authorization'] = `Bearer ${process.env.AKAHU_USER_TOKEN}`
// defaultHeaders['X-Akahu-ID'] = `${process.env.AKAHU_APP_TOKEN}`

// describe('something', function() {

//     it('can get ME', async function() {

//         try {

//             const r = await got(`${process.env.BASE_URL}/me`, { 
//                 headers: defaultHeaders
//             });

//             console.log(r.statusCode);

//         } catch (ex) {
//             console.log(ex);
//         }
//     })

//     it('lists accounts', async function() {

//         // ks
//         let r = await got('https://api.akahu.io/v1/accounts/acc_ckowfn0di000009k08gysaept', { 
//             headers: defaultHeaders
//         });

//         console.log(r.statusCode);
//         console.dir(JSON.parse(r.body));

//         //ANZ
//         r = await got('https://api.akahu.io/v1/accounts/acc_ckowf6tae000008mi7uto05nu', { 
//             headers: defaultHeaders
//         });

//         console.log(r.statusCode);
//         console.dir(JSON.parse(r.body));

//     })

//     it('transacts', async function () {
//         let r = await got('https://api.akahu.io/v1/transactions', { 
//             headers: defaultHeaders
//         });

//         console.log(r.statusCode);
//         console.dir(JSON.parse(r.body)[0]);
//     })

// })
