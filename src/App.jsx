import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import ErrorPage from './Pages/ErrorPage'
import Teams from './Pages/Teams'
import Rankings from './Pages/Rankings'
import Players from './Pages/Players'
function App() {

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/players" element={<Players />} />
        </Routes>
      </BrowserRouter>
    
  )
}

export default App
