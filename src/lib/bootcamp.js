'use client';

import { authService } from './auth';

const API = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const bootcampService = {
  async listEvents() {
    const res = await fetch(`${API()}/bootcamp/events`, {
      cache: 'no-store',
    }).catch(() => null);
    if (!res?.ok) return { success: false, events: [] };
    const data = await res.json().catch(() => ({}));
    return { success: true, events: data.events || [] };
  },

  async getEventBySlug(slug) {
    const res = await fetch(`${API()}/bootcamp/events/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    }).catch(() => null);
    if (!res?.ok) return { success: false, error: 'Not found' };
    const data = await res.json().catch(() => ({}));
    if (!data.event) return { success: false, error: 'Not found' };
    return { success: true, event: data.event };
  },

  async myRegistrations() {
    const token = authService.getToken();
    if (!token) return { success: false, registrations: [] };
    const res = await fetch(`${API()}/bootcamp/my-registrations`, {
      headers: authService.getAuthHeaders(),
      cache: 'no-store',
    }).catch(() => null);
    if (!res?.ok) return { success: false, registrations: [] };
    const data = await res.json().catch(() => ({}));
    return { success: true, registrations: data.registrations || [] };
  },

  async registrationStatus(slug) {
    const token = authService.getToken();
    if (!token) return { success: true, registered: false };
    const res = await fetch(`${API()}/bootcamp/events/${encodeURIComponent(slug)}/me`, {
      headers: authService.getAuthHeaders(),
      cache: 'no-store',
    }).catch(() => null);
    if (!res?.ok) return { success: false, registered: false };
    const data = await res.json().catch(() => ({}));
    return { success: true, registered: !!data.registered };
  },

  async register(slug) {
    const token = authService.getToken();
    if (!token) return { success: false, error: 'Please sign in to register' };
    const res = await fetch(`${API()}/bootcamp/events/${encodeURIComponent(slug)}/register`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
    }).catch(() => null);
    if (!res?.ok) return { success: false, error: 'Registration failed or backend offline' };
    const data = await res.json().catch(() => ({}));
    return { success: true, message: data.message };
  },

  async getUpdates(slug) {
    const token = authService.getToken();
    if (!token) return { success: false, error: 'Sign in required', updates: [] };
    const res = await fetch(`${API()}/bootcamp/events/${encodeURIComponent(slug)}/updates`, {
      headers: authService.getAuthHeaders(),
      cache: 'no-store',
    }).catch(() => null);
    if (!res?.ok) return { success: false, error: 'Failed to load updates', updates: [] };
    const data = await res.json().catch(() => ({}));
    return { success: true, updates: data.updates || [] };
  },
};
