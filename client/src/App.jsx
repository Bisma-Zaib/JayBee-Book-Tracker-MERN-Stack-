import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Books from "./Books";
import CreateBook from "./CreateBook";
import UpdateBook from "./UpdateBook";
import Login from "./Login";
import Register from "./Register";
import ExternalBooks from "./ExternalBooks";
import { AuthProvider, useAuth } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'
import Profile from './Profile'  



function AppContent() {
  const { user } = useAuth();

  return (
    <div>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path='/' element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        } />
        <Route path='/create' element={
          <ProtectedRoute>
            <CreateBook />
          </ProtectedRoute>
        } />
        <Route path='/update/:id' element={
          <ProtectedRoute>
            <UpdateBook />
          </ProtectedRoute>
        } />
        <Route path='/discover' element={
          <ProtectedRoute>
            <ExternalBooks />
          </ProtectedRoute>
        } />
        {/* <Route path='/profile' element={
        <ProtectedRoute>
          <Profile/>
        </ProtectedRoute>
        }/> */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App