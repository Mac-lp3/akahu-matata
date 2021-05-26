import { buildTransferPlan, buildPlanSummary } from './core';
import { ConsoleSender, FileDao, getAccountConfigs, MockInputStreamer } from './io';

const dao = new FileDao();
const sender = new ConsoleSender();
const streamer = new MockInputStreamer();

const batchSize = 1; // 
let batch: string[] = [];

/**
 * set up the stream that will provide user IDs as input
 */
const inputStream = streamer.getInputStream();
inputStream.on('data', async (data) => {

    inputStream.pause();
    batch.push(data);

    if (batch.length >= batchSize) {
        await main(batch);
        batch = [];
    }

    inputStream.resume();
});

inputStream.on('finish', async function() {
    console.log(`at the end`)
    if (batch.length > 0) {
        await main(batch);
    }
    console.log(`all user IDs have been processed`)
})

/**
 * The scheduled job.
 * 
 * loads the user's preferences. gets the latest account $. builds a transfer plan.
 * sends the text message. saves the plan for later.
 */
 export async function main(processIds: string[]) {

    // console.log(userId);
    // const processIds: string[] = ['123'];

    console.log(`generating plans for ${processIds.length} user IDs...`);

    // process each id in parallel
    await Promise.all(
        processIds.map(async (userId) => {

            const userPrefs = await dao.getUser(userId);
            const accounts = await getAccountConfigs(userPrefs.accounts);
            const plan = buildTransferPlan(accounts);

            await Promise.all([
                dao.savePlan(plan, userId),
                buildAndSendMessage(plan, userPrefs)
            ]);

        })
    );

    console.log(`completed generating plans.`)
}

async function buildAndSendMessage(transferPlan: any, user: any) {
    const text = buildPlanSummary(transferPlan, user);
    sender.send(text);
}
