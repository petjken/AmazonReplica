import { Link, useLocation } from "react-router-dom";

function ShopBreadcrumb() {
    const { pathname } = useLocation();

    const onBooks = pathname === "/" || pathname === "/books";
    const onBuy = pathname.startsWith("/buy/");
    const onCart = pathname === "/cart";

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-3">
                <li
                    className={`breadcrumb-item${onBooks ? " active" : ""}`}
                    aria-current={onBooks ? "page" : undefined}
                >
                    {onBooks ? "Books" : <Link to="/books">Books</Link>}
                </li>
                {onBuy && (
                    <li
                        className="breadcrumb-item active"
                        aria-current="page"
                    >
                        Buy
                    </li>
                )}
                {onCart && (
                    <li
                        className="breadcrumb-item active"
                        aria-current="page"
                    >
                        Cart
                    </li>
                )}
            </ol>
        </nav>
    );
}

export default ShopBreadcrumb;
