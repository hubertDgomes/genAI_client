import React, { useState } from 'react'
import Container from '../../Container'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // If user was redirected here from a protected page, send them back there after login
  const from = location.state?.from?.pathname || "/home"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await handleLogin({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to log in. Please try again.")
    }
  }

  return (
    <Container>
      <h1 className='text-center text-[30px] mb-[20px] font-bold'>Log In</h1>
      <div className="flex justify-center w-full">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {error && (
            <div className="alert alert-error mb-4 text-sm py-2 px-3 rounded">
              <span>{error}</span>
            </div>
          )}

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
            {loading ? "Logging In..." : "Log In"}
          </button>

          <p className="text-center text-sm">
            New here? <span className='text-primary font-semibold'><Link to="/register">Sign Up</Link></span>
          </p>
        </form>
      </div>
    </Container>
  )
}

export default Login

