import React, { useEffect, useRef, useState } from 'react'

const HeroPage = () => {

    const gameBoardRef = useRef()

    const [finalBox, setFinalBox] = useState(0)

    useEffect(() => {
        const element = gameBoardRef.current;
        if (!element) return;

        const calculateGrid = () => {
            const blockHeight = 20;
            const blockWidth = 20;

            const columns = Math.floor(element.clientWidth / blockWidth);
            const rows = Math.floor(element.clientHeight / blockHeight);

            setFinalBox(columns * rows);
        };

        calculateGrid();

    }, []);


    return (
        <div>
            <div className='py-10! px-40! flex gap-10! h-screen'>
                <div className='w-fit flex flex-col gap-3 px-8!'>
                    <div className='border border-gray-300 py-2! px-4! rounded-2xl'><h1>High Score:<span> 0 </span></h1></div>
                    <div className='border border-gray-300 py-2! px-4! rounded-2xl'><h1>Score:<span> 0 </span></h1></div>
                    <div className='border border-gray-300 py-2! px-4! rounded-2xl'><h1>Time:<span> 00-00 </span></h1></div>
                </div>
                <div ref={gameBoardRef} className='bg-orange-600 flex-1 grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))] grid-rows-[repeat(auto-fill,minmax(20px,1fr))]'>
                    {[...Array(finalBox)].map((_, index) => {
                        return <div key={index} className='box'></div>
                    })}
                </div>
            </div>
            <div className='h-screen bg-pink-500'>Hye</div>
        </div>
    )
}

export default HeroPage