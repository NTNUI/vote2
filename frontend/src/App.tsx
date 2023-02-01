import { useState } from 'react'
import './App.css'
import { Login } from './pages/login'
import { StartPage } from './pages/StartPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectRoutes } from './utils/ProtectedRouter/protectedRoutes'
import { Vote } from './pages/VotePage'
import { QR } from './pages/QRpage'
import { Assembly } from './pages/GenforsDashboard'
import { CheckIn } from './pages/CheckIn'
import { AdminDashboard } from './pages/AdminDashboard'
function App() {
  const [ isAuth, setIsAuth ] = useState("false");

 
    
  const toggle = () => {
    if (isAuth == "false") {
      setIsAuth("true")
    }
    else {
      setIsAuth("false")
    }
    sessionStorage.setItem("Auth", isAuth)
  }

  return (
      isAuth == "true" || isAuth == "" ? <><button onClick={() => toggle()}>Login</button>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectRoutes />}>
          <Route path="/start" element={<StartPage />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/QR" element={<QR />} />
          <Route path='/assemly' element={<Assembly />} />
          <Route path='/CheckIn' element={<CheckIn />} />
          <Route path='/admin' element={<AdminDashboard />} />
        </Route>
      </Routes>

    </BrowserRouter></>
    : <><button onClick={() => toggle()}>Logout</button>
    <a href='/QR'>QR</a>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectRoutes />}>
          <Route path="/start" element={<StartPage />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/QR" element={<QR />} />
          <Route path='/assemly' element={<Assembly />} />
          <Route path='/CheckIn' element={<CheckIn />} />
          <Route path='/admin' element={<AdminDashboard />} />
        </Route>
      </Routes>

    </BrowserRouter></>
  )
}

export default App
