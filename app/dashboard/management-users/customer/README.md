# Customer Management Route

## 📁 Structure

```
app/dashboard/management-users/customer/
├── page.tsx                    # Main customer list page
├── components/
│   ├── CustomerCard.tsx        # Customer-specific card component
│   ├── CustomerUpsert.tsx      # Customer form component
│   └── DeleteCustomer.tsx      # Customer delete confirmation
├── actions/
│   ├── getCustomers.ts         # Fetch customers data
│   ├── upsertCustomer.ts       # Create/update customer
│   └── deleteCustomer.ts       # Delete customer
├── helpers/
│   ├── customerSchema.ts       # Customer validation schema
│   └── customerFields.ts       # Customer form fields configuration
└── README.md                   # This file
```

## 🎯 Features

### Customer-Specific Fields
- **Personal Information**: Name, email, phone, address, password
- **Customer Preferences**: 
  - Preferred payment method (Cash, Card, Wallet)
  - Delivery preferences
  - Customer status (Active, Inactive, VIP)
  - VIP level (0-5)
- **Location**: Latitude, longitude, shared location link

### Customer-Specific Styling
- **Blue Theme**: Customer cards use blue color scheme
- **Status Badges**: Visual indicators for customer status
- **VIP Indicators**: Special badges for VIP customers
- **Payment Method Display**: Shows preferred payment method

### Customer-Specific Actions
- **Add Customer**: Form with customer-specific fields
- **Edit Customer**: Update customer information
- **Delete Customer**: Safe deletion with order checks
- **Location Integration**: Google Maps link support

## 🔧 Components

### CustomerCard
- Displays customer information in a card format
- Shows customer status and VIP level
- Includes payment method and delivery preferences
- Integrates with Google Maps for location
- Uses blue theme styling

### CustomerUpsert
- Form component for adding/editing customers
- Customer-specific validation
- Location coordinate extraction
- Collapsible sections for better UX

### DeleteCustomer
- Confirmation dialog for customer deletion
- Checks for related orders before deletion
- Safe deletion with proper error handling

## 📊 Data Model

### Customer Schema
```typescript
{
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  preferredPaymentMethod?: 'CASH' | 'CARD' | 'WALLET';
  deliveryPreferences?: string;
  customerStatus: 'ACTIVE' | 'INACTIVE' | 'VIP';
  vipLevel: number;
  sharedLocationLink?: string;
  latitude?: string;
  longitude?: string;
}
```

## 🚀 Usage

### Adding a Customer
```tsx
<CustomerUpsert
  mode='new'
  title="إضافة عميل جديد"
  description="يرجى إدخال بيانات العميل"
  defaultValues={{
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    // ... other fields
  }}
/>
```

### Displaying Customers
```tsx
{customers.map((customer) => (
  <CustomerCard key={customer.id} customer={customer} />
))}
```

## ✅ Benefits

1. **Complete Independence**: No shared component dependencies
2. **Customer-Specific Features**: Tailored for customer management
3. **Better UX**: Customer-appropriate styling and interactions
4. **Type Safety**: Strong typing for customer data
5. **Maintainability**: Self-contained and easy to maintain
6. **Scalability**: Easy to extend with new customer features

## 🔄 Migration from Shared Components

This route has been completely separated from the shared components:
- ❌ No more `UserCard` dependency
- ❌ No more `UserUpsert` dependency  
- ❌ No more shared validation schemas
- ✅ Complete customer-specific implementation
- ✅ Preserved all existing functionality
- ✅ Enhanced with customer-specific features 