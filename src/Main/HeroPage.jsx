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

            const rows = Math.floor(element.clientHeight / blockHeight);
            const columns = Math.floor(element.clientWidth / blockHeight);

            // setFinalBox(columns * rows);
            setRow(rows);
            setColumn(columns);
        };

        calculateGrid();

    }, [])

    // Array of board blocks
    useEffect(() => {

        const allBoxElements = document.querySelectorAll('.box');

        allBoxElements.forEach((e) => {
            const row = e.dataset.row;
            const column = e.dataset.column;
            const block = {
                [`${row}-${column}`]: e
            }
            console.log(block);

        })


    }, [row, column]);

    //create a snake array
    // const snake = [
    //     { x: 10, y: 1 },
    //     { x: 0, y: 0 },
    //     { x: 0, y: 0 }
    // ]

    // useEffect(() => {
    //     const renderSnake = () => {
    //         snake.forEach((segment, index) => {
    //             allBlockElements[segment.x + segment.y].classList.add('snake');
    //         });
    //     };

    //     if (blockElements.length > 0) {
    //         renderSnake();
    //     }
    // }, [blockElements, column]);

    return (
        <div>
            <div className='py-10! px-2! lg:px-40! flex flex-col gap-10! h-screen'>
                <div className='flex flex-col items-center'>
                    <h2 className='text-4xl! text-center mb-8! lg:mb-15! font-bold!'>Snaky</h2>
                    <div className='flex flex-col lg:flex-row gap-3 px-8! items-center'>
                        <div className='border border-gray-300 py-2! px-5! rounded-2xl min-w-80 '><h1>High Score : <span> 0 </span></h1></div>
                        <div className='border border-gray-300 py-2! px-5! rounded-2xl min-w-80 '><h1>Score : <span> 0 </span></h1></div>
                        <div className='border border-gray-300 py-2! px-5! rounded-2xl min-w-80 '><h1>Time : <span> 00-00 </span></h1></div>
                    </div>
                </div>
                <div ref={gameBoardRef} className='bg-amber-600/15 flex-1 grid grid-rows-[repeat(auto-fill,minmax(20px,1fr))]'>
                    {Array.from({ length: row }).map((_, i) => (
                        <div key={i} className='grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))]'>
                            {Array.from({ length: column }).map((_, j) => (
                                <div
                                    data-row={i}
                                    data-column={j}
                                    key={j}
                                    style={{ height: "20px", width: "20px" }}
                                    className="box">
                                    {`${i}-${j}`}
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
            </div>
            {/* <div className='h-screen bg-pink-500'>Hye</div> */}
        </div>
    )
}

export default HeroPage