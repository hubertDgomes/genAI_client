import React from 'react'
import { Route, Routes } from 'react-router-dom'
import RootLayout from './components/layouts/RootLayout'
import Login from './components/pages/auth/Login'
import Register from './components/pages/auth/Register'

import Interview from './components/pages/ai/Interview'
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRoute from './components/common/PublicRoute'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route element={<PublicRoute />}>
          <Route index element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Interview />} />
          <Route path='/interview' element={<Interview />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
