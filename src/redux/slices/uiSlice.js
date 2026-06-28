import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isCartDrawerOpen: false,
  isLoading: true,
  cursorVariant: 'default',
  scrollProgress: 0,
  currentPage: 'home',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
      // Close other overlays when mobile menu opens
      if (state.isMobileMenuOpen) {
        state.isSearchOpen = false
        state.isCartDrawerOpen = false
      }
    },

    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen
      // Close other overlays when search opens
      if (state.isSearchOpen) {
        state.isMobileMenuOpen = false
        state.isCartDrawerOpen = false
      }
    },

    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen
      // Close other overlays when cart drawer opens
      if (state.isCartDrawerOpen) {
        state.isMobileMenuOpen = false
        state.isSearchOpen = false
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload
    },

    setCursorVariant: (state, action) => {
      state.cursorVariant = action.payload
    },

    setScrollProgress: (state, action) => {
      state.scrollProgress = action.payload
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },

    closeAllOverlays: (state) => {
      state.isMobileMenuOpen = false
      state.isSearchOpen = false
      state.isCartDrawerOpen = false
    },
  },
})

export const {
  toggleMobileMenu,
  toggleSearch,
  toggleCartDrawer,
  setLoading,
  setCursorVariant,
  setScrollProgress,
  setCurrentPage,
  closeAllOverlays,
} = uiSlice.actions

// Selectors
export const selectIsMobileMenuOpen = (state) => state.ui.isMobileMenuOpen
export const selectIsSearchOpen = (state) => state.ui.isSearchOpen
export const selectIsCartDrawerOpen = (state) => state.ui.isCartDrawerOpen
export const selectIsLoading = (state) => state.ui.isLoading
export const selectCursorVariant = (state) => state.ui.cursorVariant
export const selectScrollProgress = (state) => state.ui.scrollProgress
export const selectCurrentPage = (state) => state.ui.currentPage

export default uiSlice.reducer
