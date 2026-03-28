import { useCart } from "../context/CartContext";

const DISCOUNT_GOAL = 75;

function DiscountProgressBar() {
    const { cart } = useCart();
    const total = cart.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
    );
    const percent = Math.min(
        100,
        Math.round((total / DISCOUNT_GOAL) * 100)
    );

    return (
        <div className="mb-3">
            <label className="form-label mb-1" htmlFor="discount-progress">
                progress to 15% discount on purchase
            </label>
            <div
                id="discount-progress"
                className="progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label="Cart total progress toward discount goal"
            >
                <div className="progress-bar" style={{ width: `${percent}%` }}>
                    {percent}%
                </div>
            </div>
        </div>
    );
}

export default DiscountProgressBar;
