# SK Buildings - UI Navigation Guide

## Complete URL Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    SK BUILDINGS PORTAL                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PUBLIC ROUTES (No Login Required)                          │
│  ├─ / (Home Page)                                           │
│  │  └─ Browse all properties                                │
│  │  └─ View projects                                        │
│  │  └─ Filter by location/type                              │
│  │                                                           │
│  ├─ /properties (Property Listing)                          │
│  │  └─ Same as home page                                    │
│  │                                                           │
│  ├─ /properties/:id (Property Details)                      │
│  │  └─ View full property info                              │
│  │  └─ See images and amenities                             │
│  │                                                           │
│  ├─ /login (Login Page)                                     │
│  │  └─ Admin & Customer login                               │
│  │  └─ Sign up option                                       │
│  │                                                           │
│  PROTECTED ROUTES (Login Required)                          │
│  ├─ /booking/:id (Booking Page)                             │
│  │  └─ Customer-only booking form                           │
│  │  └─ Payment gateway integration                          │
│  │  └─ Document upload                                      │
│  │                                                           │
│  ├─ /dashboard (Tenant/Customer Dashboard)                  │
│  │  └─ My Bookings                                          │
│  │  └─ My Documents                                         │
│  │  └─ Rent Payment Status                                  │
│  │  └─ Rent Alerts & Reminders                              │
│  │                                                           │
│  ADMIN ONLY ROUTES (Admin Login Required)                   │
│  └─ /admin/dashboard (Admin Console)                        │
│     ├─ 📊 Overview Tab                                       │
│     │  ├─ Dashboard Statistics                              │
│     │  ├─ Recent Bookings Widget                            │
│     │  └─ Pending Actions Alert                             │
│     │                                                        │
│     ├─ 🏢 Properties Tab                                     │
│     │  ├─ Add New Property (Modal)                          │
│     │  ├─ Edit Property Details (Modal)                     │
│     │  ├─ Delete Property                                   │
│     │  ├─ Search Properties                                 │
│     │  ├─ Filter by Status                                  │
│     │  └─ Property Grid View                                │
│     │                                                        │
│     ├─ 📋 Bookings Tab                                       │
│     │  ├─ View All Bookings                                 │
│     │  ├─ Approve Booking                                   │
│     │  ├─ Reject Booking                                    │
│     │  ├─ Cancel Booking                                    │
│     │  └─ View Documents                                    │
│     │                                                        │
│     └─ 👥 Tenants Tab                                        │
│        ├─ View All Tenants                                  │
│        ├─ Edit Tenant Details (Modal)                       │
│        ├─ Upload Aadhaar Card (Modal)                       │
│        ├─ Upload Lease Agreement (Modal)                    │
│        ├─ Search Tenants                                    │
│        └─ View Documents                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## User Journey Flowcharts

### ADMIN WORKFLOW:
```
Login (/login)
    ↓
    [Enter admin credentials]
    ↓
Admin Dashboard (/admin/dashboard)
    │
    ├─→ Overview Tab
    │   ├─ Check statistics
    │   ├─ Review recent bookings
    │   └─ See pending actions
    │
    ├─→ Properties Tab
    │   ├─→ Add New Property
    │   │   ├─ Fill form (title, type, project, price, etc.)
    │   │   └─ Submit
    │   │
    │   ├─→ Edit Property
    │   │   ├─ Click edit on property card
    │   │   ├─ Update details
    │   │   ├─ Change price/status
    │   │   └─ Save
    │   │
    │   ├─→ Delete Property
    │   │   ├─ Click delete
    │   │   ├─ Confirm deletion
    │   │   └─ Property removed
    │   │
    │   └─→ Search & Filter
    │       ├─ Type keyword
    │       ├─ Select status
    │       └─ View filtered results
    │
    ├─→ Bookings Tab
    │   ├─ See all customer bookings
    │   ├─→ Approve Booking
    │   │   ├─ Click "Approve & Lease"
    │   │   ├─ Booking status → Confirmed
    │   │   └─ Customer notified
    │   │
    │   ├─→ Reject Booking
    │   │   ├─ Click "Reject Request"
    │   │   ├─ Booking status → Cancelled
    │   │   └─ Customer notified
    │   │
    │   └─→ View/Download Documents
    │       ├─ Click "View Aadhaar"
    │       └─ Click "View Agreement"
    │
    └─→ Tenants Tab
        ├─ See all tenants
        ├─→ Edit Tenant Details
        │   ├─ Click "Edit Details"
        │   ├─ Update name, phone, email
        │   ├─ Set rent amount & due day
        │   └─ Save
        │
        ├─→ Upload Documents
        │   ├─ Click "Upload Aadhaar"
        │   ├─ Select file (PDF/JPG/PNG)
        │   └─ Upload
        │   
        │   (Same for "Upload Agreement")
        │
        └─→ Search Tenants
            ├─ Type name or phone
            └─ View matching results
```

### CUSTOMER WORKFLOW:
```
Home Page (/)
    ↓
    [Browse properties]
    ↓
    Click Property
        ↓
    Property Details (/properties/:id)
        ↓
    [View full info, images, price]
        ↓
    "Book Now" Button
        ↓
    Login (/login) - if not logged in
        ↓
    Booking Form (/booking/:id)
        ├─ Fill personal details
        ├─ Upload Aadhaar Card
        ├─ Upload Lease Agreement
        ├─ Select payment method
        └─ Submit booking
        ↓
    Booking Confirmation
        ↓
    Customer Dashboard (/dashboard)
        ├─ My Bookings
        │  ├─ View booking status
        │  └─ Check documents
        │
        └─ Rent Reminders
           ├─ See rent due date
           ├─ View due amount
           └─ Days remaining alert
```

---

## Feature Comparison Table

| Feature | Admin | Customer | Public |
|---------|-------|----------|--------|
| View Properties | ✅ (Full) | ✅ (Browse) | ✅ (Browse) |
| Add Property | ✅ | ❌ | ❌ |
| Edit Property | ✅ (Title, Price, Status) | ❌ | ❌ |
| Delete Property | ✅ | ❌ | ❌ |
| Rename Property | ✅ | ❌ | ❌ |
| Change Rent/Price | ✅ | ❌ | ❌ |
| Book Property | ❌ | ✅ | ❌ |
| View My Bookings | ❌ | ✅ | ❌ |
| Upload Documents | ✅ (On behalf) | ✅ (Own) | ❌ |
| Manage Tenants | ✅ | ❌ | ❌ |
| Edit Tenant Info | ✅ | ❌ | ❌ |
| View All Bookings | ✅ | ✅ (Own only) | ❌ |
| Approve Bookings | ✅ | ❌ | ❌ |
| Manage Rent Alerts | ✅ (Setup) | ✅ (View) | ❌ |
| View Dashboard Stats | ✅ | ❌ | ❌ |

---

## Modal Dialogs (Popups)

### Admin Modals:
1. **Add New Property Modal**
   - Form with 8 fields
   - Project dropdown
   - Property type selection
   - Cancel/Add buttons

2. **Edit Property Modal**
   - Pre-filled property details
   - Editable fields
   - Status dropdown
   - Cancel/Save buttons

3. **Edit Tenant Modal**
   - Name, phone, email fields
   - Rent amount input
   - Rent due day (1-31)
   - Cancel/Save buttons

4. **Upload Document Modal**
   - File input (PDF/JPG/PNG)
   - File preview with size
   - Upload progress
   - Cancel/Upload buttons

### Customer Modals:
1. **Book Property Modal**
   - Customer details form
   - Document upload fields
   - Payment info
   - Submit booking button

2. **Upload Document Modal**
   - Aadhaar upload
   - Lease agreement upload
   - File preview
   - Submit buttons

---

## Responsive Design

### Mobile View (< 768px):
- Tabs stack vertically
- One-column grid for properties
- Full-width modals
- Touch-friendly buttons
- Stacked form fields

### Tablet View (768px - 1024px):
- 2-column property grid
- Horizontal tabs
- Compact modals
- 2-column forms where space allows

### Desktop View (> 1024px):
- 3-column property grid
- Horizontal tabs
- Side-by-side modals
- Multi-column forms
- Full layout space utilized

---

## Color Scheme

- **Primary Color:** `#d4af37` (Gold) - Used for buttons, accents
- **Dark Background:** `#000000` - Main background
- **Dark-Light:** `#1a1a1a` - Cards, secondary bg
- **Dark-Lighter:** `#2a2a2a` - Hover, borders
- **Text (White):** `#ffffff` - Primary text
- **Text (Grey):** `#9ca3af` - Secondary text
- **Success (Green):** `#22c55e` - Available status
- **Warning (Yellow):** `#eab308` - Pending status
- **Danger (Red):** `#ef4444` - Cancelled/Error status

---

## Keyboard Navigation

- **Tab Key** - Move through form fields
- **Enter** - Submit forms/buttons
- **Escape** - Close modals
- **Arrow Keys** - Navigate grids (future enhancement)

---

## Accessibility Features

✅ Semantic HTML
✅ ARIA labels
✅ Keyboard navigation
✅ Color contrast compliance
✅ Form labels
✅ Error messages
✅ Loading states
✅ Focus indicators

---

## Performance Considerations

- **Lazy Loading** - Images load on scroll
- **Search Optimization** - Client-side filtering
- **Modal Caching** - Modals not re-rendered
- **Responsive Images** - Optimized for devices
- **Code Splitting** - Route-based code splitting

---

## Current Servers Status

```
✅ Frontend Server: http://localhost:5173
   - Hot reload enabled
   - React development mode
   - Vite dev server
   
✅ Backend Server: http://localhost:3001
   - Node.js + Express
   - Supabase connected
   - API endpoints ready
```

---

**Last Updated:** May 28, 2026
**Version:** 1.0
**Status:** Complete & Functional
