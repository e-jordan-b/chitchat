import React from 'react'

export default function RoomLoading() {
  return (
    <section id="device-selection" className="h-full w-full flex justify-center items-center bg-white dark:bg-gray-800 ">
      <div className="flex flex-col lg:flex-row md:flex-row justify-center items-center h-full md:h-1/4 lg:h-3/5 mg:h-2/4 p-2 w-full  ">

        <div className="h-full md:w-2/4 lg:w-2/5">

          <div id="vide-and-controls" className='flex flex-col  lg:mt-10 items-center justify-startw-full h-full mg:w-full lg:w-full mg:h-3/4 lg:h-3/4 min-w-[300px] '>

            <div id="video-container" className="flex flex-col xs:ml-5 items-center justify-center  w-full h-full min-w-[300px] aspect-w-16 aspect-h-9 relative animate-pulse bg-custom-purple-100  dark:bg-gray-600 rounded-xl">

            <section
              // className={`${isLoading ? "animate-pulse bg-custom-purple-600" : null} absolute top-0 left-0 w-full h-full object-cover rounded-xl border-3 drop-shadow-xl`}
              className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl border-3 drop-shadow-xl`}

              style={{ scale: '-1 1 1' }}
              ></section>

            </div>

          </div>
          <div id="controls-container" className="bottom-5 mt-5 flex justify-center space-x-4">

      </div>
      </div>

      <section id="continue" className=" flex justify-center items-center mb-5 md:mx-28 w-full lg:w-1/4 mg:w-1/4 max-w-[500px] h-full">
        <div
        className="flex flex-col justify-center items-center rounded-lg  drop-shadow-sm h-72 w-full md:w-5/6 lg:w-5/6 xl:w-5/6 2xl:w-5/6  animate-pulse">
        <div className="md:text-2xl text-4xl text-center font-semibold   min-w-11/12 bg-custom-purple-100 text-custom-purple-100  dark:text-zinc-600 dark:bg-gray-600 rounded-lg ">Whats your name?</div>
          <div className="mt-8 mb-10 h-14 w-4/6  min-w-[75px] rounded-md transition-all bg-custom-purple-100 px-5 dark:bg-gray-600"  />
          <div className="px-2  whitespace-nowrap h-14 w-4/6 min-w-[75px] bg-custom-purple-100 dark:dark:bg-gray-600 transition-all rounded-md sm:text-xl mb-2 md:text-base md:w-/12 lg:text-xl">
          </div>
        </div>
      </section>

    </div>
  </section>)
}
