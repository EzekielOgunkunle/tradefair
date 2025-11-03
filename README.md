# TradeFair - Your Trusted African Marketplace

A modern, full-featured e-commerce platform connecting African buyers with verified vendors. Built with Next.js 15, Prisma, and a beautiful custom UI.

## 🌟 Features

### Current Implementation
- ✅ **Custom Brand Identity** - Emerald/Amber color scheme representing trust and African warmth
- ✅ **Animated UI** - Framer Motion animations throughout the platform
- ✅ **Toast Notifications** - Sonner integration with custom utilities
- ✅ **Database Setup** - PostgreSQL with Prisma ORM
- ✅ **Seeded Data** - 3 vendors, 9 products ready for testing
- ✅ **Modern Design System** - Tailwind CSS v4 with custom tokens
- ✅ **Clerk Authentication** - Full authentication with sign-in/sign-up, middleware, webhooks
- ✅ **Product Listing Pages** - Advanced filters, search, sorting, pagination
- ✅ **Product Detail Pages** - Image galleries, zoom modal, vendor cards, reviews
- ✅ **Shopping Cart** - Full cart with localStorage persistence, quantity management, beautiful UI
- ✅ **Checkout & Payment** - Complete checkout flow with Paystack integration, order creation, payment verification
- ✅ **Order Management** - Order detail pages, order tracking, order cancellation, refund requests
- ✅ **Vendor Dashboard - Products** - Product management with add/edit/delete, inventory tracking, status toggle
- ✅ **Vendor Dashboard - Orders** - Order management, status updates, revenue tracking, customer details
- ✅ **Admin Panel - Vendor Approval** - Vendor application review, approval/rejection workflow, notifications

### In Progress
- 🔄 Admin Panel - Analytics

## 🚀 Tech Stack

- **Framework:** Next.js 15.3.5 with Turbopack
- **Database:** Neon PostgreSQL with Prisma ORM
- **Authentication:** Clerk
- **Payments:** Paystack
- **Storage:** AWS S3
- **UI Components:** shadcn/ui with custom animations
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **State Management:** Redux Toolkit
- **Charts:** Recharts
- **AI:** Google Gemini API

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/EzekielOgunkunle/tradefair.git
cd tradefair

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your API keys to .env.local

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
node prisma/seed.js

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

TradeFair uses a custom design system with:
- **Primary:** Emerald 600 (#059669) - Trust & Growth
- **Secondary:** Amber 500 (#f59e0b) - Energy & Warmth
- **Accent:** Teal 500 (#14b8a6) - Modern & Fresh

See [design-tokens.md](design-tokens.md) for complete guidelines.

## 📱 Key Pages

- `/` - Homepage with animated hero
- `/toast-demo` - Toast notification showcase
- `/products` - Product listings with filters, search, and sorting
- `/product/[id]` - Product detail pages with image galleries and reviews
- `/cart` - Shopping cart with order summary and delivery estimation
- `/checkout` - Checkout page with shipping address form and Paystack payment
- `/payment/callback` - Payment verification and order confirmation
- `/orders` - Order history with cancel functionality and tracking
- `/orders/[id]` - Detailed order tracking with progress timeline
- `/sign-in` & `/sign-up` - Authentication pages
- `/pending` - Vendor pending approval page
- `/store` - Vendor dashboard with product and order management
- `/admin` - Admin panel with vendor management
- `/admin/approve` - Vendor approval workflow with detailed reviews
- `/admin/stores` - Complete vendor management and monitoring

## 🗄️ Database Schema

The platform includes models for:
- Users (Admin, Buyer, Vendor roles)
- Vendors (with approval workflow)
- Listings (products with inventory)
- Orders & OrderItems
- Reviews
- Notifications
- Platform Revenue tracking

## 🧪 Test Data

The seed script creates:
- 1 Admin user
- 3 Buyer users
- 3 Vendor businesses:
  - **African Fabrics & Textiles** - Traditional fabrics
  - **Northern Beads & Crafts** - Handmade jewelry
  - **Lagos Tech Gadgets** - Electronics
## 🎯 Roadmap

### Phase 1 (Current - 55% Complete)
- [x] UI/UX Design System
- [x] Database Schema
- [x] Basic Navigation
- [x] Authentication (Clerk with middleware, webhooks)
- [x] Product Display (Listing + Detail pages)
- [x] Shopping Cart (localStorage, quantity management)
- [x] Checkout Flow (Paystack payment integration)
- [x] Order Management System
- [x] Vendor Product Management
- [x] Vendor Order Management
- [x] Admin Vendor Approval System

### Phase 2
- [ ] Payment Integration (Paystack)
- [ ] Order Management
- [ ] Vendor Dashboard
- [ ] Product Management

### Phase 3
- [ ] Admin Panel
- [ ] Vendor Approval System
- [ ] Analytics Dashboard
- [ ] AI Recommendations

### Phase 4
- [ ] Email Notifications
- [ ] Advanced Search & Filters
- [ ] Reviews & Rating System
- [ ] Mobile Optimizationilters
- [ ] Reviews System
- [ ] Mobile App

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Ezekiel Ogunkunle**
- GitHub: [@EzekielOgunkunle](https://github.com/EzekielOgunkunle)
- Email: ezekiel.ogunkunle@yahoo.com

## 🙏 Acknowledgments

- Base template inspired by [GoCart](https://github.com/GreatStackDev/gocart)
- UI components from shadcn/ui
- Icons from Lucide React
- Images from Unsplash

---

Built with ❤️ for the African marketplace
