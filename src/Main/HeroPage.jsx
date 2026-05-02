import React, { use, useEffect, useRef, useState } from 'react'

const HeroPage = () => {

    const gameBoardRef = useRef()

    const [row, setRow] = useState([])
    const [column, setColumn] = useState([])
    const [blockElements, setBlockElements] = useState([])

    // Calculate the number of rows and columns based on the game board size
    useEffect(() => {
        const element = gameBoardRef.current;
        if (!element) return;

        const calculateGrid = () => {
            const blockHeight = 20;
            const blockWidth = 20;

            const columns = Math.floor(element.clientWidth / blockWidth);
            const rows = Math.floor(element.clientHeight / blockHeight);

            // setFinalBox(columns * rows);
            setRow(rows);
            setColumn(columns);
        };

        calculateGrid();

    }, [])

    // Array for all block elements
    useEffect(() => {
        const allBoxElements = document.querySelectorAll('.box');
        setBlockElements(Array.from(allBoxElements));
        window.allBlockElements = allBoxElements;
    }, [row, column]);

    //create a snake array
    const snake = [
        { x: 10, y: 1 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
    ]

    useEffect(() => {
        const renderSnake = () => {
            snake.forEach((segment, index) => {
                allBlockElements[segment.x + segment.y].classList.add('snake');
            });
        };

        if (blockElements.length > 0) {
            renderSnake();
        }
    }, [blockElements, column]);

    return (
        <div>
            <div className='py-10! px-40! flex gap-10! h-screen'>
                <div className='w-fit flex flex-col gap-3 px-8!'>
                    <div className='border border-gray-300 py-2! px-4! rounded-2xl'><h1>High Score:<span> 0 </span></h1></div>
                    <div className='border border-gray-300 py-2! px-4! rounded-2xl'><h1>Score:<span> 0 </span></h1></div>
                    <div className='border border-gray-300 py-2! px-4! rounded-2xl'><h1>Time:<span> 00-00 </span></h1></div>
                </div>
                <div ref={gameBoardRef} className='flex-1 grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))] grid-rows-[repeat(auto-fill,minmax(20px,1fr))]'>
                    {Array.from({ length: row }).map((_, rowIndex) => (
                        Array.from({ length: column }).map((_, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`} className='box text-[1rem]'>
                            </div>
                        ))
                    ))}
                </div>
            </div>
            <div className='h-screen bg-pink-500'>Hye</div>
        </div>
    )
}

export default HeroPage