# SK Buildings - Frontend

Modern property management system for SK Buildings with React, TypeScript, and TailwindCSS.

## Features

### For Customers
- 📱 **Phone Number Authentication** - Login with OTP verification
- 🏠 **Property Browsing** - View flats and commercial shops across multiple locations
- 🔍 **Advanced Filters** - Filter by type, price, location, bedrooms
- 📅 **Online Booking** - Book properties with flexible payment options
- 📄 **Document Upload** - Upload Aadhaar and agreement documents
- 💰 **Payment Options** - Pay online or contact owner
- 🔔 **Rent Reminders** - Get notified 5 days before rent due date
- 📊 **User Dashboard** - View all bookings and owned properties

### For Admin
- 👥 **User Management** - View and manage all users
- 🏢 **Property Management** - Add, edit, delete properties
- 📋 **Booking Management** - Approve/reject bookings
- 📁 **Document Management** - View and upload user documents
- 📊 **Analytics Dashboard** - View statistics and revenue

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS with custom black/grey/gold theme
- **Routing:** React Router v6
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## Color Theme

- **Primary Gold:** `#d4af37` (light: `#ffd700`)
- **Dark Black:** `#000000` (light: `#1a1a1a`, lighter: `#2d2d2d`)
- **Grey:** `#808080` (light: `#a0a0a0`, dark: `#404040`)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies
```bash
npm install
```

2. Create environment file
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL
```
VITE_API_URL=http://localhost:5000/api
```

4. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── services/        # API service layer
├── store/           # Zustand stores
├── types/           # TypeScript interfaces
├── utils/           # Helper functions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Key Features

- **Phone + OTP Authentication**
- **Property Browsing & Filtering**
- **Online Booking with Payment Options**
- **Document Upload (Aadhaar & Agreement)**
- **Rent Payment Reminders**
- **Admin Dashboard**
- **User Dashboard**
- **WhatsApp & Call Integration**

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:5000/api`)

## License

Proprietary - SK Buildings © 2026
