import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppContextProvider } from './contexts/AppContext.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  }
})

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  </BrowserRouter>
)
