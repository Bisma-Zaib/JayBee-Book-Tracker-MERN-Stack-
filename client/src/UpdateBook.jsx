import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'

function UpdateBook (){
  const {id} = useParams()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')
  const [genre, setGenre] = useState('')
  const [isbn, setIsbn] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()

   useEffect(() => {
    axios.get('http://localhost:3001/api/books/'+id)
      .then(result =>{
         console.log(result)
         setTitle(result.data.title)
         setAuthor(result.data.author)
         setYear(result.data.year)
         setGenre(result.data.genre)
         setIsbn(result.data.isbn)
         setDescription(result.data.description)
        })
      .catch(err => console.log(err));
  }, [id]);

  const Update = (e) => {
  e.preventDefault();
    axios.put("http://localhost:3001/api/books/"+id, {
      title, 
      author, 
      year, 
      genre, 
      isbn, 
      description
    })
    .then(result =>{
      console.log(result)
      navigate('/')
    })
    .catch(err => console.log(err))  
  }

  return (
     <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className='w-50 bg-white rounded p-4 shadow'>
        <form onSubmit={Update}>
          <h2 className="text-primary mb-4">Update Book</h2>
          
          <div className='mb-3'>
            <label className="form-label">Title *</label>
            <input type="text" placeholder='Enter Book Title' className='form-control'
            value={title} onChange={(e) => setTitle(e.target.value)} required/>
          </div>
          
          <div className='mb-3'>
            <label className="form-label">Author *</label>
            <input type="text" placeholder='Enter Author Name' className='form-control'
            value={author} onChange={(e) => setAuthor(e.target.value)} required/>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Publication Year</label>
              <input type="number" placeholder='Enter Year' className='form-control'
              value={year} onChange={(e) => setYear(e.target.value)}/>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Genre</label>
              <input type="text" placeholder='Enter Genre' className='form-control'
              value={genre} onChange={(e) => setGenre(e.target.value)}/>
            </div>
          </div>

          <div className='mb-3'>
            <label className="form-label">ISBN</label>
            <input type="text" placeholder='Enter ISBN' className='form-control'
            value={isbn} onChange={(e) => setIsbn(e.target.value)}/>
          </div>

          <div className='mb-3'>
            <label className="form-label">Description</label>
            <textarea placeholder='Enter Book Description' className='form-control' rows="3"
            value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn btn-warning">Update Book</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateBook;