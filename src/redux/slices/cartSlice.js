import { createSlice } from '@reduxjs/toolkit'

const recalculateTotals = (state) => {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  state.totalAmount = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
}

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, size, color } = action.payload
      const existingIndex = state.items.findIndex(
        (item) => item.id === id && item.size === size && item.color === color
      )

      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += action.payload.quantity || 1
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        })
      }

      recalculateTotals(state)
    },

    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload
      state.items = state.items.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color)
      )
      recalculateTotals(state)
    },

    updateQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload
      const item = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      )

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) =>
              !(i.id === id && i.size === size && i.color === color)
          )
        } else {
          item.quantity = quantity
        }
      }

      recalculateTotals(state)
    },

    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
      state.totalItems = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => state.cart.totalAmount
export const selectCartCount = (state) => state.cart.totalItems

export default cartSlice.reducer
