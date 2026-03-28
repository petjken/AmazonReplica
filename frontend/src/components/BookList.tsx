import { useEffect, useState } from "react";
import{ type Book } from '../types/Book';
import { useNavigate } from "react-router-dom";

function BookList({selectedCategories}: {selectedCategories: string[]}){

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10); 
    const [pageNum, setPageNum] =useState<number>(1);
    const [, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] =useState<number>(0);
    const [sort, setSort] = useState<string>("title_asc");
    const navigate =useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            const categoryParams = selectedCategories
            .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
            .join('&')

            const response = await fetch(
                `https://localhost:5000/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sort=${sort}${selectedCategories.length ? `&${categoryParams}` : ''}`
            );
            const data = await response.json();
            setBooks(data.books);
            // setTotalItems(data.totalNumProjects)
            // setTotalPages(Math.ceil(totalItems / pageSize));
            const count = data.totalNumBooks || 0; 
            setTotalItems(count);
            const pages = Math.ceil(count / pageSize);
            setTotalPages(pages);

        };

        fetchBooks();
    }, [pageSize, pageNum, sort, selectedCategories]); 

    return(
        <>
        
        <br/>
        {books.map((b) =>
            <div id="bookCard" className="card" key={b.bookID}>
                <h3 className="card-title">{b.title}</h3>
                <div className="card-body">
                    <ul className = "list-unstyled">
                        <li><strong>Author:</strong> {b.author} </li>
                        <li><strong>Publisher:</strong> {b.publisher}</li>
                        <li><strong>ISBN:</strong> {b.isbn}</li>
                        <li><strong>Classification:</strong> {b.classification}</li>
                        <li><strong>Category:</strong> {b.category}</li>
                        <li><strong>Page Count:</strong> {b.pageCount}</li>
                        <li><strong>Price:</strong> {b.price}</li>
                    </ul>   

                    <button className='btn btn-success' 
                    onClick={()=> navigate(`/buy/${b.title}/${b.bookID}`) }>Buy</button>
                </div>

            
            </div>
        )}

        <button disabled={pageNum ===1} onClick ={() => setPageNum(pageNum -1)}>Previous</button>

        {
            [...Array(totalPages)].map((_, index) => (
                <button key={index +1} onClick={() => setPageNum(index +1)} disabled={pageNum ===(index +1)}>
                    {index+1}
                    </button> 
            ))}

        <button 
        disabled={pageNum=== totalPages} 
        onClick={() => setPageNum(pageNum +1)}>Next</button>
        <br/>
        <label>
            Results per page:
            <select value={pageSize} 
            onChange={(b) => {
                setPageSize(Number(b.target.value));
                setPageNum(1);
                }}
                >
            
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
            <label className="ms-4 me-2">Sort by:</label>
                <select 
                    className="form-select w-auto" 
                    value={sort} 
                    onChange={(e) => {
                        setSort(e.target.value);
                        setPageNum(1); // Reset to page 1
                    }}
                >
                    <option value="title_asc">Title (A-Z)</option>
                    <option value="title_desc">Title (Z-A)</option>
                </select>
            </label>
        </>

    );
}

export default BookList;