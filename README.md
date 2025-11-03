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

### In Progress
- 🔄 Clerk Authentication
- 🔄 Product Listing Pages
- 🔄 Shopping Cart & Checkout
- 🔄 Vendor Dashboard
- 🔄 Admin Panel

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
- `/products` - Product listings (coming soon)
- `/store` - Vendor dashboard (coming soon)
- `/admin` - Admin panel (coming soon)

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
- 9 Product listings

## 🎯 Roadmap

### Phase 1 (Current)
- [x] UI/UX Design System
- [x] Database Schema
- [x] Basic Navigation
- [ ] Authentication
- [ ] Product Display

### Phase 2
- [ ] Shopping Cart
- [ ] Checkout Flow
- [ ] Payment Integration
- [ ] Order Management

### Phase 3
- [ ] Vendor Dashboard
- [ ] Admin Panel
- [ ] Analytics
- [ ] AI Recommendations

### Phase 4
- [ ] Email Notifications
- [ ] Search & Filters
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

- Base template inspired by GoCart
- UI components from shadcn/ui
- Icons from Lucide React
- Images from Unsplash

---

Built with ❤️ for the African marketplace
