import React, { use, useEffect, useRef, useState } from 'react'

const HeroPage = () => {

    const gameBoardRef = useRef()
    const isFirstRender = useRef(true);

    const [row, setRow] = useState([])
    const [column, setColumn] = useState([])
    const [blockElements, setBlockElements] = useState([])

    useEffect(() => {
        // Calculate the number of rows and columns based on the game board size
        const element = gameBoardRef.current;
        if (!element) return;

        const calculateGrid = () => {
            const blockHeight = 10
            const blockWidth = 10

            const rows = Math.floor(element.clientHeight / blockHeight);
            const columns = Math.floor(element.clientWidth / blockHeight);

            // setFinalBox(columns * rows);
            setRow(rows);
            setColumn(columns);
        };
        calculateGrid();

        // Array of board blocks
        const allBoxElements = document.querySelectorAll('.box');
        if (allBoxElements.length === 0) return;

        const block = [];
        allBoxElements.forEach((e) => {
            const row = e.dataset.row;
            const column = e.dataset.column;
            block[`${row}-${column}`] = e;
        })
        setBlockElements(block);
        console.log(block);

    }, [row, column])

    //Snake body coordinates
    const snake = [
        { row: 5, column: 4 },
        { row: 6, column: 4 },
        { row: 7, column: 4 },
        { row: 8, column: 4 },
    ]

    // Function to render the snake on the game board
    const renderSnake = () => {
        snake.forEach((segment) => {
            blockElements[`${segment.row}-${segment.column}`].classList.add('snake');
        })
    }

    // Render the snake on the game board whenever the block elements are updated
    useEffect(() => {
        // if (blockElements.length === 0) return
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        renderSnake()
    }, [blockElements])

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
                <div ref={gameBoardRef} className='flex-1 grid grid-rows-[repeat(auto-fill,minmax(10px,1fr))] mx-5! lg:mx-53! bg-amber-800'>
                    {Array.from({ length: row }).map((_, i) => (
                        <div key={i} className='grid grid-cols-[repeat(auto-fill,minmax(10px,1fr))]'>
                            {Array.from({ length: column }).map((_, j) => (
                                <div
                                    data-row={i}
                                    data-column={j}
                                    key={j}
                                    style={{ height: "10px", width: "10px" }}
                                    className="box">
                                    {/* {`${i}-${j}`} */}
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