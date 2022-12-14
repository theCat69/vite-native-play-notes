import { DOMGenerator } from './dom-generator';

export class DOMGeneratorManager {

    private domGenerators: DOMGenerator[];

    constructor(...domGenerators: DOMGenerator[]) {
        this.domGenerators = domGenerators;
    }

    public async generateDOM(): Promise<void> {
        const promises: Promise<any>[] = [];
        this.domGenerators.forEach((domGenerator) => promises.push(domGenerator.generateDOM()));
        await Promise.all(promises);
    }
}