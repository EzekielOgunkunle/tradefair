'use client'
import { updateQuantity } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId }) => {
    const { items } = useSelector(state => state.cart);
    const cartItem = items.find(item => item.id === productId);
    const dispatch = useDispatch();

    const addToCartHandler = () => {
        if (cartItem && cartItem.quantity < cartItem.maxQuantity) {
            dispatch(updateQuantity({ id: productId, quantity: cartItem.quantity + 1 }))
        }
    }

    const removeFromCartHandler = () => {
        if (cartItem && cartItem.quantity > 1) {
            dispatch(updateQuantity({ id: productId, quantity: cartItem.quantity - 1 }))
        }
    }

    if (!cartItem) return null;

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none" disabled={cartItem.quantity <= 1}>-</button>
            <p className="p-1">{cartItem.quantity}</p>
            <button onClick={addToCartHandler} className="p-1 select-none" disabled={cartItem.quantity >= cartItem.maxQuantity}>+</button>
        </div>
    )
}

export default Counter