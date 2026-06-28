import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import MainLayout from '@/layouts/MainLayout'
import AppRoutes from '@/routes/AppRoutes'
import LoadingScreen from '@/components/layout/LoadingScreen'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Provider store={store}>
      <BrowserRouter>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </Provider>
  )
}
