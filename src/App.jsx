import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import LiveScores from './Pages/LiveScores'
import ErrorPage from './Pages/ErrorPage'

function App() {

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live-scores" element={<LiveScores />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    
  )
}

export default App
