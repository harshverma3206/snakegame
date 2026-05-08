import React, { use, useEffect, useRef, useState } from 'react'

const HeroPage = () => {

    //useRef Conditions
    const gameBoardRef = useRef()
    const isFirstRender = useRef(true);

    //useState Conditions
    const [row, setRow] = useState([])
    const [column, setColumn] = useState([])
    const [blockElements, setBlockElements] = useState([])

    //Global Variables
    let direction = 'left';
    let intervalId = null;

    //Generate food
    let food = {
        x: Math.floor(Math.random() * row),
        y: Math.floor(Math.random() * column)
    }

    //useEffect Conditions
    useEffect(() => {
        // Calculate the number of rows and columns based on the game board size
        const element = gameBoardRef.current;
        if (!element) return;

        const calculateGrid = () => {
            const blockHeight = 10
            const blockWidth = 10

            const rows = Math.floor(element.clientHeight / blockHeight);
            const columns = Math.floor(element.clientWidth / blockHeight);

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
        { x: 0, y: 13 },
        { x: 0, y: 12 },
        { x: 0, y: 11 },
    ]

    // Render Snake to gameboard
    const render = () => {

        //Food rendering
        blockElements[`${food.x}-${food.y}`].classList.add('foodColor')

        //calculate snake head
        let snakeHead = null;

        //Calculate the new head position based on the current direction
        if (direction === 'right') {
            snakeHead = { x: snake[0].x, y: snake[0].y + 1 }
        } else if (direction === 'left') {
            snakeHead = { x: snake[0].x, y: snake[0].y - 1 }
        } else if (direction === 'down') {
            snakeHead = { x: snake[0].x + 1, y: snake[0].y }
        } else if (direction === 'up') {
            snakeHead = { x: snake[0].x - 1, y: snake[0].y }
        }

        //Control game over conditions
        if (snakeHead.x < 0 || snakeHead.x >= row || snakeHead.y < 0 || snakeHead.y >= column) {
            alert('Game Over');
            clearInterval(intervalId)
        }

        //food eating conditions
        if (snakeHead.x === food.x && snakeHead.y === food.y) {
            blockElements[`${food.x}-${food.y}`].classList.remove('foodColor')
            food = {
                x: Math.floor(Math.random() * row),
                y: Math.floor(Math.random() * column)
            }
        }

        //Remove snake color from the tail segment
        snake.forEach((segment) => {
            blockElements[`${segment.x}-${segment.y}`].classList.remove('snakeColor')
        })

        snake.unshift(snakeHead);
        snake.pop();

        //fill snake color
        snake.forEach((segment) => {
            blockElements[`${segment.x}-${segment.y}`].classList.add('snakeColor')
        })

    }

    // Render the snake on the game board whenever the block elements are updated
    intervalId = setInterval(() => {
        render()
    }, 200)

    //control the snake movement using arrow keys
    addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && direction !== 'left') {
            direction = 'right';
        } else if (e.key === 'ArrowLeft' && direction !== 'right') {
            direction = 'left';
        } else if (e.key === 'ArrowDown' && direction !== 'up') {
            direction = 'down';
        } else if (e.key === 'ArrowUp' && direction !== 'down') {
            direction = 'up';
        }
    })

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