'use client'
import { Search, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {

    const router = useRouter();
    const { user } = useUser();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700 dark:text-slate-200">
                        <span className="text-emerald-600 dark:text-emerald-400">Trade</span>Fair<span className="text-amber-500 dark:text-amber-400 text-5xl leading-0">.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600 dark:text-slate-300">
                        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Home</Link>
                        <Link href="/products" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Products</Link>
                        <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">About</Link>
                        <Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 dark:bg-gray-800 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600 dark:text-slate-400" />
                            <input 
                                className="w-full bg-transparent outline-none placeholder-slate-600 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100" 
                                type="text" 
                                placeholder="Search products" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                required 
                            />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                            <ShoppingCart size={18} />
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-1 left-3 text-[10px] text-white bg-emerald-600 px-1.5 py-0.5 rounded-full font-medium">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-full font-medium">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <div className="flex items-center gap-4">
                                {user?.publicMetadata?.role === 'VENDOR' && (
                                    <Link 
                                        href="/store" 
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition font-medium"
                                    >
                                        <Store size={16} />
                                        My Store
                                    </Link>
                                )}
                                
                                {user?.publicMetadata?.role === 'ADMIN' && (
                                    <Link 
                                        href="/admin" 
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition font-medium"
                                    >
                                        Admin
                                    </Link>
                                )}
                                
                                <UserButton 
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10 border-2 border-emerald-500 dark:border-emerald-400"
                                        }
                                    }}
                                />
                            </div>
                        </SignedIn>

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden flex items-center gap-3">
                        <Link href="/cart" className="relative">
                            <ShoppingCart size={20} className="text-slate-600 dark:text-slate-300" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 text-[10px] text-white bg-emerald-600 px-1.5 py-0.5 rounded-full font-medium">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-sm transition text-white rounded-full font-medium">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                        
                        <SignedIn>
                            <UserButton 
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9 border-2 border-emerald-500"
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar