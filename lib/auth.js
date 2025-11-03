import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

/**
 * Get the current authenticated user from Clerk and sync with database
 * @returns {Promise<Object|null>} User object from database or null
 */
export async function getCurrentUser() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    return null
  }

  // Try to find user in database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      vendor: true,
    },
  })

  // If user doesn't exist in database, create them
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        displayName: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] || 'User',
        role: 'BUYER', // Default role
      },
    })
  }

  return dbUser
}

/**
 * Require user to be authenticated, redirect to sign-in if not
 * @returns {Promise<Object>} User object from database
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  return user
}

/**
 * Require user to have ADMIN role
 * @returns {Promise<Object>} Admin user object
 */
export async function requireAdmin() {
  const user = await requireAuth()
  
  if (user.role !== 'ADMIN') {
    redirect('/')
  }
  
  return user
}

/**
 * Require user to have VENDOR role and approved status
 * @returns {Promise<Object>} Vendor user object with vendor data
 */
export async function requireVendor() {
  const user = await requireAuth()
  
  if (user.role !== 'VENDOR') {
    redirect('/')
  }
  
  if (!user.vendor || user.vendor.status !== 'APPROVED') {
    redirect('/store/pending')
  }
  
  return user
}

/**
 * Check if current user is authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const { userId } = await auth()
  return !!userId
}

/**
 * Check if current user is admin
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN'
}

/**
 * Check if current user is vendor
 * @returns {Promise<boolean>}
 */
export async function isVendor() {
  const user = await getCurrentUser()
  return user?.role === 'VENDOR'
}
