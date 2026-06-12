# SK Buildings - Admin & Tenant UI Structure

## Overview
I've successfully implemented a complete separation between **Admin Dashboard** and **Tenant/Customer Dashboard** with distinct features for each user role.

---

## 1. **ADMIN DASHBOARD** (For SK Buildings Owner)
**Access Path:** `/admin/dashboard`

### Features:

#### 📊 **Overview Tab**
- **Statistics Cards:**
  - Total Properties
  - Available Properties
  - Total Tenants
  - Monthly Revenue
- **Recent Bookings Widget** - Shows latest bookings with status
- **Pending Actions Widget** - Alerts for pending bookings requiring approval

#### 🏢 **Properties Tab**
**Complete Property Management:**
- ✅ **Add New Property** - Modal form to create properties with:
  - Title
  - Type (Flat/Shop)
  - Project Selection
  - Price/Rent Amount
  - Floor Number
  - Area (sq.ft)
  - Description
  
- ✅ **Edit Property** - Update existing properties:
  - Change title, type, status, price
  - Modify floor and area details
  - Update description
  
- ✅ **Delete Property** - Remove properties from system
  
- ✅ **Search & Filter:**
  - Search by property title
  - Filter by status (All, Available, Booked)
  - Clear filters option

#### 📋 **Bookings Tab**
**Booking Management & Approval:**
- View all customer bookings
- Check property details and tenant information
- **Booking Actions:**
  - ✅ Approve & Lease (Confirm booking)
  - ❌ Reject Request (Deny booking)
  - ⚠️ Cancel Booking (For confirmed bookings)
- View uploaded documents (Aadhaar, Agreement)

#### 👥 **Tenants Tab**
**Complete Tenant Management:**
- View all tenants with details
- **Edit Tenant Details:**
  - Name, Phone, Email
  - Rent Amount
  - Rent Due Day (1-31)
  
- **Upload Documents:**
  - Upload Aadhaar Card
  - Upload Lease Agreement
  - Admin can upload docs on behalf of tenants
  
- **Search & Filter:**
  - Search by tenant name or phone number

---

## 2. **TENANT/CUSTOMER DASHBOARD** (For Customers)
**Access Path:** `/dashboard`

### Features:

#### My Bookings
- View all your property bookings
- Check booking status (Pending, Confirmed, Cancelled)
- See property details (Name, Location, Price)
- View booking dates and move-in dates

#### Document Management
- Upload Aadhaar Card
- Upload Lease Agreement
- View uploaded documents

#### Rent Alerts
- See upcoming rent payment due dates
- Days remaining until rent due
- Monthly rent amount

---

## 3. **HOME PAGE** (Public - For All Users)
**Access Path:** `/` or `/properties`

### Features:
- Browse all available properties
- View property details
- Filter properties by location, type, price
- Browse project information

---

## 4. **Authentication Flow**

### User Types:
1. **Admin User** - role: "admin"
   - Full access to admin dashboard
   - Can manage all properties, bookings, and tenants
   - Restricted by `ProtectedRoute` with `requireAdmin` prop

2. **Tenant/Customer** - role: "tenant" (default)
   - Access to customer dashboard
   - Can view own bookings
   - Can upload/manage own documents

3. **Public User** - Not authenticated
   - Can browse properties and home page
   - Redirected to login to make bookings

### Protected Routes:
```
/admin/dashboard - Requires Admin role
/dashboard - Requires Authentication
/booking/:id - Requires Authentication
/properties/:id - Public access
/ - Public access
```

---

## 5. **Key Components Used**

### Existing Components:
- **Card** - For displaying information blocks
- **Button** - For all interactive actions
- **Modal** - For forms and dialogs
- **Loading** - For loading states
- **ProtectedRoute** - For route protection

### Icons Used:
- Building2 - Properties
- Users - Tenants
- IndianRupee - Revenue
- Edit - Edit actions
- Trash2 - Delete actions
- Upload - Document uploads
- FileText - Documents
- Plus - Add new
- Search - Search functionality
- Filter - Filtering

---

## 6. **Admin Capabilities**

### Properties Management:
✅ Add new properties (flats/shops)
✅ Update property details (title, price, status)
✅ Rename properties
✅ Change rent/price amounts
✅ Delete properties
✅ Mark properties as available/booked
✅ Manage property floor and area info

### Tenant Management:
✅ View all tenants
✅ Edit tenant details (name, contact, rent)
✅ Upload tenant documents (Aadhaar, Agreement)
✅ Set rent amount and due date
✅ Search and filter tenants

### Booking Management:
✅ View all bookings
✅ Approve pending bookings
✅ Reject bookings
✅ Cancel confirmed bookings
✅ View customer documents

---

## 7. **UI/UX Features**

- **Tab Navigation** - Easy switching between sections
- **Search & Filter** - Quick access to properties
- **Status Indicators** - Color-coded status badges
- **Modal Forms** - Clean, organized data entry
- **Grid Layout** - Responsive design (mobile to desktop)
- **Dark Theme** - Professional gold/black color scheme
- **Toast Notifications** - User feedback for actions
- **Loading States** - Show action progress

---

## 8. **Next Steps (Optional Enhancements)**

1. **Analytics Dashboard** - Revenue charts, occupancy rates
2. **Payment Tracking** - Track rent payments from tenants
3. **Maintenance Requests** - Handle tenant repair requests
4. **Notices** - Send announcements to tenants
5. **Lease Expiry Alerts** - Remind about lease renewals
6. **Tenant History** - Track past and current tenants
7. **Reports** - Generate property and financial reports

---

## 9. **How to Access**

### For Admin (Owner):
1. Go to `http://localhost:5173/login`
2. Login with admin credentials
3. Navigate to `/admin/dashboard`
4. Manage properties, bookings, and tenants

### For Tenants/Customers:
1. Go to `http://localhost:5173/`
2. Browse properties
3. Login to book a property
4. View `/dashboard` for personal bookings
5. Upload required documents

---

## 10. **Database Models Involved**

- **Property** - Building units/shops
- **Booking** - Customer booking records
- **Tenant** - Tenant information
- **Project** - Real estate projects
- **Admin** - Admin user accounts
- **Document** - Uploaded files (Aadhaar, Agreements)

---

**Status:** ✅ Complete and Running
**Last Updated:** May 28, 2026
**Servers Running:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
