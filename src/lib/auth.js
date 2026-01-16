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
  getAuthHeaders: (includeContentType = true) => {
    const token = authService.getToken()
    const headers = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    // Only include Content-Type if not FormData (browser will set it automatically with boundary)
    if (includeContentType) {
      headers['Content-Type'] = 'application/json'
    }
    return headers
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
  register: async (userData, profilePicture = null) => {
    try {
      const formData = new FormData();
      
      // Add all user data fields
      Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });
      
      // Add profile picture if provided
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      const response = await fetch(`${API_BASE_URL}/auth/register/initiate`, {
        method: 'POST',
        headers: authService.getAuthHeaders(false), // Don't set Content-Type, let browser set it with boundary for FormData
        body: formData
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

      let response
      try {
        // Create abort controller for timeout handling
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: authService.getAuthHeaders(),
          signal: controller.signal
        }).catch((fetchError) => {
          clearTimeout(timeoutId)
          // Catch fetch errors immediately
          if (fetchError.name === 'TypeError' || 
              fetchError.name === 'AbortError' ||
              fetchError.message?.includes('fetch') || 
              fetchError.message?.includes('Failed to fetch')) {
            // Network error - return a special marker
            return { _networkError: true, error: fetchError }
          }
          throw fetchError
        })
        
        // Clear timeout on successful fetch
        clearTimeout(timeoutId)
        
        // Check if fetch returned a network error marker
        if (response && response._networkError) {
          // Try cached data
          try {
            const cachedUser = localStorage.getItem('userData')
            if (cachedUser) {
              return JSON.parse(cachedUser)
            }
          } catch (e) {
            // Ignore parse errors
          }
          // Return null but don't remove token - might be temporary network issue
          return null
        }
      } catch (fetchError) {
        // Fetch failed (network error, CORS, etc.)
        if (fetchError.name === 'TypeError' || 
            fetchError.name === 'AbortError' ||
            fetchError.message?.includes('fetch') || 
            fetchError.message?.includes('Failed to fetch')) {
          // Network error - try cached data
          try {
            const cachedUser = localStorage.getItem('userData')
            if (cachedUser) {
              return JSON.parse(cachedUser)
            }
          } catch (e) {
            // Ignore parse errors
          }
          // Return null but don't remove token - might be temporary network issue
          return null
        }
        throw fetchError // Re-throw if it's not a network error
      }

      if (response && response.ok) {
        const result = await response.json()
        if (result.success && result.user) {
          localStorage.setItem('userData', JSON.stringify(result.user))
          return result.user
        }
      }
      
      // Only remove token if it's an auth error (401/403), not network error
      if (response && response.status && (response.status === 401 || response.status === 403)) {
        authService.removeToken()
      }
      return null
    } catch (error) {
      // Handle any other errors
      if (error.name === 'TypeError' && (error.message?.includes('fetch') || error.message?.includes('Failed to fetch'))) {
        // Network error - try cached data
        try {
          const cachedUser = localStorage.getItem('userData')
          if (cachedUser) {
            return JSON.parse(cachedUser)
          }
        } catch (e) {
          // Ignore parse errors
        }
        return null
      }
      console.error('Error fetching current user:', error)
      return null
    }
  },

  // Forgot password - Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, message: data.message || 'Password reset link sent to your email' }
      } else {
        return { success: false, error: data.error || data.message || 'Failed to send password reset email' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  },

  // Reset password - Verify token and update password
  resetPassword: async (email, token, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, token, new_password: newPassword })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, message: data.message || 'Password reset successfully' }
      } else {
        return { success: false, error: data.error || data.message || 'Failed to reset password' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }
}
