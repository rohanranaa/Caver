import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
export default function Signup() {
  const navigate=useNavigate()
  const[state,setState]=useState({fname:"", lname:"",email:"",password:"",phno:""})
  const change=(e)=>{
    const {name,value}=e.target
    setState({...state,[name]:value})
}
const signupbtn=(e)=>{
  e.preventDefault()
  axios.post("https://caver-cabs.herokuapp.com/signup",state).then(resp=>{
    alert(resp.data.message)
      navigate('/')
  })
}
  return (
    <>
        <section class="text-gray-400 bg-black body-font">
    <div class="container px-5 py-24 mx-auto flex flex-wrap items-center">
      <div class="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
        <h1 class="title-font font-medium text-3xl text-white">Become our caver member by Sign In</h1>
        <p class="leading-relaxed mt-4">Poke slow-carb mixtape knausgaard, typewriter street art gentrify hammock starladder roathse. Craies vegan tousled etsy austin.</p>
      </div>
      <div class="lg:w-2/6 md:w-1/2 bg-black bg-opacity-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
        <h2 class="text-white text-lg font-medium title-font mb-5">Sign Up</h2>
        <div class="relative mb-4">
          <label for="full-name" class="leading-7 text-sm text-gray-400">First Name</label>
          <input type="text" value={state.fname}   name="fname" onChange={change} class="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
        </div>
        <div class="relative mb-4">
          <label for="full-name" class="leading-7 text-sm text-gray-400">Last Name</label>
          <input type="text"  value={state.lname}  name="lname" onChange={change} class="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
        </div>
        <div class="relative mb-4">
          <label for="full-name" class="leading-7 text-sm text-gray-400">Number</label>
          <input type="number" value={state.phno}  name="phno" onChange={change} class="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
        </div>
        <div class="relative mb-4">
          <label for="email" class="leading-7 text-sm text-gray-400">Email</label>
          <input type="email" value={state.email}  id="email" name="email" onChange={change} class="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
        </div>
        <div class="relative mb-4">
            <label for="password"  class="leading-7 text-sm text-gray-400">Password</label>
            <input type="password" value={state.password}  id="password" name="password" onChange={change} class="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        <Link class="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg text-center" to="/">
          <button onClick={signupbtn}>Sign Up</button>
          </Link>
        <p class="text-xs mt-3">Literally you probably haven't heard of them jean shorts.</p>
      </div>
    </div>
    </section>
    {/* -------------------Footer---------- */}
    <footer class="text-gray-400 bg-black body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-wrap md:text-left text-center order-first">
            <div class="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 class="title-font font-medium text-white tracking-widest text-sm mb-3">CATEGORIES</h2>
              <nav class="list-none mb-10">
                <li>
                  <Link class="text-gray-400 hover:text-white">First Link</Link>
                </li>
                <li>
                  <Link class="text-gray-400 hover:text-white">Second Link</Link>
                </li>
                <li>
                  <Link class="text-gray-400 hover:text-white">Third Link</Link>
                </li>
                <li>
                  <Link class="text-gray-400 hover:text-white">Fourth Link</Link>
                </li>
              </nav>
            </div>
            <div class="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 class="title-font font-medium text-white tracking-widest text-sm mb-3">CATEGORIES</h2>
              <nav class="list-none mb-10">
                <li>
                  <Link class="text-gray-400 hover:text-white">First Link</Link>
                </li>
                <li>
                  <Link class="text-gray-400 hover:text-white">Second Link</Link>
                </li>
                <li>
                  <Link class="text-gray-400 hover:text-white">Third Link</Link>
                </li>
                <li>
                  <Link class="text-gray-400 hover:text-white">Fourth Link</Link>
                </li>
              </nav>
            </div>
            <div class="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 class="title-font font-medium text-white tracking-widest text-sm mb-3">CATEGORIES</h2>
              <nav class="list-none mb-10">
                <li>
                  <Link class="text-gray-400 hover:text-white">First Link</Link>
                </li>
                <li>
                  <Link class="text-gray-400 hover:text-white">Second Link</Link>
                </li>
                <li>
                  <Link class="text-gray-400 hover:text-white">Third Link</Link>
                </li>
                <li>
                  <Link class="text-gray-400 hover:text-white">Fourth Link</Link>
                </li>
              </nav>
            </div>
            <div class="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 class="title-font font-medium text-white tracking-widest text-sm mb-3">CAVER</h2>
              <div class="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start">
                <div class="relative w-40 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
                  <label for="footer-field" class="leading-7 text-sm text-gray-400">Feedback</label>
                  <input type="text" id="footer-field" name="footer-field" class="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                </div>
                <button class="lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-indigo-900 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-500 rounded">Submit</button>
              </div>
              <p class="text-gray-500 text-sm mt-2 md:text-left text-center">Bitters chicharrones fanny pack
                <br class="lg:block hidden"/>waistcoat green juice
              </p>
            </div>
          </div>
        </div>
        <div class="bg-black bg-opacity-75">
          <div class="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
            <Link class="flex title-font font-medium items-center md:justify-start justify-center text-white">
              <span class="ml-3 text-xl">Caver</span>
            </Link>
            <p class="text-sm text-gray-400 sm:ml-6 sm:mt-0 mt-4">© 2022 Caver —
              <Link href="https://twitter.com/knyttneve" class="text-gray-500 ml-1" target="_blank" rel="noopener noreferrer">caver@Gamil.com</Link>
            </p>
            <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
              <Link class="text-gray-400">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </Link>
              <Link class="ml-3 text-gray-400">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </Link>
              <Link class="ml-3 text-gray-400">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </Link>
              <Link class="ml-3 text-gray-400">
                <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
                  <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2" stroke="none"></circle>
                </svg>
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}