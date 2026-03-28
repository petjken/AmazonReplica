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
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = () =>  {
        const newItem: CartItem = {
            bookID: Number(bookID),
            title: title || "No book found",
            quantity: 1,
            unitPrice: price,
        };
        addToCart(newItem);
        setShowModal(true);
    }

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/cart');
    };
    
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

        {showModal && (
            <>
                <div className="modal fade show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p className="mb-0">Good Choice! That&apos;s my favorite book!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleModalClose}>
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show"></div>
            </>
        )}
        
        </>
    );
}
export default BuyPage;
