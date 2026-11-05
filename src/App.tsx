import { BrowserRouter } from 'react-router'
import { AppRoutes } from './routes/AppRoutes.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
