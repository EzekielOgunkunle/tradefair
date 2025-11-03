'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1] // spring effect
            }
        }
    }

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    return (
        <div className='mx-6'>
            <motion.div 
                className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Main Hero Card */}
                <motion.div 
                    className='relative flex-1 flex flex-col bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-3xl xl:min-h-100 group overflow-hidden'
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className='p-5 sm:p-16 relative z-10'>
                        <motion.div 
                            className='inline-flex items-center gap-3 bg-emerald-200 text-emerald-700 pr-4 p-1 rounded-full text-xs sm:text-sm font-medium'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className='bg-emerald-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs font-semibold'>NEW</span> 
                            Free Shipping on Orders Above $50! 
                            <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </motion.div>
                        <motion.h2 
                            className='text-3xl sm:text-5xl leading-[1.2] my-3 font-bold bg-gradient-to-r from-slate-800 via-emerald-700 to-emerald-600 bg-clip-text text-transparent max-w-xs sm:max-w-md'
                            variants={itemVariants}
                        >
                            Quality products. Trusted vendors. African pride.
                        </motion.h2>
                        <motion.div 
                            className='text-slate-700 text-sm font-medium mt-4 sm:mt-8'
                            variants={itemVariants}
                        >
                            <p>Starts from</p>
                            <p className='text-3xl font-bold text-emerald-600'>{currency}4.90</p>
                        </motion.div>
                        <motion.button 
                            className='bg-emerald-600 text-white text-sm font-semibold py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-lg shadow-lg hover:shadow-emerald-200 transition-shadow'
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(5, 150, 105, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            EXPLORE NOW
                        </motion.button>
                    </div>
                    <motion.div
                        variants={imageVariants}
                        className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm'
                    >
                        <Image className='w-full' src={assets.hero_model_img} alt="Featured product" />
                    </motion.div>
                    {/* Decorative gradient */}
                    <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full blur-3xl'></div>
                </motion.div>

                {/* Side Cards */}
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <motion.div 
                        className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl p-6 px-8 group overflow-hidden relative'
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className='relative z-10'>
                            <p className='text-3xl font-bold bg-gradient-to-r from-slate-800 to-amber-600 bg-clip-text text-transparent max-w-40'>
                                Verified Vendors
                            </p>
                            <motion.p 
                                className='flex items-center gap-1 mt-4 text-amber-700 font-medium'
                                whileHover={{ x: 5 }}
                            >
                                Learn more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> 
                            </motion.p>
                        </div>
                        <motion.div
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image className='w-35' src={assets.hero_product_img1} alt="Best products" />
                        </motion.div>
                        <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-200/30 to-transparent rounded-full blur-2xl'></div>
                    </motion.div>

                    <motion.div 
                        className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-teal-100 to-teal-50 rounded-3xl p-6 px-8 group overflow-hidden relative'
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className='relative z-10'>
                            <p className='text-3xl font-bold bg-gradient-to-r from-slate-800 to-teal-600 bg-clip-text text-transparent max-w-40'>
                                20% discounts
                            </p>
                            <motion.p 
                                className='flex items-center gap-1 mt-4 text-teal-700 font-medium'
                                whileHover={{ x: 5 }}
                            >
                                Shop now <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> 
                            </motion.p>
                        </div>
                        <motion.div
                            whileHover={{ rotate: -5, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image className='w-35' src={assets.hero_product_img2} alt="Discounted products" />
                        </motion.div>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-200/30 to-transparent rounded-full blur-2xl'></div>
                    </motion.div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <CategoriesMarquee />
            </motion.div>
        </div>

    )
}

export default Hero