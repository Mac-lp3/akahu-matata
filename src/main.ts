/**
 * This process must be ready to handle hundreds of requests.
 * 
 * Thus, the userIds are fed in via readable stream (perhaps from S3 select or a Dynamo query).
 * 
 * With the userId, the application can look up the users preferences and account info, 
 * generate a transfer plan, and send the text message.
 * 
 */
import { buildTransferPlan, buildPlanSummary } from './core';
import { ConsoleSender, FileDao, getAccounts, MockInputStreamer } from './io';

const dao = new FileDao();
const sender = new ConsoleSender();
const streamer = new MockInputStreamer();

const batchSize = 1; // change this in prod
let batch: string[] = [];

/**
 * Set up the input stream
 */
const inputStream = streamer.getInputStream();
inputStream.on('data', async (data) => {

    inputStream.pause();
    batch.push(data);

    // batch requests to prevent an explosion of API calls
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
 * Loads the user's preferences.
 * Gets the latest account $.
 * Builds a transfer plan.
 * Generates the message text.
 * Sends the message.
 * Saves the plan for later.
 */
 export async function main(processIds: string[]) {

    console.log(`generating plans for ${processIds.length} user IDs...`);

    // process each id in parallel
    await Promise.all(
        processIds.map(async (userId) => {

            const userPrefs = await dao.getUser(userId);
            const accounts = await getAccounts(userPrefs.accounts);
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
