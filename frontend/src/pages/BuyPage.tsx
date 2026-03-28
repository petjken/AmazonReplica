import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import ShopBreadcrumb from "../components/ShopBreadcrumb";
import DiscountProgressBar from "../components/DiscountProgressBar";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { CartItem } from "../types/CartItem";
import type { Book } from "../types/Book";

function BuyPage() {
    const navigate = useNavigate();
    const { bookID } = useParams();
    const { addToCart } = useCart();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!bookID) {
            setLoading(false);
            return;
        }

        const loadBook = async () => {
            setLoading(true);
            setBook(null);
            try {
                const response = await fetch(
                    `https://localhost:5000/Books/${bookID}`
                );
                if (!response.ok) {
                    return;
                }
                const data = (await response.json()) as Record<string, unknown>;
                const id = Number(data.bookID ?? data.BookID);
                const title = String(data.title ?? data.Title ?? "");
                const price = Number(data.price ?? data.Price);
                if (!Number.isFinite(id) || !Number.isFinite(price)) {
                    return;
                }
                setBook({
                    bookID: id,
                    title,
                    author: String(data.author ?? data.Author ?? ""),
                    publisher: String(data.publisher ?? data.Publisher ?? ""),
                    isbn: String(data.isbn ?? data.ISBN ?? ""),
                    classification: String(
                        data.classification ?? data.Classification ?? ""
                    ),
                    category: String(data.category ?? data.Category ?? ""),
                    pageCount: Number(data.pageCount ?? data.PageCount ?? 0),
                    price,
                });
            } catch {
                setBook(null);
            } finally {
                setLoading(false);
            }
        };

        loadBook();
    }, [bookID]);

    const handleAddToCart = () => {
        if (!book) return;

        const newItem: CartItem = {
            bookID: book.bookID,
            title: book.title,
            quantity: 1,
            unitPrice: book.price,
        };
        addToCart(newItem);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate("/cart");
    };

    return (
        <>
            <div className="container mt-4">
                <ShopBreadcrumb />
                <DiscountProgressBar />
                <WelcomeBand />
                <h2>
                    {book ? `Buy books: ${book.title}` : "Buy books"}
                </h2>

                <div>
                    {loading && <p>Loading book…</p>}
                    {!loading && !book && <p>Could not load this book.</p>}
                    {book && (
                        <>
                            <p>
                                <strong>Price:</strong> $
                                {book.price.toFixed(2)}
                            </p>
                            <button type="button" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </>
                    )}
                </div>
                <button onClick={() => navigate("/books")}>Go Back</button>
            </div>

            {showModal && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex={-1}
                        role="dialog"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <p className="mb-0">
                                        Good Choice! That&apos;s my favorite
                                        book!
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleModalClose}
                                    >
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
