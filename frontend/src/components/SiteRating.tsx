import { useState } from "react";

const STORAGE_KEY = "siteRating";

function SiteRating() {
    const [rating, setRating] = useState<number>(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? Number(saved) : 0;
    });

    const choose = (n: number) => {
        setRating(n);
        sessionStorage.setItem(STORAGE_KEY, String(n));
    };

    return (
        <div className="position-fixed bottom-0 start-0 p-3 bg-light border rounded-top">
            <div className="small text-muted mb-1">Rate this site (1–5)</div>
            <div className="btn-group" role="group">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        className={
                            n <= rating && rating > 0
                                ? "btn btn-warning btn-sm"
                                : "btn btn-outline-secondary btn-sm"
                        }
                        onClick={() => choose(n)}
                    >
                        {n} ★
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SiteRating;
