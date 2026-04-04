import { useEffect, useState } from "react";
import{ type Book } from '../types/Book';
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../api/BooksAPI";
import Pagination from './Pagination';
function BookList({selectedCategories}: {selectedCategories: string[]}){

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10); 
    const [pageNum, setPageNum] =useState<number>(1);
    const [, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] =useState<number>(0);
    const navigate =useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadBooks = async () => {
            try {
                setLoading(true);
                const data = await fetchBooks(pageSize, pageNum, selectedCategories);
            setBooks(data.books);
            // setTotalItems(data.totalNumProjects)
            // setTotalPages(Math.ceil(totalItems / pageSize));
            const count = data.totalNumBooks || 0; 
            setTotalItems(count);
            const pages = Math.ceil(count / pageSize);
            setTotalPages(pages);
        }
        catch (error) {
            setError((error as Error).message)
        } finally {
            setLoading(false);
        }
        };

        loadBooks();


    }, [pageSize, pageNum, selectedCategories]); 
    if (loading) return <p>Loading projects...</p>
    if (error) return <p className='text-red-500'>Error: {error}</p>;

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
                    onClick={()=> navigate(`/buy/${b.bookID}`) }>Buy</button>
                </div>

                
            </div>
        
        )}
        <Pagination
            currentPage = {pageNum}
            totalPages = {totalPages}
            pageSize = {pageSize}
            onPageChange = {setPageNum}
            onPageSizeChange = {(newSize) => {
            setPageSize(newSize);
            setPageNum(1);
            }}
            />
        
        </>

    );
}

export default BookList;