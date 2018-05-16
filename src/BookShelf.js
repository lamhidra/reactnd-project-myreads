import React from 'react'
import Book from './Book'

const BookShelf = ({ books, name, handleChange }) => (
    <div className="bookshelf" >
        <h2 className="bookshelf-title">{name}</h2>
        <div className="bookshelf-books">
            <ol className="books-grid">
                {
                    books.map(book => (
                        <li key={book.id}>
                            <Book
                                book={book}
                                handleChange={handleChange}
                            />
                        </li>
                    ))
                }
            </ol>
        </div>
    </div>
)


export default BookShelf;