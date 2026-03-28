import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import type { CartItem } from "../types/CartItem";

function BuyPage() {
    const navigate = useNavigate();
    const {title, bookID} = useParams();
    const {addToCart} = useCart();
    const [price, setPrice] = useState<number>(0);

    const handleAddToCart = () =>  {
        const newItem: CartItem = {
            bookID: Number(bookID),
            title: title || "No book found",
            price}
            addToCart(newItem);
            navigate('/cart');
        }
    
    return (

        <>
        
        <WelcomeBand/>
        <h2>Buy books: {title}</h2>

        <div>
            <input type='number' 
            placeholder="Enter purchase amount" 
            value= {price} 
            onChange={(x) => setPrice(Number(x.target.value))} />
            <button onClick={handleAddToCart}>Add to Cart</button>
            
        </div>
        <button onClick={(()=> navigate('/books'))}>Go Back</button>
        
        </>
    );
}
export default BuyPage;