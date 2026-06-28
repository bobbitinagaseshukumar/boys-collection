import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api'

// Helper to map DB cart item structure to Frontend UI structure
const normalizeCartItem = (dbItem) => ({
  id: dbItem.product.id || dbItem.productId,
  cartItemId: dbItem.id,
  name: dbItem.product.title || dbItem.product.name,
  price: dbItem.product.price,
  image: dbItem.product.images?.[0]?.url || dbItem.product.image || '/images/placeholder.jpg',
  size: dbItem.size,
  color: dbItem.color,
  quantity: dbItem.quantity,
})

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      if (!auth.isAuthenticated) return []
      const response = await api.get('/api/cart')
      const items = response.data || response
      return items.map(normalizeCartItem)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addToCartDb = createAsyncThunk(
  'cart/add',
  async (itemData, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState()
      if (!auth.isAuthenticated) return itemData // Local fallback handled in reducer

      await api.post('/api/cart', {
        productId: itemData.id,
        size: itemData.size,
        color: itemData.color,
        quantity: itemData.quantity || 1,
      })
      dispatch(fetchCart())
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateQuantityDb = createAsyncThunk(
  'cart/updateQty',
  async (itemData, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState()
      if (!auth.isAuthenticated) return itemData

      const { cart } = getState()
      const cartItem = cart.items.find(
        (i) => i.id === itemData.id && i.size === itemData.size && i.color === itemData.color
      )

      if (cartItem && cartItem.cartItemId) {
        await api.put(`/api/cart/${cartItem.cartItemId}`, {
          quantity: itemData.quantity,
        })
        dispatch(fetchCart())
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const removeFromCartDb = createAsyncThunk(
  'cart/remove',
  async (itemData, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState()
      if (!auth.isAuthenticated) return itemData

      const { cart } = getState()
      const cartItem = cart.items.find(
        (i) => i.id === itemData.id && i.size === itemData.size && i.color === itemData.color
      )

      if (cartItem && cartItem.cartItemId) {
        await api.delete(`/api/cart/${cartItem.cartItemId}`)
        dispatch(fetchCart())
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const syncCartWithDb = createAsyncThunk(
  'cart/sync',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth, cart } = getState()
      if (!auth.isAuthenticated || cart.items.length === 0) return

      // Merge local cart to database
      const itemsToMerge = cart.items.map((item) => ({
        productId: item.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }))

      await api.post('/api/cart/merge', { cartItems: itemsToMerge })
      dispatch(fetchCart())
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

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
  isLoading: false,
  error: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        recalculateTotals(state)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => state.cart.totalAmount
export const selectCartCount = (state) => state.cart.totalItems

export default cartSlice.reducer
