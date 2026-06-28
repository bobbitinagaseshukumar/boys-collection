import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from '@/redux/store'
import MainLayout from '@/layouts/MainLayout'
import AppRoutes from '@/routes/AppRoutes'
import LoadingScreen from '@/components/layout/LoadingScreen'
import { checkAuthStatus, selectIsAuthenticated } from '@/redux/slices/authSlice'
import { fetchProducts, fetchCategories } from '@/redux/slices/productSlice'
import { fetchCart, syncCartWithDb } from '@/redux/slices/cartSlice'
import { fetchWishlist } from '@/redux/slices/wishlistSlice'

function AppInitializer({ children }) {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    dispatch(checkAuthStatus())
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(syncCartWithDb())
      dispatch(fetchCart())
      dispatch(fetchWishlist())
    }
  }, [isAuthenticated, dispatch])

  return children
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Provider store={store}>
      <AppInitializer>
        <BrowserRouter>
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </BrowserRouter>
      </AppInitializer>
    </Provider>
  )
}
