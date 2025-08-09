# Driver Management Route

## 📁 Structure

```
app/dashboard/management-users/drivers/
├── page.tsx                    # Main driver list page
├── components/
│   ├── DriverCard.tsx          # Driver-specific card component
│   ├── DriverUpsert.tsx        # Driver form component
│   └── DeleteDriver.tsx        # Driver delete confirmation
├── actions/
│   ├── getDrivers.ts           # Fetch drivers data
│   ├── upsertDriver.ts         # Create/update driver
│   └── deleteDriver.ts         # Delete driver
├── helpers/
│   ├── driverSchema.ts         # Driver validation schema
│   └── driverFields.ts         # Driver form fields configuration
└── README.md                   # This file
```

## 🎯 Features

### Driver-Specific Fields
- **Personal Information**: Name, email, phone, address, password
- **Vehicle Information**: 
  - Vehicle type (Motorcycle, Car, Van, Truck, Bicycle)
  - Vehicle plate number
  - Vehicle color and model
  - Driver license number
  - Years of experience
- **Driver Settings**: 
  - Maximum concurrent orders
  - Driver status (Online, Offline, Busy)
- **Location**: Latitude, longitude, shared location link

### Driver-Specific Styling
- **Green Theme**: Driver cards use green color scheme
- **Status Badges**: Visual indicators for driver status
- **Vehicle Information Display**: Shows detailed vehicle information
- **Experience Indicators**: Displays years of experience

### Driver-Specific Actions
- **Add Driver**: Form with driver-specific fields including vehicle info
- **Edit Driver**: Update driver and vehicle information
- **Delete Driver**: Safe deletion with order checks
- **Location Integration**: Google Maps link support

## 🔧 Components

### DriverCard
- Displays driver information in a card format
- Shows driver status (Online, Offline, Busy)
- Includes detailed vehicle information
- Shows experience and max orders
- Integrates with Google Maps for location
- Uses green theme styling

### DriverUpsert
- Form component for adding/editing drivers
- Driver-specific validation with vehicle fields
- Location coordinate extraction
- Collapsible sections for better UX
- Vehicle type selection

### DeleteDriver
- Confirmation dialog for driver deletion
- Checks for related orders before deletion
- Safe deletion with proper error handling

## 📊 Data Model

### Driver Schema
```typescript
{
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  vehicleType: 'MOTORCYCLE' | 'CAR' | 'VAN' | 'TRUCK' | 'BICYCLE';
  vehiclePlateNumber: string;
  vehicleColor: string;
  vehicleModel: string;
  driverLicenseNumber: string;
  experience: string;
  maxOrders: string;
  driverStatus: 'ONLINE' | 'OFFLINE' | 'BUSY';
  sharedLocationLink?: string;
  latitude?: string;
  longitude?: string;
}
```

## 🚀 Usage

### Adding a Driver
```tsx
<DriverUpsert
  mode='new'
  title="إضافة سائق جديد"
  description="يرجى إدخال بيانات السائق"
  defaultValues={{
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    vehicleType: undefined,
    vehiclePlateNumber: '',
    vehicleColor: '',
    vehicleModel: '',
    driverLicenseNumber: '',
    experience: '',
    maxOrders: '3',
    driverStatus: 'OFFLINE',
    // ... other fields
  }}
/>
```

### Displaying Drivers
```tsx
{drivers.map((driver) => (
  <DriverCard key={driver.id} driver={driver} />
))}
```

## ✅ Benefits

1. **Complete Independence**: No shared component dependencies
2. **Driver-Specific Features**: Tailored for driver management
3. **Vehicle Management**: Complete vehicle information handling
4. **Better UX**: Driver-appropriate styling and interactions
5. **Type Safety**: Strong typing for driver data
6. **Maintainability**: Self-contained and easy to maintain
7. **Scalability**: Easy to extend with new driver features

## 🔄 Migration from Shared Components

This route has been completely separated from the shared components:
- ❌ No more `UserCard` dependency
- ❌ No more `UserUpsert` dependency  
- ❌ No more shared validation schemas
- ✅ Complete driver-specific implementation
- ✅ Preserved all existing functionality
- ✅ Enhanced with driver-specific features
- ✅ Vehicle information management 