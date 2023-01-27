import React from "react"
import { Link, useNavigate } from 'react-router-dom'
import main from '../images/main.jpg'
import {useState} from'react'
import './Home.css'
import axios from "axios"
export default function Home() {
  const[state,setState]=useState({email:"", password:""})
  const change=(e)=>{
    const {name,value}=e.target
    setState({...state,[name]:value})
} 
const navigate=useNavigate()
const signinbtn=(e)=>{
    e.preventDefault();
    axios.post("https://caver-cabs.herokuapp.com/signin",state).then(res=>{
      alert(res.data.message)
      if(res.data.user && res.data.user._id){
        navigate('/button')
      }
    })
  }
  return (
    <>
      <div id="main">
      <div id="container-out">
        <div id="container">
          <div id="container-left">
            <div className="text-5xl uppercase:text-7xl font-bold">CAVER</div>
            <div className="text-lg uppercase md:text-3xl">
              Book Your First Ride
            </div>
            <div className="text-xl md:text-3xl">@caver.org</div>
          </div>
             <div className="lg:w-2/6 md:w-1/2 bg-light-800 bg-opacity-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                <h2 className="text-white text-lg font-medium title-font mb-5">Sign In</h2>
                <div className="relative mb-4">
                    <label for="email"  className="leading-7 text-sm text-gray-400">Username</label>
                    <input type="email" value={state.email} onChange={change} id="email" name="email" className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                  </div>
                <div className="relative mb-4">
                  <label for="password"  className="leading-7 text-sm text-gray-400">Password</label>
                  <input type="password" onChange={change} value={state.password} id="password" name="password" className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                </div>
                <div className="text-white bg-indigo-900 border-0 py-2 px-8 focus:outline-none hover:bg-gray-900 rounded text-center">
                  <button type="submit" onClick={signinbtn}>Login</button>
                </div>            
                <Link href="#"><p className="text-gray-500 mt-3 underline  decoration-gray-500 py-1">Forget password?</p></Link>
            </div>
        </div>
        <img src={main} style={{backgroundposition: "center" , backgroundsize: "cover" }} alt="main" />
      </div> 
    </div>
    <script src="https://use.fontawesome.com/03f8a0ebd4.js"></script>

     

  {/* -------------Steps------- */}
  <section class="text-gray-400 bg-black body-font">
        <div class="container px-5 py-24 mx-auto flex flex-wrap">
          <div class="flex relative pt-10 pb-20 sm:items-center md:w-2/3 mx-auto">
            <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
              <div class="h-full w-1 bg-gray-800 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">1</div>
            <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div class="flex-shrink-0 w-24 h-24 bg-gray-800 text-indigo-400 rounded-full inline-flex items-center justify-center">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 class="font-medium title-font text-white mb-1 text-xl">Enter Your Location</h2>
                <p class="leading-relaxed">You can use your Current Location or Location from another place.</p>
              </div>
            </div>
          </div>
          <div class="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
            <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
              <div class="h-full w-1 bg-gray-800 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">2</div>
            <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div class="flex-shrink-0 w-24 h-24 bg-gray-800 text-indigo-400 rounded-full inline-flex items-center justify-center">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 class="font-medium title-font text-white mb-1 text-xl">Select Your Ride</h2>
                <p class="leading-relaxed">We provided various rides for the users wo want to go with ebike, moterCycle, Car, Taxi, Train, Plane</p>
              </div>
            </div>
          </div>
          <div class="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
            <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
              <div class="h-full w-1 bg-gray-800 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">3</div>
            <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div class="flex-shrink-0 w-24 h-24 bg-gray-800 text-indigo-400 rounded-full inline-flex items-center justify-center">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="3"></circle>
                  <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
                </svg>
              </div>
              <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 class="font-medium title-font text-white mb-1 text-xl">Enter OTP</h2>
                <p class="leading-relaxed">With safety purpose we need to give OTP to the Driver. So that Our bond become more Strong in future.</p>
              </div>
            </div>
          </div>
          <div class="flex relative pb-10 sm:items-center md:w-2/3 mx-auto">
            <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
              <div class="h-full w-1 bg-gray-800 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">4</div>
            <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div class="flex-shrink-0 w-24 h-24 bg-gray-800 text-indigo-400 rounded-full inline-flex items-center justify-center">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 class="font-medium title-font text-white mb-1 text-xl">Enjoy Your Ride</h2>
                <p class="leading-relaxed">After completed all thius Step You are ready to Enjoy four journey with CAVER.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* <!-- Feedback Section --> */}
      <section class="text-gray-400 bg-black body-font">
        <div class="flex justify-center ">
          <div class="flex flex-col justify-center  my-10 w-[90%] space-y-28 lg:space-y-24 max-w-7xl">
              <div class="flex flex-col justify-center items-center ">
                  <div class="text-xl md:text-3xl text-white font-bold uppercase">caver users</div>
                  <div class="border-b-4 border-indigo-900 -mt-2"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
                  <div class="text-gray-100 text-sm text-center mt-5">Users who are part of our CAVER family sends the feedback.
                  </div>
              </div>
              <div class="flex flex-col justify-center items-center lg:flex-row space-y-28 lg:space-y-0  lg:space-x-10">
                  <div
                      class="bg-black shadow-lg flex flex-col justify-center items-center py-4 h-56 md:w-[80%] lg:w-fit">
                      <div class="-mt-20 ">
                          <img src="https://source.unsplash.com/150x150/?man" class="rounded-full " alt=""/>
                      </div>
                      <p class="text-center text-sm p-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa velit ipsum quis amet reprehenderit cumque temporibus, consequuntur laboriosam dicta odio!</p>
                      <div class="flex flex-col lg:flex-row justify-center text-center lg:space-x-3">
                          <h1 class="text-indigo-900 text-lg font-semibold">Antonio Starc</h1>
                          <p class="text-white text-sm lg:mt-[5px]">from Delhi to Noida</p>
                      </div>
                  </div>
                  <div
                      class="bg-black shadow-lg flex flex-col justify-center items-center py-4 h-56 md:w-[80%] lg:w-fit">
                      <div class="-mt-20 ">
                          <img src="https://source.unsplash.com/150x150/?woman" class="rounded-full " alt=""/>
                      </div>
                      <p class="text-center text-sm p-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati recusandae maiores perspiciatis ipsam, veniam quis tempore officia debitis perferendis dicta.</p>
                      <div class="flex flex-col lg:flex-row justify-center text-center lg:space-x-3">
                          <h1 class="text-indigo-900 text-lg font-semibold">Maria Starc</h1>
                          <p class="text-white text-sm lg:mt-[5px]">from Mumbai to Goa</p>
                      </div>
                  </div>
                  <div
                      class="bg-black shadow-lg flex flex-col justify-center items-center py-4 h-56 md:w-[80%] lg:w-fit">
                      <div class="-mt-20 ">
                          <img src="https://source.unsplash.com/150x150/?girl" class="rounded-full " alt=""/>
                      </div>
                      <p class="text-center text-sm p-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est architecto, ad tempora reprehenderit quibusdam iure rerum ducimus corporis repellat eos.</p>
                      <div class="flex flex-col lg:flex-row justify-center text-center lg:space-x-3">
                          <h1 class="text-indigo-900 text-lg font-semibold">Jessica Starc</h1>
                          <p class="text-white text-sm lg:mt-[5px]">from Delhi to Uttrakhand</p>
                      </div>
                  </div>
  
              </div>
          </div>
      </div> 
      </section>
     {/* -------------------Footer---------- */}
     <footer className="text-gray-400 bg-black body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap md:text-left text-center order-first">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">CATEGORIES</h2>
              <nav className="list-none mb-10">
                <li>
                  <Link className="text-gray-400 hover:text-white">First Link</Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white">Second Link</Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white">Third Link</Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white">Fourth Link</Link>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">CATEGORIES</h2>
              <nav className="list-none mb-10">
                <li>
                  <Link className="text-gray-400 hover:text-white">First Link</Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white">Second Link</Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white">Third Link</Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white">Fourth Link</Link>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">CATEGORIES</h2>
              <nav className="list-none mb-10">
                <li>
                  <Link className="text-gray-400 hover:text-white">First Link</Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white">Second Link</Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white">Third Link</Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white">Fourth Link</Link>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">CAVER</h2>
              <div className="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start">
                <div className="relative w-40 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
                  <label for="footer-field" className="leading-7 text-sm text-gray-400">Feedback</label>
                  <input type="text" id="footer-field" name="footer-field" className="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                </div>
                <button className="lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-indigo-900 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-500 rounded">Submit</button>
              </div>
              <p className="text-gray-500 text-sm mt-2 md:text-left text-center">Bitters chicharrones fanny pack
                <br className="lg:block hidden"/>waistcoat green juice
              </p>
            </div>
          </div>
        </div>
        <div className="bg-black bg-opacity-75">
          <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
            <Link className="flex title-font font-medium items-center md:justify-start justify-center text-white">
              <span className="ml-3 text-xl">Caver</span>
            </Link>
            <p className="text-sm text-gray-400 sm:ml-6 sm:mt-0 mt-4">© 2022 Caver —
              <Link href="https://twitter.com/knyttneve" className="text-gray-500 ml-1" target="_blank" rel="noopener noreferrer">caver@Gamil.com</Link>
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
              <Link className="text-gray-400">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </Link>
              <Link className="ml-3 text-gray-400">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </Link>
              <Link className="ml-3 text-gray-400">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </Link>
              <Link className="ml-3 text-gray-400">
                <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" className="w-5 h-5" viewBox="0 0 24 24">
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
