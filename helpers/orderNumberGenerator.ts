import db from "@/lib/prisma";

export interface OrderNumberOptions {
  prefix?: string;
  padding?: number;
  separator?: string;
}

export class OrderNumberGenerator {
  private static readonly DEFAULT_OPTIONS: Required<OrderNumberOptions> = {
    prefix: 'ORD',
    padding: 6,
    separator: '-'
  };

  /**
   * Generates a unique sequential order number using atomic counter increment
   */
  static async generateOrderNumber(options: OrderNumberOptions = {}): Promise<string> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    try {
      // Atomic increment of counter
      const counter = await db.counter.upsert({
        where: { key: 'order_counter' },
        update: { counter: { increment: 1 } },
        create: { key: 'order_counter', counter: 1 }
      });

      const paddedNumber = counter.counter.toString().padStart(config.padding, '0');
      return `${config.prefix}${config.separator}${paddedNumber}`;
    } catch (error) {
      // Fallback to timestamp-based if counter fails
      const timestamp = Date.now();
      return `${config.prefix}${config.separator}${timestamp}`;
    }
  }

  /**
   * Validates if an order number already exists
   */
  static async isOrderNumberUnique(orderNumber: string): Promise<boolean> {
    const existingOrder = await db.order.findUnique({
      where: { orderNumber },
      select: { id: true }
    });
    return !existingOrder;
  }

  /**
   * Gets the next available order number without creating it
   */
  static async getNextOrderNumber(options: OrderNumberOptions = {}): Promise<string> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    const counter = await db.counter.findUnique({
      where: { key: 'order_counter' }
    });
    
    const nextNumber = (counter?.counter || 0) + 1;
    const paddedNumber = nextNumber.toString().padStart(config.padding, '0');
    return `${config.prefix}${config.separator}${paddedNumber}`;
  }

  /**
   * Resets the order counter (admin function)
   */
  static async resetOrderCounter(): Promise<void> {
    await db.counter.update({
      where: { key: 'order_counter' },
      data: { counter: 0 }
    });
  }
} 