import React, { useState } from 'react'
import Container from '../../Container'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { loading, handleRegister } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      await handleRegister({ username, email, password })
      setSuccess("Account created successfully! Redirecting to login...")
      setTimeout(() => {
        navigate("/")
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.")
    }
  }

  return (
    <Container>
      <h1 className='text-center text-[30px] mb-[20px] font-bold'>Sign Up</h1>
      <div className="flex justify-center w-full">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {error && (
            <div className="alert alert-error mb-4 text-sm py-2 px-3 rounded">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success mb-4 text-sm py-2 px-3 rounded">
              <span>{success}</span>
            </div>
          )}

          <fieldset className="fieldset mb-4">
            <label className="label font-medium" htmlFor="username">Username</label>
            <input 
              onChange={(e) => setUsername(e.target.value)} 
              value={username}
              type="text" 
              id="username" 
              className="input input-bordered w-full" 
              placeholder="Enter your username" 
              required
            />
          </fieldset>

          <fieldset className="fieldset mb-4">
            <label className="label font-medium" htmlFor="email">Email</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              type="email" 
              id="email" 
              className="input input-bordered w-full" 
              placeholder="Enter your email" 
              required
            />
          </fieldset>

          <fieldset className="fieldset mb-4">
            <label className="label font-medium" htmlFor="password">Password</label>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
              type="password" 
              id="password" 
              className="input input-bordered w-full" 
              placeholder="Enter your password" 
              required
            />
          </fieldset>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full my-[15px]"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm">
            Already have an account? <span className='text-primary font-semibold'><Link to="/">Log In</Link></span>
          </p>
        </form>
      </div>
    </Container>
  )
}

export default Register
