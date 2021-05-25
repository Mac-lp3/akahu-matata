import { AccountConfig, TransferDefinition, User } from '../types';

function applyTemplate(userData: User, fromToMap: Map<string, string>) {

    const boi = userData.preferences.nickName ? userData.preferences.nickName : userData.firstName;
    const botSig = userData.preferences.botSig ? userData.preferences.botSig : 'Matata-bot';

    const messageTemplate = `
hi ${boi}, its ${botSig}.

you cool with this?`

    let midMessage: string = ``;
    for(const [name, fromTo] of fromToMap) {
        midMessage += `

${name}:
${fromTo}`

    }

    const endMessage = `

reply "yes" in 3 days and i'll do it.

:peace:`

    return messageTemplate + midMessage + endMessage;

}

function round(value: number) {
    return Number(Math.round(parseFloat(value + 'e2')) + 'e-2').toFixed(2);
}

function buildFromTo(change: number, value: number): string {

    const str = `${change > 0 ? '+'+round(change) : round(change)} to ${round(value + change)}`;

    return str;
}

function buildAccountName(account: AccountConfig) {
    
    const readableName = account.nickName ? 
        account.nickName :
        `${account.company} ${account.type} ${account.accountNumber}`;

    return readableName
}

export function buildPlanSummary(transferPlan: TransferDefinition[], userData: User) {

    const transfersMap = new Map();
    const originalsMap = new Map();

    let tmp: number = 0;
    let toName: string;
    let fromName: string;
    transferPlan.forEach(transfer => {

        toName = buildAccountName(transfer.to);
        fromName = buildAccountName(transfer.from);
        
        // cheaper than checking
        originalsMap.set(toName, transfer.to.current)
        originalsMap.set(fromName, transfer.from.current)

        if (transfersMap.has(fromName)) {

            tmp = transfersMap.get(fromName);
            tmp -= transfer.amount
            transfersMap.set(fromName, tmp);

        } else {
            transfersMap.set(fromName, - transfer.amount);
        }

        if (transfersMap.has(toName)) {

            tmp = transfersMap.get(toName);
            tmp += transfer.amount
            transfersMap.set(toName, tmp);

        } else {
            transfersMap.set(toName, transfer.amount);
        }
    });

    const fromToMap = new Map();

    let change: number;
    for (let [key, value] of originalsMap) {
        change = transfersMap.get(key)    
        fromToMap.set(key, buildFromTo(change, value))
    }

    const messageText = applyTemplate(userData, fromToMap);

    return messageText;

}