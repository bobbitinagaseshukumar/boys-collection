import { createSlice } from '@reduxjs/toolkit'

const DEMO_USER = {
  id: 'usr_stylex_001',
  name: 'Arjun Malhotra',
  email: 'arjun@stylex.in',
  phone: '+91 98765 43210',
  avatar: '/images/avatar-demo.jpg',
  address: {
    line1: '42, MG Road',
    line2: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  },
  orders: 12,
  memberSince: '2024',
  tier: 'Gold',
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  otpSent: false,
  otpVerified: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload ?? DEMO_USER
      state.isAuthenticated = true
      state.isLoading = false
      state.otpSent = false
      state.otpVerified = false
    },

    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.otpSent = false
      state.otpVerified = false
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload
    },

    setOtpSent: (state, action) => {
      state.otpSent = action.payload
    },

    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload
    },

    loginDemo: (state) => {
      state.user = DEMO_USER
      state.isAuthenticated = true
      state.isLoading = false
      state.otpSent = false
      state.otpVerified = false
    },
  },
})

export const { setUser, logout, setLoading, setOtpSent, setOtpVerified, loginDemo } =
  authSlice.actions

// Selectors
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectOtpSent = (state) => state.auth.otpSent
export const selectOtpVerified = (state) => state.auth.otpVerified

export default authSlice.reducer
