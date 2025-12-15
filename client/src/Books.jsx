import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Books() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    genre: 'All',
    status: 'All',
    sortBy: 'newest'
  });
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, [filters]);

  const fetchBooks = () => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.genre !== 'All') params.append('genre', filters.genre);
    if (filters.status !== 'All') params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    axios.get(`http://localhost:3001/api/books?${params}`)
      .then(result => {
        setBooks(result.data);
      })
      .catch(err => console.log(err));
  };

  const fetchStats = () => {
    axios.get('http://localhost:3001/api/stats/stats')
      .then(result => {
        setStats(result.data);
      })
      .catch(err => console.log(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      axios.delete('http://localhost:3001/api/books/'+id)
      .then(res => {
        fetchBooks();
        fetchStats();
      })
      .catch(err => console.log(err));
    }
  };

  const updateReadingStatus = (bookId, newStatus) => {
    axios.put(`http://localhost:3001/api/stats/${bookId}/status`, {
      readingStatus: newStatus
    })
    .then(res => {
      fetchBooks();
      fetchStats();
    })
    .catch(err => console.log(err));
  };

  const handleLogout = () => {
    logout();
  };


const genres = ['All', 'Fiction', 'Non-Fiction', 'Romance', 'Thriller', 'Mystery', 
  'Science Fiction', 'Fantasy', 'Biography', 'Self-Help', 'Young Adult', 
  'Children', 'Classic', 'Horror', 'Historical', 'Poetry', 'Comedy', 
  'Rom-Com', 'Drama', 'Adventure', 'Other'];
    const statuses = ['All', 'Want to Read', 'Currently Reading', 'Completed'];

  return (
    <div className="d-flex vh-100 bg-light">
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <nav className="navbar navbar-girly">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">
              <i className="bi bi-book-half me-2"></i>
               JayBee Book Tracker
            </span>

            <div className="d-flex align-items-center">
          
            {/* <Link to = "/profile" className="btn btn-outline-light btn-sm me-2">
             <i className="bi bi-person"></i> Profile
              
             </Link> */}
        
              <span className="text-white me-3">Welcome, {user?.name}!
                <i className="bi bi-stars ms-2"></i>
              </span>

              <button 
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          <div className="container-fluid">
            {/* Stats Overview */}
            {stats && (
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="stats-card">
                    <div className="stats-number">{stats.totalBooks}</div>
                    <div className="stats-label">Total Books</div>
                  </div>
                </div>
                {stats.statusStats.map(stat => (
                  <div key={stat._id} className="col-md-3 mb-3">
                    <div className="stats-card">
                      <div className="stats-number">{stat.count}</div>
                      <div className="stats-label">{stat._id}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

                    {/* Filters Section */}
        <div className="filters-section">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Search Books</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by title, author..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <div className="col-md-2">
              <label className="form-label">Genre</label>
              <select
                className="form-select"
                value={filters.genre}
                onChange={(e) => setFilters({...filters, genre: e.target.value})}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="col-md-1">
              <label className="form-label">Sort By</label>
              <select
                className="form-select"
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="newest">Newest First</option>
                <option value="title">Title A-Z</option>
                <option value="author">Author A-Z</option>
                <option value="year">Publication Year</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="col-md-1">
              <label className="form-label">View</label>
              <div className="btn-group w-100">
                <button
                  className={`btn btn-sm ${view === 'grid' ? 'btn-girly-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setView('grid')}
                >
                  <i className="bi bi-grid"></i>
                </button>
                <button
                  className={`btn btn-sm ${view === 'list' ? 'btn-girly-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setView('list')}
                >
                  <i className="bi bi-list"></i>
                </button>
              </div>
            </div>

            <div className="col-md-1">
              <Link to="/create" className='btn btn-girly-success w-100'>
                <i className="bi bi-plus-circle me-2"></i>
                Add Book
              </Link>
            </div>

            <div className="col-md-2">
              <Link to="/discover" className='btn btn-girly-primary w-100'>
                <i className="bi bi-search me-2"></i>
                Discover Books
              </Link>
            </div>
            
          </div>
        </div>

         

            {/* Books Display */}
            {view === 'grid' ? (
              // Grid View
              <div className="row">
                {books.length > 0 ? (
                  books.map((book) => (
                    <div key={book._id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                      <BookCard 
                        book={book} 
                        onUpdateStatus={updateReadingStatus}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center text-muted py-5">
                    <i className="bi bi-book display-1"></i>
                    <h4 className="mt-3">No books found</h4>
                    <p>Try adjusting your filters or add some books!</p>
                    <Link to="/create" className='btn btn-girly-primary mt-2'>
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Your First Book
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              // List View
              <div className="table-responsive">
                <table className='table table-girly'>
                  <thead>
                    <tr>
                      <th>Cover</th>
                      <th>Title & Author</th>
                      <th>Genre</th>
                      <th>Year</th>
                      <th>Status</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book._id}>
                        <td>
                          <div className="book-cover-small" style={{width: '50px', height: '70px', background: 'linear-gradient(135deg, var(--tea-pink-light), var(--lavender))', borderRadius: '5px'}}>
                            {book.coverImage ? (
                              <img src={book.coverImage} alt={book.title} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px'}} />
                            ) : (
                              <i className="bi bi-book" style={{fontSize: '1.5rem', color: 'var(--text-light)'}}></i>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{book.title}</strong>
                            <br />
                            <small className="text-muted">{book.author}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-girly">{book.genre}</span>
                        </td>
                        <td>{book.year}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={book.readingStatus}
                            onChange={(e) => updateReadingStatus(book._id, e.target.value)}
                          >
                            <option value="Want to Read">Want to Read</option>
                            <option value="Currently Reading">Currently Reading</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <div className="heart-rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`bi ${i < book.rating ? 'bi-heart-fill' : 'bi-heart'}`}
                              ></i>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link to={`/update/${book._id}`} className='btn btn-girly-warning btn-sm'>
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button 
                              className='btn btn-girly-danger btn-sm'
                              onClick={() => handleDelete(book._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Book Card Component for Grid View
function BookCard({ book, onUpdateStatus, onDelete }) {
  return (
    <div className="book-card">
      <div className="book-cover">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} />
        ) : (
          <i className="bi bi-book"></i>
        )}
      </div>
      <div className="book-card-body">
        <h6 className="card-title">{book.title}</h6>
        <p className="card-text text-muted small mb-2">{book.author}</p>
        
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge badge-girly">{book.genre}</span>
          <span className="text-muted small">{book.year}</span>
        </div>

        <div className="mb-3">
          <select
            className="form-select form-select-sm"
            value={book.readingStatus}
            onChange={(e) => onUpdateStatus(book._id, e.target.value)}
          >
            <option value="Want to Read">Want to Read</option>
            <option value="Currently Reading">Currently Reading</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="heart-rating">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi ${i < book.rating ? 'bi-heart-fill' : 'bi-heart'} ${i < book.rating ? 'text-danger' : 'text-muted'}`}
              ></i>
            ))}
          </div>
          <div className="d-flex gap-1">
            <Link to={`/update/${book._id}`} className='btn btn-girly-warning btn-sm'>
              <i className="bi bi-pencil"></i>
            </Link>
            <button 
              className='btn btn-girly-danger btn-sm'
              onClick={() => onDelete(book._id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Books;