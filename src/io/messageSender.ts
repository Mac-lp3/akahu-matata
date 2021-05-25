import { Sender } from '../types';

export class ConsoleSender implements Sender {

    constructor() {}

    public async send(text: string) {
        console.log('....................sending message');
        console.log(text);
        console.log('message sent.......................');
    }
}
