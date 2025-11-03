import { createSlice } from '@reduxjs/toolkit'

// Load cart from localStorage if available
const loadCartFromStorage = () => {
    if (typeof window !== 'undefined') {
        try {
            const serializedCart = localStorage.getItem('tradefair_cart')
            if (serializedCart) {
                return JSON.parse(serializedCart)
            }
        } catch (err) {
            console.error('Error loading cart from localStorage:', err)
        }
    }
    return {
        items: [],
        total: 0,
        subtotal: 0,
    }
}

// Save cart to localStorage
const saveCartToStorage = (cart) => {
    if (typeof window !== 'undefined') {
        try {
            const serializedCart = JSON.stringify(cart)
            localStorage.setItem('tradefair_cart', serializedCart)
        } catch (err) {
            console.error('Error saving cart to localStorage:', err)
        }
    }
}

const initialState = loadCartFromStorage()

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { id, name, price, image, vendor, maxQuantity = 99 } = action.payload
            const existingItem = state.items.find(item => item.id === id)
            
            if (existingItem) {
                // Increment quantity if not exceeding max
                if (existingItem.quantity < maxQuantity) {
                    existingItem.quantity += 1
                    state.total += 1
                }
            } else {
                // Add new item to cart
                state.items.push({
                    id,
                    name,
                    price,
                    image,
                    vendor,
                    quantity: 1,
                    maxQuantity,
                })
                state.total += 1
            }
            
            // Recalculate subtotal
            state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            
            // Save to localStorage
            saveCartToStorage(state)
        },
        
        removeFromCart: (state, action) => {
            const { id } = action.payload
            const existingItem = state.items.find(item => item.id === id)
            
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1
                    state.total -= 1
                } else {
                    // Remove item if quantity is 1
                    state.items = state.items.filter(item => item.id !== id)
                    state.total -= 1
                }
                
                // Recalculate subtotal
                state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            }
            
            saveCartToStorage(state)
        },
        
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload
            const existingItem = state.items.find(item => item.id === id)
            
            if (existingItem && quantity > 0 && quantity <= existingItem.maxQuantity) {
                const diff = quantity - existingItem.quantity
                existingItem.quantity = quantity
                state.total += diff
                
                // Recalculate subtotal
                state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                
                saveCartToStorage(state)
            }
        },
        
        deleteItemFromCart: (state, action) => {
            const { id } = action.payload
            const existingItem = state.items.find(item => item.id === id)
            
            if (existingItem) {
                state.total -= existingItem.quantity
                state.items = state.items.filter(item => item.id !== id)
                
                // Recalculate subtotal
                state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                
                saveCartToStorage(state)
            }
        },
        
        clearCart: (state) => {
            state.items = []
            state.total = 0
            state.subtotal = 0
            
            saveCartToStorage(state)
        },
    }
})

export const { 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearCart, 
    deleteItemFromCart 
} = cartSlice.actions

export default cartSlice.reducer
