import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api'

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.searchQuery) queryParams.append('search', filters.searchQuery)
      if (filters.priceRange) {
        queryParams.append('minPrice', filters.priceRange[0])
        queryParams.append('maxPrice', filters.priceRange[1])
      }
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)

      const response = await api.get(`/api/products?${queryParams.toString()}`)
      return response.products || response.data || response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${slug}`)
      return response.product || response.data || response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/categories')
      return response.categories || response.data || response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  items: [],
  filteredItems: [],
  categories: [],
  selectedProduct: null,
  filters: {
    category: '',
    priceRange: [0, 15000],
    sortBy: 'featured',
    searchQuery: '',
  },
  isLoading: false,
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [0, 15000],
        sortBy: 'featured',
        searchQuery: '',
      }
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        const products = Array.isArray(action.payload) ? action.payload : action.payload.products || []
        state.items = products
        state.filteredItems = products
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch single product by slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoading = true
        state.selectedProduct = null
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload) ? action.payload : action.payload.categories || []
      })
  },
})

export const { setFilters, resetFilters, setSearchQuery } = productSlice.actions

// Selectors
export const selectAllProducts = (state) => state.products.items
export const selectFilteredProducts = (state) => state.products.filteredItems
export const selectSelectedProduct = (state) => state.products.selectedProduct
export const selectProductFilters = (state) => state.products.filters
export const selectProductsLoading = (state) => state.products.isLoading
export const selectCategories = (state) => state.products.categories

export default productSlice.reducer
