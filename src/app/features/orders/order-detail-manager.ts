export interface OrderDetailItem {
  mangoTypeId: number;
  crateTypeId: number;
  mangoTypeName: string;
  crateTypeName: string;
  quantity: number;
  pricePerKg: number;
  totalAmount: number;
}

export class OrderManager {
  constructor(private orderDetailList: OrderDetailItem[]) {}

  addItem(
    mangoTypeId: number,
    crateTypeId: number,
    mangoTypeName: string,
    crateTypeName: string,
    quantity: number,
    pricePerKg: number
  ): void {
    const existingItem = this.orderDetailList.find(item =>
      item.mangoTypeId === mangoTypeId &&
      item.crateTypeId === crateTypeId
    );

    const totalAmount = quantity * pricePerKg;

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalAmount += totalAmount;
    } else {
      this.orderDetailList.push({
        mangoTypeId,
        crateTypeId,
        mangoTypeName,
        crateTypeName,
        quantity,
        pricePerKg,
        totalAmount
      });
    }
  }

  removeItem(mangoTypeId: number, crateTypeId: number): void {
    this.orderDetailList = this.orderDetailList.filter(item =>
      !(item.mangoTypeId === mangoTypeId && item.crateTypeId === crateTypeId)
    );
  }

  getItems(): OrderDetailItem[] {
    return this.orderDetailList;
  }

  getTotalQuantity(): number {
    return this.orderDetailList.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalAmount(): number {
    return this.orderDetailList.reduce((sum, item) => sum + item.totalAmount, 0);
  }

  getSummary(): { totalQuantity: number; totalAmount: number } {
    return {
      totalQuantity: this.getTotalQuantity(),
      totalAmount: this.getTotalAmount()
    };
  }
}

// Usage in your component
// const manager = new OrderManager(this.orderDetailList);
// manager.addItem(mangoTypeId, crateTypeId, mangoTypeName, crateTypeName, quantity, pricePerKg);
// const summary = manager.getSummary();
