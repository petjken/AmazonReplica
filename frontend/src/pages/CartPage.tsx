import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../types/CartItem";
import ShopBreadcrumb from "../components/ShopBreadcrumb";
import DiscountProgressBar from "../components/DiscountProgressBar";

function CartPage() {
    
    const navigate = useNavigate();
    const {cart, removeFromCart} =useCart();
    const total = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    return (
        
        <div className="container mt-4">
            <ShopBreadcrumb />
            <DiscountProgressBar />
            <h2>
                Your cart
            </h2>
            <div>
                {cart.length === 0 ? 
                <p>
                    Your cart is empty.
                </p> : 
                <ul>
                    {cart.map((item: CartItem) =>
                        <li key ={item.bookID}>
                            {item.title} — Qty: {item.quantity} × ${item.unitPrice.toFixed(2)} = ${(item.quantity * item.unitPrice).toFixed(2)}
                            <button onClick={() => removeFromCart(item.bookID)}>
                                Remove
                            </button>
                            </li>
                    )}
                </ul>
                }
            </div>
            <h3>
                Total: ${total.toFixed(2)}
            </h3>
            <button>Checkout</button>
            <button onClick={() => navigate('/books')}>Continue Browsing</button>
        </div>
    );
}

export default CartPage;
