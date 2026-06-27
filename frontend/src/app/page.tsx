import React from 'react'
import { useNavigate } from 'react-router-dom'
import LoginPage from './login/login-page'
export default function Home() {
  const navigate = useNavigate()
  return <LoginPage onLoginSuccess={() => navigate('/dashboard')} />
}
