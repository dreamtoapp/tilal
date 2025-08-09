# Helpers Directory

This directory contains utility functions for server actions and business logic.

## Files:

### newsletterHelpers.ts
Utility functions for newsletter DB operations, such as checking if an email exists and adding a new subscriber.

### orderNumberGenerator.ts
**Order Number Generation System**

Generates unique sequential order numbers using atomic counter operations to prevent race conditions.

**Features:**
- ✅ Sequential numbering with atomic increments
- ✅ Customizable prefix, padding, and separator
- ✅ Uniqueness validation
- ✅ Fallback to timestamp if counter fails

**Usage:**
```typescript
import { OrderNumberGenerator } from "@/helpers/orderNumberGenerator";

// Default format: ORD-000001
const orderNumber = await OrderNumberGenerator.generateOrderNumber();

// Custom format
const customNumber = await OrderNumberGenerator.generateOrderNumber({
  prefix: 'INV',
  padding: 4,
  separator: '/'
});

// Check uniqueness
const isUnique = await OrderNumberGenerator.isOrderNumberUnique(orderNumber);
```

**Format:**
- Sequential: ORD-000001, ORD-000002, ORD-000003 (uses Counter model)
- Fallback: ORD-1703123456789 (timestamp if counter fails) 