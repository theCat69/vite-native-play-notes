export interface DOMEventProducer {
    addDOMEvent(): Promise<void>
}