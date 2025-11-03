import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/products(.*)',
  '/product/(.*)',
  '/api/webhooks(.*)',
  '/toast-demo(.*)',
])

// Define admin-only routes
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

// Define vendor routes
const isVendorRoute = createRouteMatcher([
  '/store(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return
  }

  // Protect admin routes - require ADMIN role
  if (isAdminRoute(req)) {
    await auth.protect((has) => {
      return has({ role: 'org:admin' }) || has({ permission: 'org:admin:access' })
    })
  }

  // Protect vendor routes - require VENDOR role
  if (isVendorRoute(req)) {
    await auth.protect((has) => {
      return has({ role: 'org:vendor' }) || has({ permission: 'org:vendor:access' })
    })
  }

  // For all other routes, just require authentication
  await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
