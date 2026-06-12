# 🚀 SK Buildings - Quick Start Guide

## 📍 Website URLs

```
Public Home Page:        http://localhost:5173/
Property Details:        http://localhost:5173/properties/:id
Login Page:             http://localhost:5173/login
Booking Page:           http://localhost:5173/booking/:id

Tenant Dashboard:       http://localhost:5173/dashboard
Admin Dashboard:        http://localhost:5173/admin/dashboard

Backend API:            http://localhost:3001
```

---

## 👤 User Roles & Access

### Role: ADMIN (SK Buildings Owner)
**Login Credentials:** (Use your admin credentials)
- **Access:** `/admin/dashboard`
- **Permissions:**
  - ✅ Add/Edit/Delete Properties
  - ✅ Change Property Prices
  - ✅ Rename Properties
  - ✅ Approve/Reject Bookings
  - ✅ Manage Tenant Information
  - ✅ Upload Documents for Tenants
  - ✅ View Dashboard Statistics

### Role: TENANT (Customers/Renters)
**Login Credentials:** (Customer account)
- **Access:** `/dashboard`
- **Permissions:**
  - ✅ Browse Properties
  - ✅ Book Properties
  - ✅ View My Bookings
  - ✅ Upload My Documents
  - ✅ Track Rent Status

### Role: PUBLIC (No Login)
- **Access:** Home page, Property browse, Login
- **Permissions:**
  - ✅ View Properties
  - ✅ View Project Details

---

## ⚡ Quick Tasks

### Add a Property (Admin Only)
1. Go to `/admin/dashboard`
2. Click "Properties" tab
3. Click "Add New Property" button
4. Fill form: Title, Type, Project, Price, Floor, Size, Description
5. Click "Add Property"
✅ Done!

### Change Property Price (Admin Only)
1. Go to `Properties` tab
2. Find property
3. Click "Edit" button
4. Change "Price / Rent Amount"
5. Click "Save Changes"
✅ Done!

### Delete Property (Admin Only)
1. Go to `Properties` tab
2. Find property
3. Click "Delete" (trash icon)
4. Confirm deletion
✅ Done!

### Approve a Booking (Admin Only)
1. Go to `Bookings` tab
2. Find "PENDING" booking
3. Click "Approve & Lease"
✅ Booking confirmed!

### Upload Tenant Document (Admin Only)
1. Go to `Tenants` tab
2. Find tenant
3. Click "Upload Aadhaar" or "Upload Agreement"
4. Select file (PDF/JPG/PNG)
5. Click "Upload"
✅ Done!

### Search Properties (Admin Only)
1. Go to `Properties` tab
2. Type in search field
3. Results filter automatically
✅ Found!

### Filter Properties (Admin Only)
1. Go to `Properties` tab
2. Select from dropdown:
   - All Properties
   - Available Only
   - Booked Only
✅ Filtered!

---

## 🎯 Admin Dashboard Tabs

```
┌─────────────────────────────────────────┐
│ Admin Dashboard                         │
├─────────────────────────────────────────┤
│
│ [📊 Overview] [🏢 Properties] [📋 Bookings] [👥 Tenants]
│
│ Tab 1: Overview
│   └─ Statistics, recent bookings, pending actions
│
│ Tab 2: Properties
│   ├─ Add new properties
│   ├─ Edit properties
│   ├─ Delete properties
│   ├─ Search by name
│   └─ Filter by status
│
│ Tab 3: Bookings
│   ├─ View all bookings
│   ├─ Approve pending bookings
│   ├─ Reject bookings
│   ├─ Cancel confirmed bookings
│   └─ View documents
│
│ Tab 4: Tenants
│   ├─ View tenant info
│   ├─ Edit tenant details
│   ├─ Upload documents
│   ├─ Set rent info
│   └─ Search tenants
│
└─────────────────────────────────────────┘
```

---

## 📊 Key Metrics (Dashboard)

| Metric | Shows | Updates |
|--------|-------|---------|
| **Total Properties** | All properties in system | Real-time |
| **Available** | Ready to rent/sell | Real-time |
| **Total Tenants** | Number of tenants | Real-time |
| **Monthly Revenue** | From confirmed bookings | Real-time |

---

## 📋 Booking Statuses

| Status | Meaning | Admin Action | Next Step |
|--------|---------|--------------|-----------|
| **PENDING** | Customer booked, awaiting approval | Approve or Reject | Confirmed or Cancelled |
| **CONFIRMED** | Approved and active | Can cancel | Customer moving in |
| **CANCELLED** | Rejected or cancelled | - | Booking closed |

---

## 🏠 Property Statuses

| Status | Meaning | Bookable |
|--------|---------|----------|
| **Available** | Ready to rent/sell | ✅ Yes |
| **Booked** | Currently occupied | ❌ No |

---

## 📁 Document Types

- **Aadhaar Card:** Government ID
- **Lease Agreement:** Rental contract
- **Formats:** PDF, JPG, PNG

---

## 🎨 Status Colors

- 🟢 **Green** = Available / Confirmed / Success
- 🟡 **Yellow** = Pending / Needs Action / Warning
- 🔴 **Red** = Cancelled / Missing / Error

---

## 🔑 Important Buttons & Icons

| Icon | Function | Location |
|------|----------|----------|
| ✏️ Edit | Edit details | Property/Tenant cards |
| 🗑️ Delete | Remove permanently | Property cards |
| ⬆️ Upload | Upload files | Tenant section |
| 🔍 Search | Find items | All tabs |
| ⬅️ Clear | Reset filters | Filter bar |
| ➕ Add | Create new | Properties tab |

---

## ❌ Common Issues & Solutions

### Issue: Can't access admin dashboard
- **Solution:** Make sure you're logged in as admin
- Check: `/admin/dashboard` requires admin role

### Issue: Property not appearing
- **Solution:** Refresh page or scroll down
- Try: Search or filter to find it

### Issue: Can't upload document
- **Solution:** Check file format (PDF/JPG/PNG only)
- Check: File size isn't too large

### Issue: Changes not saving
- **Solution:** Check internet connection
- Try: Refresh page and try again

### Issue: Booking not approving
- **Solution:** Check booking has required documents
- Try: Reject and ask customer to resubmit

---

## 🔒 Security Tips

✅ Don't share admin password
✅ Log out when done
✅ Keep documents backed up
✅ Regular password changes
✅ Verify customer documents
✅ Keep records organized

---

## 📱 Device Support

✅ Desktop (Windows, Mac, Linux)
✅ Tablet (iPad, Android tablets)
✅ Mobile (iPhone, Android)

**Responsive:** All screen sizes supported

---

## ⏱️ Performance Tips

- Page loads in ~1 second
- Search filters instantly
- Modal opens smoothly
- Upload shows progress
- Real-time updates

---

## 🎓 Learning Resources

📖 Read: `ADMIN_FEATURES.md` - Detailed guide
📖 Read: `UI_NAVIGATION_GUIDE.md` - URL routing
📖 Read: `UI_STRUCTURE.md` - Complete overview

---

## 🆘 Getting Help

1. Check documentation files
2. Check browser console (F12)
3. Verify backend is running
4. Try refresh page
5. Check network connection

---

## 🚀 Next Steps

1. ✅ Admin dashboard is ready
2. ✅ Customer dashboard is ready
3. ✅ Public pages are ready
4. Start adding properties
5. Accept customer bookings
6. Manage tenants and documents

---

## 💻 Server Status

Check if servers are running:

```bash
Frontend:  http://localhost:5173  ✅
Backend:   http://localhost:3001  ✅
Database:  Supabase connected      ✅
```

---

## 🎯 Your Next Actions

1. **Go to Admin Dashboard:** `http://localhost:5173/admin/dashboard`
2. **Add Your First Property:** Click "Add New Property"
3. **Set Up Tenants:** Go to "Tenants" tab
4. **Manage Bookings:** Go to "Bookings" tab
5. **Monitor Dashboard:** Check statistics

---

## ✨ Features at a Glance

```
ADMIN DASHBOARD
├─ Add Property ✅
├─ Edit Property ✅
├─ Delete Property ✅
├─ Rename Property ✅
├─ Change Price ✅
├─ Approve Booking ✅
├─ Reject Booking ✅
├─ Cancel Booking ✅
├─ Manage Tenants ✅
├─ Upload Documents ✅
├─ View Statistics ✅
├─ Search/Filter ✅
└─ Dashboard Metrics ✅

CUSTOMER DASHBOARD
├─ View Bookings ✅
├─ Check Status ✅
├─ Upload Documents ✅
├─ View Rent Info ✅
└─ Browse Properties ✅

PUBLIC PAGES
├─ Home/Properties ✅
├─ Property Details ✅
├─ Booking Page ✅
└─ Login Page ✅
```

---

## 📞 Quick Links

- **Docs:** `/IMPLEMENTATION_CHECKLIST.md`
- **Admin Guide:** `/ADMIN_FEATURES.md`
- **Navigation:** `/UI_NAVIGATION_GUIDE.md`
- **Structure:** `/UI_STRUCTURE.md`

---

**Ready to manage properties? Start now! 🎉**

**Last Updated:** May 28, 2026
**Version:** 1.0
**Status:** ✅ Ready
