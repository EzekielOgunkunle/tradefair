'use client'
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children }) => {
    const { user, isLoaded } = useUser()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!isLoaded) {
                return
            }

            if (!user) {
                setIsAdmin(false)
                setLoading(false)
                return
            }

            try {
                // Fetch user role from database
                const response = await fetch('/api/user/role')
                const data = await response.json()

                if (data.success && data.role === 'ADMIN') {
                    setIsAdmin(true)
                } else {
                    setIsAdmin(false)
                }
            } catch (error) {
                console.error('Error checking admin status:', error)
                setIsAdmin(false)
            } finally {
                setLoading(false)
            }
        }

        checkAdminStatus()
    }, [user, isLoaded])

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex flex-col h-screen">
            <AdminNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <AdminSidebar />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default AdminLayout