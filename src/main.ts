import { buildTransferPlan } from './core/buildPlan';
import { buildPlanSummary } from './messages/buildMessageText';

async function buildAndSendMessage(someUserId: any, transferPlan: any) {
    // TODO message sender implementation

    return {} as any;
}

async function getUserConfig(someUserId: any) {
    // TODO where is the data?
    // TODO what does it look like?
    // TODO use the input to load it

    return {} as any
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

export async function main() {
    const userPrefs = await getUserConfig('idk');
    const accounts = await getAccountObjects(userPrefs.accountList);

    const plan = buildTransferPlan(accounts);

    await Promise.all([
        savePlan('idk', plan),
        buildAndSendMessage('idk', plan)
    ])
}
