# Admin Management Route

## 📁 Structure

```
app/dashboard/management-users/admin/
├── page.tsx                    # Main admin list page
├── components/
│   ├── AdminCard.tsx           # Admin-specific card component
│   ├── AdminUpsert.tsx         # Admin form component
│   └── DeleteAdmin.tsx         # Admin delete confirmation
├── actions/
│   ├── getAdmins.ts            # Fetch admins data
│   ├── upsertAdmin.ts          # Create/update admin
│   └── deleteAdmin.ts          # Delete admin
├── helpers/
│   ├── adminSchema.ts          # Admin validation schema
│   └── adminFields.ts          # Admin form fields configuration
└── README.md                   # This file
```

## 🎯 Features

### Admin-Specific Fields
- **Personal Information**: Name, email, phone, address, password
- **Admin Settings**: 
  - Admin level (Super Admin, Admin, Moderator)
  - Permissions array
  - Active status
- **Location**: Latitude, longitude, shared location link

### Admin-Specific Styling
- **Purple Theme**: Admin cards use purple color scheme
- **Level Badges**: Visual indicators for admin levels
  - Super Admin: Red badge
  - Admin: Purple badge
  - Moderator: Orange badge
- **Status Indicators**: Active/Inactive status display
- **Permission Display**: Shows assigned permissions

### Admin-Specific Actions
- **Add Admin**: Form with admin-specific fields
- **Edit Admin**: Update admin information and permissions
- **Delete Admin**: Safe deletion with last admin protection
- **Location Integration**: Google Maps link support

## 🔧 Components

### AdminCard
- Displays admin information in a card format
- Shows admin level with color-coded badges
- Displays permissions list
- Shows active/inactive status
- Integrates with Google Maps for location
- Uses purple theme styling

### AdminUpsert
- Form component for adding/editing admins
- Admin-specific validation
- Admin level selection
- Permission management
- Location coordinate extraction
- Collapsible sections for better UX

### DeleteAdmin
- Confirmation dialog for admin deletion
- Prevents deletion of last admin
- Safe deletion with proper error handling

## 📊 Data Model

### Admin Schema
```typescript
{
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  adminLevel: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  permissions?: string[];
  isActive: boolean;
  sharedLocationLink?: string;
  latitude?: string;
  longitude?: string;
}
```

### Permission Options
- `USER_MANAGEMENT`: إدارة المستخدمين
- `ORDER_MANAGEMENT`: إدارة الطلبات
- `PRODUCT_MANAGEMENT`: إدارة المنتجات
- `REPORT_VIEWING`: عرض التقارير
- `SYSTEM_SETTINGS`: إعدادات النظام
- `FINANCIAL_MANAGEMENT`: إدارة المالية

## 🚀 Usage

### Adding an Admin
```tsx
<AdminUpsert
  mode='new'
  title="إضافة مشرف جديد"
  description="يرجى إدخال بيانات المشرف"
  defaultValues={{
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    adminLevel: 'ADMIN',
    permissions: [],
    isActive: true,
    // ... other fields
  }}
/>
```

### Displaying Admins
```tsx
{admins.map((admin) => (
  <AdminCard key={admin.id} admin={admin} />
))}
```

## ✅ Benefits

1. **Complete Independence**: No shared component dependencies
2. **Admin-Specific Features**: Tailored for admin management
3. **Permission Management**: Complete permission system
4. **Better UX**: Admin-appropriate styling and interactions
5. **Type Safety**: Strong typing for admin data
6. **Maintainability**: Self-contained and easy to maintain
7. **Scalability**: Easy to extend with new admin features
8. **Security**: Last admin protection

## 🔄 Migration from Shared Components

This route has been completely separated from the shared components:
- ❌ No more `UserCard` dependency
- ❌ No more `UserUpsert` dependency  
- ❌ No more shared validation schemas
- ✅ Complete admin-specific implementation
- ✅ Preserved all existing functionality
- ✅ Enhanced with admin-specific features
- ✅ Permission management system
- ✅ Admin level hierarchy
- ✅ Last admin protection

## 🔒 Security Features

- **Last Admin Protection**: Cannot delete the last admin in the system
- **Permission-Based Access**: Granular permission system
- **Admin Level Hierarchy**: Clear admin level structure
- **Safe Deletion**: Proper validation before deletion 