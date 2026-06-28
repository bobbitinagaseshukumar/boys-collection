import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.some((item) => item.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    toggleWishlist: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      )
      if (index !== -1) {
        state.items.splice(index, 1)
      } else {
        state.items.push(action.payload)
      }
    },
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist } =
  wishlistSlice.actions

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((item) => item.id === productId)

export default wishlistSlice.reducer
