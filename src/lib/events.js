'use client'

import { authService } from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const eventService = {
  // Register for an event
  register: async (eventData) => {
    try {
      const token = authService.getToken()
      if (!token) {
        return { success: false, error: 'Please login to register for events' }
      }

      const response = await fetch(`${API_BASE_URL}/events/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders()
        },
        body: JSON.stringify(eventData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, registration: data.registration }
      } else {
        return { success: false, error: data.error || data.message || 'Registration failed' }
      }
    } catch (error) {
      console.error('Event registration error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  },

  // Get user's event registrations
  getMyRegistrations: async () => {
    try {
      const token = authService.getToken()
      if (!token) {
        return { success: false, error: 'Please login' }
      }

      const response = await fetch(`${API_BASE_URL}/events/my-registrations`, {
        headers: authService.getAuthHeaders()
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, registrations: data.registrations }
      } else {
        return { success: false, error: data.error || 'Failed to get registrations' }
      }
    } catch (error) {
      console.error('Get registrations error:', error)
      return { success: false, error: 'Network error' }
    }
  },

  // Get specific registration
  getRegistration: async (registrationId) => {
    try {
      const token = authService.getToken()
      if (!token) {
        return { success: false, error: 'Please login' }
      }

      const response = await fetch(`${API_BASE_URL}/events/registration/${registrationId}`, {
        headers: authService.getAuthHeaders()
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, registration: data.registration }
      } else {
        return { success: false, error: data.error || 'Registration not found' }
      }
    } catch (error) {
      console.error('Get registration error:', error)
      return { success: false, error: 'Network error' }
    }
  },

  // Cancel registration
  cancelRegistration: async (registrationId) => {
    try {
      const token = authService.getToken()
      if (!token) {
        return { success: false, error: 'Please login' }
      }

      const response = await fetch(`${API_BASE_URL}/events/registration/${registrationId}/cancel`, {
        method: 'PATCH',
        headers: authService.getAuthHeaders()
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, registration: data.registration }
      } else {
        return { success: false, error: data.error || 'Failed to cancel registration' }
      }
    } catch (error) {
      console.error('Cancel registration error:', error)
      return { success: false, error: 'Network error' }
    }
  }
}










