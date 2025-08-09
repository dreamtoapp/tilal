# TODO: Driver Management System Enhancements

## 🎯 **Issues Identified & Solutions**

### **1. Distance Calculation Logic** ✅ **FIXED**
- **Issue**: Previous logic calculated distance from driver to customer
- **Solution**: Now correctly calculates distance from driver to store/warehouse
- **Logic**: Driver → Store → Customer (proper delivery flow)

### **2. Rating System** ❌ **MISSING**
- **Issue**: No rating system implemented for drivers
- **Current**: Using placeholder `rating: 0` and showing "لا يوجد تقييم"
- **Impact**: Smart suggestions algorithm missing 25% weighting for ratings

---

## 🛠️ **Database Schema Improvements Needed**

### **User Model Extensions (for Drivers)**
```prisma
model User {
  // ... existing fields ...
  
  // Driver-specific fields to add:
  isActive         Boolean?   @default(true)        // Driver availability toggle
  status           DriverStatus? @default(AVAILABLE) // Current driver status
  vehicleType      String?                          // "دراجة نارية", "سيارة", etc.
  plateNumber      String?                          // Vehicle plate number
  maxOrders        Int?       @default(3)          // Maximum concurrent orders
  experience       Int?       @default(0)          // Years of experience
  
  // Performance tracking
  totalEarnings    Float?     @default(0)          // Total earnings
  averageRating    Float?     @default(0)          // Calculated from ratings
  totalRatings     Int?       @default(0)          // Number of ratings received
  
  // Location tracking
  lastLocationUpdate DateTime?                     // When location was last updated
  
  // Relations
  driverRatings    DriverRating[]                 // Ratings received
  vehicleInfo      DriverVehicle?                 // Detailed vehicle info
}

enum DriverStatus {
  AVAILABLE
  BUSY
  OFFLINE
  ON_BREAK
}
```

### **New Models to Create**

#### **1. DriverRating Model**
```prisma
model DriverRating {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Rating details
  rating      Int      @map("rating") // 1-5 stars
  comment     String?                 // Optional comment
  
  // Relations
  driverId    String
  driver      User     @relation(fields: [driverId], references: [id], onDelete: Cascade)
  
  orderId     String   @unique
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  customerId  String
  customer    User     @relation("CustomerRatings", fields: [customerId], references: [id])
  
  @@map("driver_ratings")
}
```

#### **2. DriverVehicle Model** (Optional - Enhanced)
```prisma
model DriverVehicle {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Vehicle details
  type          String                    // "دراجة نارية", "سيارة صغيرة", etc.
  make          String?                   // "هوندا", "تويوتا", etc.
  model         String?                   // Model name
  year          Int?                      // Manufacturing year
  color         String?                   // Vehicle color
  plateNumber   String   @unique          // License plate
  
  // Capacity & specifications
  maxWeight     Float?                    // Maximum carrying weight (kg)
  maxVolume     Float?                    // Maximum volume (liters)
  
  // Documentation
  licenseExpiry DateTime?                 // Driver license expiry
  insuranceExpiry DateTime?               // Insurance expiry
  
  // Relations
  driverId      String   @unique
  driver        User     @relation(fields: [driverId], references: [id], onDelete: Cascade)
  
  @@map("driver_vehicles")
}
```

#### **3. Company/Store Settings Model**
```prisma
model CompanySettings {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Store/Warehouse location
  storeName      String                   // "المتجر الرئيسي"
  storeAddress   String                   // Full address
  storeLatitude  String                   // Latitude
  storeLongitude String                   // Longitude
  
  // Business settings
  maxDeliveryDistance Float @default(50)  // Maximum delivery radius (km)
  defaultMaxOrders    Int   @default(3)   // Default max orders per driver
  
  // Delivery time estimates
  avgPrepTime    Int @default(15)        // Average preparation time (minutes)
  avgDeliverySpeed Float @default(25)    // Average delivery speed (km/h)
  
  @@map("company_settings")
}
```

---

## 🔧 **Implementation Tasks**

### **Phase 1: Database Schema** 🏗️
- [ ] Update User model with driver-specific fields
- [ ] Create DriverRating model
- [ ] Create CompanySettings model  
- [ ] Create and run Prisma migration
- [ ] Update existing seed data

### **Phase 2: Rating System** ⭐
- [ ] Create rating submission component
- [ ] Add rating to order completion flow
- [ ] Calculate average rating for drivers
- [ ] Update smart suggestions algorithm
- [ ] Add rating display in driver cards

### **Phase 3: Store Location Management** 📍
- [ ] Create store settings admin panel
- [ ] Update distance calculation to use real store location
- [ ] Add multiple store locations support (future)

### **Phase 4: Driver Management** 👨‍💼
- [ ] Create driver status management
- [ ] Add vehicle information forms
- [ ] Implement driver capacity limits
- [ ] Add performance tracking dashboard

### **Phase 5: Enhanced Features** 🚀
- [ ] Real-time driver location tracking
- [ ] Driver earnings tracking
- [ ] Advanced analytics and reports
- [ ] Mobile driver app integration

---

## 🎯 **Priority Order**

1. **HIGH** - Company store location settings
2. **HIGH** - Driver rating system 
3. **MEDIUM** - Driver status management
4. **MEDIUM** - Vehicle information tracking
5. **LOW** - Advanced performance analytics

---

## 📝 **Notes**

- Current smart algorithm works at 75% capacity (missing rating 25%)
- Distance calculation now correctly uses store → customer flow
- All TODOs in code marked for easy identification
- System is fully functional but enhanced features will improve accuracy 