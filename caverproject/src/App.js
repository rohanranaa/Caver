import React from 'react'
import Nav from '../src/component/Nav.js'
import Home from '../src/component/Home.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './component/Signup.js'
import Services from './component/Services.js'
import Blog from './component/Blog.js'
import About from './component/About.js'
import Contact from './component/Contact.js'
import Button from './component/Button.js'
function App() {
  return (
   <>
    <BrowserRouter>
    <Nav/>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/services' element={<Services/>}></Route>
      <Route path='/Signup' element={<Signup/>}></Route>
      <Route path='/blog' element={<Blog/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/contact' element={<Contact/>}></Route>
      <Route path='/button' element={<Button/>}></Route>
    </Routes>
    </BrowserRouter>
   </>
  )
}
export default App