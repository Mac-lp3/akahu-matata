import { Readable } from 'stream';
import { Streamer } from '../types';

/**
 * This class would establish a connection to a data source like s3 select or dynamo.
 * 
 * Since it could contain a large dataset, other functions can then stream the output.
 */
export class MockInputStreamer implements Streamer {

    private readable: Readable;

    constructor() { 
        // obviously not how you would do it for real...
        this.readable = Readable.from(['123']);
    }

    public getInputStream(): Readable {
        return this.readable;
    }
}