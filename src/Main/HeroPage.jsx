import React, { useEffect, useRef, useState } from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";

const HeroPage = () => {

    //useRef Conditions - ALL GAME STATE MUST BE IN useRef
    const gameBoardRef = useRef()
    const startButtonRef = useRef()
    const restartButtonRef = useRef()
    const modalRef = useRef()
    const gameOverModalRef = useRef()
    const gameStartRef = useRef()
    const scoreRef = useRef()
    const highScoreRef = useRef()
    const timeRef = useRef()
    const directionRef = useRef('down')

    // CRITICAL: Game state in useRef (NOT let)
    const snakeRef = useRef([{ x: 10, y: 13 }])
    const foodRef = useRef({ x: 15, y: 15 })
    const blockElementsRef = useRef({})
    const scoreRefValue = useRef(0)
    const timeRefValue = useRef('0-0')
    const highScoreRefValue = useRef(parseInt(localStorage.getItem('highScore')) || 0)
    const intervalIdRef = useRef(null)
    const timeIntervalIdRef = useRef(null)

    //useState Conditions - ONLY for React re-renders
    const [row, setRow] = useState([])
    const [column, setColumn] = useState([])

    //useEffect Conditions
    useEffect(() => {
        // Calculate the number of rows and columns based on the game board size
        const element = gameBoardRef.current;
        if (!element) return;

        const calculateGrid = () => {
            const blockHeight = 20
            const blockWidth = 20

            const rows = Math.floor(element.clientHeight / blockHeight);
            const columns = Math.floor(element.clientWidth / blockWidth);

            setRow(rows);
            setColumn(columns);
        };

        calculateGrid();

        // Array of board blocks
        const allBoxElements = document.querySelectorAll('.box');
        if (allBoxElements.length === 0) return;

        const block = {};
        allBoxElements.forEach((e) => {
            const rowNum = e.dataset.row;
            const colNum = e.dataset.column;
            block[`${rowNum}-${colNum}`] = e;
        })
        blockElementsRef.current = block;

    }, [row, column])

    // Mobile direction button handlers
    const handleDirectionChange = (newDirection) => {
        const currentDirection = directionRef.current;

        // Prevent reversing direction
        if (newDirection === 'right' && currentDirection !== 'left') {
            directionRef.current = 'right';
        } else if (newDirection === 'left' && currentDirection !== 'right') {
            directionRef.current = 'left';
        } else if (newDirection === 'down' && currentDirection !== 'up') {
            directionRef.current = 'down';
        } else if (newDirection === 'up' && currentDirection !== 'down') {
            directionRef.current = 'up';
        }
    }

    // Render Snake to gameboard
    const render = () => {
        const snake = snakeRef.current;
        const food = foodRef.current;
        const blockElements = blockElementsRef.current;

        highScoreRef.current.textContent = highScoreRefValue.current;

        // Food rendering
        if (blockElements[`${food.x}-${food.y}`]) {
            blockElements[`${food.x}-${food.y}`].classList.add('foodColor')
        }

        // Calculate snake head
        let snakeHead = null;

        // Calculate the new head position based on the current direction
        if (directionRef.current === 'right') {
            snakeHead = { x: snake[0].x, y: snake[0].y + 1 }
        } else if (directionRef.current === 'left') {
            snakeHead = { x: snake[0].x, y: snake[0].y - 1 }
        } else if (directionRef.current === 'down') {
            snakeHead = { x: snake[0].x + 1, y: snake[0].y }
        } else if (directionRef.current === 'up') {
            snakeHead = { x: snake[0].x - 1, y: snake[0].y }
        }

        // Control game over conditions
        if (snakeHead.x < 0 || snakeHead.x >= row || snakeHead.y < 0 || snakeHead.y >= column) {
            clearInterval(intervalIdRef.current)
            clearInterval(timeIntervalIdRef.current)
            modalRef.current.style.display = 'flex';
            gameOverModalRef.current.style.display = 'flex';
            gameStartRef.current.style.display = 'none';
            return;
        }

        // Food eating conditions
        if (snakeHead.x === food.x && snakeHead.y === food.y) {
            blockElements[`${food.x}-${food.y}`].classList.remove('foodColor')

            foodRef.current = {
                x: Math.floor(Math.random() * row),
                y: Math.floor(Math.random() * column)
            }

            // Add new head to the snake body
            snake.unshift(snakeHead);

            scoreRefValue.current += 1;
            if (scoreRefValue.current > highScoreRefValue.current) {
                highScoreRefValue.current = scoreRefValue.current;
                highScoreRef.current.textContent = highScoreRefValue.current;
                localStorage.setItem('highScore', highScoreRefValue.current.toString());
            }
            scoreRef.current.textContent = scoreRefValue.current;
        } else {
            // Remove snake color from the tail segment
            const tail = snake[snake.length - 1];
            if (blockElements[`${tail.x}-${tail.y}`]) {
                blockElements[`${tail.x}-${tail.y}`].classList.remove('snakeColor')
            }

            snake.unshift(snakeHead);
            snake.pop();
        }

        // Fill snake color
        snake.forEach((segment) => {
            if (blockElements[`${segment.x}-${segment.y}`]) {
                blockElements[`${segment.x}-${segment.y}`].classList.add('snakeColor')
            }
        })
    }

    // Start Game
    const startGameHandler = () => {
        modalRef.current.style.display = 'none';

        // 🔧 ADD THIS - Initialize food before game starts
        const blockElements = blockElementsRef.current;
        if (blockElements[`${foodRef.current.x}-${foodRef.current.y}`]) {
            blockElements[`${foodRef.current.x}-${foodRef.current.y}`].classList.add('foodColor')
        }

        // Add initial snake color
        snakeRef.current.forEach((segment) => {
            if (blockElements[`${segment.x}-${segment.y}`]) {
                blockElements[`${segment.x}-${segment.y}`].classList.add('snakeColor')
            }
        })

        intervalIdRef.current = setInterval(() => {
            render()
        }, 200)

        let [min, sec] = timeRefValue.current.split('-').map(Number)
        timeIntervalIdRef.current = setInterval(() => {
            sec += 1;
            if (sec === 60) {
                min += 1;
                sec = 0;
            }
            timeRefValue.current = `${min}-${sec}`
            timeRef.current.textContent = timeRefValue.current;
        }, 1000)
    }

    // Restart Game
    const restartHandler = () => {
        // Clear intervals
        clearInterval(intervalIdRef.current)
        clearInterval(timeIntervalIdRef.current)

        modalRef.current.style.display = 'none';

        const blockElements = blockElementsRef.current;

        // Reset all values
        scoreRefValue.current = 0;
        scoreRef.current.textContent = scoreRefValue.current;

        // Reset snake position
        snakeRef.current = [{ x: 10, y: 13 }];

        // Reset Direction
        directionRef.current = 'down';

        // Clear all previous colors
        Object.values(blockElements).forEach(el => {
            el.classList.remove('snakeColor')
            el.classList.remove('foodColor')
        })

        // Reset food position
        foodRef.current = {
            x: Math.floor(Math.random() * row),
            y: Math.floor(Math.random() * column)
        }

        // Add food color
        if (blockElements[`${foodRef.current.x}-${foodRef.current.y}`]) {
            blockElements[`${foodRef.current.x}-${foodRef.current.y}`].classList.add('foodColor')
        }

        // Add initial snake color
        snakeRef.current.forEach((segment) => {
            if (blockElements[`${segment.x}-${segment.y}`]) {
                blockElements[`${segment.x}-${segment.y}`].classList.add('snakeColor')
            }
        })

        // Start the game loop again
        intervalIdRef.current = setInterval(() => {
            render()
        }, 200)

        // Start the timer again
        timeRefValue.current = `0-0`
        let [min, sec] = timeRefValue.current.split('-').map(Number)
        timeIntervalIdRef.current = setInterval(() => {
            sec += 1;

            if (sec === 60) {
                min += 1;
                sec = 0;
            }
            timeRefValue.current = `${min}-${sec}`
            timeRef.current.textContent = timeRefValue.current;
        }, 1000)
    }

    // Control the snake movement using arrow keys
    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === 'ArrowRight') {
                handleDirectionChange('right');
            } else if (e.key === 'ArrowLeft') {
                handleDirectionChange('left');
            } else if (e.key === 'ArrowDown') {
                handleDirectionChange('down');
            } else if (e.key === 'ArrowUp') {
                handleDirectionChange('up');
            }
        }

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [])

    return (
        <div>
            {/* Game Board */}
            <div className='py-10! px-2! lg:px-40! flex flex-col gap-10! min-h-screen'>
                <div className='flex flex-col items-center'>
                    <h2 className='text-4xl! text-center mb-8! lg:mb-15! font-bold!'>Snaky</h2>
                    <div className='flex flex-col lg:flex-row gap-3 px-8! items-center'>
                        <div className='border border-gray-300 py-2! px-5! rounded-2xl min-w-80 '><h1>High Score : <span ref={highScoreRef}> 0 </span></h1></div>
                        <div className='border border-gray-300 py-2! px-5! rounded-2xl min-w-80 '><h1>Score : <span ref={scoreRef}> 0 </span></h1></div>
                        <div className='border border-gray-300 py-2! px-5! rounded-2xl min-w-80 '><h1>Time : <span ref={timeRef}> 0-0 </span></h1></div>
                    </div>
                </div>
                <div ref={gameBoardRef} className='flex-1 grid grid-rows-[repeat(auto-fill,minmax(20px,1fr))] mx-5! lg:mx-20! sm:mx-10! bg-amber-600'>
                    {Array.from({ length: row }).map((_, i) => (
                        <div key={i} className='grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))]'>
                            {Array.from({ length: column }).map((_, j) => (
                                <div
                                    data-row={i}
                                    data-column={j}
                                    key={j}
                                    style={{ height: "20px", width: "20px" }}
                                    className="box">
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Mobile Control Buttons - Visible only on Mobile & Tablet (under 768px) */}
                <div className='flex md:hidden flex-col items-center'>
                    {/* Up Button */}
                    <button
                        onClick={() => handleDirectionChange('up')}
                        className='p-5! rounded-full! -mb-2!'
                    >
                        <MdKeyboardArrowUp />
                    </button>
                    {/* Left, Right Buttons */}
                    <div className='flex gap-7 items-center justify-center'>
                        <button
                            onClick={() => handleDirectionChange('left')}
                            className='p-5! rounded-full!'
                        >
                            <MdKeyboardArrowLeft />
                        </button>

                        <button
                            onClick={() => handleDirectionChange('right')}
                            className='p-5! rounded-full!'
                        >
                            <MdKeyboardArrowRight />
                        </button>
                    </div>
                    {/* Down Button */}
                    <div className='flex items-center -mt-2! justify-center'>
                        <button
                            onClick={() => handleDirectionChange('down')}
                            className='p-5! rounded-full!'
                        >
                            <MdKeyboardArrowDown />
                        </button>
                    </div>
                </div>
            </div>

            {/* ModalBoard  */}
            <div ref={modalRef} className='h-screen w-full fixed top-0 bg-pink-500/5 backdrop-blur-xl flex items-center justify-center'>
                <div ref={gameStartRef} className='bg-white/90 rounded-2xl p-10! flex flex-col items-center gap-5!'>
                    <h3 className='text-2xl lg:text-3xl font-semibold'>Welcome to Snaky</h3>
                    <button ref={startButtonRef} onClick={() => {
                        startGameHandler()
                    }}>Start</button>
                </div>
                <div ref={gameOverModalRef} className='bg-white/90 rounded-2xl p-10! flex-col items-center gap-5! hidden'>
                    <h3 className='text-2xl lg:text-3xl font-semibold'>Game Over</h3>
                    <button ref={restartButtonRef} onClick={restartHandler}>
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HeroPage