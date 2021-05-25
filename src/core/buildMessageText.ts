import { TransferDefinition } from '../types/transferPlan'

function applyTemplate(yaBoy: string, fromToMap: Map<string, string>) {

    const messageTemplate = `
hi, its ${yaBoy}.

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

export function buildPlanSummary(transferPlan: TransferDefinition[]) {

    const transfersMap = new Map();
    const originalsMap = new Map();

    let tmp: number = 0;
    transferPlan.forEach(transfer => {
        
        // cheaper than checking
        originalsMap.set(transfer.to.name, transfer.to.current)
        originalsMap.set(transfer.from.name, transfer.from.current)

        if (transfersMap.has(transfer.from.name)) {

            tmp = transfersMap.get(transfer.from.name);
            tmp -= transfer.amount
            transfersMap.set(transfer.from.name, tmp);

        } else {
            transfersMap.set(transfer.from.name, - transfer.amount);
        }

        if (transfersMap.has(transfer.to.name)) {

            tmp = transfersMap.get(transfer.to.name);
            tmp += transfer.amount
            transfersMap.set(transfer.to.name, tmp);

        } else {
            transfersMap.set(transfer.to.name, transfer.amount);
        }
    });

    const fromToMap = new Map();

    let change: number;
    for (let [key, value] of originalsMap) {
        change = transfersMap.get(key)    
        fromToMap.set(key, buildFromTo(change, value))
    }


    const idk = applyTemplate('me, ya boy', fromToMap);

    console.log(idk)

}