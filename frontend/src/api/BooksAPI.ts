import type { Book } from "../types/Book";
import { API_BOOKS_BASE } from "../config/api";

interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;

}

const API_URL = API_BOOKS_BASE;
export const fetchBooks = async (
    pageSize: number,
    pageNum: number,
    selectedCategories: string[],
): Promise<FetchBooksResponse> => {
    try {const categoryParams = selectedCategories
        .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
        .join('&')

        const response = await fetch(
            `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`
        );

if (!response.ok) {
    throw new Error('Failed to fetch projects');
}
        return await response.json();

    }
    catch (error) {
        console.error('Error fetching projects: ', error)
        throw error;
    }

};
export const addBook = async (newBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/AddBook`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: 
            JSON.stringify(newBook)
            });

            if(!response.ok) {
                throw new Error('Failed to add book');
            }

            return await response.json();

        } catch (error) {
            console.error('Error adding project', error);
            throw error;
        }  
     };

export const updateBook = async (bookID:number, updatedBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/UpdateBook/${bookID}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: 
            JSON.stringify(updatedBook)
            });

        return await response.json();
    } catch (error) {
        console.error('Error updating book', error);
        throw error;
    }
};

export const deleteBook = async  (bookID: number) : Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/DeleteBook/${bookID}`,
            {
                method: 'DELETE'
            }

        );

        if (!response.ok) {
            throw new Error('Failed to delete book');

        }

    } catch (error) {
        console.error('Error deleting book: ', error)
        throw error;
    }
}