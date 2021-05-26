import { Readable } from 'stream';

export interface Streamer {

    getInputStream: () => Readable;

}