# Supabase Migration Guide

## Setup Instructions

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Note your project URL and API keys

### 2. Environment Variables
Update `.env` file with:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Create Database Schema
1. Go to Supabase SQL Editor
2. Copy and paste contents from `migrations/001_init_schema.sql`
3. Run the SQL

### 5. Replace Mongoose Models

#### Before (Mongoose):
```javascript
const Tenant = require("./models/Tenant");
const tenant = await Tenant.findById(id);
```

#### After (Supabase):
```javascript
const TenantModel = require("./models/TenantSupabase");
const tenant = await TenantModel.findById(id);
```

## Model Migration Map

| Old Model | New Model | Location |
|-----------|-----------|----------|
| Tenant.js | TenantSupabase.js | models/TenantSupabase.js |
| Property.js | PropertySupabase.js | models/PropertySupabase.js |
| Admin.js | AdminSupabase.js | models/AdminSupabase.js |
| Booking.js | BookingSupabase.js | models/BookingSupabase.js |
| Project.js | ProjectSupabase.js | models/ProjectSupabase.js |
| Payment.js | PaymentSupabase.js | models/PaymentSupabase.js |

## Controller Updates Required

### Example: Tenant Controller

**Old (Mongoose):**
```javascript
const Tenant = require("../models/Tenant");

const getTenant = async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  res.json(tenant);
};
```

**New (Supabase):**
```javascript
const TenantModel = require("../models/TenantSupabase");

const getTenant = async (req, res) => {
  try {
    const tenant = await TenantModel.findById(req.params.id);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Key Differences

### 1. UUID vs ObjectId
- **MongoDB**: Uses `ObjectId` (24-character hex)
- **Supabase**: Uses `UUID` (36-character with hyphens)

### 2. Error Handling
- **Mongoose**: Returns `null` for not found
- **Supabase**: Returns `null` or error code `PGRST116`

```javascript
// Supabase pattern
if (error && error.code !== "PGRST116") throw error;
return data || null;
```

### 3. Relationships
- **Mongoose**: Automatic population with `.populate()`
- **Supabase**: Use `.select("*, relatedTable(*)")` or fetch separately

```javascript
// Example: Get tenant with properties
const tenant = await supabase
  .from("tenants")
  .select("*, tenant_properties(*, properties(*))")
  .eq("id", id)
  .single();
```

### 4. Timestamps
- **Mongoose**: `createdAt`, `updatedAt` auto-created
- **Supabase**: Need to set manually with `DEFAULT CURRENT_TIMESTAMP`

## Common Patterns

### Create
```javascript
// Old (Mongoose)
const tenant = new Tenant(data);
await tenant.save();

// New (Supabase)
const { data, error } = await supabase
  .from("tenants")
  .insert([data])
  .select()
  .single();
```

### Update
```javascript
// Old (Mongoose)
await Tenant.findByIdAndUpdate(id, updateData);

// New (Supabase)
await supabase
  .from("tenants")
  .update({ ...updateData, updated_at: new Date() })
  .eq("id", id)
  .select()
  .single();
```

### Delete
```javascript
// Old (Mongoose)
await Tenant.findByIdAndDelete(id);

// New (Supabase)
await supabase
  .from("tenants")
  .delete()
  .eq("id", id);
```

### Filter/Query
```javascript
// Old (Mongoose)
const tenants = await Tenant.find({ status: "active" });

// New (Supabase)
const { data } = await supabase
  .from("tenants")
  .select("*")
  .eq("phone", phoneNumber);
```

## Migration Checklist

- [ ] Create Supabase project
- [ ] Add environment variables
- [ ] Run `npm install` to get @supabase/supabase-js
- [ ] Run SQL schema from `migrations/001_init_schema.sql`
- [ ] Update all controllers to use Supabase models
- [ ] Add proper error handling (Supabase patterns)
- [ ] Test all CRUD operations
- [ ] Update file uploads (if using Supabase Storage)
- [ ] Test authentication flows
- [ ] Deploy to production

## Storage Setup (Optional)

For file uploads (aadhaar, agreements), use Supabase Storage:

```javascript
// Upload file
const { data, error } = await supabase.storage
  .from("documents")
  .upload(`${tenantId}/aadhaar.pdf`, file);

// Get public URL
const { data: urlData } = supabase.storage
  .from("documents")
  .getPublicUrl(`${tenantId}/aadhaar.pdf`);
```

## Troubleshooting

### Issue: UUID doesn't match format
- Ensure all IDs are proper UUIDs (36 chars with hyphens)
- Supabase auto-generates UUIDs if not provided

### Issue: Relationship queries return null
- Check table names match exactly
- Use correct foreign key names
- Verify Row Level Security (RLS) policies if enabled

### Issue: Timestamps are incorrect
- Always set `updated_at: new Date()` on updates
- Use `DEFAULT CURRENT_TIMESTAMP` in schema

## Support

- Supabase Docs: https://supabase.com/docs
- JavaScript Client: https://supabase.com/docs/reference/javascript
