import { DOMEventSupplier } from './dom-event-supplier';

export class AppEventManager {
  private domEventSuppliers: DOMEventSupplier[];

  constructor(...domEventSuppliers: DOMEventSupplier[]) {
    this.domEventSuppliers = domEventSuppliers;
  }

  public async addDOMEvents(): Promise<void> {
    this.domEventSuppliers.forEach(async (eventSupplier) => eventSupplier.addDOMEvent());
  }
} 