import React from 'react'
import { Route, Link } from 'react-router-dom';
import './App.css'
import Search from './Search'
import BookShelf from './BookShelf'
import * as BooksAPI from './BooksAPI'

class BooksApp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      books: []
    }
  }

  componentWillMount() {
    BooksAPI.getAll()
      .then((books) => {

        this.setState((currentState) => ({
          books: currentState.books.concat(books)
        }))
      });
  }

  handleChange = (bk) => {
    this.setState((currentState) => ({
      books: [...currentState.books.filter(book => book.id !== bk.id), bk]
    }))

    // Execute the server side update
    BooksAPI.update(bk, bk.shelf);

  }

  render() {
    return (
      <div>
        <Route path="/search" render={() => (
          <Search
            books={this.state.books}
            handleChange={this.handleChange}
          />
        )} />

        <Route exact path="/" render={() => (
          <div>
            <div className="list-books-content">
              {
                <div className="list-books">
                  <div className="list-books-title">
                    <h1>MyReads</h1>
                  </div>

                  <div>
                    {
                      this.props.shelves.map(shelf => (
                        <BookShelf
                          key={shelf.name}
                          books={this.state.books.filter(book => book.shelf === shelf.name)}
                          handleChange={this.handleChange}
                          name={shelf.title}
                        />
                      ))
                    }
                  </div>
                </div>
              }
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

BooksApp.defaultProps = {
  shelves: [{
    title: "Currently Reading",
    name: "currentlyReading"
  }, {
    title: "Want To Read",
    name: "wantToRead"
  }, {
    title: "Read",
    name: "read"
  }]
}

export default BooksApp


