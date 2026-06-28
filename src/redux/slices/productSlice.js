import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  filters: {
    category: '',
    priceRange: [0, 15000],
    sortBy: 'featured',
    searchQuery: '',
  },
  isLoading: false,
}

const applyFilters = (items, filters) => {
  let result = [...items]

  // Category filter
  if (filters.category) {
    result = result.filter(
      (item) =>
        item.category?.toLowerCase() === filters.category.toLowerCase()
    )
  }

  // Price range filter
  const [minPrice, maxPrice] = filters.priceRange
  result = result.filter(
    (item) => item.price >= minPrice && item.price <= maxPrice
  )

  // Search query filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    result = result.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    )
  }

  // Sort
  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      result.sort(
        (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)
      )
      break
    case 'name':
      result.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
      break
    case 'featured':
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      break
  }

  return result
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload
      state.filteredItems = applyFilters(action.payload, state.filters)
      state.isLoading = false
    },

    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredItems = applyFilters(state.items, state.filters)
    },

    resetFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [0, 15000],
        sortBy: 'featured',
        searchQuery: '',
      }
      state.filteredItems = applyFilters(state.items, state.filters)
    },

    filterProducts: (state) => {
      state.filteredItems = applyFilters(state.items, state.filters)
    },

    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload
      state.filteredItems = applyFilters(state.items, state.filters)
    },

    setProductsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  setProducts,
  setSelectedProduct,
  setFilters,
  resetFilters,
  filterProducts,
  setSearchQuery,
  setProductsLoading,
} = productSlice.actions

// Selectors
export const selectAllProducts = (state) => state.products.items
export const selectFilteredProducts = (state) => state.products.filteredItems
export const selectSelectedProduct = (state) => state.products.selectedProduct
export const selectProductFilters = (state) => state.products.filters
export const selectProductsLoading = (state) => state.products.isLoading

export default productSlice.reducer
