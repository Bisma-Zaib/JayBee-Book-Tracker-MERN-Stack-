import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

function ExternalBooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [externalBooks, setExternalBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addedBooks, setAddedBooks] = useState(new Set());

  const searchExternalBooks = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
  `http://localhost:3001/api/external/books?search=${encodeURIComponent(searchQuery)}`
      );
      setExternalBooks(response.data);
      if (response.data.length === 0) {
        setError('No books found. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching external books:', error);
      const errorMessage = error.response?.data?.error || 
                          'Error searching for books. Please try again.';
      setError(errorMessage);
      setExternalBooks([]);
    }
    setLoading(false);
  };

  const addBookToLibrary = async (book) => {
    try {
const response = await axios.post('http://localhost:3001/api/external/add-external-book', book);
      setAddedBooks(new Set([...addedBooks, book.externalId]));
      alert('Book added to your library successfully! 🎉');
    } catch (error) {
      console.error('Error adding book:', error);
      const errorMessage = error.response?.data?.error || 
                          'Error adding book to library. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card-girly p-4">
            <h2 className="text-center mb-4">
              <i className="bi bi-search me-2"></i>
              Discover Books Worldwide 📚
            </h2>
            
            <div className="input-group mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search for books by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && searchExternalBooks()}
              />
              <button 
                className="btn btn-girly-primary btn-lg"
                onClick={searchExternalBooks}
                disabled={loading || !searchQuery.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i>
                    Search
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError('')}
                ></button>
              </div>
            )}

            <div className="row">
              {externalBooks.map((book) => (
                <div key={book.externalId} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                  <div className="book-card h-100">
                    <div className="book-cover">
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div 
                        className="d-flex align-items-center justify-content-center h-100"
                        style={{display: book.coverImage ? 'none' : 'flex'}}
                      >
                        <i className="bi bi-book" style={{fontSize: '3rem', color: 'var(--text-light)'}}></i>
                      </div>
                    </div>
                    <div className="book-card-body">
                      <h6 className="card-title fw-bold">{book.title}</h6>
                      <p className="card-text text-muted small mb-2">
                        <i className="bi bi-person me-1"></i>
                        {book.author}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        {book.year && (
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {book.year}
                          </small>
                        )}
                        <span className="badge badge-girly">{book.genre}</span>
                      </div>

                      <p className="card-text small text-muted mb-3 line-clamp-3">
                        {book.description}
                      </p>

                      <button
                        className={`btn btn-sm w-100 ${
                          addedBooks.has(book.externalId) 
                            ? 'btn-success' 
                            : 'btn-girly-primary'
                        }`}
                        onClick={() => addBookToLibrary(book)}
                        disabled={addedBooks.has(book.externalId)}
                      >
                        {addedBooks.has(book.externalId) ? (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Added to Library ✓
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-circle me-2"></i>
                            Add to My Library
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {externalBooks.length === 0 && searchQuery && !loading && !error && (
              <div className="text-center text-muted py-5">
                <i className="bi bi-book display-1"></i>
                <h4 className="mt-3">No books found</h4>
                <p>Try searching with different keywords</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExternalBooks;