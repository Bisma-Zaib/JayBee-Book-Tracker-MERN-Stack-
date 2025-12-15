import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function CreateBook (){
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')
  const [genre, setGenre] = useState('')
  const [isbn, setIsbn] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const Submit = async (e) => {
    e.preventDefault();
    setError('')
    setLoading(true)

    try {
      const result = await axios.post("http://localhost:3001/api/books", {
        title, 
        author, 
        year: year ? parseInt(year) : undefined, 
        genre, 
        isbn, 
        description
      })
      
      console.log("Book created successfully:", result.data)
      navigate('/')
    } catch (err) {
      console.log("Error creating book:", err)
      setError(err.response?.data?.error || err.response?.data?.details || 'Failed to create book. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className='w-50 bg-white rounded p-4 shadow'>
        <form onSubmit={Submit}>
          <h2 className="text-primary mb-4">Add New Book</h2>
          
          {error && (
            <div className="alert alert-danger">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className='mb-3'>
            <label className="form-label">Title *</label>
            <input 
              type="text" 
              placeholder='Enter Book Title' 
              className='form-control'
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>
          
          <div className='mb-3'>
            <label className="form-label">Author *</label>
            <input 
              type="text" 
              placeholder='Enter Author Name' 
              className='form-control'
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Publication Year</label>
              <input 
                type="number" 
                placeholder='Enter Year' 
                className='form-control'
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                min="1000"
                max={new Date().getFullYear() + 5}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Genre</label>
              <select 
                className='form-select'
                value={genre} 
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Mystery">Mystery</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Biography">Biography</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Rom-Com">Rom-Com</option>
                <option value="Drama">Drama</option>
              </select>
            </div>
          </div>

          <div className='mb-3'>
            <label className="form-label">ISBN</label>
            <input 
              type="text" 
              placeholder='Enter ISBN' 
              className='form-control'
              value={isbn} 
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>

          <div className='mb-3'>
            <label className="form-label">Description</label>
            <textarea 
              placeholder='Enter Book Description' 
              className='form-control' 
              rows="3"
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding...
                </>
              ) : (
                'Add Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBook;