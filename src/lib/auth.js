'use client'

import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const authService = {
  // Get stored token
  getToken: () => {
    const cookieToken = Cookies.get('auth_token')
    if (cookieToken) return cookieToken
    if (typeof window !== 'undefined') {
      const lsToken = localStorage.getItem('authToken')
      if (lsToken) return lsToken
    }
    return undefined
  },

  // Set token
  setToken: (token, remember = false) => {
    const options = remember 
      ? { expires: 30, secure: true, sameSite: 'strict' } 
      : { expires: 1, secure: true, sameSite: 'strict' }
    
    try { Cookies.set('auth_token', token, options) } catch {}
    try { localStorage.setItem('authToken', token) } catch {}
  },

  // Remove token
  removeToken: () => {
    try { Cookies.remove('auth_token') } catch {}
    try { localStorage.removeItem('authToken') } catch {}
    try { localStorage.removeItem('userData') } catch {}
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!authService.getToken()
  },

  // Get auth headers for API requests
  getAuthHeaders: () => {
    const token = authService.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const token = authService.getToken()
      if (!token) return false

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        authService.setToken(data.access_token)
        return true
      } else {
        authService.removeToken()
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      authService.removeToken()
      return false
    }
  },

  // Login with credentials
  login: async (email, password, remember = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, remember_me: remember })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        authService.setToken(data.access_token, remember)
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user))
        }
        return { success: true, user: data.user, token: data.access_token }
      } else {
        return { success: false, error: data.error || data.message || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || data.message || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  },

  // Complete registration with OTP
  completeRegistration: async (email, otpCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp_code: otpCode })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.access_token) {
          authService.setToken(data.access_token)
        }
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user))
        }
        return { success: true, user: data.user, token: data.access_token }
      } else {
        return { success: false, error: data.error || data.message || 'Verification failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  },

  // Resend OTP
  resendOTP: async (email, otpType = 'registration') => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/otp/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp_type: otpType })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || data.message || 'Failed to resend OTP' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  },

  // Logout
  logout: async () => {
    try {
      const token = authService.getToken()
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: authService.getAuthHeaders()
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      authService.removeToken()
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = authService.getToken()
      if (!token) return null

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: authService.getAuthHeaders()
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.user) {
          localStorage.setItem('userData', JSON.stringify(result.user))
          return result.user
        }
      }
      authService.removeToken()
      return null
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }
}
