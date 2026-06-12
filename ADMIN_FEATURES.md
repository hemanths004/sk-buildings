# Admin Dashboard - Complete Feature Documentation

## Overview
The SK Buildings Admin Dashboard is a comprehensive property management system that allows the SK Buildings owner to manage properties, bookings, and tenant information all from one centralized console.

---

## 📊 Dashboard Statistics (Overview Tab)

### Cards Displayed:

**1. Total Properties**
- Shows total count of all properties (flats & shops)
- Updates in real-time
- Navigation: Click to jump to Properties tab

**2. Available Properties**
- Shows count of properties with "available" status
- Indicates how many units are ready for rent/sale
- Green indicator for quick visibility

**3. Total Tenants**
- Displays total number of tenants in the system
- Includes all current tenant profiles
- Links to Tenants tab

**4. Monthly Revenue**
- Shows total monthly rent from all confirmed bookings
- Calculated from confirmed bookings
- Displayed in Indian Rupees (₹)

### Recent Bookings Widget
- Shows last 5 bookings
- Displays: Property name, Customer name, Booking status
- Status color-coded (Green=Confirmed, Yellow=Pending, Red=Cancelled)
- Quick access to Bookings tab

### Pending Actions Widget
- Alert box for pending bookings requiring approval
- Shows count of pending bookings
- Yellow highlight for visibility
- Prompts to review Bookings tab

---

## 🏢 Properties Management (Properties Tab)

### Adding a New Property

**Click "Add New Property" Button**
- Opens modal dialog
- Fields to fill:

1. **Property Title** (Required)
   - Example: "A-302 Premium Flat", "Shop-105"
   - Must be unique or descriptive

2. **Property Type** (Required)
   - Dropdown: Flat or Shop
   - Determines usage category

3. **Project** (Required)
   - Dropdown to select from existing projects
   - Each property must be linked to a project
   - Project name displayed for reference

4. **Price/Rent Amount** (Required)
   - Monthly rent or sale price
   - Numeric value only
   - Displayed in Indian Rupees

5. **Floor** (Optional)
   - Which floor the property is on
   - Example: 1, 2, 3, etc.
   - Helps in identification

6. **Size (sq.ft)** (Optional)
   - Total area in square feet
   - Example: 1200, 850, etc.
   - Used for property details

7. **Description** (Optional)
   - Additional details about property
   - Amenities, features, condition
   - Visible to customers browsing

**Action:** Click "Add Property" to save

---

### Editing a Property

**Click "Edit" Button on Property Card**
- Opens Edit Property modal
- Pre-filled with current values
- Editable fields:
  - Title
  - Type (Flat/Shop)
  - Status (Available/Booked)
  - Price/Rent Amount
  - Floor
  - Area
  - Description

**Status Field:**
- Available: Property is ready for booking
- Booked: Property is occupied

**Action:** Click "Save Changes" to update

---

### Deleting a Property

**Click "Delete" Button (Trash Icon)**
- Confirmation dialog appears: "Are you sure?"
- Warning: This removes related bookings too
- Click "Confirm" to permanently delete
- Property disappears from list

---

### Searching & Filtering Properties

**Search Field:**
- Type property title keyword
- Real-time filtering as you type
- Example: Type "A-302" to find that property

**Status Filter:**
- All Properties: Shows all
- Available Only: Shows only available units
- Booked Only: Shows only booked units

**Clear Filters Button:**
- Resets search and status filter
- Shows all properties again

---

## 📋 Bookings Management (Bookings Tab)

### Viewing Bookings

Each booking card displays:

**Left Section (Property & Customer Info):**
- Property name and type (Flat/Shop)
- Project name
- Customer name
- Customer phone number
- Booking date (when booked)
- Move-in date
- Rent amount (if applicable)
- Payment type

**Middle Section (Status & Documents):**
- Booking status badge:
  - ✅ CONFIRMED (Green)
  - ⏳ PENDING (Yellow)
  - ❌ CANCELLED (Red)
- Documents status:
  - Links to view uploaded Aadhaar
  - Links to view uploaded Agreement
  - "No documents" if not yet uploaded

**Right Section (Actions):**
Depends on booking status:

**If Status is PENDING:**
- **Approve & Lease Button**
  - Confirms the booking
  - Customer can move in
  - Booking status changes to CONFIRMED
  - Tenant rent tracking begins
  
- **Reject Request Button**
  - Denies the booking
  - Booking status changes to CANCELLED
  - Customer notified of rejection
  - Property returns to available

**If Status is CONFIRMED:**
- **Cancel Booking Button**
  - Cancels an active booking
  - Customer must vacate
  - Property returns to available

---

## 👥 Tenants Management (Tenants Tab)

### Viewing Tenants

Each tenant card displays:

**Tenant Information (Left):**
- Tenant name
- Phone number
- Email address
- Linked properties (which properties they rent)

**Rent Details (Middle):**
- Rent amount (₹)
- Rent due day (1-31 of month)
- When rent payment is due

**Documents (Middle-Right):**
- Aadhaar Card:
  - Green link if uploaded (clickable)
  - Red text if missing
- Lease Agreement:
  - Green link if uploaded (clickable)
  - Red text if missing

**Action Buttons (Right):**

1. **Edit Details Button**
   - Opens Edit Tenant modal
   - Editable fields:
     - Name
     - Phone
     - Email
     - Rent amount
     - Rent due day
   - Click "Save Details" to update

2. **Upload Aadhaar Button**
   - Opens file upload modal
   - Accepted formats: PDF, JPG, PNG
   - Select file from computer
   - Click "Upload Document"
   - Aadhaar stored in system

3. **Upload Agreement Button**
   - Opens file upload modal
   - Accepted formats: PDF, JPG, PNG
   - Select file from computer
   - Click "Upload Document"
   - Lease agreement stored in system

### Searching Tenants

**Search Field:**
- Type tenant name or phone number
- Real-time filtering
- Example: Type "John" to find John
- Example: Type "9876543210" to find by phone

---

## 🔧 How to Perform Common Tasks

### Task 1: Add a New Property

1. Go to **Properties Tab**
2. Click **"Add New Property"** button
3. Fill in the form:
   - Property Title: "B-501 Luxury Flat"
   - Type: "Flat"
   - Project: Select project
   - Price: "25000"
   - Floor: "5"
   - Size: "1500"
   - Description: "Fully furnished, AC, parking"
4. Click **"Add Property"**
5. Property appears in grid

---

### Task 2: Update Property Price

1. Go to **Properties Tab**
2. Find the property
3. Click **"Edit"** button
4. Change **"Price / Rent Amount"** field
5. Click **"Save Changes"**
6. Price updated instantly

---

### Task 3: Approve a Booking

1. Go to **Bookings Tab**
2. Find booking with "PENDING" status
3. Click **"Approve & Lease"** button
4. Booking changes to "CONFIRMED"
5. Customer can move in

---

### Task 4: Add Tenant Documents

1. Go to **Tenants Tab**
2. Find the tenant
3. Click **"Upload Aadhaar"** or **"Upload Agreement"**
4. Select file from computer (PDF/JPG/PNG)
5. Click **"Upload"**
6. Document saved in system
7. Link appears in green on tenant card

---

### Task 5: Modify Tenant Rent Information

1. Go to **Tenants Tab**
2. Find the tenant
3. Click **"Edit Details"**
4. Update:
   - Rent Amount (new rent value)
   - Rent Due Day (1-31)
5. Click **"Save Details"**
6. Information updated for rent tracking

---

### Task 6: Find a Property by Name

1. Go to **Properties Tab**
2. In search field type property name
3. Grid filters in real-time
4. Or click **"Clear Filters"** to reset

---

### Task 7: Delete a Property

1. Go to **Properties Tab**
2. Find property to delete
3. Click **"Delete"** button (trash icon)
4. Confirm in popup
5. Property removed from system

---

## 📱 User Interface Elements

### Top Navigation Bar
- Shows "Admin Dashboard" title
- Subtitle: "Manage properties, bookings, and tenants for SK Buildings"
- Four main tabs: Overview, Properties, Bookings, Tenants

### Tab Buttons
- Gold color = Active tab
- Dark color = Inactive tabs
- Emojis for quick visual identification:
  - 📊 Overview
  - 🏢 Properties
  - 📋 Bookings
  - 👥 Tenants

### Cards
- White/dark borders
- Gold accents on hover
- Responsive layout (stacks on mobile)
- Icon indicators for status

### Status Badges
- Green = Available/Confirmed/Uploaded
- Yellow = Pending/Needs Action
- Red = Cancelled/Missing/Error

### Buttons
- Primary (Gold): Main actions
- Outline (Gray): Secondary actions
- Danger (Red): Delete/Cancel actions
- Small size: Compact buttons

---

## 💡 Tips & Best Practices

### Properties
✅ Always fill in all required fields (marked with *)
✅ Use clear, descriptive property titles
✅ Keep prices up-to-date for accurate revenue calculation
✅ Regular update property status when units are occupied
✅ Store documents in organized folders

### Bookings
✅ Review pending bookings regularly
✅ Approve bookings after document verification
✅ Reject requests that don't meet requirements
✅ Cancel bookings quickly if tenant leaves early
✅ Keep document records for legal compliance

### Tenants
✅ Collect Aadhaar and Agreement documents from all tenants
✅ Set correct rent due date for monthly tracking
✅ Update tenant contact info regularly
✅ Maintain accurate rent amount records
✅ Search function helps locate tenants quickly

---

## ⚠️ Important Notes

1. **Data Integrity**
   - Deleted properties cannot be recovered
   - Cancelled bookings are permanent
   - Keep document backups

2. **Authorization**
   - Only admins can access this dashboard
   - Customers cannot modify property details
   - Protect login credentials

3. **Accuracy**
   - Ensure price/rent amounts are correct
   - Verify tenant details before confirming
   - Double-check before deleting

4. **Legal Compliance**
   - Store all required documents (Aadhaar, Agreements)
   - Maintain booking records
   - Follow rental laws for your jurisdiction

---

## 🔐 Security

- Admin-only access (role-based)
- Login required
- Session timeout for safety
- Encrypted data transmission
- Document storage with backup

---

## 📞 Support

For issues or questions:
- Check UI_NAVIGATION_GUIDE.md for routing info
- Check UI_STRUCTURE.md for feature overview
- Test in different browsers
- Check browser console for errors

---

**Last Updated:** May 28, 2026
**Version:** 1.0
**Status:** Fully Functional
