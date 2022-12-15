import { HTTPPrefetchSupplier } from './http-fetch-supplier';

export class HTTPInitialFecthManager {
    private httpPrefetchSuppliers: HTTPPrefetchSupplier[];
    
    constructor(...httpPrefetchSuppliers: HTTPPrefetchSupplier[]) {
        this.httpPrefetchSuppliers = httpPrefetchSuppliers;
    }

    async sendPrefetchHTTPRequest() {
        const promises: Promise<any>[] = [];
        this.httpPrefetchSuppliers.forEach((httpPrefetchSupplier) => promises.push(httpPrefetchSupplier.sendPrefetchHTTPRequest()));
        await Promise.all(promises);
    }
}