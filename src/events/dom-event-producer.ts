export interface DOMEventSupplier {
    addDOMEvent(): Promise<void>
}