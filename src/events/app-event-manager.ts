import { DOMEventSupplier } from './dom-event-supplier';

export class AppEventManager {
  private domEventSuppliers: DOMEventSupplier[];

  constructor(...domEventSuppliers: DOMEventSupplier[]) {
    this.domEventSuppliers = domEventSuppliers;
  }

  public async addDOMEvents(): Promise<void> {
    const promises: Promise<any>[] = [];
    this.domEventSuppliers.forEach((eventSupplier) => promises.push(eventSupplier.addDOMEvent()));
    await Promise.all(promises);
  }
} 