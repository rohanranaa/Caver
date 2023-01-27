import React from 'react'
import { Link } from 'react-router-dom'
import car from '../images/car.jpg'
import a0 from '../images/a0.jpg'
import a1 from '../images/a1.jpg'
import ebike from '../images/ebike.jpg'
import aeroplane from '../images/aeroplane.jpg'
import s3 from '../images/s3.jpg'
import s4 from '../images/s4.jpg'

function About() {
  return (
    <>
    <section class="text-gray-400 bg-black body-font">
        <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
                    <br class="hidden lg:inline-block"/>What we do?
                </h1>
                <p class="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
            </div>
            <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                <img src={a0} style={{backgroundposition: "center" , backgroundsize: "cover" }} alt="Hero" />
            </div>
        </div>
    </section>
{/* -----------------What we Do?---------------- */}
<div class="flex justify-center bg-black">
    <div class="flex flex-col justify-center">
        <div class="flex flex-col md:flex-row max-w-7xl justify-center items-center ">
            <div class="overflow-hidden w-full m-4 flex justify-center">
                    <div class="flex flex-col md:flex-row items-center shadow-md h-full text-white bg-indigo-1000 hover:bg-brorn hover:text-w">
                        <div class=" w-1/2 overflow-hidden ">
                            <div class="flex flex-col justify-center h-full p-2">
                                <div class="font-bold text-3xl m-2">
                                    A letter from our CEO 
                                </div>
                                <p class="text-gray-500 text-sm mt-2 md:text-left text-center">Read about our team's commitment
                                    <br class="lg:block hidden"/>to provide everyone on our global 
                                </p>
                                <div class=" m-2 hover:text-orange-500">
                                    <Link href="#">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div class=" md:w-1/2 overflow-hidden ">
                            <img src={a1} style={{backgroundposition: "center" , backgroundsize: "cover" }} alt="Hero" /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex justify-center bg-black">
        <div class="flex flex-col lg:flex-row items-center max-w-7xl w-[90%] m-4">
            <div style={{ backgroundImage: `url(${car})`}} class="bg-no-repeat bg-cover bg-center lg:bg-left flex flex-col w-[90%] lg:w-[40%] h-96 m-2 brightness-110 hover:brightness-90 ">
                <div class="absolute inset-0 bg-gray-900 bg-opacity-50">
                    <div class="flex flex-col items-center justify-center p-2 text-gray-300">
                        <div class="font-bold text-lg m-2 mt-[30%]"> 
                            <Link to="">Everything has beauty, but not everyone sees it.</Link>
                        </div>
                        <div class=" m-2 text-sm">
                            <Link to="">There is no one definition of beauty. Beauty standards vary from culture to culture and change over time. In Western cultures, beauty standards have
                                traditionally been based on ideals of youth and femininity. 
                            </Link>
                        </div>
                    </div>
                </div>
            </div> 
            <div style={{ backgroundImage: `url(${ebike})`}} class="bg-no-repeat bg-cover bg-center lg:bg-left flex flex-col w-[90%] lg:w-[40%] h-96 m-2 brightness-110 hover:brightness-90 ">
                <div class="absolute inset-0 bg-gray-900 bg-opacity-50">
                    <div class="flex flex-col items-center justify-center p-2 text-gray-300">
                        <div class="font-bold text-lg m-2 mt-[30%]">
                             <Link to="">There is no Wi-Fi in the forest, but I promise you will find a better connection</Link>
                        </div>
                        <div class=" m-2 text-sm">
                            <Link to="">There is something about mountains that is both humbling and invigorating. Their very presence seems to demand respect and even a certain amount of reverence. </Link>
                        </div>
                    </div>
                </div>
            </div> 
            <div style={{ backgroundImage: `url(${aeroplane})`}}
                class="bg-no-repeat bg-cover bg-center lg:bg-left flex flex-col w-[90%] lg:w-[40%] h-96 m-2 brightness-110 hover:brightness-90 ">
                <div class="absolute inset-0 bg-gray-900 bg-opacity-50">
                    <div class="flex flex-col items-center justify-center p-2 text-gray-300">
                        <div class="font-bold text-lg m-2 mt-[30%]"> 
                            <Link to="">The twinkle in your eyes is light the brightest stars on the clearest night.</Link>
                        </div>
                        <div class=" m-2 text-sm">
                            <Link to="">There is something magical about the universe. It is so vast and mysterious, and it is always expanding. Every day, we are learning more about it and discovering new things.</Link>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </div>  
    {/* ------------Caver Provides the best Security----------------- */}
    <section class="text-gray-400 bg-black body-font">
        <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 md:mb-0 mb-10">
          <img src={s3} class="object-cover object-center rounded" style={{backgroundposition: "center" , backgroundsize: "cover" }} alt="Hero" /> 
          </div>
          <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">Caver provide the best security
              <br class="hidden lg:inline-block"/>world wide 
            </h1>
            <p class="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
            
          </div>
        </div>
      </section>
      <section class="text-gray-400 bg-black body-font">
        <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 md:mb-0 mb-10">
          <img src={s4} class="object-cover object-center rounded" style={{backgroundposition: "center" , backgroundsize: "cover" }} alt="Hero" />
          </div>
          <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">Caver folow all the rules 
              <br class="hidden lg:inline-block"/>of security purpoes
            </h1>
            <p class="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
            
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

export default About