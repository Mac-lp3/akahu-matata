import { buildTransferPlan } from './core/buildPlan';
import { ConsoleSender, FileDao, getAccountConfigs } from './io';
import { buildPlanSummary } from './core/buildMessageText';

const dao = new FileDao();
const sender = new ConsoleSender();

/**
 * main calls:
 *  get user(id)
 *  get deets (user)
 *  build (deets)
 *  save (plan)
 *  message(plan)
 */

/**
 * The scheduled job.
 * 
 * loads the user's preferences. gets the latest account $. builds a transfer plan.
 * sends the text message. saves the plan for later.
 */
 export async function main() {
    const userPrefs = await dao.getUser('123');
    const accounts = await getAccountConfigs(userPrefs.accounts);

    const plan = buildTransferPlan(accounts);

    await Promise.all([
        savePlan('idk', plan),
        buildAndSendMessage(plan, userPrefs)
    ])
}


async function buildAndSendMessage(transferPlan: any, user: any) {

    const text = buildPlanSummary(transferPlan, user);
    sender.send(text);
}

async function getAccountObjects(listOfAccountIds: any) {

    // TODO make API call
    // TODO join w/ user data to create account objects

    // TODO return array like in unit tests

    return {} as any;
}

async function savePlan(someUserId: any, transferPlan: any) {
    // TODO where is it being saved?
    // TODO dao to handle that

    return {} as any;
}

