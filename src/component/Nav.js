import React from 'react'
import { Link } from 'react-router-dom'
function Nav() {
  return (
    <>
        <header class="text-gray-400 bg-black body-font">
        <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
            <span class="ml-3 text-xl">CAVER</span>
          </Link>
          <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link class="mr-5 hover:text-white text-[18px] font-semibold hover:underline underline-offset-4 decoration-2 decoration-white py-2 rounded-lg px-5" to="/">Home</Link>
            <Link class="mr-5 hover:text-white text-[18px] font-semibold hover:underline underline-offset-4 decoration-2 decoration-white py-2 rounded-lg px-5" to="/services">Services</Link>
            <Link class="mr-5 hover:text-white text-[18px] font-semibold hover:underline underline-offset-4 decoration-2 decoration-white py-2 rounded-lg px-5" to="/blog">Blogs</Link>
            <Link class="mr-5 hover:text-white text-[18px] font-semibold hover:underline underline-offset-4 decoration-2 decoration-white py-2 rounded-lg px-5" to="/about">About</Link>
            <Link class="mr-5 hover:text-white text-[18px] font-semibold hover:underline underline-offset-4 decoration-2 decoration-white py-2 rounded-lg px-5" to="/contact">Contact</Link>
          </nav>
          <Link to="/Signup">
          <button class="inline-flex items-center bg-indigo-900 border-0 py-1 px-3 focus:outline-none hover:bg-gray-900 rounded text-base mt-4 md:mt-0">Sign Up
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
          </Link>
        </div>
      </header>

    </>
  )
}

export default Nav