import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api'

// Helper to map DB wishlist item structure to Frontend UI structure
const normalizeWishlistItem = (dbItem) => ({
  id: dbItem.product.id || dbItem.productId,
  wishlistItemId: dbItem.id,
  name: dbItem.product.title || dbItem.product.name,
  price: dbItem.product.price,
  image: dbItem.product.images?.[0]?.url || dbItem.product.image || '/images/placeholder.jpg',
  brand: dbItem.product.brand,
  slug: dbItem.product.slug,
})

// Async Thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      if (!auth.isAuthenticated) return []
      const response = await api.get('/api/wishlist')
      const items = response.data || response
      return items.map(normalizeWishlistItem)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const toggleWishlistDb = createAsyncThunk(
  'wishlist/toggle',
  async (product, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState()
      if (!auth.isAuthenticated) return product // Local fallback handled in reducer

      await api.post('/api/wishlist/toggle', {
        productId: product.id,
      })
      dispatch(fetchWishlist())
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  items: [],
  isLoading: false,
  error: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist } =
  wishlistSlice.actions

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((item) => item.id === productId)

export default wishlistSlice.reducer
