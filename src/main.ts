import { buildTransferPlan } from './core/buildPlan';
import { buildPlanSummary } from './core/buildMessageText';
import { ConsoleSender, FileDao, getAccountConfigs } from './io';

const dao = new FileDao();
const sender = new ConsoleSender();

/**
 * The scheduled job.
 * 
 * loads the user's preferences. gets the latest account $. builds a transfer plan.
 * sends the text message. saves the plan for later.
 */
 export async function main() {

    // TODO this should be passed in
    const processIds: string[] = ['123'];

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
}

async function buildAndSendMessage(transferPlan: any, user: any) {
    const text = buildPlanSummary(transferPlan, user);
    sender.send(text);
}
