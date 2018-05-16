import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf';
import Loading from './Loading'
import NotFound from './NotFound'
import { Link } from 'react-router-dom';


class Search extends Component {

    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.ajaxCall = this.ajaxCall.bind(this)
        this.ajaxCall = this.debounce(this.ajaxCall, 500)
    }

    state = {
        query: '',
        isLoading: false,
        books: [],
        hasError: false,
        currentBook: {}
    }

    search(searchTerm) {
        searchTerm.persist()

        if (searchTerm.target.value.trim() === '') {
            this.setState((currentState) => ({
                books: [],
                query: searchTerm.target.value,
                isLoading: false,
                hasError: false
            }))

            return;
        }
        this.setState((currentState) => ({
            query: searchTerm.target.value,
            isLoading: true,
            hasError: false
        }))

        this.ajaxCall(searchTerm.target.value)
    }

    ajaxCall = () => {
        BooksAPI
            .search(this.state.query)
            .then(books => {
                if (books) {
                    if (books.error) {
                        this.setState(() => ({
                            books: [],
                            hasError: true,
                            isLoading: false
                        }))
                    } else {
                        this.setState(() => ({
                            books: this.bookFilteredList(books),
                            hasError: false,
                            isLoading: false
                        }))
                    }
                } else {
                    this.setState(() => ({
                        hasError: true,
                        isLoading: false
                    }))
                }

            });
    }

    debounce = (func, wait) => {
        let timeout
        return function (...args) {
            const context = this
            clearTimeout(timeout)
            timeout = setTimeout(() => func.apply(context, args), wait)
        }
    }

    bookFilteredList = (books) => {
        const alreadyInShelf = (bk, query) => ((bk.title && bk.title.toLowerCase().includes(query)) || 
                                        (bk.description && bk.description.toLowerCase().includes(query)))
          
        const filteredBooks = this.props.books.filter(bk => alreadyInShelf(bk, this.state.query));
        const filteredBooksIds = filteredBooks.map(bk => bk.id);

        return books.filter(bk => filteredBooksIds.indexOf(bk.id) === -1)
            .map(bk => ({...bk, shelf: 'none' }))
            .concat(filteredBooks);
    }

    handleChange = (bk) => {
        this.setState((currentState) => ({
            books: [...currentState.books.filter(book => book.id !== bk.id), bk]
        }))
        this.props.handleChange(bk);
    }

    render() {
        return (

            <div>
                <div className="search-books">
                    <div className="search-books-bar">
                        <Link className="close-search" to="/">Close</Link>
                        <div className="search-books-input-wrapper">
                            <input type="text"
                                value={this.state.query}
                                onChange={this.search}
                                placeholder="Search by title or author" />

                        </div>
                    </div>
                    <div className="search-books-results">
                        <ol className="books-grid"></ol>
                    </div>
                </div>
                {
                    !this.state.isLoading && this.state.hasError && <NotFound query={this.state.query} />
                }
                {
                    !this.state.isLoading && this.state.books && this.state.books.length > 0
                    && (<BookShelf handleChange={this.handleChange} name="Search" books={this.state.books} />)
                }
                {
                    this.state.isLoading && !this.state.hasError && <Loading />
                }
            </div>
        )
    }
}

export default Search;
