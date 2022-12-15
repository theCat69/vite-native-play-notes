export interface HTTPPrefetchSupplier {
    sendPrefetchHTTPRequest(): Promise<void>;
}